import { SafeAreaView, TouchableOpacity, ScrollView, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as Icon from "react-native-feather";
import { TextInput } from "react-native-paper";
import  { themeColors }  from "../../../themes/index";
import Category from "../../../components/app/category";
import * as Location from 'expo-location';
import { filterCategoriesWithoutParent, truncateString } from "../../../configs/libs/utils";
import { CategoryState, IMeState, Item, Store } from "@/types";
import { CategoryApi } from "@/configs/apis/CategoryApi";
import FeatureRow from "@/components/app/featureRow";
import { featured } from "@/constants/data";
import ItemColumn from "@/components/app/ItemColumn";
import { MenuItemsApi } from "@/configs/apis/MenuItemApi";
import { useAppDispatch, useAppSelector } from "@/configs/redux/hooks";
import { Redirect } from "expo-router";
import { getDataSecure } from "@/configs/libs/storage";
import { meActions } from "@/configs/redux/meSlice";
import { UserApi } from "@/configs/apis/UserApi";

export default function HomeScreen() {
    const {me} = useAppSelector(state => state.reducer);
    const [categories, setCategories] = useState<CategoryState[]>([]);
    const [menuitems, setMenuitems] = useState<Item[]|undefined>(undefined);
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | any>();
    const [address, setAddress] = useState<string>("");
    const [stores, setStores] = useState<Store[]>([]);
    const [query, setQuery] = useState<string>('');
    const [categoriesPressed, setCategoriesPressed] = useState<number[]>([]);
    const dispatch = useAppDispatch();


    const loadMenuitems = async () => {
        try {
            const res = await MenuItemsApi.getAllMenuItems();
            setMenuitems(res.data.result);
        } catch (ex) {
            console.error(ex);
        }
    };
    const handleAddress = async () => {
        Alert.alert(
            "Bạn có muốn lấy vị trí hiện tại của bạn?",
            "Địa chỉ của bạn là: "+ address,
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Hủy"),
                    style: "cancel",
                },
                {
                    text: "Đồng ý",
                    onPress: async () => getPermissions(),
                    style: "destructive",
                },
            ],
            { cancelable: false }
        );
    }

    const getPermissions = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log("Please grant location permissions");
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        console.log(location)
        setCurrentLocation(location);
        reverseGeocode(location);
    };

    const reverseGeocode = async (value:Location.LocationObject) => {
        const reverseGeocodeAddress = await Location.reverseGeocodeAsync({
            latitude: value.coords?.latitude,
            longitude: value.coords?.longitude
        });

        console.log(currentLocation)

        const a = reverseGeocodeAddress[0].name+", "+reverseGeocodeAddress[0].district+", "+reverseGeocodeAddress[0].subregion+", "+reverseGeocodeAddress[0].region;

        setAddress(a)
        try{
            const form = new FormData();
            form.append("location", a);
            form.append("longitude", value.coords?.longitude.toString());
            form.append("latitude", value.coords?.latitude.toString());
            const res = await UserApi.updateUser(me.profile?.id, form);
            console.log(address)
        }catch(err){
            console.log(err, "lỗi update location")
        }
        Alert.alert("Vị trí hiện tại của bạn là", a)
    }

    // const reverseGeocode = async () => {
    //     if (currentLocation) {
    //         const reverseGeocodeAddress = await Location.reverseGeocodeAsync({
    //             latitude: currentLocation.coords.latitude,
    //             longitude: currentLocation.coords.longitude,
    //         });

    //         if (reverseGeocodeAddress.length > 0) {
    //             setAddress(`${reverseGeocodeAddress[0].name}, ${reverseGeocodeAddress[0].district}, ${reverseGeocodeAddress[0].subregion}, ${reverseGeocodeAddress[0].region}`);
    //         }
    //     }
    // };

    const loadCategories = async () => {
        try {
            const res = await CategoryApi.getAllCategories();
            const filteredCategories = filterCategoriesWithoutParent(res.data.result);
            setCategories(filteredCategories);
        } catch (ex) {
            console.error(ex);
        }
    };

    const onCategoriesPressed = async (id: number) => {
        let newCategoriesPressed;
    
        if (categoriesPressed.includes(id)) {
            newCategoriesPressed = categoriesPressed.filter(i => i !== id);
        } else {
            newCategoriesPressed = [...categoriesPressed, id];
        }
    
        setCategoriesPressed(newCategoriesPressed);
    
        await MenuItemsApi.getMenuItemByCateId(newCategoriesPressed.toString())
        .then(result => {
            setMenuitems(result.data.result);
            console.log(result.data.result);
        })
        .catch(error => {
            console.log("Đã xảy ra lỗi:", error);
        });;
        
    };

    const search = async () => {
        var t = query
        if(!t) t = " ";
            
        try {
            const res = await MenuItemsApi.getMenuItemByName(t);
            setMenuitems(res.data.result);
            console.log(res.data)
        } catch (error) {
            console.error(error);
        }
    };

    var token = null;
 
    
    const loadData = async () => {
        const res = await getDataSecure("token");
        token = res

        if(me.profile?.location) {
            setAddress(me.profile?.location)
        }else{
            getPermissions();
        }

        if(res!==null) {
            loadCategories();
            loadMenuitems();
            await dispatch(meActions.getProfile())
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    if(token) return <Redirect href='/(auths)/wellcome'/>
    else return <>
    <SafeAreaView className="bg-white">
            <StatusBar  style="dark"/>

            <View className="flex-row items-center space-x-2 py-12 px-4 pb-2">
                <View className="flex-row flex-1 items-center p-1 rounded-full border border-gray-300">
                    <Icon.Search height="20" width="20" stroke="gray" />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={search}
                        placeholder="Nhập từ khóa"
                        className="ml-2 flex-1 h-8"
                    />
                    <TouchableOpacity onPress={()=> {handleAddress()}}  className="flex-row items-center space-x-1 border-0 border-l-2 pl-2 border-l-gray-300">
                        <Icon.MapPin height="20" width="20" stroke="gray" />
                        <Text className="text-gray-600">{truncateString(address, 5)}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: themeColors.bgColor(1) }} className="p-3 bg-gray-300 rounded-full">
                    <Icon.Sliders height="20" width="20" strokeWidth={2.5} stroke="white" />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="mt-4">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible" contentContainerStyle={{ paddingHorizontal: 15 }}>
                        {categories.map(c => (
                            <Category onCategoriesPressed={onCategoriesPressed} key={c.id} props={c} />
                        ))}
                    </ScrollView>
                </View>
                <View className="mt-5">
                    {
                        [featured].map((item, index) => (
                            <FeatureRow key={index} title={item.title} description={item.description} />
                        ))
                    }
                </View>
                <ScrollView className="mt-5">
                    {menuitems ? menuitems.map((item, index) => (
                        <ItemColumn key={index} item={item}/>
                    )) : <></>}
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    </>

}
