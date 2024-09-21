import { StyleSheet  } from 'react-native'
import React from 'react'
import { View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'

const PostSaved = () => {
  const navigation = useNavigation()
  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("setting.saved")}>
      <View flex bg-white>

      </View>
    </Wapper>
  )
}

export default PostSaved

const styles = StyleSheet.create({})