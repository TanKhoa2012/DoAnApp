import { Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import  {themeColors}  from "../../themes/index";
import { useNavigation } from "@react-navigation/native";
import { Item, Order } from "@/types";
import { truncateString } from "@/configs/libs/utils";
import { Icon } from "react-native-paper";
import { useEffect, useState } from "react";
import { LikeItemsApi } from "@/configs/apis/LikeItemApi";
import { useAppSelector } from "@/configs/redux/hooks";
import moment from "moment";


interface ItemProps {
  order: Order
}


const OrderItem: React.FC<ItemProps> = ({order}) => {
  const navigation = useNavigation();
  const item:Item = order.menuItemsId;

  useEffect(()=>{
  },[])

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate("itemdetail", {item} )}>
      <View className="flex-row bg-white pr-6">
        <Image resizeMode='contain' className="w-24 rounded-full m-2" source={{ uri: order.menuItemsId.itemimagesSet[0].url}} />
        <View className="px-3 pb-4 space-y-2">
          <Text className="text-lg font-bold pt-2">{truncateString(order.menuItemsId.name, 25)}</Text>
          <View className="flex-row items-center space-x-1">
            <Text className="text-gray-700">Ngày đặt thuê: </Text>
            <Text>{moment(order.createdDate).format('YYYY-MM-DD HH:mm')}</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <Text className="text-gray-700">Ngày nhận: </Text>
            <Text>{moment(order.startDate).format('YYYY-MM-DD HH:mm')}</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <Text className="text-gray-700">Ngày trả: </Text>
            <Text>{moment(order.endDate).format('YYYY-MM-DD HH:mm')}</Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <Text className="text-lg font-bold text-red-500">{order.totalPrice}đ</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OrderItem;
