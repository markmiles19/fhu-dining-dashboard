import AsyncStorage from "@react-native-async-storage/async-storage";
import type { CheerioAPI } from "cheerio";
import * as cheerio from "cheerio/slim";
import { useCallback, useState, useEffect } from "react";

interface MealPlan {
  name: string;
  totalMeals: number;
  totalDiningDollars: number;
  totalGuestSwipes: number;
}

interface MealTransaction {
  date: string;
  time: string;
  description: string;
  account: string;
  amount: string;
}

interface MealSwipeData {
  diningDollars: string | null;
  lionBucks: string | null;
  mealSwipes: string | null;
  guestSwipes: string | null;
  transactions: MealTransaction[];
  mealPlan: MealPlan;
}

export function useMealSwipeData() {
  const [username, setUsername] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [diningDollars, setDiningDollars] = useState<string | null>(null);
  const [lionBucks, setLionBucks] = useState<string | null>(null);
  const [mealSwipes, setMealSwipes] = useState<string | null>(null);
  const [guestSwipes, setGuestSwipes] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<MealTransaction[]>([]);
  // const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan>({
    name: "",
    totalMeals: 0,
    totalDiningDollars: 0,
    totalGuestSwipes: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveCredentials = async (user: string, pass: string) => {
    try {
      await AsyncStorage.setItem("username", user);
      await AsyncStorage.setItem("password", pass);
      setUsername(user);
      setPassword(pass);
    } catch (err) {
      console.log("Error saving credentials", err);
    }
  };

  const scrapeWithLogin = useCallback(
    async (username: string, password: string): Promise<string> => {
      try {
        const URLParametersString = new URLSearchParams({
          username: `${username}`,
          password: `${password}`,
          action: "Login",
        }).toString();

        const baseURL = "https://fhu.campuscardcenter.com/ch/";
        const fullURL =
          baseURL +
          `login.html?username=${username}&password=${password}&action=Login`;

        // Step 1: Login
        const loginResponse = await fetch(fullURL, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: URLParametersString,
        });

        if (!loginResponse.ok) {
          const responseText = await loginResponse.text();
          console.log("Response body:", responseText);

          throw new Error(`Login failed with status: ${loginResponse.status}`);
        }

        // Step 2: Reload the homepage
        const reloadResponse = await fetch(baseURL, {
          method: "GET",
        });

        const htmlText = await reloadResponse.text();

        return htmlText;
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.name);
          console.error(error.message);
        }
        throw error;
      }
    },
    []
  );

  const extractData = (htmlString: string): MealSwipeData => {
    const $: CheerioAPI = cheerio.load(htmlString);
    const data = $("div[align=right]")
      .map((_, el) =>
        $(el)
          .text()
          .replace(/\u00A0/g, " ")
          .trim()
      )
      .get();

    const rows = $('tr:has(td div[align="right"])');

    let lionBucks = null;
    let diningDollars = null;
    let mealSwipes = null;
    let guestSwipes = null;
    let mealPlan:MealPlan = {
      name: "",
      totalMeals: 0,
      totalDiningDollars: 0,
      totalGuestSwipes: 0,
    };

    rows.each((index, row) => {
      if (index > 3) {
        return;
      }

      const tds = $(row)
        .children("td")
        .toArray()
        .map((td) => $(td).text().trim());

      const titleIndex = 1;
      const dataIndex = 3;
      if (tds[titleIndex].includes("Lion Bucks")) {
        lionBucks = tds[dataIndex];
      } else if (tds[titleIndex].includes("Guest Meals")) {
        guestSwipes = tds[dataIndex];
      } else if (tds[titleIndex].includes("DD")) {
        diningDollars = tds[dataIndex];
      } else if (tds[titleIndex].includes("MPA 14 Weekly Meals")) {
        mealSwipes = tds[dataIndex];
        mealPlan.name = "Meal Plan A";
        mealPlan.totalDiningDollars = 175;
        mealPlan.totalMeals = 14;
        mealPlan.totalGuestSwipes = 5;
      } else if (tds[titleIndex].includes("MPB 10 Weekly Meals")) {
        mealSwipes = tds[dataIndex];
        mealPlan.name = "Meal Plan B";
        mealPlan.totalDiningDollars = 275;
        mealPlan.totalMeals = 10;
        mealPlan.totalGuestSwipes = 10;
      } else if (tds[titleIndex].includes("MPC 80 Meals")) {
        mealSwipes = tds[dataIndex];
        mealPlan.name = "Meal Plan C";
        mealPlan.totalDiningDollars = 125;
        mealPlan.totalMeals = 80;
        mealPlan.totalGuestSwipes = 5;
      } else if (tds[titleIndex].includes("MPU 19 Meals")) {
        mealSwipes = tds[dataIndex];
        mealPlan.name = "Meal Plan U";
        mealPlan.totalDiningDollars = 300;
        mealPlan.totalMeals = 19;
        mealPlan.totalGuestSwipes = 15;
      }
    });

    console.log(
      `${JSON.stringify(
        mealPlan
      )} ${mealSwipes} | ${guestSwipes} | ${diningDollars} | ${lionBucks}`
    );

    const transactions = $("tr#EntryRow")
      .toArray()
      .map((tr) => {
        const tds = $(tr)
          .children("td")
          .toArray()
          .map(
            (td) => $(td).text().trim()
          );

        return {
          date: tds[0] ?? "",
          time: tds[1] ?? "",
          description: tds[2] ?? "",
          account: tds[3] ?? "",
          amount: tds[5] ?? "",
        };
      });

    return {
      diningDollars,
      lionBucks,
      mealSwipes,
      guestSwipes,
      transactions,
      mealPlan,
    };
  };

  const fetchMealData = useCallback(
    async (username: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await saveCredentials(username, password);

        const html = await scrapeWithLogin(username, password);
        const extracted = extractData(html);

        setDiningDollars(extracted.diningDollars);
        setLionBucks(extracted.lionBucks);
        setMealSwipes(extracted.mealSwipes);
        setGuestSwipes(extracted.guestSwipes);
        setTransactions(extracted.transactions);
        setMealPlan(extracted.mealPlan);

      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setError(msg);
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
    [scrapeWithLogin]
  );

  const toNumber = (val: string | null): number => {
    if (!val) return 0;
    return Number(val.replace(/[^0-9.]/g, ""));
  };

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("username");
        const savedPass = await AsyncStorage.getItem("password");

        if (savedUser && savedPass) {
          setUsername(savedUser);
          setPassword(savedPass);
          await fetchMealData(savedUser, savedPass);
        }
      } catch (err) {
        console.log("Error loading credentials", err);
      }
    };

    loadCredentials();
  }, [fetchMealData]);

  return {
    username,
    password,
    diningDollars: toNumber(diningDollars),
    lionBucks: toNumber(lionBucks),
    mealSwipes: toNumber(mealSwipes),
    guestSwipes: toNumber(guestSwipes),
    transactions,
    // mealPlan,
    mealPlan: {
      name: mealPlan.name,
      totalMeals: Number(mealPlan.totalMeals),
      totalDiningDollars: Number(mealPlan.totalDiningDollars),
      totalGuestSwipes: Number(mealPlan.totalGuestSwipes),
    },
    isLoading,
    error,
    fetchMealData,
    saveCredentials,
  };
}