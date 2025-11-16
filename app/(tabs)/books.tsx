import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { Author } from "@/entitites/Author";
import { Book } from "@/entitites/Book";
import { authorService } from "@/services/authorService";
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
  const [authorList, setAuthorList] = useState<Author[]>([]);



  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await bookService.listBooks();
        setBookList(data);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      }
    };
    const fetchAuthors = async () => {
      try {
        const data = await authorService.findAll();
        setAuthorList(data);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      }
    };
    fetchAuthors();
    fetchBooks();
  }, []);

  const renderBook = ({ item }: { item: Book }) => (
    <View style={styles.bookCard}>
      <TouchableOpacity onPress={() =>
        setSelectedPdf(item.viewLink)}
      >
        <Image
          source={{ uri: item.cover }}
          style={styles.bookCover}
        />
      </TouchableOpacity>
      <ThemedText style={styles.bookTitle}>{item.title}</ThemedText>
    </View>
  );

  // const renderAuthor = ({ item }: { item: Author }) => (
  //   <View style={styles.bookCard}>
  //     <ThemedText style={styles.bookTitle}>{item.firstName} {item.lastName}</ThemedText>
  //   </View>
  // );

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

      {/* <FlatList
        data={authorList}
        keyExtractor={(item) => item.id}
        renderItem={renderAuthor}
        contentContainerStyle={{ paddingBottom: 40 }}
      /> */}

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
    flexDirection: 'row',
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 8,
  },
  bookCover: {
    height: 120,
    aspectRatio: 0.75,
    alignSelf: "center",
    marginRight: 20,
    borderRadius: 16,
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
