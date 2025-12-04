import {View, Text, ScrollView, TouchableOpacity, Image, Modal} from 'react-native'
import React, {useState} from 'react'
import {router, useLocalSearchParams} from "expo-router";
import useFetch from "@/hooks/use-fetch";
import {bookService} from "@/services/bookService";
import {Feather} from "@expo/vector-icons";
import {WebView} from "react-native-webview";

const BookDetailsScreen = () => {
    const {id} = useLocalSearchParams();
    const {data: book} = useFetch(() => bookService.getBook(id as string));
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

    return (
        <ScrollView className="flex-1 bg-[#0A1A1F] px-4 pt-10">
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 py-3">
                <TouchableOpacity onPress={router.back}>
                    <Feather name="arrow-left" size={24} color="white"/>
                </TouchableOpacity>
            </View>
            {/* BookCover */}
            <View className="items-center mt-2">
                <Image
                    source={{uri: book?.cover}}
                    className="w-64 h-72 rounded-xl"
                />
            </View>
            {/* BookTitle */}
            <Text className="text-xl font-extrabold text-center px-6 mt-4 text-white">
                {book?.title}
            </Text>
            {/* AuthorName */}
            <Text className="text-center mt-1 text-gray-400">
                por <Text
                className="text-[#2AD2C9] font-semibold">{`${book?.author.firstName} ${book?.author.lastName}`}</Text>
            </Text>
            {/* Tags */}
            <View className="flex-row justify-center gap-2 mt-4 px-4 flex-wrap">
                {book?.categories?.map((category) => (
                    <View key={category.id} className="bg-[#152228] border border-gray-800 px-4 py-2 rounded-lg">
                        <Text className="text-sm font-semibold text-gray-300">{category.name}</Text>
                    </View>
                ))}

                <View className="bg-[#152228] border border-gray-800 px-4 py-2 rounded-lg">
                    <Text className="text-sm font-semibold text-gray-300">{book?.releaseDate}</Text>
                </View>

                <View className="bg-[#152228] border border-gray-800 px-4 py-2 rounded-lg">
                    <Text className="text-sm font-semibold text-gray-300">{`${book?.pagesNumber} páginas`}</Text>
                </View>
            </View>
            {/* Buttons */}
            <View className="flex-row items-center justify-between px-4 mt-8 mb-10">
                {/*<TouchableOpacity className="p-3 rounded-full border border-gray-600 bg-[#152228]">*/}
                {/*    <Feather name="bookmark" size={24} color="white"/>*/}
                {/*</TouchableOpacity>*/}

                <TouchableOpacity
                    className="flex-1 ml-3 bg-[#2AD2C9] py-3 rounded-xl"
                    onPress={() => setSelectedPdf(book?.viewLink!)}
                >
                    <Text className="text-[#0A1A1F] text-center font-bold text-lg">Ler Livro</Text>
                </TouchableOpacity>
            </View>
            {/* BookReader */}
            <Modal
                visible={!!selectedPdf}
                onRequestClose={() => setSelectedPdf(null)}
                animationType="slide"
            >
                <View className="flex-1 bg-[#0A1A1F]">
                    <TouchableOpacity
                        className="absolute top-12 left-5 z-10 bg-black/60 w-10 h-10 rounded-full items-center justify-center"
                        onPress={() => setSelectedPdf(null)}
                    >
                        <Text className="text-white text-base">✕</Text>
                    </TouchableOpacity>

                    {selectedPdf && (
                        <WebView
                            source={{uri: selectedPdf}}
                            className="flex-1"
                            sharedCookiesEnabled={true}
                            thirdPartyCookiesEnabled={true}
                        />
                    )}
                </View>
            </Modal>
        </ScrollView>
    )
}

export default BookDetailsScreen;
