import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { Icon, TouchableRipple } from 'react-native-paper'
import { themeColors } from '@/themes';
import { useNavigation } from '@react-navigation/native';
import { IImage } from '@/types';
import * as ImagePicker from 'expo-image-picker';
import RadioGroup from 'react-native-radio-buttons-group';
import { useAppDispatch, useAppSelector } from '@/configs/redux/hooks';
import { StoreApi } from '@/configs/apis/StoreApi';
import { meActions } from '@/configs/redux/meSlice';

enum HANDLE_PICKER {
    AVATAR = 1,
    BACKGROUND = 2
}

const dataBusinessType = [
    {
        id: '1',
        label: 'Cá nhân',
        value: 'Cá nhân',
        selected: true,
    },
    {
        id: '2',
        label: 'Hộ kinh doanh',
        value: 'Hộ kinh doanh',
    },
    {
        id: '3',
        label: 'Công ty',
        value: 'Công ty',
    },
]

const RegisterStore = () => {
    const {me} = useAppSelector(state => state.reducer);
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [avatar, setAvatar] = useState<IImage>();
    const [background, setBackground] = useState<IImage>();
    const [businessType, setBusinessType] = useState(null);
    const [selectedId, setSelectedId] = useState('1');
    const [storeName, setStoreName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState<any>({}); 
    const navigation = useNavigation();

    const handlePress = (id: string) => {
        setSelectedId(id); 
    };

    const handlePicker = async (handleName: number) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Shareme", "Permissions Denied!");
            return;
        }

        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!res.canceled) {
            if (handleName === HANDLE_PICKER.BACKGROUND) {
                setBackground({
                    uri: res.assets[0].uri,
                    type: res.assets[0].type,
                    fileName: res.assets[0].fileName,
                });
            } else if (handleName === HANDLE_PICKER.AVATAR) {
                setAvatar({
                    uri: res.assets[0].uri,
                    type: res.assets[0].type,
                    fileName: res.assets[0].fileName,
                });
            }
        }
    };

    const validateForm = () => {
        const newErrors: any = {}; 
        if (!storeName) newErrors.storeName = "Tên cửa hàng là bắt buộc.";
        if (!phoneNumber) newErrors.phoneNumber = "Số điện thoại là bắt buộc.";
        if (!email) newErrors.email = "Email là bắt buộc.";
        if (!code) newErrors.code = "Mã số là bắt buộc.";
        if (!description) newErrors.description = "Mô tả là bắt buộc.";
        if (!address) newErrors.address = "Địa chỉ là bắt buộc.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm() && me.profile?.id) {
            const form = new FormData();
            form.append("userId", me.profile?.id);
            form.append("name", storeName);
            form.append("businessType", dataBusinessType[parseInt(selectedId)].value);
            form.append("numberPhone", phoneNumber);
            form.append("email", email);
            form.append("code", code);
            form.append("description", description);
            form.append("location", address);
            form.append("avatar",{
                uri: avatar?.uri,
                name: avatar?.fileName || 'default_filename.jpg',
                type: avatar?.type || 'image/jpeg'
            } as any);
            form.append("background", {
                uri: background?.uri,
                name: background?.fileName || 'default_filename.jpg',
                type: background?.type || 'image/jpeg'
            } as any);

            await StoreApi.createStore(form).then(()=>{
                Alert.alert("Đăng ký cửa hàng thành công");
                dispatch(meActions.getProfile());
                navigation.navigate("profile");
            }).catch((err) =>{
                console.log(err, "Lỗi createStore")
            });
        }
    };

    return (
        <View>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-16 left-5 z-50 bg-gray-400 p-2 rounded-full shadow"
            >
                <Icon size={20} color={themeColors.bgColor(1)} source="arrow-left-bold" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={{ paddingBottom: 136 }}>
                <View className='w-full h-48 justify-center items-center'>
                    <Text className="text-2xl font-bold">Đăng kí cửa hàng</Text>
                </View>
                <View className="form space-y-2 items-center">
                    <View className='w-3/4 space-y-4'>
                        <Text className="text-base text-gray-700">Tên cửa hàng:</Text>
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-xl mb-3 border border-gray-300"
                            placeholder="Nhập tên"
                            value={storeName}
                            onChangeText={setStoreName}
                        />
                        {errors.storeName && <Text style={{ color: 'red' }}>{errors.storeName}</Text>}
                    </View>

                    <View className='w-3/4 space-y-4 flex-col justify-start items-start'>
                        <Text className="text-base text-gray-700">Loại hình kinh doanh:</Text>
                        <RadioGroup selectedId={selectedId} radioButtons={dataBusinessType} onPress={handlePress} containerStyle={{ alignItems: 'flex-start' }} />
                    </View>

                    <View className='w-3/4 space-y-4'>
                        <Text className="text-base text-gray-700">Số điện thoại:</Text>
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-xl mb-3 border border-gray-300"
                            placeholder="Nhập số điện thoại"
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                        {errors.phoneNumber && <Text style={{ color: 'red' }}>{errors.phoneNumber}</Text>}
                    </View>

                    <View className='w-3/4 space-y-4'>
                        <Text className="text-base text-gray-700">Email:</Text>
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-xl mb-3 border border-gray-300"
                            placeholder="Nhập email"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                        {errors.email && <Text style={{ color: 'red' }}>{errors.email}</Text>}
                    </View>

                    <View className='w-3/4 space-y-4'>
                        <Text className="text-base text-gray-700">Mã số:</Text>
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-xl mb-3 border border-gray-300"
                            placeholder="Nhập mã số"
                            value={code}
                            onChangeText={setCode}
                        />
                        {errors.code && <Text style={{ color: 'red' }}>{errors.code}</Text>}
                    </View>

                    <View className='w-3/4 space-y-4'>
                        <Text className="text-base text-gray-700">Mô tả:</Text>
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-xl mb-3 border border-gray-300"
                            placeholder="Nhập mô tả"
                            multiline
                            numberOfLines={4}
                            value={description}
                            onChangeText={setDescription}
                        />
                        {errors.description && <Text style={{ color: 'red' }}>{errors.description}</Text>}
                    </View>

                    <View className='w-3/4 space-y-4'>
                        <Text className="text-base text-gray-700">Địa chỉ:</Text>
                        <TextInput
                            className="p-4 bg-gray-100 text-gray-700 rounded-xl mb-3 border border-gray-300"
                            placeholder="Nhập địa chỉ"
                            value={address}
                            onChangeText={setAddress}
                        />
                        {errors.address && <Text style={{ color: 'red' }}>{errors.address}</Text>}
                    </View>

                    <View className='w-3/4 space-y-4'>
                        <View className='flex-row'>
                            <Text className="text-base text-gray-700">Ảnh đại diện:</Text>
                            <TouchableRipple style={{ margin: 5 }} onPress={() => handlePicker(HANDLE_PICKER.AVATAR)}>
                                <Text className='text-sm font-light' style={{ color: themeColors.bgColor(0.7) }}>Chọn ảnh đại diện...</Text>
                            </TouchableRipple>
                        </View>
                        {avatar && <Image source={{ uri: avatar?.uri }} style={{ width: 80, height: 80, borderRadius: 10 }} />}
                    </View>

                    <View className='w-3/4 space-y-4'>
                        <View className='flex-row'>
                            <Text className="text-base text-gray-700">Ảnh bìa:</Text>
                            <TouchableRipple style={{ margin: 5 }} onPress={() => handlePicker(HANDLE_PICKER.BACKGROUND)}>
                                <Text className='text-sm font-light' style={{ color: themeColors.bgColor(0.7) }}>Chọn ảnh bìa...</Text>
                            </TouchableRipple>
                        </View>
                        {background && <Image source={{ uri: background?.uri }} style={{ width: 80, height: 80, borderRadius: 10 }} />}
                    </View>

                    <TouchableOpacity className='w-3/4 bg-green-500 rounded-md py-3 items-center' onPress={handleSubmit}>
                        <Text className='text-white font-semibold'>Đăng ký</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default RegisterStore;
