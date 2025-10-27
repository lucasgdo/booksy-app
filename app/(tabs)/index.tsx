import { userService } from "@/services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [currentReadings, setCurrentReadings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      const userEmail = await AsyncStorage.getItem('userEmail')
      if (!userEmail) {
        setUserName("Leitor")
        return
      }
      try {
        const user = await userService.getUserByEmail(userEmail)
        setUserName(user?.name || "Leitor")
      } catch (error) {
        console.error('Failed to load user', error)
        setUserName("Leitor")
      }
    };

    // Mock inicial (substituirá futuramente pela API)
    setCurrentReadings([
      { id: "1", title: "O Hobbit", progress: "45%" },
      { id: "2", title: "1984", progress: "80%" },
    ]);

    setReviews([
      { id: "1", book: "A Revolução dos Bichos", rating: 5 },
      { id: "2", book: "Dom Casmurro", rating: 4 },
    ]);

    loadUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Bem-vindo, {userName?.split(' ')[0]}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leituras em progresso:</Text>

        <FlatList
          data={currentReadings}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>Progresso: {item.progress}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Últimas análises:</Text>

        {reviews.length > 0 ? (
          reviews.map((review) => (
            <TouchableOpacity key={review.id} style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>{review.book}</Text>
              <Text style={styles.reviewSubtitle}>⭐ {review.rating}/5</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhuma review ainda</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: 160,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  reviewCard: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  reviewSubtitle: {
    fontSize: 14,
    color: "#475569",
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: "#94A3B8",
    fontStyle: "italic",
  },
});
