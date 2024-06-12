import { StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import DevNavigation from 'containers/navigations/DevNavigation'
import { Provider } from 'react-redux'
import { store, persistor } from 'src/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { I18nProvider } from 'lang'
import MainNavigation from 'containers/navigations/MainNavigation'
const App = () => {
  return (
    <Provider store={store}>
      <I18nProvider>
        <PersistGate loading={null} persistor={persistor}>  
            <StatusBar translucent backgroundColor={'rgba(0,0,0,0)'} />
            {/* <DevNavigation /> */}
            <MainNavigation />
        </PersistGate>
      </I18nProvider>
    </Provider>

  )
}

export default App

const styles = StyleSheet.create({})