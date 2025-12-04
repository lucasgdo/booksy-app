import {View, Text, FlatList, TouchableOpacity, Image, ScrollView} from 'react-native'
import React from 'react'
import useFetch from "@/hooks/use-fetch";
import {readingService} from "@/services/readingService";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useRouter} from "expo-router";

const ReadingsScreen = () => {
    const {data: readingsList} = useFetch(() => readingService.listReadings());
    const router = useRouter();

    return (
        <View className="flex-1 bg-[#0A1A1F]">
            <ScrollView className="flex-1 pt-12 px-5">
                {/* Header */}
                <View className="flex-row justify-center items-center mb-8">
                    <Text className="text-white text-3xl font-bold">Leituras</Text>
                </View>
                {/* Book List */}
                <FlatList
                    data={readingsList}
                    keyExtractor={(item) => item.id?.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={{paddingBottom: 100}}
                    renderItem={({item}) => {
                        const progressPercent = Math.round((item.currentPage / item.book.pagesNumber) * 100);
                        const authorName = item.book?.author
                            ? `${item.book.author.firstName} ${item.book.author.lastName}`
                            : "Autor Desconhecido";

                        return (
                            <View className="mb-10">
                                {/* Book Cover Card */}
                                <View
                                    className="w-full h-[380px] bg-white rounded-2xl overflow-hidden mb-4 items-center justify-center">
                                    <Image
                                        source={{uri: item.book?.cover}}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </View>
                                {/* Title & Author */}
                                <Text className="text-white text-xl font-bold mb-1">{item.book?.title}</Text>
                                <Text className="text-gray-400 text-base mb-4">{authorName}</Text>
                                {/* Progress Bar */}
                                <View className="w-full h-2 bg-gray-800 rounded-full mb-2 overflow-hidden">
                                    <View
                                        className="h-full bg-[#2AD2C9]"
                                        style={{width: `${progressPercent}%`}}
                                    />
                                </View>
                                <Text className="text-gray-400 text-xs text-right mb-4">{progressPercent}%
                                    concluído</Text>
                                {/* Action Button */}
                                <TouchableOpacity
                                    className="w-full bg-[#2AD2C9] py-3 rounded-xl items-center justify-center">
                                    <Text className="text-[#0A1A1F] font-bold text-base">Editar</Text>
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            </ScrollView>
            {/* Floating Action Button - Placed outside ScrollView */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-[#2AD2C9] rounded-full justify-center items-center shadow-lg z-50"
                activeOpacity={0.8}
                onPress={() => router.push('/add-reading')}
            >
                <MaterialCommunityIcons name="plus" size={28} color="#0A1A1F"/>
            </TouchableOpacity>
        </View>
    )
}

export default ReadingsScreen;
