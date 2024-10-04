import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { OrdersApi } from '@/configs/apis/OrderApi';
import { useAppSelector } from '@/configs/redux/hooks';
import { Order } from '@/types';
import OrderItem from '@/components/app/orderitem';
import { themeColors } from '@/themes';



const History = () => {
  const {me} = useAppSelector(state => state.reducer);
  const [orders, setOrder] = useState<Order[]>();


  const loadOrders = async () => {
    try{
      const res = await OrdersApi.getOrdersByUserId(me.profile?.id);
      setOrder(res.data.result)
    }catch(er){
      console.log(er, "lỗi getOrders")
    }
  }




  useEffect(()=> {
    loadOrders();
  },[])

  return (
    <View>
      <View className='w-full h-48 justify-center items-center'>
        <Text className="text-2xl font-bold">Hoạt động</Text>
      </View>
      <ScrollView>
        <View className='w-full justify-center pl-4'>
          <Text className="text-xl font-bold">Gần đây</Text>
        </View>
        <View className='pt-4 space-y-2'>
          {orders ? orders.map((item, index)=> (
            <View key={index} className='shadow-sm'>
              <OrderItem order={item}/>
            </View>
          )): <></>}
        </View>
      </ScrollView>
    </View>
  )
}

export default History