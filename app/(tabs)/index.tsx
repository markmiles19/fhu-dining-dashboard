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

export default function HomeScreen() {

  const {
    diningDollars,
    lionBucks,
    mealSwipes,
    guestSwipes,
    mealPlan,
    isLoading,
    error,
    fetchMealData,
  } = useMealSwipeData();

  // const handleGetHtml = async () => {
  //   try {
  //     await fetchMealData(username, password);
  //   }
  //   catch (err) {
  //     console.log(err)
  //   }
  // };

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
          value={Number(mealSwipes ?? 0)}
          radius={56}
          maxValue={mealPlan?.totalMeals ?? 0}
          duration={mealPlan?.totalMeals ?? 0}
          activeStrokeWidth={12}
          inActiveStrokeWidth={12}
          activeStrokeColor="#f44949ff"
          inActiveStrokeColor="#E8EAF0"
          progressValueStyle={{ fontWeight: '600' }}
        />
        <Text style={styles.subtitle}>
          Total: {mealPlan?.totalMeals ?? 0}
        </Text>
        <Separator />

        {/* GUEST MEALS */}
        <Text style={styles.title}>Guest Swipes</Text>
        <CircularProgress
          value={Number(guestSwipes ?? 0)}
          radius={56}
          maxValue={mealPlan?.totalGuestSwipes ?? 0}
          duration={mealPlan?.totalGuestSwipes ?? 0}
          activeStrokeWidth={12}
          inActiveStrokeWidth={12}
          activeStrokeColor="#f44949ff"
          inActiveStrokeColor="#E8EAF0"
          progressValueStyle={{ fontWeight: '600' }}
        />
        <Text style={styles.subtitle}>
          Total: {mealPlan?.totalGuestSwipes ?? 0}
        </Text>
        <Separator />

        {/* DINING DOLLARS */}
        <Text style={styles.title}>Dining Dollars</Text>
        <CircularProgress
          value={Number(diningDollars ?? 0)}
          radius={56}
          maxValue={mealPlan?.totalDiningDollars ?? 0}
          duration={mealPlan?.totalDiningDollars ?? 0}
          activeStrokeWidth={12}
          inActiveStrokeWidth={12}
          activeStrokeColor="#f44949ff"
          inActiveStrokeColor="#E8EAF0"
          progressValueStyle={{ fontWeight: '600' }}
          valuePrefix="$"
        />
        <Text style={styles.subtitle}>
          Total: ${mealPlan?.totalDiningDollars ?? 0}
        </Text>
        <Separator />

        {/* LIONBUCKS */}
        <Text style={styles.title}>Lionbucks</Text>
        <ThemedView style={styles.lionbucksBox}>
          <Text style={styles.lionbucksAmount}>
            ${lionBucks ?? 0}
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