import { LayoutAnimation, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import { Icon, TouchableOpacity, View } from 'react-native-ui-lib'
import TextApp from 'components/commons/TextApp'
import { useDispatch, useSelector } from 'react-redux'
import { setting_roll } from 'reducers/setting'

const Extentions = () => {
  const navigation = useNavigation()
  const setting = useSelector(state => state.setting)
  const dispatch = useDispatch()
  const [shake, setShake] = useState(setting?.rollpost)

  const handleSetShake = async () => {
    await dispatch(setting_roll(!shake))
    setShake(!shake)
    LayoutAnimation.easeInEaseOut()
  }

  return (
    <Wapper title={t('setting.setting_dice')} renderleft funtleft={() => { navigation.goBack() }}>
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <View flex padding-xv>
          <View marginB-x >
            <TouchableOpacity padding-x row spread onPress={handleSetShake}>
              <View row>
                <Icon assetName={'dice'} size={25} marginR-x tintColor='black' />
                <TextApp style={styles.title} text={t('setting.roll')} />
              </View>
              <Icon
                assetName={shake ? 'toggle_on' : 'toggle_off'}
                size={25}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Wapper>
  )
}

export default Extentions

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
  }
})