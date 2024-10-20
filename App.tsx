import {
  Alert,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from 'src/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nProvider } from 'lang';
import MainNavigation from 'containers/navigations/MainNavigation';
import { ConnectionStatusBar } from 'react-native-ui-lib';
const App = () => {
  return (
    <Provider store={store}>
      <I18nProvider>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar translucent barStyle='dark-content' backgroundColor={'rgba(0,0,0,0)'} />
          <ConnectionStatusBar onConnectionChange={(e) => ToastAndroid.show(e ? "Conected to Internet" : "Disconectd Wifi/5G", ToastAndroid.SHORT)} />
          <MainNavigation />
        </PersistGate>
      </I18nProvider>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
