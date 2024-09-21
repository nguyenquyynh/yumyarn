import React, { useState } from 'react'
import Authen from './Authen'
import { NavigationContainer } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import MainApp from './MainApp'

const MainNavigation = () => {
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

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
    // Check()
  }, [])

  return (
    <NavigationContainer>
      {auth.isLogin ? <MainApp /> : <Authen />}
    </NavigationContainer>
  )
}

export default MainNavigation
