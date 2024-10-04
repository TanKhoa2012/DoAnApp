import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {themeColors} from "../../themes/index";
import { StoreApi } from "@/configs/apis/StoreApi";
import StoreCard from "./storeCard";
import { Store } from "@/types";
import { getDataSecure } from "@/configs/libs/storage";

// Định nghĩa kiểu cho props
interface FeatureRowProps {
  title: string;
  description: string;
}


const FeatureRow: React.FC<FeatureRowProps> = ({ title, description }) => {
  const [stores, setStores] = useState<Store[]>([]); 

  const loadStores = async () => {
    const token = await getDataSecure("token");
    if(token !== null) {
      try {
        let res = await StoreApi.getAllStores();
        console.log(res.data.result)
        setStores(res.data.result);
      } catch (ex) {
        console.error(ex);
      }
    }
  };

  useEffect(() => {
    loadStores();
  }, []);

  return (
    <View>
      <View className="flex-row justify-between items-center px-4">
        <View>
          <Text className="font-bold text-lg">{title}</Text>
          <Text className="text-gray-500 text-xs">{description}</Text>
        </View>
        <TouchableOpacity>
          <Text className="font-semibold" style={{ color: themeColors.text }}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView className="overflow-visible py-5" horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }}>
        {
          stores.map((item, index) => {
            return (
              <StoreCard key={index} store={item} />
            );
          })
        }
      </ScrollView>
    </View>
  );
};

export default FeatureRow;
