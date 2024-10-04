import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { Icon } from "react-native-paper";
import theme from "../../../themes/Colors";
import { useAppDispatch } from "@/configs/redux/hooks";
import { authActions } from "@/configs/redux/authSlice";
import { themeColors } from "@/themes";


export default function SignIn() {
    const navigation = useNavigation();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ userName?: string; password?: string }>({});
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();

    // Validate form fields
    const validateForm = () => {
        const newErrors: any = {};

        if (!userName) {
            newErrors.userName = 'Tên người dùng là bắt buộc';
        }

        // if (!password) {
        //     newErrors.password = 'Mật khẩu là bắt buộc';
        // }else if(password.length < 8 || !/\d/.test(password) || !/[!@#$%^&*]/.test(password)) {
        //     newErrors.password = 'Mật khẩu mới phải ít nhất 8 ký tự và chứa số, ký tự đặc biệt'
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const onLoginPressed = async () => {
        if (validateForm()) {
            setIsLoading(true);
            await dispatch(authActions.login(userName, password));
            navigation.navigate("(tabs)");
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white" style={theme.bg}>
            <SafeAreaView className="flex">
                <View className="flex-row justify-start">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                        <Icon size={20} color="black" source="arrow-left-bold" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center">
                    <Image style={{ width: 200, height: 200 }} source={require("../../../assets/images/app/login.png")} />
                </View>
            </SafeAreaView>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="flex-1 bg-white px-11 pt-2" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
                <View className="form space-y-2">
                    <Text className="text-gray-700 ml-4">Tên người dùng:</Text>
                    <TextInput
                        className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 border border-gray-300"
                        placeholder="Nhập tên người dùng"
                        onChangeText={t => setUserName(t)}
                    />
                    {errors.userName && <Text className="text-red-500">{errors.userName}</Text>}

                    <Text className="text-gray-700 ml-4">Mật khẩu:</Text>
                    <View className="relative">
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3 border border-gray-300"
                            placeholder="Nhập mật khẩu"
                            secureTextEntry={!showPassword}
                            onChangeText={t => setPassword(t)}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3" // Position the icon
                        >
                            <Icon source={showPassword ? "eye-off" : "eye"} size={24} color={themeColors.bgColor(1)} />
                        </TouchableOpacity>
                    </View>
                    {errors.password && <Text className="text-red-500">{errors.password}</Text>}

                    <TouchableOpacity className="flex items-end mb-5">
                        <Text className="text-gray-700">Quên mật khẩu?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-3 bg-yellow-400 rounded-xl" disabled={isLoading} onPress={onLoginPressed}>
                        <Text className="font-xl font-bold text-center text-gray-700">Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-xl text-gray-700 font-bold text-center py-5">Hoặc</Text>
                <View className="flex-row justify-center space-x-12">
                    <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                        <Image className="w-10 h-10" source={require("../../../assets/images/app/google.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                        <Image className="w-10 h-10" source={require("../../../assets/images/app/apple.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 bg-gray-100 rounded-2xl">
                        <Image className="w-10 h-10" source={require("../../../assets/images/app/facebook.png")} />
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center mt-7">
                    <Text className="text-gray-500 font-semibold">Chưa có tài khoản?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                        <Text className="font-semibold text-yellow-400">Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
