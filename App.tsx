import { Alert, StatusBar, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store, persistor } from 'src/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { I18nProvider } from 'lang'
import MainNavigation from 'containers/navigations/MainNavigation'
import { addEventListener } from "@react-native-community/netinfo";

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
          <MainNavigation />
        </PersistGate>
      </I18nProvider>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})