import React, { useState } from 'react'
import Authen from './Authen'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import MainApp from './MainApp'

const MainNavigation = () => {
  const auth = useSelector(state => state.auth)
  return (
    <NavigationContainer>
      {auth.isLogin ? <MainApp /> : <Authen />}
    </NavigationContainer>
  )
}

export default MainNavigation
