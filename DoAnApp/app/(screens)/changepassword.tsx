import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from 'expo-router';
import { Icon } from 'react-native-paper';
import { themeColors } from '@/themes';

const ChangePassword = () => {
    const navigation = useNavigation();

    // State to manage form values, errors, and password visibility
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<any>({});
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validate form fields
    const validateForm = () => {
        const newErrors: any = {};

        if (!currentPassword) {
            newErrors.currentPassword = 'Mật khẩu hiện tại là bắt buộc';
        }

        if (!newPassword) {
            newErrors.newPassword = 'Mật khẩu mới là bắt buộc';
        } else if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
            newErrors.newPassword = 'Mật khẩu mới phải ít nhất 8 ký tự và chứa số, ký tự đặc biệt';
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    // Handle password change submission
    const handleChangePassword = () => {
        if (validateForm()) {
            // Submit the form (you can add your API call here)
            console.log('Đổi mật khẩu thành công!');
        }
    };

    return (
        <View className='flex-1'>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-16 left-5 z-50 bg-gray-400 p-2 rounded-full shadow"
            >
                <Icon size={20} color={themeColors.bgColor(1)} source="arrow-left-bold" />
            </TouchableOpacity>
            <View className='w-full h-48 justify-center items-center'>
                <Text className="text-2xl font-bold">Đổi mật khẩu</Text>
            </View>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }} className="space-y-2">
                <View className='w-3/4 space-y-4'>
                    <Text className="text-base text-gray-700">Mật khẩu hiện tại:</Text>
                    <View className="relative">
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-xl mb-3 border border-gray-300"
                            placeholder="Nhập mật khẩu hiện tại"
                            secureTextEntry={!showCurrentPassword}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-3" // Position the icon
                        >
                            <Icon source={showCurrentPassword ? "eye-off" : "eye"} size={24} color={themeColors.bgColor(1)} />
                        </TouchableOpacity>
                    </View>
                    {errors.currentPassword && <Text className="text-red-500">{errors.currentPassword}</Text>}
                </View>
                <View className='w-3/4 space-y-4'>
                    <Text className="text-base text-gray-700">Mật khẩu mới:</Text>
                    <View className="relative">
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-xl mb-3 border border-gray-300"
                            placeholder="Nhập mật khẩu mới"
                            secureTextEntry={!showNewPassword}
                            value={newPassword}
                            onChangeText={setNewPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-3" // Position the icon
                        >
                            <Icon source={showNewPassword ? "eye-off" : "eye"} size={24} color={themeColors.bgColor(1)} />
                        </TouchableOpacity>
                    </View>
                    {errors.newPassword && <Text className="text-red-500">{errors.newPassword}</Text>}
                </View>
                <View className='w-3/4 space-y-4'>
                    <Text className="text-base text-gray-700">Xác nhận mật khẩu:</Text>
                    <View className="relative">
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-xl mb-3 border border-gray-300"
                            placeholder="Nhập lại mật khẩu xác nhận"
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3" // Position the icon
                        >
                            <Icon source={showConfirmPassword ? "eye-off" : "eye"} size={24} color={themeColors.bgColor(1)} />
                        </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && <Text className="text-red-500">{errors.confirmPassword}</Text>}
                </View>
                <TouchableOpacity
                    className="w-3/4 py-3 rounded-xl"
                    style={{ backgroundColor: themeColors.bgColor(1) }}
                    onPress={handleChangePassword}
                >
                    <Text className="font-xl font-bold text-center" style={{ color: "white" }}>Đổi mật khẩu</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default ChangePassword;
