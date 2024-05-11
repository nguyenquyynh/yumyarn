import { StatusBar, StyleSheet, Text } from 'react-native'
import React from 'react'
import Screen1 from 'src/testcomponent/Screen1'
import { View } from 'react-native-ui-lib'

const App = () => {
  return (
    <View flex>
      <Screen1 />
    </View>

  )
}

export default App

const styles = StyleSheet.create({})