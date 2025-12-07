import { Book } from "@/entitites/Book";
import useFetch from "@/hooks/use-fetch";
import { bookService } from "@/services/bookService";
import { reviewService } from "@/services/reviewService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const AddReviewScreen = () => {
    const router = useRouter();
    const { data: books } = useFetch(() => bookService.listBooks());

    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isBookModalVisible, setIsBookModalVisible] = useState(false);

    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const getUserId = async () => {
            const token = await AsyncStorage.getItem("userToken");
            // @ts-ignore
            const parts = token.split('.');
            const payloadEncoded = parts[1];
            const payloadDecoded = JSON.parse(atob(payloadEncoded));
            setUserId(payloadDecoded.sub);
        }

        getUserId();
    }, [userId]);

    const handleSelectBook = (book: Book) => {
        setSelectedBook(book);
        setIsBookModalVisible(false);
    };

    const handleSubmit = async () => {
        if (!selectedBook) return alert("Selecione um livro");
        if (!rating) return alert("Dê uma nota");
        if (!title.trim()) return alert("Digite um título");
        if (!comment.trim()) return alert("Digite um comentário");
        if (!userId) return alert("Usuário não identificado");

        try {
            await reviewService.createReview({
                bookId: selectedBook.id,
                rating: rating,
                title: title,
                textPost: comment,
                userId
            });

            router.back();

        } catch (error) {
            console.log("Erro ao criar review:", error);
            alert("Não foi possível enviar a avaliação");
        }
    };


    return (
        <View className="flex-1 bg-[#0A1A1F]">
            {/* Header */}
            <View className="pt-12 px-5 pb-4 flex-row items-center relative border-b border-gray-800">
                <TouchableOpacity onPress={() => router.back()} className="absolute left-5 bottom-4 z-10">
                    <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <View className="flex-1 items-center justify-center">
                    <Text className="text-white text-lg font-bold">Adicionar Avaliação</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-5 pt-6">
                {/* Book Selection */}
                <View className="mb-6">
                    <Text className="text-white font-bold mb-2 ml-1">Selecione o livro</Text>
                    <TouchableOpacity
                        className="bg-[#112329] p-4 rounded-xl border border-gray-800 flex-row justify-between items-center"
                        onPress={() => setIsBookModalVisible(true)}
                    >
                        <Text className={`text-base ${selectedBook ? 'text-white' : 'text-[#4B5563]'}`}>
                            {selectedBook ? selectedBook.title : "Selecione o livro"}
                        </Text>
                        <MaterialCommunityIcons name="chevron-down" size={24} color="#4B5563" />
                    </TouchableOpacity>
                </View>

                {/* Rating */}
                <Text className="text-white font-bold mb-4 ml-1">Sua nota</Text>
                <View className="flex-row mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => setRating(star)} activeOpacity={0.7}>
                            <MaterialCommunityIcons
                                name={star <= rating ? "star" : "star-outline"}
                                size={36}
                                color="#2AD2C9"
                                style={{ marginRight: 8 }}
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Title Input */}
                <View className="mb-6">
                    <Text className="text-white font-bold mb-2 ml-1">Título da avaliação</Text>
                    <TextInput
                        className="bg-[#112329] text-white p-4 rounded-xl border border-gray-800 text-base"
                        placeholder="Ex: Uma jornada fantástica"
                        placeholderTextColor="#4B5563"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Comment Input */}
                <View className="mb-6">
                    <Text className="text-white font-bold mb-2 ml-1">Comentário</Text>
                    <TextInput
                        className="bg-[#112329] text-white p-4 rounded-xl border border-gray-800 text-base h-40 text-top"
                        placeholder="Escreva sua opinião sobre o livro..."
                        placeholderTextColor="#4B5563"
                        multiline
                        textAlignVertical="top"
                        value={comment}
                        onChangeText={setComment}
                    />
                </View>
            </ScrollView>

            {/* Footer Button */}
            <View className="p-5 border-t border-gray-800">
                <TouchableOpacity
                    className="bg-[#2AD2C9] py-4 rounded-xl items-center"
                    activeOpacity={0.8}
                    onPress={() => handleSubmit()}
                >
                    <Text className="text-[#0A1A1F] font-bold text-lg">Enviar Avaliação</Text>
                </TouchableOpacity>
            </View>

            {/* Book Selection Modal */}
            <Modal
                visible={isBookModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsBookModalVisible(false)}
            >
                <View className="flex-1 bg-black/80 justify-center px-5">
                    <View className="bg-[#112329] rounded-2xl max-h-[80%] border border-gray-800">
                        <View className="p-4 border-b border-gray-800 flex-row justify-between items-center">
                            <Text className="text-white font-bold text-lg">Selecione um Livro</Text>
                            <TouchableOpacity onPress={() => setIsBookModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={books}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="p-4 border-b border-gray-800"
                                    onPress={() => handleSelectBook(item)}
                                >
                                    <Text className="text-white text-base">{item.title}</Text>
                                    <Text className="text-gray-500 text-sm">{item.author?.firstName} {item.author?.lastName}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default AddReviewScreen;
