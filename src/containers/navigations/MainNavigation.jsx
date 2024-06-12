import { View, Text } from 'react-native'
import React from 'react'
import Authen from './Authen'
import { NavigationContainer } from '@react-navigation/native'

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Authen />
    </NavigationContainer>
  )
}

export default MainNavigation
