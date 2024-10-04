import { Stack } from "expo-router";

export default function RootLayout () {
    return <>
        <Stack>
            <Stack.Screen name="wellcome" options={{
                    headerShown: false,
                }}/>
            <Stack.Screen name="signin" options={{
                    headerShown: false,
                }}/>
            <Stack.Screen name="signup" options={{
                headerShown: false,
            }}/>
        </Stack>
    </>
}