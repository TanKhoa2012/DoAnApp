import { Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import  {themeColors}  from "../../themes/index";
import { useNavigation } from "@react-navigation/native";
import { Item } from "@/types";
import { truncateString } from "@/configs/libs/utils";
import { Icon } from "react-native-paper";
import { useEffect, useState } from "react";
import { LikeItemsApi } from "@/configs/apis/LikeItemApi";
import { useAppDispatch, useAppSelector } from "@/configs/redux/hooks";
import { meActions } from "@/configs/redux/meSlice";


interface ItemProps {
  key: number,
  item: Item
}


const ItemColumn: React.FC<ItemProps> = ({item}) => {
  const dispatch = useAppDispatch();
  const {me} = useAppSelector(state => state.reducer);
  const [heart, setHeart] = useState(false);
  const navigation = useNavigation();
  const handleHeart = async () => {
    setHeart(!heart);
    if(!heart) {
      try{
        await LikeItemsApi.createLikeitems(me.profile?.id, item.id);
      }catch(err){
        console.log(err, "lỗi create likeItems!")
      }
    }else {
      try{
        await LikeItemsApi.deleteLikeitems(me.profile?.id, item.id);
      }catch(err){
        console.log(err, "lỗi delete likeItems!")
      }
    }
  }

  const checkLikeItems = async () => {
    try{
      const res = await LikeItemsApi.checkLikeItems(me.profile?.id, item.id);
      setHeart(res.data.result)
      await dispatch(meActions.getProfile());
     }catch(err){
      console.log(err, "lỗi checkLikeItems")
     }
  }
  useEffect(()=>{
      checkLikeItems();
  },[])

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate("itemdetail", { item })}>
      <View style={{ shadowColor: themeColors.bgColor(0.2), shadowRadius: 7 }} className="flex-row bg-white pr-6 border-t border-gray-300">
        <Image resizeMode='contain' className="h-25 w-28 rounded-xl m-2" source={{ uri: item.itemimagesSet[0].url}} />
        <View className="px-3 pb-4 space-y-2">
          <View className="items-end pr-4 pt-2">
            <TouchableOpacity onPress={()=>{handleHeart()}} className="w-8 h-8 rounded-full items-center justify-center" style={{backgroundColor:themeColors.text}}>
              {!heart ? <Icon size={20} color="black" source="cards-heart-outline" />
              :<Icon size={20} color="#dc2626" source="heart" />}
            </TouchableOpacity>
          </View>
          <Text className="text-lg font-bold pt-2">{truncateString(item.name, 25)}</Text>
          <View className="flex-row items-center space-x-1">
            <Image source={require('../../assets/images/app/star.png')} className="h-5 w-5" />
            <Text>
              <Text className="text-gray-700">5</Text>
              <Text className="text-gray-700">
                | 4.4k - <Text className="font-semibold">{item.name}</Text>
              </Text>
            </Text>
          </View>
          <View className="flex-row items-center space-x-1">
            {/* <Icon.MapPin color="gray" width="15" height="15" /> */}
            <Text className="text-lg font-bold text-red-500">Giá: {item.price} VNĐ/Ngày</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ItemColumn;
