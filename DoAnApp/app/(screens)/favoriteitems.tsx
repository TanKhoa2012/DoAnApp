import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { themeColors } from '@/themes'
import { Icon } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { LikeItemsApi } from '@/configs/apis/LikeItemApi'
import { useAppSelector } from '@/configs/redux/hooks'
import ItemColumn from '@/components/app/ItemColumn'
import { Item, LikeItems } from '@/types'

const FavoriteItems = () => {
  const {me} = useAppSelector(state => state.reducer);
  const navigation = useNavigation();
  const [items, setItems] = useState<LikeItems[]>([]);


  const loadData = async () => {
    try{
    const res = await LikeItemsApi.getLikeitemsByUserId(me.profile?.id);
    setItems(res.data.result);
    console.log(res.data.result)
    }catch(err){
      console.log(err, "lỗi getLikeItems")
    }
  }


  useEffect(() => {
    loadData();



  },[])



  return (
    <View className='w-full'>
      <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-16 left-5 z-50 bg-gray-400 p-2 rounded-full shadow"
            >
            <Icon size={20} color={themeColors.bgColor(1)} source="arrow-left-bold" />
      </TouchableOpacity>
      <View className='w-full h-48 justify-center items-center'>
            <Text className="text-2xl font-bold">Mục yêu thích</Text>
      </View>
      <ScrollView className='bg-black'>
        {items ? items.map((item, index)=> (console.log(item),<ItemColumn key={index} item={item.menuItems}/>
        )): <></>}

      </ScrollView>
    </View>
  )
}

export default FavoriteItems