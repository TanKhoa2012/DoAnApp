import { View, Text, TouchableOpacity, Image, ScrollView, Button, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Icon } from 'react-native-paper';
import { useNavigation } from 'expo-router';
import { themeColors } from '@/themes';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { delivery, paypalMethods } from '@/constants/data';
import MapView, { Marker } from 'react-native-maps';
import { Item, OrderDate } from '@/types';
import { RouteProp, useRoute } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { OrdersApi } from '@/configs/apis/OrderApi';
import { useAppSelector } from '@/configs/redux/hooks';

type RootStackParamList = {
  ItemDetail: { 
    item: Item ,
    review: boolean,
  };
};

type ItemDetailRouteProp = RouteProp<RootStackParamList, 'ItemDetail'>;

const ItemDetail = () => {
  const route = useRoute<ItemDetailRouteProp>();
  const { item } = route.params;
  const { review } = route.params;
  const {me} = useAppSelector(state => state.reducer);
  const navigation = useNavigation();
  const [startDateChoose, setStartDate] = useState<Date | null |any>(null);
  const [endDateChoose, setEndDate] = useState<Date | null | any>(null);
  const [selectedOption, setSelectedOption] = useState(1);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectedPay, setSelectedPay] = useState(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [reservedDates, setReservedDates] = useState<OrderDate[]>([]);



const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
  const slideIndex = Math.ceil(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
  setActiveIndex(slideIndex);
};


const handleDeliveryFee = (id:number) => {
    setSelectedOption(id)
    if(id===1) {
      setDeliveryFee(0)
      setTotalPrice(0 + (endDateChoose.getDate()-startDateChoose.getDate()+1) * item.price);
    } 
    else{
      setDeliveryFee(50000)
      setTotalPrice(50000 + (endDateChoose.getDate()-startDateChoose.getDate()+1) * item.price);
    }
}

const handlePay = (id:number) => {
  setSelectedPay(id)
}

  const isDateReserved = (date: Date) => {
    return reservedDates.some(({ startDate, endDate }) => {
    console.log(startDate ,endDate)
        return (date >= startDate && date <= endDate) || (startDateChoose && startDateChoose <= startDate && date >= endDate);
    });
};

  const handleDayPress = (day: { dateString: string }) => {
    const selectedDate = new Date(day.dateString);
    var totalDays = 0;

    if (isDateReserved(selectedDate)) {
        setStartDate(null);
        setEndDate(null);
        alert('Ngày này đã được đặt, vui lòng chọn ngày khác.');
        return;
    }

    if (startDateChoose && selectedDate.getTime() === startDateChoose.getTime()) {
        setStartDate(null);
        setEndDate(null);
        console.log("aaaaaaaaaaaaaaa")
    } else if (!startDateChoose || (endDateChoose && selectedDate < startDateChoose)) {
        setStartDate(selectedDate);
        setEndDate(null); 
    } else if (selectedDate > startDateChoose) {
        setEndDate(selectedDate);
        totalDays = selectedDate.getDate()-startDateChoose.getDate()+1;
    } else {
        setStartDate(selectedDate);
        setEndDate(null);
    }
    setTotalPrice(deliveryFee + totalDays * item.price);
};

const markRange = (startDate: Date | null, endDate: Date | null) => {
    let markedDates: { [key: string]: any } = {};
    
    reservedDates.forEach(({ startDate, endDate }) => {
        let dateIterator = new Date(startDate);
        while (dateIterator <= endDate) {
            const dateString = dateIterator.toISOString().split('T')[0];
            markedDates[dateString] = { color: '#fca5a566' };
            dateIterator.setDate(dateIterator.getDate() + 1);
        }
    });

    if (!startDate || !endDate) return markedDates;;

    let currentDate = startDate;

    while (currentDate <= endDate) {
      const dateString = moment(currentDate).format('YYYY-MM-DD');
      markedDates[dateString] = {
        color: themeColors.text,
        startingDay: moment(currentDate).isSame(startDate, 'day'),
        endingDay: moment(currentDate).isSame(endDate, 'day'),
      };
      currentDate = moment(currentDate).add(1, 'day').toDate();
    }

    return markedDates;
};

const [isVisible, setIsVisible] = useState(false);

    const toggleModal = () => {
        setIsVisible(!isVisible);
    };

  const handleSubmit = async () => {
    if (startDateChoose && endDateChoose) {
      const orderDate = {
        totalPrice: totalPrice,
        deliveryFee: deliveryFee,
        paymentMethod: paypalMethods[selectedPay-1].name,
        storeId: item.stores.id,
        userId: me.profile?.id,
        menuitemId: item.id,
        startDate: startDateChoose,
        endDate: endDateChoose
      }
      try{
        await OrdersApi.createOrder(orderDate);
        Alert.alert("Thông báo", "Đặt thuê thành công");
        navigation.navigate("history")

      }catch(err){
        console.log(err, "lỗi create order")
      }
    } else {
      alert("Vui lòng chọn thời gian thuê.");
    }
  };

  const loadDate = async() => {
    try{
     const res = await OrdersApi.getDateOrdersByStoreId(item.stores.id);
     const reservedDatesFormatted = res.data.result.map((dateRange: { startDate: string, endDate: string }) => ({
      startDate: new Date(dateRange.startDate),
      endDate: new Date(dateRange.endDate),
    }));
    setReservedDates(reservedDatesFormatted);
    console.log(reservedDatesFormatted)

    }catch(err){
      console.log(err, "lỗi getDate")
    }
  }

  useEffect(()=>{
    loadDate();
  },[])

  const todayString = new Date().toISOString().split('T')[0];

  return (
    <View className='bg-white'>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="absolute top-12 left-5 z-50 bg-gray-400 p-2 rounded-full shadow"
      >
        <Icon size={20} color={themeColors.bgColor(1)} source="arrow-left-bold" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <View className="relative">
            <FlatList className='bg-black'
            data={item.itemimagesSet}
            horizontal
            pagingEnabled
            onScroll={onScroll}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (console.log(item),
              <Image style={{width: Dimensions.get('window').width, height:288}} source={{uri: item.url}} />
            )}
          />
          <View className='flex-row justify-center absolute bottom-2 w-full'>
          {item.itemimagesSet.map((_, index) => (
          <Text key={index} style={{ margin: 3, color: activeIndex === index ? 'white' : 'gray', fontSize: 10 }}>
            ●
          </Text>
        ))}
      </View>
        </View>

        <View className="pt-4 pl-4">
          <Text className="text-2xl font-bold">{item.name}</Text>
          <View className='flex-row'>
            <View className='flex-row items-center'>
              <Image source={require('../../assets/images/app/star.png')} className="h-5 w-5" />
              <Text className="pl-2 text-gray-700">5.0</Text>
            </View>
            <View className='flex-row items-center'>
              {/* <Text className='pl-6 text-lg pr-2'>Giá:</Text> */}
              <Text className='pl-6 text-lg font-bold text-red-500'>{item.price}/Ngày</Text>
            </View>
          </View>

          <View>
            <Text className='pt-4 text-lg font-bold'>Chọn ngày giao nhận:</Text>
            <Calendar
              markingType={'period'}
              markedDates={markRange(startDateChoose, endDateChoose)}
              onDayPress={handleDayPress}
              minDate = {todayString}
            />
            <View className='p-4 rounded-xl bg-gray-100 mr-4 mt-4'>
                <Text className='text-lg font-bold pt-4 pb-2'>Thời gian giao(nhận):</Text>
                <View className='flex-row justify-evenly items-center'>
                    <View>
                        <Text>Ngày thuê:</Text>
                        {startDateChoose?<Text  className='text-sm font-bold'>{moment(startDateChoose).format('YYYY-MM-DD HH:mm')}</Text>
                        :<Text  className='text-sm font-bold'>{moment(Date.now()).format('YYYY-MM-DD HH:mm')}</Text>
                        }
                    </View>
                    <View>
                        <Text>Ngày trả:</Text>
                        {endDateChoose?<Text  className='text-sm font-bold'>{moment(endDateChoose).format('YYYY-MM-DD HH:mm')}</Text>
                        :<Text  className='text-sm font-bold'>{moment(Date.now()).format('YYYY-MM-DD HH:mm')}</Text>
                        }
                    </View>
                </View>
                <Text className='text-lg font-bold pt-4 pb-2'>Địa điểm giao nhân xe:</Text>
                {delivery.map((option) => (
                        <TouchableOpacity className="flex-row my-0.5 items-center px-5 h-12 w-full border rounded-t-[10] rounded-b-[10]" style={[{borderColor: "#e3e3e3"},selectedOption === option.id &&  {borderColor:themeColors.bgColor(1)}]}
                            key={option.id}
                            onPress={() => handleDeliveryFee(option.id)}>
                            <Text className="w-full font-bold text-3xs text-center">
                                {option.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
            </View>
            <View className='pt-4 pb-2'>
                <Text className='text-lg font-bold'>Mô tả:</Text>
                <Text className='pt-4 text-base text-gray-700'>Chiếc xe Exiter Yamaha là một mẫu xe tay ga thể thao nổi bật với thiết kế trẻ trung, năng động. Động cơ mạnh mẽ và khả năng tăng tốc ấn tượng mang lại trải nghiệm lái xe thú vị. Với công nghệ tiên tiến và tính năng an toàn vượt trội, chiếc xe không chỉ đáp ứng nhu cầu di chuyển mà còn thể hiện phong cách cá tính. Hệ thống treo và phanh được tối ưu hóa giúp vận hành ổn định trên nhiều địa hình, mang đến sự tự tin cho người lái</Text>
            </View>
            <View className='pb-4 pt-4 pr-4'>
                <Text className='text-lg font-bold pb-4'>Vị trí:</Text>
                <MapView className='flex-1 w-full h-44'
                  initialRegion={{
                  latitude: item.stores.latitude, 
                  longitude: item.stores.longitude,
                  latitudeDelta: 0.008,  
                  longitudeDelta: 0.008, 
                  }}
                >
                  <Marker
                    coordinate={{ latitude: item.stores.latitude, longitude: item.stores.longitude }}
                    title={"Vị trí Cửa hàng"}
                    description={item.stores.description}
                  />
                </MapView>
            </View>
          </View>
          <View className='pb-4 pt-4'>
            <Text className='text-lg font-bold'>Chủ cửa hàng:</Text>
            <TouchableOpacity onPress={() => navigation.navigate("storedetail", { store: item.stores })} className='p-4 rounded-xl bg-gray-100 mr-4 mt-4'>
              <View className='flex-row'>
                <Image source={{uri: item.stores.avatar}} className="h-20 w-20 rounded-full" />
                <View className='flex-col justify-center'>
                  <Text className='text-base font-bold'>{item.stores.name}</Text>
                  <View className='flex-row items-center'>
                    <Image source={require('../../assets/images/app/star.png')} className="h-5 w-5" />
                    <Text className="pl-2 text-gray-700">5.0</Text>
                  </View>
                </View>
              </View>
              <View className='flex-row pt-4 justify-between'>
                <View className='flex-col'>
                  <Text>Tỉ lệ phản hồi</Text>
                  <Text className='self-center text-base font-bold pt-2'>100%</Text>
                </View>
                <View className='flex-col'>
                  <Text>Tỉ lệ đồng ý</Text>
                  <Text className='self-center text-base font-bold pt-2'>100%</Text>
                </View>
                <View className='flex-col'>
                  <Text>Phản hồi trong</Text>
                  <Text className='self-center text-base font-bold pt-2'>5 phút</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View className='pb-4 pt-4'>
            <Text className='text-lg font-bold'>Điều khoản:</Text>
            <Text className='pt-4 text-base text-gray-700'>Quy định khác:</Text>
            <Text className='text-base text-gray-700'>- Sử dụng đúng mục đích.</Text>
            <Text className='text-base text-gray-700'>- Không sử dụng vào mục đích phi pháp trái pháp luật..</Text>
          </View>
          {review === true && 
          <View className='pb-4 pt-4'>
            <Text className='text-lg font-bold'>Đánh giá:</Text>
          </View>}
        </View>
      </ScrollView>
      <View className='absolute flex-col justify-around pl-6 pr-6 pb-6 bottom-0 h-40 bg-white border-t-gray-300 border-t'>
        <View className='w-full border-b border-gray-300 pt-2 pb-2 flex-row items-center justify-between'>
          <View className='border-r pr-4'>
            <Text className='text-base font-semibold'>
              Phương thức thanh toán
            </Text>
          </View>
            <View className='flex-row items-center flex-1 justify-center'>
            <TouchableOpacity className='flex-row items-center space-x-4' onPress={toggleModal}>
            {selectedPay === 1?<>
              <Image className='h-6 w-10' resizeMode='contain' source={require("../../assets/images/app/cash.png")}/>
              <Text className='text-base font-bold'>Tiền Mặt</Text>
              </>:
              <>
              <Image className='h-6 w-10' resizeMode='contain' source={require("../../assets/images/app/VNPay.png")}/>
              <Text className='text-base font-bold'>VNPay</Text>
              </>}
            <Icon size={26} source="chevron-right" color='black'/>
            </TouchableOpacity>
          

            <Modal isVisible={isVisible} onBackdropPress={toggleModal}>
                <View className="bg-white p-5 rounded-lg space-y-6">
                    <Text className="text-lg mb-2 font-bold">Chọn loại thanh toán:</Text>
                    <View>
                    {paypalMethods.map((option) => (
                        <TouchableOpacity className="flex-row my-0.5 items-center px-5 h-12 w-full border rounded-t-[10] rounded-b-[10]" style={[{borderColor: "#e3e3e3"},selectedPay === option.id &&  {borderColor:themeColors.bgColor(1)}]}
                            key={option.id}
                            onPress={() => handlePay(option.id)}>
                            <Image className='h-6 w-32' resizeMode='contain' source={option.image}/>
                            <Text className="w-1/2 font-bold text-3xs text-center">
                                {option.name}
                            </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TouchableOpacity className='w-full border-t border-t-gray-300 items-center pt-2' onPress={toggleModal}> 
                      <Text className='text-base font-bold'>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            
          </View>
        </View>
        <View className='flex-row w-full justify-between items-center' >
          <View className='flex-row items-center'>
              <Text className='text-base'>Tổng cộng: </Text>
              <Text className='text-lg font-bold'>{totalPrice}đ</Text>
          </View>
          <TouchableOpacity  onPress={handleSubmit} style={{backgroundColor: themeColors.bgColor(1)}} className='bg-black h-12 w-28 rounded-xl items-center justify-center'>
              <Text className='text-white text-base font-bold'>Thuê</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};

export default ItemDetail;
