import type { CheerioAPI } from "cheerio";
import * as cheerio from "cheerio/slim";
import { useCallback, useState } from "react";

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
  const [diningDollars, setDiningDollars] = useState<string | null>(null);
  const [lionBucks, setLionBucks] = useState<string | null>(null);
  const [mealSwipes, setMealSwipes] = useState<string | null>(null);
  const [guestSwipes, setGuestSwipes] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<MealTransaction[]>([]);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrapeWithLogin = useCallback(
    async (username: string, password: string): Promise<string> => {
      try {
        //console.log("Starting Scrape");

        const URLParametersString = new URLSearchParams({
          username: `${username}`,
          password: `${password}`,
          action: "Login",
        }).toString();

        //console.log(URLParametersString);

        const baseURL = "https://fhu.campuscardcenter.com/ch/";
        const fullURL =
          baseURL +
          `login.html?username=${username}&password=${password}&action=Login`;
        //console.log(fullURL);

        // Step 1: Login
        const loginResponse = await fetch(fullURL, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: URLParametersString,
        });

        //console.log("Response status:", loginResponse.status);
        //console.log("Response headers:", loginResponse.headers);

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
          .replace(/\u00A0/g, " ") // replace non-breaking space char with space
          .trim()
      )
      .get();

    // Find all tr elements that have a td with a div that has align="right"
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

    // iterate over each tr
    rows.each((index, row) => {
      // only process the first 4 rows
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

    const transactions = $("tr#EntryRow") // or: $('tr[id="EntryRow"]')
      .toArray()
      .map((tr) => {
        // Get direct TD children -> array of trimmed text
        const tds = $(tr)
          .children("td")
          .toArray()
          .map(
            (td) => $(td).text().trim()
            //$(td).text().replace(/\u00A0/g, ' ').trim()
          );

        return {
          date: tds[0] ?? "",
          time: tds[1] ?? "",
          description: tds[2] ?? "",
          account: tds[3] ?? "",
          amount: tds[5] ?? "",
        };
      });

    //console.log(transactions);

    // the 4 pieces of data are in the first 4 div[align=right] nodes
    return {
      diningDollars,
      lionBucks,
      mealSwipes,
      guestSwipes,
      transactions,
      mealPlan,
    };
    // return {
    //   diningDollars: data[0],
    //   lionBucks: data[1],
    //   mealSwipes: data[2],
    //   guestSwipes: data[3],
    //   transactions,
    // };
  };

  const fetchMealData = useCallback(
    async (username: string, password: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const html = await scrapeWithLogin(username, password);
        const {
          diningDollars,
          lionBucks,
          mealSwipes,
          guestSwipes,
          transactions,
          mealPlan: extractedMealPlan,
        } = extractData(html);
        setDiningDollars(diningDollars);
        setLionBucks(lionBucks);
        setMealSwipes(mealSwipes);
        setGuestSwipes(guestSwipes);
        setTransactions(transactions);
        setMealPlan(extractedMealPlan);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [scrapeWithLogin]
  );

  return {
    diningDollars,
    lionBucks,
    mealSwipes,
    guestSwipes,
    transactions,
    mealPlan,
    isLoading,
    error,
    fetchMealData,
  };
}
