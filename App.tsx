import { StatusBar, StyleSheet, Text } from 'react-native'
import React from 'react'
import DevNavigation from 'containers/navigations/DevNavigation'
import { View } from 'react-native-ui-lib'

const App = () => {
  return (
    <View flex>
      <StatusBar translucent backgroundColor={'rgba(0,0,0,0)'} />
        <DevNavigation />
    </View>

  )
}

export default App

const styles = StyleSheet.create({})