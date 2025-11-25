import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';
import { Text } from '@/components/Themed';
import { useMealSwipeData } from "@/hooks/use-meal-swipe-data";

export default function RecentTransactionsScreen() {
  const {
    transactions,
    isLoading,
    error,
    fetchMealData,
  } = useMealSwipeData();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Recent Transactions</Text>

      {isLoading && (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      )}

      {error && (
        <Text style={styles.error}>{error}</Text>
      )}

      {!isLoading && !error && (
        <ScrollView contentContainerStyle={styles.list}>
          {transactions.length === 0 && (
            <Text>No transactions found.</Text>
          )}

          {transactions.map((tx, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{tx.date}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Time</Text>
                <Text style={styles.value}>{tx.time}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Description</Text>
                <Text style={styles.value}>{tx.description}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Account</Text>
                <Text style={styles.value}>{tx.account}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Amount</Text>
                <Text style={styles.amount}>
                  {tx.amount || "-"}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    alignItems: "center",
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  error: {
    marginTop: 20,
    color: "red",
    fontSize: 16,
  },
  list: {
    width: "100%",
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    color: "#777",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
});