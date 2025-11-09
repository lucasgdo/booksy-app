import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { Book } from "@/entitites/Book";
import { bookService } from "@/services/bookService";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

export default function BooksScreen() {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [bookList, setBookList] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.listBooks();
        setBookList(data);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      }
    };

    fetchBooks();
  }, []);

  const renderBook = ({ item }: { item: Book }) => (
    <View style={styles.bookCard}>
      <TouchableOpacity onPress={() =>
        setSelectedPdf(item.viewLink)}
      >
        <Image
          source={{ uri: item.cover }}
          style={{ height: 200, aspectRatio: 0.75, alignSelf: "center" }}
        />
      </TouchableOpacity>
      <ThemedText style={styles.bookTitle}>{item.title}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.content}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Livros
        </ThemedText>
      </ThemedView>

      <FlatList
        data={bookList}
        keyExtractor={(item) => item.title}
        renderItem={renderBook}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      <Modal
        visible={!!selectedPdf}
        onRequestClose={() => setSelectedPdf(null)}
        animationType="slide"
      >
        <View style={styles.webviewContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPdf(null)}
          >
            <Text style={{ color: "white", fontSize: 16 }}>✕</Text>
          </TouchableOpacity>

          {selectedPdf && (
            <WebView
              source={{ uri: selectedPdf }}
              style={{ flex: 1 }}
              sharedCookiesEnabled={true}
              thirdPartyCookiesEnabled={true}
            />
          )}
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bookCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 8,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  content: {
    flex: 1,
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 50,
    gap: 16,
    overflow: "hidden",
  },
  webviewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: "#00000099",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
