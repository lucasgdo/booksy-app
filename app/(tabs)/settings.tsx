import {userService} from '@/services/userService';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {UserResponse} from "@/entitites/User";

const SettingsScreen = () => {
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState<UserResponse | null>(null);

    useEffect(() => {
        AsyncStorage.getItem("userToken").then((token) => {
            if (token) {
                const parts = token.split('.');
                const payloadEncoded = parts[1];
                const payloadDecoded = JSON.parse(atob(payloadEncoded));
                setUserId(payloadDecoded.sub);
            }
        });

    }, []);

    useEffect(() => {
        if (!userId) return;

        let mounted = true;

        const fetchUser = async () => {
            try {
                const fetched = await userService.getUserById(userId);
                if (mounted) setUser(fetched);
            } catch (e) {
                console.warn("Failed to fetch user: ", e);
            }
        };

        fetchUser().then();

        return () => { mounted = false };
    }, [userId]);

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
                        <Text className="text-white font-bold text-base">{user?.name}</Text>
                        <Text className="text-gray-400 text-sm">{user?.email}</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="#4B5563" />
                </View>

                <TouchableOpacity
                    className="flex-row items-center py-4 mt-2"
                    onPress={handleLogout}
                >
                    <MaterialCommunityIcons name="logout" size={24} color="#EF4444" />
                    <Text className="ml-4 text-base text-red-500">Sair</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

export default SettingsScreen;
