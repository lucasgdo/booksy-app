import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from "expo-constants";

const api = axios.create({
    baseURL: "http://" + Constants.expoConfig?.hostUri?.split(":").shift()?.concat(":8080/api/v1")
});

// Request interceptor with logging
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log('🚀 Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            headers: config.headers,
            data: config.data
        });

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor with logging
api.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', {
            status: response.status,
            statusText: response.statusText,
            url: response.config.url,
            data: response.data
        });
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('❌ Response Error:', {
                status: error.response.status,
                statusText: error.response.statusText,
                url: error.config?.url,
                data: error.response.data
            });
        } else if (error.request) {
            console.error('❌ No Response:', {
                url: error.config?.url,
                message: error.message
            });
        } else {
            console.error('❌ Request Setup Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;