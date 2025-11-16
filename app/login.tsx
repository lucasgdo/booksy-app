import { authService } from "@/services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export default function LoginScreen() {
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
            console.log(error)
            setErrorMessage("Indisponível! Tente novamente mais tarde.");
        }
    };

    return (
        <ImageBackground
            source={require("@/assets/images/backgroundImage.avif")}
            style={styles.background}
            resizeMode="cover"
            blurRadius={3}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.card}>
                    <Text style={styles.title}>Booksy</Text>
                    <Text style={styles.errorText}>{errorMessage}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor="#a0a0a0"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        placeholderTextColor="#a0a0a0"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        paddingHorizontal: 24,
    },
    card: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 20,
        padding: 30,
        width: '100%',
        maxWidth: 360,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 15,
        elevation: 8,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 10,
        textShadowColor: 'rgba(0,0,0,0.1)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    errorText: {
        color: '#EF4444',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderColor: '#c7c7c7',
        borderWidth: 1,
        backgroundColor: '#F1F5F9',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 18,
        fontSize: 16,
        color: '#0F172A',
        marginBottom: 16,
        width: '100%',
    },
    button: {
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
