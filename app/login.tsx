import { authService } from "@/services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

const LoginScreen = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleLogin = async () => {
        if (!email) return setErrorMessage("Favor inserir email!");
        if (!password) return setErrorMessage("Favor inserir senha!");
        if (!validateEmail(email)) return setErrorMessage("Favor inserir um email válido!");
        try {
            const res = await authService.login(email, password);
            if (res) {
                await AsyncStorage.setItem('userToken', res);
                await AsyncStorage.setItem('userEmail', email);
                setErrorMessage("");
                router.replace('/(tabs)');
            } else {
                setErrorMessage("Token não recebido.");
            }
        } catch (error) {
            console.error(error)
            setErrorMessage("Indisponível! Tente novamente mais tarde.");
        }
    };

    return (
        <ImageBackground
            source={require("@/assets/images/backgroundImage.avif")}
            className="flex-1 justify-center items-center"
            resizeMode="cover"
            blurRadius={3}
        >
            <KeyboardAvoidingView
                className="w-full px-6"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View
                    className="bg-[#112329]/95 rounded-[20px] p-[30px] w-full max-w-[360px] items-center"
                    style={{
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 5 },
                        shadowRadius: 15,
                        elevation: 8,
                    }}
                >
                    <Text
                        className="text-4xl font-extrabold text-white mb-2.5"
                        style={{
                            textShadowColor: 'rgba(0,0,0,0.1)',
                            textShadowOffset: { width: 0, height: 2 },
                            textShadowRadius: 4,
                        }}
                    >
                        Booksy
                    </Text>
                    <Text className="text-red-500 mb-4 text-center">{errorMessage}</Text>
                    <TextInput
                        className="border border-gray-800 bg-[#152228] rounded-xl py-3.5 px-[18px] text-base text-white mb-4 w-full"
                        placeholder="E-mail"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        className="border border-gray-800 bg-[#152228] rounded-xl py-3.5 px-[18px] text-base text-white mb-4 w-full"
                        placeholder="Senha"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity
                        className="bg-[#2AD2C9] py-4 px-10 rounded-xl items-center w-full"
                        onPress={handleLogin}
                    >
                        <Text className="text-[#0A1A1F] text-lg font-bold">Entrar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

export default LoginScreen;
