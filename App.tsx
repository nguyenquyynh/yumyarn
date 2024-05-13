import { StatusBar, StyleSheet, Text } from 'react-native'
import React from 'react'
import { View } from 'react-native-ui-lib'
import ScreenGGmap from 'src/testcomponent/ScreenGGmap'

const App = () => {
  return (
    <View flex>
      <ScreenGGmap/>
    </View>

  )
}

export default App

const styles = StyleSheet.create({})