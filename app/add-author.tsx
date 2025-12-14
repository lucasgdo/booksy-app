import {View, Text, TextInput, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {useState} from "react";
import {authorService, CreateAuthorDto} from "@/services/authorService";

const InputField = ({ label, placeholder, value, onChangeText, keyboardType="default", multiline = false }: any) => (
    <View className="mb-4">
        <Text className="text-white font-bold mb-2 ml-1">{label}</Text>
        <TextInput
            className="bg-[#112329] text-white p-4 rounded-xl border border-gray-800 text-base"
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            multiline={multiline}
            placeholderTextColor="#4B5563"
        />
    </View>
);

const RegisterAuthorScreen = () => {
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [originCountry, setOriginCountry] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        if (!firstName || !lastName || !birthYear || !originCountry) {
            Alert.alert("Campos obrigatórios", "Por favor, preencha primeiro nome, sobrenome, data de nascimento e país de origem.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: CreateAuthorDto = {
                firstName,
                lastName,
                birthYear: parseInt(birthYear, 10),
                originCountry,
            };

            await authorService.createAuthor(payload);
            Alert.alert("Sucesso", "Autor cadastrado com sucesso!", [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possível cadastrar o autor. Verifique os dados e tente novamente.");
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
                    <Text className="text-white text-lg font-bold">Cadastrar Autor</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-5 pt-6">
                <InputField label="Nome" placeholder="Digite o nome" value={firstName} onChangeText={setFirstName} />
                <InputField label="Sobrenome" placeholder="Digite o sobrenome" value={lastName} onChangeText={setLastName} />
                <InputField label="País de origem" placeholder="Digite o país de origem" value={originCountry} onChangeText={setOriginCountry} />
                <InputField label="Ano de nascimento" placeholder="Digite o ano de nascimento" value={birthYear} onChangeText={setBirthYear} keyboardType="numeric" />
            </ScrollView>

             {/* Footer Button */}
             <View className="p-5 border-t border-gray-800">
                <TouchableOpacity 
                    className="bg-[#2AD2C9] py-4 rounded-xl items-center"
                    activeOpacity={0.8}
                    onPress={handleSave}
                    disabled={isSubmitting}
                >
                    <Text className="text-[#0A1A1F] font-bold text-lg">Salvar Autor</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default RegisterAuthorScreen;
