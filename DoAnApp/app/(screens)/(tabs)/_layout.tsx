import { themeColors } from "@/themes";
import { Redirect, Stack, Tabs } from "expo-router";
import { Icon } from "react-native-paper";



export default function RootLayout() {
    return <>
            <Tabs>
                <Tabs.Screen name="index" options={{
                    tabBarActiveTintColor:themeColors.bgColor(1),
                    headerShown: false,
                    title:"Home",
                    tabBarIcon: ({ focused, size }) => (
                        <Icon size={size} color={focused ? themeColors.bgColor(1) : "gray"} source="home" />
                    )
                }}/>
                <Tabs.Screen name="history" options={{
                    tabBarActiveTintColor:themeColors.bgColor(1),
                    headerShown: false,
                    title:"History",
                    tabBarIcon: ({ focused, size }) => (
                        <Icon size={size} color={focused ? themeColors.bgColor(1) : "gray"} source="clipboard-text-clock-outline" />
                    ),
                }}/>
                <Tabs.Screen name="chat" options={{
                    tabBarActiveTintColor:themeColors.bgColor(1),
                    headerShown: false,
                    title:"Chat",
                    tabBarIcon: ({ focused, size }) => (
                        <Icon size={size} color={focused ? themeColors.bgColor(1) : "gray"} source="chat" />
                    ),
                }}/>
                <Tabs.Screen name="profile" options={{
                    tabBarActiveTintColor:themeColors.bgColor(1),
                    headerShown: false,
                    title:"Profile",
                    tabBarIcon: ({ focused, size }) => (
                        <Icon size={size} color={focused ? themeColors.bgColor(1) : "gray"} source="account" />
                    ),
                }}/>
            </Tabs>
    </>
}