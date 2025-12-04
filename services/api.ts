import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from "expo-constants";

const api = axios.create({
    baseURL: "http://" + Constants.expoConfig?.hostUri?.split(":").shift()?.concat(":8080/api/v1")
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
