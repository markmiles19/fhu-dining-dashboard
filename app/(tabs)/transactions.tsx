import { Text } from '@/components/Themed';
import { useTransactions } from '@/contexts/TransactionContext';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BASE_URL = "https://api.fhumealtracker.fhu.edu/data.json"

export default async function HomeScreen() {
  const [username, setUsername] = useState("username");
  const [password, setPassword] = useState("password");
  const { totalsByTag } = useTransactions();

  const getData = async () => {
    const response = await fetch(BASE_URL)
    const data = await response.json()

    console.log(data)

    setMealsRemaining(data.meals.remaining);
  }

  useEffect(()=> {
    getData()
  }, []);

  const contactSupport = () => {
    Linking.openURL("mailto:ttenon@fhu.edu");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{username}</Text>

          <Text style={styles.label}>Password</Text>
          <Text style={styles.value}>{password}</Text>

          <Text style={styles.label}>Meal Plan</Text>
          <Text style={styles.value}>{mealPlan}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={contactSupport}>
          <Text style={styles.buttonText}>Contact Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.logout]} onPress={logout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: "#f44949ff",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    paddingBottom: 100,
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

// Find the proper way to import transactions and calculate remaining.