import { Redirect, Stack, Tabs } from "expo-router";

export default function RootLayout () {
    return <>
        <Stack initialRouteName="(tabs)">
            <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
            <Stack.Screen name="(auths)" options={{ headerShown: false }}/>
            <Stack.Screen name="itemdetail" options={{ headerShown: false }}/>
            <Stack.Screen name="changepassword" options={{ headerShown: false }}/>
            <Stack.Screen name="account" options={{ headerShown: false }}/>
            <Stack.Screen name="registerstore" options={{ headerShown: false }}/>
            <Stack.Screen name="favoriteitems" options={{ headerShown: false }}/>
            <Stack.Screen name="locationdetail" options={{ headerShown: false }}/>
            <Stack.Screen name="storedetail" options={{ headerShown: false }}/>
        </Stack>
    </>
}