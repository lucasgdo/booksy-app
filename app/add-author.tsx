import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const RegisterAuthorScreen = () => {
    const router = useRouter();

    const InputField = ({ label, placeholder }: any) => (
        <View className="mb-4">
            <Text className="text-white font-bold mb-2 ml-1">{label}</Text>
            <TextInput 
                className="bg-[#112329] text-white p-4 rounded-xl border border-gray-800 text-base"
                placeholder={placeholder}
                placeholderTextColor="#4B5563"
            />
        </View>
    );

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
                <InputField label="Nome" placeholder="Digite o nome" />
                <InputField label="Sobrenome" placeholder="Digite o sobrenome" />
                <InputField label="País de origem" placeholder="Digite o país de origem" />
                <InputField label="Ano de nascimento" placeholder="Digite o ano de nascimento" />
            </ScrollView>

             {/* Footer Button */}
             <View className="p-5 border-t border-gray-800">
                <TouchableOpacity 
                    className="bg-[#2AD2C9] py-4 rounded-xl items-center"
                    activeOpacity={0.8}
                    onPress={() => router.back()}
                >
                    <Text className="text-[#0A1A1F] font-bold text-lg">Salvar Autor</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default RegisterAuthorScreen;
