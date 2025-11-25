import Separator from '@/components/Separator';
import { Text } from '@/components/Themed';
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTransactions } from '@/contexts/TransactionContext';
import { useMealSwipeData } from "@/hooks/use-meal-swipe-data";
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = "https://api.fhumealtracker.fhu.edu/data.json"

export default function HomeScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { totalsByTag } = useTransactions();

  const {
    diningDollars,
    lionBucks,
    mealSwipes,
    guestSwipes,
    mealPlan,
    // isLoading,
    // error,
    fetchMealData,
  } = useMealSwipeData();

  const getData = async () => {
    const response = await fetch(BASE_URL)
    const data = await response.json()

    console.log(data)

    setMealsRemaining(data.meals.remaining);
  }

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("username");
        const savedPass = await AsyncStorage.getItem("password");

        if (savedUser) setUsername(savedUser);
        if (savedPass) setPassword(savedPass);

        if (savedUser && savedPass) {
          fetchMealData(savedUser, savedPass);
        }
      } catch (err) {
        console.log("Error loading saved credentials:", err);
      }
    };

    loadCredentials();
  }, []);

  const [mealsRemaining, setMealsRemaining] = useState(0)

  const totalLionBucks = 180.00;

  const totalDD = 150.00;
  const remainingDD = totalDD - totalsByTag['Starbucks'];

  const totalMeals = 14;
  const remainingMeals = totalMeals - totalsByTag['Jones'];

  const totalLionsPride = 5;
  const remainingLionsPride = totalLionsPride - totalsByTag['LP'];

  const totalCFA = 2;
  const remainingCFA = totalCFA - totalsByTag['CFA'];

  const handleGetHtml = async () => {
    try {
      await AsyncStorage.setItem("username", username);
      await AsyncStorage.setItem("password", password);

      await fetchMealData(username, password);
    } catch (err) {
      console.log("Login error:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText> Username: </ThemedText>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <ThemedText> Password: </ThemedText>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />

        <Pressable style={styles.contactButton} onPress={handleGetHtml}>
          <Text style={styles.contactButtonText}>Login</Text>
        </Pressable>

        <Separator />

        <ThemedView style={styles.profileCard}>
          <Text style={styles.profileTitle}>
            {mealPlan?.name || "Meal Plan"}
          </Text>

          <Text style={styles.profileItem}>
            Meal Swipes: {mealPlan?.totalMeals ?? "-"}
          </Text>

          <Text style={styles.profileItem}>
            Guest Swipes: {mealPlan?.totalGuestSwipes ?? "-"}
          </Text>

          <Text style={styles.profileItem}>
            Dining Dollars: ${mealPlan?.totalDiningDollars ?? "-"}
          </Text>

          <Text style={styles.profileItem}>
            Lion Bucks: ${lionBucks ?? "-"}
          </Text>
        </ThemedView>

        <Separator />

        <Pressable
          style={styles.contactButton}
          onPress={() => Linking.openURL("mailto:ttenon@fhu.edu")}
        >
          <Text style={styles.contactButtonText}>Contact</Text>
        </Pressable>

        <Pressable
          style={styles.logoutButton}
          onPress={async () => {
            await AsyncStorage.removeItem("username");
            await AsyncStorage.removeItem("password");
            setUsername("");
            setPassword("");
            console.log("Logged out");
          }}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>

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
  contactButton: {
    width: "90%",
    paddingVertical: 14,
    backgroundColor: "#E8EAF0",
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  contactButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
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
  logoutButton: {
    width: "90%",
    paddingVertical: 14,
    backgroundColor: "#f44949ff",
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 50,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modeText: {
    fontSize: 18,
    marginBottom: 20,
  },
  profileCard: {
    width: "90%",
    padding: 20,
    backgroundColor: "#E8EAF0",
    borderRadius: 16,
    alignItems: "flex-start",
    marginBottom: 30,
  },
  profileItem: {
    fontSize: 16,
    marginBottom: 6,
  },
  profileTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
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