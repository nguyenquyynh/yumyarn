import { StatusBar, StyleSheet, Text } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import DevNavigation from 'containers/navigations/DevNavigation'

const App = () => {
  return (
    <GestureHandlerRootView>
      <StatusBar translucent backgroundColor={'rgba(0,0,0,0)'} />
        <DevNavigation />
    </GestureHandlerRootView>

  )
}

export default App

const styles = StyleSheet.create({})