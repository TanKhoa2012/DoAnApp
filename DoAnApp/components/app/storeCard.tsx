import { Image, Text, TouchableWithoutFeedback, View } from "react-native";
import * as Icon from "react-native-feather";
import { themeColors } from "../../themes/index";
import { useNavigation } from "@react-navigation/native";
import {truncateString} from "../../configs/libs/utils";
import { Store } from "@/types";

interface StoreProps {
    key: number,
    store: Store
}

const StoreCard: React.FC<StoreProps> = ( {store} ) => {
  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={() => navigation.navigate("storedetail", { store: store })}>
      <View style={{ shadowColor: themeColors.bgColor(0.2), shadowRadius: 6 }} className="mr-6 bg-white rounded-3xl shadow-lg">
      {store.avatar && !store.avatar.endsWith('.svg')?
         <Image className="h-32 w-full rounded-t-3xl" source={{uri: store.avatar}}/>
         :<Image className="h-32 w-full rounded-t-3xl bg-black" source={require("../../assets/images/app/login.png")}/>
      }
        <View className="px-3 pb-4 space-y-2">
          <Text className="text-lg font-bold pt-2">{truncateString(store.name, 20)}</Text>
          <View className="flex-row items-center space-x-1">
            <Image source={require('../../assets/images/app/star.png')} className="h-5 w-5" />
            <Text>
              <Text className="text-gray-700">5</Text>
              <Text className="text-gray-700">
                | 4.4k - <Text className="font-semibold">{store.businessType}</Text>
              </Text>
            </Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <Icon.MapPin color="gray" width="15" height="15" />
            <Text className="text-gray-700 text-xs">Gần bạn - {truncateString(store.location, 25)}</Text>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default StoreCard;
