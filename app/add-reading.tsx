import {View, Text, TextInput, TouchableOpacity, Modal, FlatList, Alert, ActivityIndicator} from 'react-native';
import {useRouter} from 'expo-router';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useEffect, useState} from 'react';
import {bookService} from "@/services/bookService";
import useFetch from "@/hooks/use-fetch";
import {Book} from "@/entitites/Book";
import {CreateReadingDTO, readingService} from "@/services/readingService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InputField = ({label, placeholder, multiline = false, value, onChangeText, keyboardType = 'default'}: any) => (
    <View className="mb-4">
        <Text className="text-white font-bold mb-2 ml-1">{label}</Text>
        <TextInput
            className={`bg-[#112329] text-white p-4 rounded-xl border border-gray-800 text-base ${multiline ? 'h-32 text-top' : ''}`}
            placeholder={placeholder}
            placeholderTextColor="#4B5563"
            multiline={multiline}
            textAlignVertical={multiline ? "top" : "center"}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
        />
    </View>
);

const AddReadingScreen = () => {
    const router = useRouter();
    const {data: books} = useFetch(() => bookService.listBooks());

    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isBookModalVisible, setIsBookModalVisible] = useState(false);

    const [currentPage, setCurrentPage] = useState('0');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    // const progress = Math.min(100, Math.max(0, (parseInt(currentPage) || 0) / totalPages * 100))

    const handleSelectBook = (book: Book) => {
        setSelectedBook(book);
        setIsBookModalVisible(false);
    }

    const handleSave = async () => {
        if (!selectedBook || !currentPage) {
            Alert.alert("Campos obrigatórios", "Por favor, selecione um livro e preencha a página atual.")
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: CreateReadingDTO = {
                userId,
                bookId: selectedBook.id,
                currentPage: Number(currentPage)
            };

            await readingService.createReading(payload);
            Alert.alert("Sucesso", "Leitura cadastrada com sucesso!", [
                {text: "OK", onPress: () => router.back()}
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível cadastrar a leitura. Verifique os dados e tente novamente.")
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <View className="flex-1 bg-[#0A1A1F] p-5">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-8 mt-2">
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialCommunityIcons name="close" size={24} color="white"/>
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">Adicionar Leitura</Text>
                <View className="w-6"/>
            </View>

            {/* Form */}
            <View className="flex-1">
                <Text className="text-white text-base mb-2">Qual livro você está lendo?</Text>
                {/* Book Selection */}
                <TouchableOpacity
                    className="bg-[#112329] p-4 rounded-xl border border-gray-800 flex-row justify-between items-center"
                    onPress={() => setIsBookModalVisible(true)}
                >
                    <Text className={`text-base ${selectedBook ? 'text-white' : 'text-[#4B5563]'}`}>
                        {selectedBook ? `${selectedBook.title}` : "Selecione o livro"}
                    </Text>
                    <MaterialCommunityIcons name="chevron-down" size={24} color="#4B5563"/>
                </TouchableOpacity>
                {/*<TouchableOpacity*/}
                {/*    className="flex-row justify-between items-center bg-[#112329] p-4 rounded-xl border border-gray-800 mb-6">*/}
                {/*    <Text className="text-white text-base">A Biblioteca da Meia-Noite</Text>*/}
                {/*    <MaterialCommunityIcons name="chevron-down" size={24} color="#2AD2C9"/>*/}
                {/*</TouchableOpacity>*/}

                <Text className="text-white text-base mb-2">Página Atual</Text>
                <TextInput
                    className="bg-[#112329] text-white p-4 rounded-xl border border-gray-800 text-base mb-1"
                    value={currentPage}
                    onChangeText={setCurrentPage}
                    keyboardType="numeric"
                />
                {/*<Text className="text-gray-500 text-sm mb-8">de {totalPages} páginas</Text>*/}

                {/* Progress Bar */}
                {/*<View className="flex-row justify-end mb-1">*/}
                {/*    <Text className="text-white font-bold">{Math.round(progress)}%</Text>*/}
                {/*</View>*/}
                {/*<View className="h-2 bg-gray-800 rounded-full overflow-hidden mb-8">*/}
                {/*    <View*/}
                {/*        className="h-full bg-[#2AD2C9]"*/}
                {/*        style={{width: `${progress}%`}}*/}
                {/*    />*/}
                {/*</View>*/}
            </View>

            {/* Footer Button */}
            <TouchableOpacity
                className="bg-[#2AD2C9] py-4 rounded-xl items-center mb-4"
                activeOpacity={0.8}
                onPress={handleSave}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#0A1A1F"/>
                ) : (
                    <Text className="text-[#0A1A1F] font-bold text-lg">Salvar Progresso</Text>
                )}
            </TouchableOpacity>

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
                                <MaterialCommunityIcons name="close" size={24} color="white"/>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={books}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    className="p-4 border-b border-gray-800"
                                    onPress={() => handleSelectBook(item)}
                                >
                                    <Text className="text-white text-base">{item.title}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default AddReadingScreen;
