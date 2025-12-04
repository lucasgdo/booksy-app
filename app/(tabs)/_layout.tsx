import {Tabs, useRouter} from 'expo-router';
import {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MaterialCommunityIcons} from "@expo/vector-icons";

const TabLayout = () => {
    const router = useRouter();
    useEffect(() => {
        const testToken = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
                router.replace('/login');
            }
        };
        testToken();
    }, [router]);

    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarStyle: {
                backgroundColor: '#172026',
                borderTopWidth: 0,
                paddingTop: 5,
            },
            tabBarActiveTintColor: '#2dd4bf',
            tabBarInactiveTintColor: '#9ca3af',
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Livros',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="book-outline" size={size} color={color}/>
                    )
                }}
            />
            <Tabs.Screen
                name="readings"
                options={{
                    title: 'Leituras',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="bookshelf" size={size} color={color}/>
                    )
                }}
            />
            <Tabs.Screen
                name="reviews"
                options={{
                    title: 'Avaliações',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="star-outline" size={size} color={color}/>
                    )
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Configurações',
                    tabBarIcon: ({color, size}) => (
                        <MaterialCommunityIcons name="cog-outline" size={size} color={color}/>
                    )
                }}
            />
        </Tabs>
    );
}

export default TabLayout;
