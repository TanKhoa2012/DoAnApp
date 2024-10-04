import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon, TouchableRipple } from 'react-native-paper'
import { themeColors } from '@/themes'
import { useNavigation } from 'expo-router'
import { useAppDispatch, useAppSelector } from '@/configs/redux/hooks'
import moment from 'moment'
import { UserApi } from '@/configs/apis/UserApi'
import { meActions } from '@/configs/redux/meSlice'
import * as ImagePicker from 'expo-image-picker';

enum HANDLE  {
  UPDATE_INFO = 1,
  UPDATE_AVATAR = 2,
}

const Account = () => {
  const navigation = useNavigation();
  const [name, setName] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [numberPhone, setNumberPhone] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [avatar, setAvatar] = useState<string>();

  const {me} = useAppSelector(state => state.reducer);
  const dispatch = useAppDispatch();
  
  const loadData = async () => {
    if(me.profile !== undefined) {
        setName(me.profile.name)
        setEmail(me.profile.email)
        setLocation(me.profile.location)
        setNumberPhone(me.profile.numberPhone)
        setAvatar(me.profile.avatar)
    }
  }

  const handleSubmit = async (handleName:number) => {
    if(handleName === HANDLE.UPDATE_INFO) {
      try{
        const formData = new FormData();
        if(name) formData.append("name", name);
        if(location) formData.append("location", location);
        if(numberPhone) formData.append("numberPhone", numberPhone);
        if(email) formData.append("email", email);

        if(me.profile?.id !== undefined) {
          try {
            await UserApi.updateUser(me.profile?.id, formData)
            dispatch(meActions.getProfile());
            Alert.alert("Shareme", "Cập nhật thông tin thành công")
          }catch(err){
            console.log(err)
          }
        }
      }catch(err) {
          console.log(err)
      }
    }else if(handleName === HANDLE.UPDATE_AVATAR) {
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
                            setAvatar(res.data.result.avatar)
                        }catch(err){
                            console.log(err)
                        }
                    }
                }
            }

    }
  }
  useEffect(()=> {
    loadData()
  },[me.profile])

  return (
    <View className='bg-white h-full'>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="absolute top-12 left-5 z-50 bg-gray-400 p-2 rounded-full shadow"
      >
        <Icon size={20} color={themeColors.bgColor(1)} source="arrow-left-bold" />
      </TouchableOpacity>

      <ScrollView className='space-y-10' contentContainerStyle={{ paddingBottom: 136 }}>
            <View className="relative h-80">
                <View className="absolute left-2 bottom-0 justify-center items-center w-full">
                    <Image className="border border-gray-300 h-32 w-32 rounded-full" source={{uri:avatar}}/>
                    <View className="absolute h-full w-32 items-end justify-end bottom-10">
                      <TouchableRipple onPress={()=> handleSubmit(HANDLE.UPDATE_AVATAR)}>
                          <View className="bg-gray-300 rounded-xl p-1 border-2 border-white">
                              <Icon size={16} source="camera" />
                          </View>
                      </TouchableRipple>
                    </View>
                    <Text className='pt-4 text-base font-bold'>{me.profile?.username}</Text>
                    <Text className='text-sm'>Ngày tham gia: {moment(me.profile?.createdDate).format('YYYY-MM-DD HH:mm')}</Text>
                </View>
            </View>
            <View className="w-full">
                    <TouchableOpacity className="pl-6 pr-6 flex-row h-14 items-center justify-between">
                        <View className="flex-row space-x-6">
                            <Icon size={24} source="account-outline" />
                            <Text className="text-base">Họ và tên:</Text>
                        </View>
                        {name?<><TextInput className='w-32' multiline={true} onChangeText={t => setName(t)} placeholder={name}></TextInput>
                        <Icon size={30} color={themeColors.bgColor(1)} source="checkbox-marked-circle" />
                        </>
                        :<>
                        <TextInput multiline={true} onChangeText={t => setName(t)} placeholder='chưa xác thực'></TextInput>
                        <Icon size={30} color="orange" source="alert" />
                        </>}
                    </TouchableOpacity>
                    <TouchableOpacity className="pl-6 pr-6 flex-row h-14 items-center justify-between border-t border-t-gray-200">
                        <View className="flex-row space-x-6">
                            <Icon size={24} source="google-maps" />
                            <Text className="text-base">Vị trí:</Text>
                        </View>
                        {location?<><TextInput className='w-32' multiline={true} onChangeText={t => setLocation(t)} placeholder={location}></TextInput>
                        <Icon size={30} color={themeColors.bgColor(1)} source="checkbox-marked-circle" />
                        </>
                        :<>
                        <TextInput multiline={true} onChangeText={t => setLocation(t)} placeholder='chưa xác thực'></TextInput>
                        <Icon size={30} color="orange" source="alert" />
                        </>}
                    </TouchableOpacity>
                    <TouchableOpacity className="pl-6 pr-6 flex-row h-14 items-center justify-between border-t border-t-gray-200">
                        <View className="flex-row space-x-6">
                            <Icon size={24} source="phone" />
                            <Text className="text-base">Số điện thoại:</Text>
                        </View>
                        {numberPhone?<><TextInput className='w-32' multiline={true} onChangeText={t => setNumberPhone(t)} placeholder={numberPhone}></TextInput>
                        <Icon size={30} color={themeColors.bgColor(1)} source="checkbox-marked-circle" />
                        </>
                        :<>
                        <TextInput multiline={true} onChangeText={t => setNumberPhone(t)} placeholder='chưa xác thực'></TextInput>
                        <Icon size={30} color="orange" source="alert" />
                        </>}
                    </TouchableOpacity>
                    <TouchableOpacity className="pl-6 pr-6 flex-row h-14 items-center justify-between border-t border-t-gray-200">
                        <View className="flex-row space-x-6">
                            <Icon size={24} source="email" />
                            <Text className="text-base">Email:</Text>
                        </View>
                        {email?<><TextInput className='w-32' multiline={true} onChangeText={t => setEmail(t)} placeholder={email}></TextInput>
                        <Icon size={30} color={themeColors.bgColor(1)} source="checkbox-marked-circle" />
                        </>
                        :<>
                        <TextInput multiline={true} onChangeText={t => setEmail(t)} placeholder='chưa xác thực'></TextInput>
                        <Icon size={30} color="orange" source="alert" />
                        </>}
                    </TouchableOpacity>
                </View>
                <View className="w-full" >
                        <TouchableOpacity onPress={() => handleSubmit(HANDLE.UPDATE_INFO)} style={{backgroundColor:themeColors.text}} className="m-4 pl-6 pr-6 flex-row h-14 justify-center items-center rounded-xl">
                                <Text className="text-xl font-bold" style={{color:themeColors.bgColor(1)}}>Cập nhật</Text>
                        </TouchableOpacity>
                </View>
      </ScrollView>
    </View>
  )
}

export default Account