import { StyleSheet } from 'react-native'
import React from 'react'
import Wapper from 'components/Wapper'
import { useNavigation } from '@react-navigation/native'
import { t } from 'lang'
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'

const EditProfile = () => {
  const navigation = useNavigation()

  const rightButton = () => {
    return (
      <TouchableOpacity bg-yellow br60 onPress={() => { }} paddingH-xv paddingV-v>
        <Text text80BO color='white'>
          {t("app.done")}
        </Text>
      </TouchableOpacity>
    )
  }
  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("profile.edit_profile")} customright={rightButton}>
      <View flex bg-white>

      </View>
    </Wapper>
  )
}

export default EditProfile

const styles = StyleSheet.create({})