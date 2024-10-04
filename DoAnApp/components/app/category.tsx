import { Image, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { themeColors } from "@/themes";

interface CategoryProps {
  id: number;
  name: string;
  icon: string;
}

interface CategoriesProps {
  props: CategoryProps;
  onCategoriesPressed: (id: number) => void; 
}

const Category: React.FC<CategoriesProps> = ({ props, onCategoriesPressed }) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const isActive = props.id === activeCategory;

  const btnClass = isActive ? themeColors.text : 'rgb(229 231 235)';
  const textClass = isActive ? 'font-semibold text-gray-800' : 'text-gray-500';

  const handlePress = () => {
    if (isActive) {
      setActiveCategory(null);
    } else {
      setActiveCategory(props.id); 
    }
    onCategoriesPressed(props.id);
  };

  return (
    <View className="flex justify-center items-center mr-6">
      <TouchableOpacity
        onPress={handlePress}
        style = {{backgroundColor:btnClass}}
        className={`p-5 h-20 w-20 justify-center items-center rounded-full shadow`}
      >
        <Image className="rounded-sm" style={{ width: 45, height: 45 }} source={{ uri: props.icon }} />
      </TouchableOpacity>
      <Text className={`text-sm ${textClass} text-center truncate max-w-full`}>
        {props.name}
      </Text>
    </View>
  );
};

export default Category;
