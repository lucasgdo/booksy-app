import { authService } from "@/services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from 'jwt-decode';
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface TokenPayload {
    sub: string;
    exp?: number;
    iat?: number;
}

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        if (!email) return setErrorMessage("Favor inserir email!");
        if (!password) return setErrorMessage("Favor inserir senha!");
        if (!validateEmail(email)) return setErrorMessage("Favor inserir um email válido!");

        try {
            const res = await authService.login(email, password);
            if (res) {
                const tokenPayload = jwtDecode<TokenPayload>(res);
                const userEmail = tokenPayload.sub;

                await AsyncStorage.setItem('userToken', res);
                await AsyncStorage.setItem('userEmail', userEmail);
                setErrorMessage("");
                router.replace('/(tabs)');
            } else {
                setErrorMessage("Token não recebido. Verifique a API.");
            }

        } catch (error) {
            console.log("Erro ao logar:", error);
            setErrorMessage("Não foi possível logar! Tente novamente mais tarde");
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.inner}>
                <Text style={styles.title}>Booksy</Text>
                <Text style={styles.errorText}> {errorMessage}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    placeholderTextColor="#888"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    placeholderTextColor="#888"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    inner: {
        width: '100%',
        maxWidth: 360,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: 15,
    },
    errorText: {
        marginBottom: 15,
        marginTop: 0,
        color: '#ff0000',
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#0F172A',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    button: {
        backgroundColor: '#3B82F6',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
