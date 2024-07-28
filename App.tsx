import { Alert, StatusBar, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import DevNavigation from 'containers/navigations/DevNavigation'
import { Provider } from 'react-redux'
import { store, persistor } from 'src/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { I18nProvider } from 'lang'
import MainNavigation from 'containers/navigations/MainNavigation'
import LoadingApp from 'components/commons/LoadingApp'
import SearchMain from 'containers/search/SearchMain'
import { addEventListener } from "@react-native-community/netinfo";
import ListPost from 'containers/post/ListPost'
const App = () => {
 
  useEffect(() => {
    const unsubscribe = addEventListener(state => {

      // Kiểm tra xem có kết nối không
      if (!state.isConnected) {
        Alert.alert('Warning', 'WiFi connection is lost!');
      }
      // Kiểm tra chi tiết kết nối và chất lượng kết nối WiFi
      else if (state?.details?.isConnectionExpensive) {
        Alert.alert('Warning', 'WiFi connection is weak!');
      }
      // Kết nối WiFi ổn định
      else if (state.isConnected) {
        console.log('WiFi connected')
      }
  });

  return () => {
    unsubscribe();
  };
}, []);
return (
  <Provider store={store}>
    <I18nProvider>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar translucent backgroundColor={'rgba(0,0,0,0)'} />
        <DevNavigation />
        {/* <MainNavigation /> */}
        {/* <ListPost/> */}
      </PersistGate>
    </I18nProvider>
  </Provider>
)
}

export default App

const styles = StyleSheet.create({})