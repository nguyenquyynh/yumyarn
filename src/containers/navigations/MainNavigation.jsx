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
import OpenApp from 'components/commons/OpenApp'

const MainNavigation = () => {
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const Check = async () => {
      const authen = await checkAuthen(auth.token)
      setTimeout(() => {
        setLoading(false)
        if (!authen) {
          ToastAndroid.show(t("login.expired"), ToastAndroid.SHORT);
        }
      }, 1500);
      await dispatch(auth_check({ isLogin: authen }))
    }
    Check()
  }, [])

  return (
    <NavigationContainer>
      {loading ? <OpenApp /> : auth.isLogin ? <MainApp /> : <Authen />}
    </NavigationContainer>
  )
}

export default MainNavigation
