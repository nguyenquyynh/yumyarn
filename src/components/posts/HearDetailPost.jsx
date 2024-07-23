import { Dimensions, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Avatar, Colors, Icon, Text, Toast, View } from 'react-native-ui-lib'
import LinearGradientCom from 'components/commons/LinearGradient'
import { createFollow } from 'src/hooks/api/follow'
import { useSelector } from 'react-redux'

const HearDetailPost = ({
  _id,
  back,
  avatar,
  follow,
  name,
}) => {
  const user = useSelector(state => state.auth)
  const [isfollow, setIsfollow] = useState(follow)

  const handlerClickAvatar = () => {

  }
  const handlerClickFollow = async () => {
    const followresponse = await createFollow(user._id, _id)
    if (followresponse?.status) {
      setIsfollow(!isfollow)
    }
  }
  return (
    <View style={styles.top}>
      <LinearGradientCom direction='D' dark={Colors.black} light={Colors.transparent} />
      <View absF spread bottom flex paddingT-xxx padding-x centerV row>
        <Pressable onPress={() => { back() }}>
          <Icon assetName='back' size={22} tintColor='white' />
        </Pressable>
        <View>
          <Avatar source={{ uri: avatar }} size={40} onPress={handlerClickAvatar} />
          <View flex absF right bottom>
            <Pressable onPress={handlerClickFollow}>
              <Icon assetName={isfollow ? 'check_follow' : 'plus'} size={13} />
            </Pressable>
          </View>
        </View>
      </View>
      <View flex absF center paddingT-xxx padding-x>
        <Text text70BO color={Colors.white}>{name}</Text>
      </View>
    </View>
  )
}

export default HearDetailPost
var widthscreen = Dimensions.get('window').width < Dimensions.get('window').height ? Dimensions.get('window').width : Dimensions.get('window').height

const styles = StyleSheet.create({
  top: {
    width: '100%', height: widthscreen / 4.5,
    position: 'absolute'
  },
})