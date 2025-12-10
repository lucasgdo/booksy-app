import useFetch from "@/hooks/use-fetch";
import { reviewService } from "@/services/reviewService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const ReviewsScreen = () => {
    const { data: readingsList, refetch } = useFetch(() => reviewService.listReviews());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    };

    return (
        <View className="flex-1 bg-[#0A1A1F] pt-12 px-5">
            {/* Header */}
            <View className="flex-row justify-center items-center mb-8">
                <Text className="text-white text-3xl font-bold">Avaliações</Text>
            </View>

            <FlatList
                data={readingsList || []}
                keyExtractor={(item) => item.id?.toString()}
                contentContainerStyle={{ paddingBottom: 120 }}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                renderItem={({ item }) => {
                    const rating = item.rating ?? 0;
                    const comment = item.textPost ?? "Sem comentário";
                    const title = item.book?.title ?? "Título desconhecido";
                    const cover = item.book?.cover ?? "";

                    return (
                        <View className="flex-row mb-6 items-start">
                            <Image
                                source={{ uri: cover }}
                                className="w-[60px] h-[90px] rounded-md mr-4 bg-gray-700"
                                resizeMode="cover"
                            />

                            <View className="flex-1 justify-center h-[90px]">
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1 mr-2">
                                        <Text className="text-white font-bold text-base mb-1" numberOfLines={1}>
                                            {title}
                                        </Text>

                                        <Text className="text-gray-400 text-sm mb-2" numberOfLines={2}>
                                            {comment}
                                        </Text>
                                    </View>

                                    {/*<TouchableOpacity>*/}
                                    {/*    <MaterialCommunityIcons name="dots-vertical" size={20} color="#9CA3AF" />*/}
                                    {/*</TouchableOpacity>*/}
                                </View>

                                {/* Stars */}
                                <View className="flex-row">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <MaterialCommunityIcons
                                            key={star}
                                            name="star"
                                            size={16}
                                            color={star <= rating ? "#2AD2C9" : "#374151"}
                                            style={{ marginRight: 2 }}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>
                    );
                }}
            />

            {/* Botão de adicionar review */}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-[#2AD2C9] rounded-full justify-center items-center shadow-lg z-50"
                activeOpacity={0.8}
                onPress={() => router.push('/add-review')}
            >
                <MaterialCommunityIcons name="plus" size={28} color="#0A1A1F" />
            </TouchableOpacity>
        </View>
    );
};

export default ReviewsScreen;
