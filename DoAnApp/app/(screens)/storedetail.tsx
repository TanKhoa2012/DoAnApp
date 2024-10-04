import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon } from 'react-native-paper'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { themeColors } from '@/themes'
import { Item, Store } from '@/types'
import { truncateString } from '@/configs/libs/utils'
import * as Icons from "react-native-feather";
import { MenuItemsApi } from '@/configs/apis/MenuItemApi'
import ItemColumn from '@/components/app/ItemColumn'

type RootStackParamList = {
    StoreDetail: { store: Store };
};
  
type StoreDetailRouteProp = RouteProp<RootStackParamList, 'StoreDetail'>;

const StoreDetail = () => {
  const route = useRoute<StoreDetailRouteProp>();
  const { store } = route.params;
  const [menuItems, setMenuItems] = useState<Item[]|undefined>(undefined);
  const navigation = useNavigation();

  const loadData = async () => {
    try{
      const res = await MenuItemsApi.getMenuItemsByStoreId(store.id);
      setMenuItems(res.data.result);
    }catch(err){
      console.log(err)
    }
  }


  useEffect(() => {
    loadData();
  },[])
  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="absolute top-12 left-5 z-50 bg-gray-400 p-2 rounded-full shadow"
      >
        <Icon size={20} color={themeColors.bgColor(1)} source="arrow-left-bold" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
            <View className="relative">
                <Image className="w-full h-72" source={{ uri: store.background }} />
            </View>
            <View style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }} className="bg-white -mt-12 pt-6">
                    <View className="px-5">
                        <Text className="text-3xl font-bold">{store.name}</Text>
                        <View className="flex-row space-x-2 my-1">
                            <View className="flex-row items-center space-x-1">
                                <Image source={require('../../assets/images/app/star.png')} className="h-5 w-5" />
                                <Text>
                                    <Text className="text-gray-700">5</Text>
                                    <Text className="text-gray-700">
                                        | 4.4k reviews - <Text className="font-semibold">{store.businessType}</Text>
                                    </Text>
                                </Text>
                            </View>
                        </View>
                        <View className="flex-row items-center space-x-1 pl-1">
                              <Icons.MapPin color="gray" width="15" height="15" />
                              <Text className="text-gray-700 text-xs">Nearby - {truncateString(store.location, 20)}</Text>
                        </View>
                    </View>
                </View>
                <View className="pb-3 bg-white">
                    <Text className="px-4 py-4 text-2xl font-bold">Danh sách sản phẩm</Text>
                </View>
                {menuItems ? <>
                 {menuItems.map((item, index)=> (
                  <ItemColumn key={index} item={item}/>
                 ))}
                </>:<></>
                }
      </ScrollView>
    </View>
  )
}

export default StoreDetail