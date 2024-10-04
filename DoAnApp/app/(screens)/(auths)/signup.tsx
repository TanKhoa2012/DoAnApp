import { Image, View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Icon, TouchableRipple } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import themeColors from "../../../themes/Colors";
import { SignUpState } from "@/types";
import { useAppDispatch } from "@/configs/redux/hooks";
import { authActions } from "@/configs/redux/authSlice";

export default function SignUp() {
    const [user, setUser] = useState<SignUpState>({
        username: '',
        email: '',
        password: '',
        confirm: '',
        name: "",
        avatar: undefined
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    const picker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            setErrors((prev) => ({ ...prev, avatar: "Permissions Denied!" }));
        } else {
            let res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Giới hạn chỉ ảnh
                allowsEditing: true,
                quality: 1
            });
            if (!res.canceled && res.assets) {
                updateSate(res.assets[0], "avatar");
            }
        }
    };

    const updateSate = (value: any, field: string) => {
        setUser(current => ({
            ...current,
            [field]: value
        }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    const register = async () => {
        const { username, email, password, confirm, name } = user;
        const newErrors: { [key: string]: string } = {};

        if (!username) newErrors.username = "Tên người dùng là bắt buộc.";
        if (!email) newErrors.email = "Email là bắt buộc.";
        if (!password) newErrors.password = "Mật khẩu là bắt buộc.";
        if (!confirm) newErrors.confirm = "Xác nhận mật khẩu là bắt buộc.";
        if (!name) newErrors.name = "Tên là bắt buộc.";

        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
        if (password && !passwordRegex.test(password)) {
            newErrors.password = "Mật khẩu phải chứa ít nhất một chữ cái, một số, và một ký tự đặc biệt.";
        }

        if (password !== confirm) {
            newErrors.confirm = "Mật khẩu và xác nhận không khớp.";
        }


        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        let form = new FormData();
        for (let k in user) {
            if (k !== 'confirm') {
                const fieldValue = user[k as keyof SignUpState];
                if (k === 'avatar' && user.avatar) {
                    form.append(k, {
                        uri: user.avatar.uri,
                        name: user.avatar.fileName || 'avatar.jpg',
                        type: user.avatar.type || 'image/jpeg'
                    } as any);
                } else if (typeof fieldValue === 'string') {
                    form.append(k, fieldValue);
                }
            }
        }

        setLoading(true);
        console.log(form);
        try {
            await dispatch(authActions.register(form))
            navigation.navigate("signin");
        } catch (ex: any) {
            console.error(ex?.response?.data || 'Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white" style={themeColors.bg}>
            <SafeAreaView className="flex">
                <View className="flex-row justify-start">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="bg-yellow-400 p-2 rounded-tr-2xl rounded-bl-2xl ml-4">
                        <Icon size={20} color="black" source="arrow-left-bold" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center">
                    <Image style={{ width: 150, height: 150 }} source={require("../../../assets/images/app/login.png")} />
                </View>
            </SafeAreaView>
            <ScrollView className="flex-1 bg-white px-11 pt-2" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
                <View className="form space-y-2">
                    <Text className="text-gray-700 ml-4">Name</Text>
                    <TextInput key="name" onChangeText={t => updateSate(t, "name")} className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Enter name" />
                    {errors.name && <Text className="text-red-500">{errors.name}</Text>}

                    <Text className="text-gray-700 ml-4">Email</Text>
                    <TextInput key="email" onChangeText={t => updateSate(t, "email")} className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Enter email" />
                    {errors.email && <Text className="text-red-500">{errors.email}</Text>}

                    <Text className="text-gray-700 ml-4">Username</Text>
                    <TextInput key="username" onChangeText={t => updateSate(t, "username")} className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" placeholder="Enter Username" />
                    {errors.username && <Text className="text-red-500">{errors.username}</Text>}

                    <Text className="text-gray-700 ml-4">Password</Text>
                    <TextInput key="password" onChangeText={t => updateSate(t, "password")} className="p-4 bg-gray-100 text-gray-700 rounded-2xl" secureTextEntry placeholder="Enter Password" />
                    {errors.password && <Text className="text-red-500">{errors.password}</Text>}

                    <Text className="text-gray-700 ml-4">Confirm Password</Text>
                    <TextInput key="confirm" onChangeText={t => updateSate(t, "confirm")} className="p-4 bg-gray-100 text-gray-700 rounded-2xl" secureTextEntry placeholder="Enter Confirm" />
                    {errors.confirm && <Text className="text-red-500">{errors.confirm}</Text>}

                    <TouchableRipple style={{ margin: 5 }} onPress={picker}>
                        <Text>Chọn ảnh đại diện...</Text>
                    </TouchableRipple>

                    {user.avatar && <Image source={{ uri: user.avatar.uri }} style={{ width: 80, height: 80, borderRadius: 20 }} />}

                    <TouchableOpacity className="flex items-end mb-5">
                        <Text className="text-gray-700">Forgot Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={loading} onPress={register} className="py-3 bg-yellow-400 rounded-xl">
                        <Text className="font-xl font-bold text-center text-gray-700">Sign Up</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-xl text-gray-700 font-bold text-center py-5">Or</Text>
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
            </ScrollView>
        </View>
    );
}
