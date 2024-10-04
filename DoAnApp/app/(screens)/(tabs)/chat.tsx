import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Chat() {
    return <>
    <View className="flex-1 justify-center items-center bg-gray-100">
            <Link href='/(screens)/(tabs)/profile'>
                <Text>Go to Sign In</Text>
            </Link>
    </View>
    </>
}