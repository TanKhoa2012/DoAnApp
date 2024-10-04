import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { Provider } from 'react-redux';
import { store } from '@/configs/redux/store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  return (
    <Provider store={store} >
      <Stack>
        <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </Provider>
  );
}
