import { StatusBar, StyleSheet, Text } from 'react-native'
import React from 'react'
import { View } from 'react-native-ui-lib'
import ScreenGGmap from 'src/testcomponent/ScreenGGmap'
import Signin from 'src/testcomponent/Signin'
import ImageAndVideoLibary from 'src/testcomponent/SelectImageAndVideoInLibary'


const App = () => {
  return (
    <View flex>
      {/* <Signin/> */}
      <ImageAndVideoLibary/>
    </View>

  )
}

export default App

const styles = StyleSheet.create({})