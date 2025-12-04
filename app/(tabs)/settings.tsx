import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SettingsScreen = () => {
    const router = useRouter();
    const [isSyncEnabled, setIsSyncEnabled] = useState(true);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userToken");
        router.replace("/login");
    }

    const SectionTitle = ({ title }: { title: string }) => (
        <Text className="text-white font-bold text-lg mb-4 mt-6 px-1">{title}</Text>
    );

    const MenuItem = ({ 
        icon, 
        label, 
        value, 
        isDestructive = false, 
        onPress,
        showChevron = true,
        rightElement
    }: any) => (
        <TouchableOpacity 
            className="flex-row items-center justify-between py-4 border-b border-gray-800"
            onPress={onPress}
        >
            <View className="flex-row items-center">
                <MaterialCommunityIcons 
                    name={icon} 
                    size={24} 
                    color={isDestructive ? "#EF4444" : "#9CA3AF"} 
                />
                <Text className={`ml-4 text-base ${isDestructive ? "text-red-500" : "text-white"}`}>
                    {label}
                </Text>
            </View>
            <View className="flex-row items-center">
                {value && <Text className="text-gray-500 mr-2">{value}</Text>}
                {rightElement}
                {showChevron && !rightElement && (
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#4B5563" />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <ScrollView className="flex-1 bg-[#0A1A1F] pt-12 px-5">
            {/* Header */}
            <View className="flex-row justify-center items-center mb-8">
                <Text className="text-white text-3xl font-bold">Configurações</Text>
            </View>

            <View className="flex-1 px-5">
                <SectionTitle title="Conta" />
                
                {/* User Profile Card */}
                <View className="bg-[#112329] p-4 rounded-xl flex-row items-center mb-2">
                    <View className="w-12 h-12 bg-[#1F3641] rounded-full items-center justify-center mr-4">
                        <MaterialCommunityIcons name="account-outline" size={24} color="#2AD2C9" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-bold text-base">Nome de Usuário</Text>
                        <Text className="text-gray-400 text-sm">email@exemplo.com</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#4B5563" />
                </View>

                {/*<MenuItem icon="medal-outline" label="Gerenciar assinatura" />*/}
                
                <TouchableOpacity 
                    className="flex-row items-center py-4 mt-2"
                    onPress={handleLogout}
                >
                    <MaterialCommunityIcons name="logout" size={24} color="#EF4444" />
                    <Text className="ml-4 text-base text-red-500">Sair</Text>
                </TouchableOpacity>

                {/*<SectionTitle title="Geral" />*/}
                {/*<MenuItem icon="bell-outline" label="Notificações" />*/}
                {/*<MenuItem icon="theme-light-dark" label="Aparência" value="Padrão do Sistema" />*/}
                {/*<MenuItem icon="web" label="Idioma" value="Português" />*/}

                {/*<SectionTitle title="Dados e Sincronização" />*/}
                {/*<MenuItem */}
                {/*    icon="cloud-sync-outline" */}
                {/*    label="Sincronização na Nuvem" */}
                {/*    showChevron={false}*/}
                {/*    rightElement={*/}
                {/*        <Switch*/}
                {/*            trackColor={{ false: "#374151", true: "#2AD2C9" }}*/}
                {/*            thumbColor={isSyncEnabled ? "#ffffff" : "#f4f3f4"}*/}
                {/*            onValueChange={setIsSyncEnabled}*/}
                {/*            value={isSyncEnabled}*/}
                {/*        />*/}
                {/*    }*/}
                {/*/>*/}
                {/*<MenuItem icon="download-outline" label="Opções de Download" />*/}
                {/*<MenuItem icon="trash-can-outline" label="Limpar Cache" />*/}

                {/*<SectionTitle title="Sobre" />*/}
                {/*<MenuItem icon="help-circle-outline" label="Ajuda & FAQ" />*/}
                {/*<MenuItem icon="shield-check-outline" label="Política de Privacidade" />*/}
                {/*<MenuItem icon="information-outline" label="Sobre o Aplicativo" />*/}

                {/*<Text className="text-gray-600 text-center mt-8 mb-12 text-sm">Versão 1.0.0</Text>*/}
            </View>
        </ScrollView>
    );
}

export default SettingsScreen;
