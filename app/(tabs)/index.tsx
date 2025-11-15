import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { userService } from "@/services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [currentReadings, setCurrentReadings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
        const userEmail = await AsyncStorage.getItem("userEmail");
        try {
          const user = await userService.getUserByEmail(userEmail!);
          setUserName(user?.name || "Leitor");
          if (user?.role === "ROLE_ADMIN") {
            setUserName(user?.name.concat("⭐"))
          }
        } catch {
          setUserName("Leitor");
        }
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

    checkAuth();
  }, [userName]);

  //if (isAuthenticated === null) return null;
  //if (!isAuthenticated) return <Redirect href="/login" />;

  return (
    <ThemedView style={styles.content}>
      <ThemedText style={styles.greeting}>Bem-vindo, {userName?.split(' ')[0]}</ThemedText>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Leituras em progresso:</ThemedText>

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
        <ThemedText style={styles.sectionTitle}>Últimas análises:</ThemedText>

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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 60,
    gap: 16,
    overflow: "hidden",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
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
