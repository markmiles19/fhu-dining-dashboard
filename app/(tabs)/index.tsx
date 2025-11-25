import Separator from '@/components/Separator';
import { Text } from '@/components/Themed';
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTransactions } from '@/contexts/TransactionContext';
import { useMealSwipeData } from "@/hooks/use-meal-swipe-data";
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { SafeAreaView } from 'react-native-safe-area-context';

const BASE_URL = "https://api.fhumealtracker.fhu.edu/data.json"

export default async function HomeScreen() {
  const [username, setUsername] = useState("username");
  const [password, setPassword] = useState("password");
  const { totalsByTag } = useTransactions();

  const {
    // diningDollars,
    // lionBucks,
    // mealSwipes,
    // guestSwipes,
    // transactions,
    isLoading,
    // error,
    fetchMealData,
  } = useMealSwipeData();

  const getData = async () => {
    const response = await fetch(BASE_URL)
    const data = await response.json()

    console.log(data)

    setMealsRemaining(data.meals.remaining);
  }

  useEffect(()=> {
    getData()
  }, []);

  const [mealsRemaining, setMealsRemaining] = useState(0)

  const totalMeals = 14;

  const totalDD = 150.00;

  const totalLionBucks = 0.00;

  const totalGuest = 5;

  const handleGetHtml = async () => {
    try {
      await fetchMealData(username, password);
    }
    catch (err) {
      console.log(err)
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* <ThemedView style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.button,
              {
                // backgroundColor: tintColor,
                opacity: isLoading ? 0.6 : 1,
              },
            ]}
            onPress={handleGetHtml}
            disabled={isLoading}
          >
            <ThemedText style={styles.buttonText}>
              {isLoading ? "Loading..." : "Fetch Meal Data"}
            </ThemedText>
          </Pressable>
        </ThemedView> */}
        <Separator />

        {/* JONES MEALS */}
        <Text style={styles.title}>Meal Swipes</Text>
        <CircularProgress
          value={totalMeals}
          radius={56}
          maxValue={14}
          duration={14}
          activeStrokeWidth={12}
          inActiveStrokeWidth={12}
          activeStrokeColor="#f44949ff"
          inActiveStrokeColor="#E8EAF0"
          progressValueStyle={{ fontWeight: '600' }}
        />
        <Text style={styles.subtitle}>
          Total: {totalMeals}
        </Text>
        <Separator />

        {/* GUEST MEALS */}
        <Text style={styles.title}>Guest Swipes</Text>
        <CircularProgress
          value={totalGuest}
          radius={56}
          maxValue={5}
          duration={5}
          activeStrokeWidth={12}
          inActiveStrokeWidth={12}
          activeStrokeColor="#f44949ff"
          inActiveStrokeColor="#E8EAF0"
          progressValueStyle={{ fontWeight: '600' }}
        />
        <Text style={styles.subtitle}>
          Total: {totalGuest}
        </Text>
        <Separator />

        {/* DINING DOLLARS */}
        <Text style={styles.title}>Dining Dollars</Text>
        <CircularProgress
          value={totalDD}
          radius={56}
          maxValue={150}
          duration={150}
          activeStrokeWidth={12}
          inActiveStrokeWidth={12}
          activeStrokeColor="#f44949ff"
          inActiveStrokeColor="#E8EAF0"
          progressValueStyle={{ fontWeight: '600' }}
          valuePrefix="$"
        />
        <Text style={styles.subtitle}>
          Total: ${totalDD}
        </Text>
        <Separator />

        {/* LIONBUCKS */}
        <Text style={styles.title}>Lionbucks</Text>
        <ThemedView style={styles.lionbucksBox}>
          <Text style={styles.lionbucksAmount}>
            ${totalLionBucks.toFixed(2)}
          </Text>
        </ThemedView>
        <Separator />

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  buttonContainer: {
    paddingBottom: 16,
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.5,
  },
  input: {
    width: "100%",
    borderColor: "#bbb",
    borderWidth: 1,
    backgroundColor: "#d1d1d1",
    color: "black",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingBottom: 100,
  },
  lionbucksAmount: {
    color: "#f44949ff",
    fontSize: 28,
    fontWeight: "700",
  },
  lionbucksBox: {
    width: 140,
    paddingVertical: 20,
    borderRadius: 12,
    backgroundColor: "#E8EAF0",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  modeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 20,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
});