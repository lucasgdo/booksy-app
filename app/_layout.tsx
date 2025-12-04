import {Redirect, Stack} from 'expo-router';
import "./global.css";

const RootLayout = () => {
    return (<>
            <Redirect href="/login"/>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="login"/>
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="books/[id]" options={{headerShown: false}}/>
                <Stack.Screen name="add-reading" options={{headerShown: false}}/>
                <Stack.Screen name="add-book" options={{headerShown: false}}/>
                <Stack.Screen name="add-author" options={{headerShown: false}}/>
                <Stack.Screen name="add-review" options={{headerShown: false}}/>
            </Stack>
        </>
    );
}

export default RootLayout;
