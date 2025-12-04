import {View, Text, FlatList, TouchableOpacity, Image, ScrollView} from 'react-native';
import React from 'react';
import useFetch from "@/hooks/use-fetch";
import {readingService} from "@/services/readingService";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useRouter} from "expo-router";

const ReviewsScreen = () => {
    const {data: readingsList} = useFetch(() => readingService.listReadings());
    const router = useRouter();

    // Mocking review data for UI replication purposes based on the readings list
    // In a real app, this would come from a specific reviews endpoint or be part of the reading object
    const getMockReview = (index: number) => {
        const reviews = [
            {
                comment: "Uma leitura fascinante do início ao fim...",
                rating: 5
            },
            {
                comment: "Ótimo começo para uma saga épica...",
                rating: 4
            },
            {
                comment: "Engraçado e inteligente, uma obra-prima...",
                rating: 5
            }
        ];
        return reviews[index % reviews.length];
    };

    return (
        <View className="flex-1 bg-[#0A1A1F]">
            <ScrollView className="flex-1 pt-12 px-5">
                {/* Header */}
                <View className="flex-row justify-center items-center mb-8">
                    <Text className="text-white text-3xl font-bold">Avaliações</Text>
                </View>
                {/* Reviews List */}
                <FlatList
                    data={readingsList}
                    keyExtractor={(item) => item.id?.toString()}
                    scrollEnabled={false}
                    contentContainerStyle={{paddingBottom: 20}}
                    renderItem={({item, index}) => {
                        const review = getMockReview(index);

                        return (
                            <View className="flex-row mb-6 items-start">
                                {/* Book Cover */}
                                <Image
                                    source={{uri: item.book?.cover}}
                                    className="w-[60px] h-[90px] rounded-md mr-4"
                                    resizeMode="cover"
                                />

                                {/* Content */}
                                <View className="flex-1 justify-center h-[90px]">
                                    <View className="flex-row justify-between items-start">
                                        <View className="flex-1 mr-2">
                                            <Text
                                                className="text-white font-bold text-base mb-1"
                                                numberOfLines={1}
                                            >
                                                {item.book?.title}
                                            </Text>
                                            <Text
                                                className="text-gray-400 text-sm mb-2 leading-5"
                                                numberOfLines={2}
                                            >
                                                {review.comment}
                                            </Text>
                                        </View>

                                        <TouchableOpacity className="-mt-1">
                                            <MaterialCommunityIcons name="dots-vertical" size={20} color="#9CA3AF"/>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Rating Stars */}
                                    <View className="flex-row">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <MaterialCommunityIcons
                                                key={star}
                                                name="star"
                                                size={16}
                                                color={star <= review.rating ? "#2AD2C9" : "#374151"}
                                                style={{marginRight: 2}}
                                            />
                                        ))}
                                    </View>
                                </View>
                            </View>
                        );
                    }}
                />
            </ScrollView>
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-[#2AD2C9] rounded-full justify-center items-center shadow-lg z-50"
                activeOpacity={0.8}
                onPress={() => router.push('/add-review')}
            >
                <MaterialCommunityIcons name="plus" size={28} color="#0A1A1F"/>
            </TouchableOpacity>
        </View>
    );
}

export default ReviewsScreen;
