import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, Alert, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {useEffect, useState} from 'react';
import useFetch from "@/hooks/use-fetch";
import { authorService } from "@/services/authorService";
import { Author } from "@/entitites/Author";
import { bookService, CreateBookDto } from "@/services/bookService";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";

const InputField = ({ label, placeholder, multiline = false, value, onChangeText, keyboardType = 'default' }: any) => (
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

const RegisterBookScreen = () => {
    const router = useRouter();
    const { data: authors } = useFetch(() => authorService.listAuthors());

    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
    const [isAuthorModalVisible, setIsAuthorModalVisible] = useState(false);

    const [title, setTitle] = useState("");
    const [isbn, setIsbn] = useState("");
    const [pagesNumber, setPagesNumber] = useState("");
    const [releaseDate, setReleaseDate] = useState("");
    const [cover, setCover] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSelectAuthor = (author: Author) => {
        setSelectedAuthor(author);
        setIsAuthorModalVisible(false);
    };

    const handleAddNewAuthor = () => {
        setIsAuthorModalVisible(false);
        router.push('/add-author');
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [2, 3],
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            setCover(result.assets[0].base64 ? `data:image/jpeg;base64,${result.assets[0].base64}` : result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!title || !isbn || !pagesNumber || !selectedAuthor) {
            Alert.alert("Campos obrigatórios", "Por favor, preencha título, ISBN, número de páginas e selecione um autor.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: CreateBookDto = {
                title,
                isbn,
                pagesNumber: parseInt(pagesNumber, 10),
                authorId: selectedAuthor.id,
                releaseDate: releaseDate ? parseInt(releaseDate, 10) : undefined,
                cover: cover || undefined,
            };

            await bookService.createBook(payload);
            Alert.alert("Sucesso", "Livro cadastrado com sucesso!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível cadastrar o livro. Verifique os dados e tente novamente.");
        } finally {
            setIsSubmitting(false);
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
                    <Text className="text-white text-lg font-bold">Cadastrar Livro</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-5 pt-6">
                {/* Cover Upload */}
                <TouchableOpacity
                    className="w-full h-48 border-2 border-dashed border-gray-700 rounded-2xl items-center justify-center bg-[#0d1f25] mb-8 overflow-hidden"
                    onPress={pickImage}
                >
                    {cover ? (
                        <Image source={{ uri: cover }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <>
                            <MaterialCommunityIcons name="image-plus" size={32} color="#2AD2C9" />
                            <Text className="text-white font-bold mt-3 text-lg">Adicionar capa do livro</Text>
                            <Text className="text-gray-500 text-sm mt-1">Toque para fazer upload da imagem da capa.</Text>
                        </>
                    )}
                </TouchableOpacity>

                <InputField
                    label="Título"
                    placeholder="Digite o título do livro"
                    value={title}
                    onChangeText={setTitle}
                />

                {/* Author Selection */}
                <View className="mb-4">
                    <Text className="text-white font-bold mb-2 ml-1">Autor</Text>

                    <TouchableOpacity
                        className="bg-[#112329] p-4 rounded-xl border border-gray-800 flex-row justify-between items-center"
                        onPress={() => setIsAuthorModalVisible(true)}
                    >
                        <Text className={`text-base ${selectedAuthor ? 'text-white' : 'text-[#4B5563]'}`}>
                            {selectedAuthor ? `${selectedAuthor.firstName} ${selectedAuthor.lastName}` : "Selecione o autor"}
                        </Text>
                        <MaterialCommunityIcons name="chevron-down" size={24} color="#4B5563" />
                    </TouchableOpacity>
                </View>

                <InputField
                    label="ISBN"
                    placeholder="Digite o ISBN do livro"
                    value={isbn}
                    onChangeText={setIsbn}
                />
                <InputField
                    label="Número de páginas"
                    placeholder="Digite o número de páginas do livro"
                    value={pagesNumber}
                    onChangeText={setPagesNumber}
                    keyboardType="numeric"
                />
                <InputField
                    label="Ano de lançamento"
                    placeholder="Digite o ano de lançamento"
                    value={releaseDate}
                    onChangeText={setReleaseDate}
                    keyboardType="numeric"
                />

                {/*<Text className="text-white font-bold mb-2 ml-1 mt-2">Arquivo do Livro</Text>*/}
                {/*<TouchableOpacity className="bg-[#112E35] border border-[#1E4E56] py-4 rounded-xl items-center flex-row justify-center mb-8">*/}
                {/*    <MaterialCommunityIcons name="paperclip" size={20} color="#2AD2C9" style={{ marginRight: 8 }} />*/}
                {/*    <Text className="text-[#2AD2C9] font-bold">Anexar PDF do Livro</Text>*/}
                {/*</TouchableOpacity>*/}
            </ScrollView>

            {/* Footer Button */}
            <View className="p-5 border-t border-gray-800">
                <TouchableOpacity
                    className={`bg-[#2AD2C9] py-4 rounded-xl items-center ${isSubmitting ? 'opacity-50' : ''}`}
                    activeOpacity={0.8}
                    onPress={handleSave}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#0A1A1F" />
                    ) : (
                        <Text className="text-[#0A1A1F] font-bold text-lg">Salvar Livro</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* Author Selection Modal */}
            <Modal
                visible={isAuthorModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsAuthorModalVisible(false)}
            >
                <View className="flex-1 bg-black/80 justify-center px-5">
                    <View className="bg-[#112329] rounded-2xl max-h-[80%] border border-gray-800">
                        <View className="p-4 border-b border-gray-800 flex-row justify-between items-center">
                            <Text className="text-white font-bold text-lg">Selecione um Autor</Text>
                            <TouchableOpacity onPress={() => setIsAuthorModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="white" />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={authors}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="p-4 border-b border-gray-800"
                                    onPress={() => handleSelectAuthor(item)}
                                >
                                    <Text className="text-white text-base">{item.firstName} {item.lastName}</Text>
                                </TouchableOpacity>
                            )}
                            ListFooterComponent={
                                <TouchableOpacity
                                    className="p-4 flex-row items-center"
                                    onPress={handleAddNewAuthor}
                                >
                                    <MaterialCommunityIcons name="plus" size={20} color="#2AD2C9" style={{ marginRight: 8 }} />
                                    <Text className="text-[#2AD2C9] font-bold">Adicionar novo autor</Text>
                                </TouchableOpacity>
                            }
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default RegisterBookScreen;
