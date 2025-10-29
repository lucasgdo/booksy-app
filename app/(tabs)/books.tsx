import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

export interface Book {
  title: string,
  cover: string,
  linkPdf: string
}

export default function BooksScreen() {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  const bookList: Book[] = [
    {
      title: "Revolução dos bichos",
      cover:
        "https://www.baixelivros.com.br/media/2019/06/a-revolucao-dos-bichos.jpg",
      linkPdf:
        "https://drive.google.com/file/d/1AIDlYL0nyuEB6D4AHdldA2rxvemuU_OC/preview",
    },
    {
      title: "O pequeno principe",
      cover:
        "https://www.baixelivros.com.br/media/2019/04/o-pequeno-principe.jpg",
      linkPdf:
        "https://drive.google.com/file/d/18B1bmNIzp4mUIX-y6zLi8LyDT6QgzKYH/preview",
    },
  ];

  const renderBook = ({ item }: { item: Book }) => {
    return (<View>
      <ThemedText>{item.title}</ThemedText>
      <TouchableOpacity onPress={() => setSelectedPdf(item.linkPdf)}>
        <Image
          source={item.cover}
          style={{ height: 200, aspectRatio: 0.75, alignSelf: "center" }}
        />
      </TouchableOpacity>
    </View>
    )
  }

  return (
    <ThemedView style={styles.content}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Livros
        </ThemedText>
      </ThemedView>

      <FlatList
        data={bookList}
        keyExtractor={(item) => item.title}
        renderItem={renderBook}
      />

      <Modal
        visible={!!selectedPdf}
        onRequestClose={() => setSelectedPdf(null)}
      >
        <View style={styles.webviewContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPdf(null)}
          >
            <Text style={{ color: "white" }}>X</Text>
          </TouchableOpacity>
          {selectedPdf && (
            <WebView
              source={{ uri: selectedPdf }}
              style={{ flex: 1 }}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
            />
          )}
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
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
  webviewContainer: { flex: 1 },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 10,
    backgroundColor: '#00000099',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
