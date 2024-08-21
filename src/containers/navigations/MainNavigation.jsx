import React, { useEffect, useState } from 'react'
import Authen from './Authen'
import { NavigationContainer } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import MainApp from './MainApp'
import LoadingApp from 'components/commons/LoadingApp'
import { checkAuthen } from 'src/hooks/api/auth'
import { auth_check } from 'reducers/auth'
import { Toast } from 'react-native-ui-lib'
import { ToastAndroid } from 'react-native'
import { t } from 'lang'

const MainNavigation = () => {
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const Check = async () => {
      const authen = await checkAuthen(auth.token)
      setTimeout(() => {
        setLoading(false)
      }, 1000);
      if (!authen) {
        ToastAndroid.show(t("login.expired"), ToastAndroid.SHORT);
      }
      await dispatch(auth_check({isLogin : authen}))
    }
    Check()
  }, [])

  return (
    <NavigationContainer>
      {loading ? <LoadingApp /> : auth.isLogin ? <MainApp /> : <Authen />}
    </NavigationContainer>
  )
}

export default MainNavigation
