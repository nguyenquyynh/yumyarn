import { StatusBar, StyleSheet } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import DevNavigation from 'containers/navigations/DevNavigation'
import { Provider } from 'react-redux'
import { store, persistor } from 'src/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { I18nProvider } from 'lang'
const App = () => {
  return (
    <Provider store={store}>
      <I18nProvider>
        <PersistGate loading={null} persistor={persistor}>
          <GestureHandlerRootView>
            <StatusBar translucent backgroundColor={'rgba(0,0,0,0)'} />
            <DevNavigation />
          </GestureHandlerRootView>
        </PersistGate>
      </I18nProvider>
    </Provider>

  )
}

export default App

const styles = StyleSheet.create({})