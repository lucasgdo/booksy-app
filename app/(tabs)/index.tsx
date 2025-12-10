import useFetch from "@/hooks/use-fetch";
import { bookService } from "@/services/bookService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {useState} from "react";

const HomeScreen = () => {
    // const {data: categoryList} = useFetch(() => categoryService.listCategories());
    const { data: bookList, refetch } = useFetch(() => bookService.listBooks());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const router = useRouter();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
        setIsRefreshing(false);
    }

    return (
        <View className="flex-1 bg-[#0A1A1F] px-4 pt-12">
            {/*<ScrollView showsVerticalScrollIndicator={false}>*/}
                {/* Header */}
                <Text className="text-3xl font-bold text-center mb-6 text-white">Livros</Text>
                {/* SearchBar */}
                {/*<View className="flex-row items-center bg-[#152228] rounded-2xl px-4 py-3 mb-4 border border-gray-800">*/}
                {/*    <MaterialCommunityIcons name="magnify" color="#9CA3AF" size={20}/>*/}
                {/*    <TextInput*/}
                {/*        placeholder="Qual livro você procura?"*/}
                {/*        placeholderTextColor="#9CA3AF"*/}
                {/*        className="ml-3 flex-1 text-white"*/}
                {/*    />*/}
                {/*</View>*/}
                {/* CategoryTabs */}
                {/*<FlatList*/}
                {/*    data={categoryList}*/}
                {/*    keyExtractor={(item) => item.id}*/}
                {/*    horizontal*/}
                {/*    showsHorizontalScrollIndicator={false}*/}
                {/*    contentContainerStyle={{paddingRight: 20}}*/}
                {/*    className="mb-6"*/}
                {/*    renderItem={({item}) => (*/}
                {/*        <TouchableOpacity className="mr-3 px-5 py-2 rounded-xl bg-[#152228] border border-gray-800">*/}
                {/*            <Text className="font-semibold text-gray-300">{item.name}</Text>*/}
                {/*        </TouchableOpacity>*/}
                {/*    )}*/}
                {/*/>*/}
                {/* BookList */}
                <FlatList
                    data={bookList || []}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    columnWrapperStyle={{ justifyContent: "space-between" }}
                    contentContainerStyle={{ paddingBottom: 60 }}
                    onRefresh={handleRefresh}
                    refreshing={isRefreshing}
                    renderItem={({ item }) => (
                        <Link href={`/books/${item.id}`} asChild>
                            <TouchableOpacity className="w-[48%] mb-6">
                                <View className="w-full h-56 rounded-2xl overflow-hidden bg-gray-800 mb-2">
                                    <Image
                                        source={{ uri: item.cover }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                </View>
                                <Text className="mt-1 text-lg font-semibold text-white"
                                    numberOfLines={1}>{item.title}
                                </Text>
                                {/* <Text
                                    className="text-gray-400 text-sm">{`${item.author.firstName} ${item.author.lastName}`}
                                </Text> */}
                            </TouchableOpacity>
                        </Link>
                    )}
                />
            {/*</ScrollView>*/}
            <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-[#2AD2C9] rounded-full justify-center items-center shadow-lg z-50"
                activeOpacity={0.8}
                onPress={() => router.push('/add-book')}
            >
                <MaterialCommunityIcons name="plus" size={28} color="#0A1A1F" />
            </TouchableOpacity>
        </View>
    );
}

export default HomeScreen;
