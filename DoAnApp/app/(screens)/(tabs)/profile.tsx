import { UserApi } from "@/configs/apis/UserApi";
import { getDataSecure } from "@/configs/libs/storage";
import { useAppDispatch, useAppSelector } from "@/configs/redux/hooks";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Icon, TouchableRipple } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import { meActions } from "@/configs/redux/meSlice";
import { ROLES } from "@/types";

enum HANDLE  {
    CHANGE_PASS = 1,
    REMOVE_ACCOUNT = 2,
    MY_LOCATION = 3,
    MY_FAVOURITE = 4,
    STORE = 5,
    ACCOUNT = 6,
    LOGOUT = 7,
    UPDATE_AVATAR = 8,
    UPDATE_BACKGROUND = 9,
    REGISTER_STORE = 10,
}

export default function Profile() {
    const {me} = useAppSelector(state=>state.reducer)
    const navigation = useNavigation();
    const [avatarShow, setAvatarShow] = useState<string|undefined>();
    const [backgroundShow, setBackgroundShow] = useState<string|undefined>();
    const [role, setRole] = useState<ROLES|undefined>();
    const dispatch = useAppDispatch();

    useEffect(()=> {
        console.log(me.profile?.role.name)
        if(me.profile !== undefined) {
            setBackgroundShow(me.profile.background);
            setAvatarShow(me.profile.avatar);
            setRole(me.profile.role)
        }
    },[me.profile])

    const handlePressed = async (name:Number) => {
        if(name===HANDLE.CHANGE_PASS) navigation.navigate("changepassword");
        else if(name===HANDLE.REMOVE_ACCOUNT) {
            Alert.alert(
                "Xác nhận xóa tài khoản!",
                "Bạn có chắc chắn muốn xóa tài khoản?",
                [
                    {
                        text: "Hủy",
                        onPress: () => console.log("Hủy xóa tài khoản"),
                        style: "cancel",
                    },
                    {
                        text: "Đồng ý",
                        onPress: async () => (await UserApi.deleteUser(me.profile?.id), 
                                              await UserApi.logout(), navigation.navigate("(auths)")),
                        style: "destructive",
                    },
                ],
                { cancelable: false }
            );
        }
        else if(name===HANDLE.LOGOUT) {
            const token = await getDataSecure("token");

            Alert.alert(
                "Xác nhận đăng xuất!",
                "Bạn có chắc chắn muốn đăng xuất tài khoản?",
                [
                    {
                        text: "Hủy",
                        style: "cancel",
                    },
                    {
                        text: "Đồng ý",
                        onPress: async () => (token ? 
                                (await UserApi.logout(),
                                 navigation.navigate("(auths)")) 
                                : null
                        ),
                        style: "destructive",
                    },
                ],
                { cancelable: false }
            );
        }
        else if(name===HANDLE.ACCOUNT) {
            navigation.navigate("account")
        }else if(name===HANDLE.REGISTER_STORE) {
            navigation.navigate("registerstore")
        }else if(name===HANDLE.UPDATE_AVATAR) {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted')
                Alert.alert("Shareme", "Permissions Denied!");
            else {
                let res = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                  });
                if (!res.canceled) {
                    if(res.assets[0].uri && res.assets[0].type && res.assets[0].fileName && me.profile?.id) {
                        let form = new FormData();
                        form.append("file", {
                            uri: res.assets[0].uri,
                            name: res.assets[0].fileName || 'default_filename.jpg',
                            type: res.assets[0].type || 'image/jpeg'
                        } as any);
                        try{
                            const res = await UserApi.updateAvatar(me.profile?.id, form);
                            dispatch(meActions.getProfile());
                            setAvatarShow(res.data.result.avatar)
                        }catch(err){
                            console.log(err)
                        }
                    }
                }
            }
        }else if(name===HANDLE.UPDATE_BACKGROUND) {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted')
                Alert.alert("Shareme", "Permissions Denied!");
            else {
                let res = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                  });
                if (!res.canceled) {
                    if(res.assets[0].uri && res.assets[0].type && res.assets[0].fileName && me.profile?.id) {
                        let form = new FormData();
                        form.append("file", {
                            uri: res.assets[0].uri,
                            name: res.assets[0].fileName || 'default_filename.jpg',
                            type: res.assets[0].type || 'image/jpeg'
                        } as any);
                        try{
                            const res = await UserApi.updateBackground(me.profile?.id, form);
                            dispatch(meActions.getProfile());
                            setBackgroundShow(res.data.result.background)
                        }catch(err){
                            console.log(err)
                        }
                    }
                }
            }
        }else if(name===HANDLE.MY_FAVOURITE){
            navigation.navigate("favoriteitems")
        }else if(name===HANDLE.MY_LOCATION){
            navigation.navigate("locationdetail")
        }


    }

    return <>
    <View className='bg-white'>
        <ScrollView>
            <View className="relative h-80">
                <Image className="w-full h-64" source={{uri:backgroundShow}}/>
                <View className="absolute w-full h-3/4 items-end justify-end right-6">
                    <TouchableRipple onPress={() => handlePressed(HANDLE.UPDATE_BACKGROUND)} >
                            <View className="bg-gray-300 rounded-xl p-1 border-2 border-white">
                                <Icon size={16} source="camera" />
                            </View>
                    </TouchableRipple>
                </View>
                <View className="absolute left-2 bottom-0">
                    <Image className="border border-gray-300 h-36 w-36 rounded-full" source={{uri: avatarShow}}/>
                    <View className="absolute w-full h-full items-end justify-end">
                        <TouchableRipple onPress={() => handlePressed(HANDLE.UPDATE_AVATAR)} >
                            <View className="bg-gray-300 rounded-xl p-1  border-2 border-white">
                                <Icon size={16} source="camera" />
                            </View>
                        </TouchableRipple>
                    </View>
                </View>
            </View>
            <View className="pt-2 pr-4 pl-4 space-y-8">
                <Text className="text-lg font-bold w-32 text-center">{me.profile?.username}</Text>
                <View className="w-full bg-gray-100 rounded-xl">
                    <TouchableOpacity onPress={() => handlePressed(HANDLE.ACCOUNT)} className="pl-6 pr-6 flex-row h-14 items-center justify-between">
                        <View className="flex-row space-x-6">
                            <Icon size={24} source="account-outline" />
                            <Text className="text-base font-bold">Tài khoản của tôi </Text>
                        </View>
                        <Icon size={36} source="chevron-right" />
                    </TouchableOpacity>
                    {role?.name === "user" && <>
                        <TouchableOpacity onPress={() => handlePressed(HANDLE.REGISTER_STORE)} className="pl-6 pr-6 flex-row h-14 items-center justify-between border-t border-t-white">
                            <View className="flex-row space-x-6">
                                <Icon size={24} source="store-outline" />
                                <Text className="text-base font-bold">Đăng ký cửa hàng</Text>
                            </View>
                            <Icon size={36} source="chevron-right" />
                        </TouchableOpacity>
                    </>}
                    {role?.name === "owner" && <>
                        <TouchableOpacity onPress={() => handlePressed(HANDLE.REGISTER_STORE)} className="pl-6 pr-6 flex-row h-14 items-center justify-between border-t border-t-white">
                            <View className="flex-row space-x-6">
                                <Icon size={24} source="store-outline" />
                                <Text className="text-base font-bold">Đến cửa hàng</Text>
                            </View>
                            <Icon size={36} source="chevron-right" />
                        </TouchableOpacity>
                    </>
                    }
                    <TouchableOpacity onPress={() => handlePressed(HANDLE.MY_FAVOURITE)} className="pl-6 pr-6 flex-row h-14 items-center justify-between border-t border-t-white">
                        <View className="flex-row space-x-6">
                            <Icon size={24} source="cards-heart-outline" />
                            <Text className="text-base font-bold">Items yêu thích</Text>
                        </View>
                        <Icon size={36} source="chevron-right" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handlePressed(HANDLE.MY_LOCATION)} className="pl-6 pr-6 flex-row h-14 items-center justify-between border-t border-t-white">
                        <View className="flex-row space-x-6">
                            <Icon size={24} source="map-marker-outline" />
                            <Text className="text-base font-bold">Địa chỉ của tôi</Text>
                        </View>
                        <Icon size={36} source="chevron-right" />
                    </TouchableOpacity>
                </View>
                <View className="w-full bg-gray-100 rounded-xl">
                        <TouchableOpacity onPress={() => handlePressed(HANDLE.REMOVE_ACCOUNT)} className="pl-6 pr-6 flex-row h-14 items-center justify-between">
                            <View className="flex-row space-x-6">
                                <Icon size={24} source="trash-can-outline" />
                                <Text className="text-base font-bold">Yêu cầu xóa tài khoản</Text>
                            </View>
                            <Icon size={36} source="chevron-right" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handlePressed(HANDLE.CHANGE_PASS)} className="pl-6 pr-6 flex-row h-14 items-center justify-between border-t border-t-white">
                            <View className="flex-row space-x-6">
                                <Icon size={24} source="shield-lock-outline" />
                                <Text className="text-base font-bold">Đổi mật khẩu</Text>
                            </View>
                            <Icon size={36} source="chevron-right" />
                        </TouchableOpacity>
                </View>
                <View className="w-full bg-red-300 rounded-xl">
                        <TouchableOpacity onPress={() => handlePressed(HANDLE.LOGOUT)} className="pl-6 pr-6 flex-row h-14 justify-center items-center">
                                <Text className="text-xl font-bold text-red-600">Đăng xuất</Text>
                        </TouchableOpacity>
                </View>

            </View>
        </ScrollView>
    </View>
    </>
}