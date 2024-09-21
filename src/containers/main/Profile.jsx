import { Dimensions, ImageBackground, ScrollView, StyleSheet } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { Avatar, Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import LinearGradient from 'react-native-linear-gradient'
import { t } from 'lang'
import numberFormat from 'configs/ui/format'
import ListMediaProfile from 'components/profile/ListMediaProfile'
import { getTimeline } from 'src/hooks/api/profile'
import Modals from 'components/BottomSheetApp'
import { B, BI, SB, SBI } from 'configs/fonts'

const Profile = () => {
  const navigation = useNavigation()
  const auth = useSelector(state => state.auth.user)
  const [data, setdata] = useState([])
  const [showmodal, setShowmodal] = useState(false)

  async function loadTimeline(option) {
    switch (option) {
      case 'refress':
        const refress = await getTimeline({
          user: auth._id,
          page: 1
        })
        if (refress.status) {
          setdata([...refress.data])
        }
        break;

      default:
        const resault = await getTimeline({
          user: auth._id,
          page: Math.ceil(data.length / 10) + 1
        })
        if (resault.status) {
          setdata([...data, ...resault.data])
        }
        break;
    }

  }

  useEffect(() => {
    loadTimeline()
  }, [])

  return (
    <View flex>
      <View flex bg-white padding-x>
        <ImageBackground source={{ uri: auth.coverPhoto }} style={styles.coverphoto}>
          <View flex margin-xx br30 >
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} colors={[Colors.opacity, Colors.opacity]} style={styles.linear}>
              <View flex-7 padding-xx row>
                <Avatar source={{ uri: auth.avatar }} size={60} />
                <View flex paddingH-x>
                  <View marginB-x>
                    <View row spread>
                      <Text text style={styles.name}>{auth.name}</Text>
                      <TouchableOpacity onPress={() => setShowmodal(!showmodal)}>
                        <Icon assetName='dots' size={20} />
                      </TouchableOpacity>
                    </View>
                    <Text text style={styles.tagname}>@{auth.tagName}</Text>
                  </View>
                  <Text ixtext style={styles.story}>{auth.story}</Text>

                </View>
              </View>
              <View flex-2 row padding-x>
                <View flex-3 center style={styles.bordercard} >
                  <Text style={styles.numbercard}>{numberFormat(auth.posts)}</Text>
                  <Text ixtext style={styles.numbercard}>{t("profile.postting")}</Text>
                </View>
                <TouchableOpacity flex-4 center onPress={() => navigation.navigate('FollowerList')} >
                  <Text style={styles.numbercard}>{numberFormat(auth.follower)}</Text>
                  <Text ixtext style={styles.numbercard}>{t("profile.followers")}</Text>
                </TouchableOpacity>
                <TouchableOpacity flex-4 center style={styles.bordercard} onPress={() => navigation.navigate('FollowingList')}>
                  <Text style={styles.numbercard}>{numberFormat(auth.following)}</Text>
                  <Text ixtext style={styles.numbercard}>{t("profile.following")}</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </ImageBackground>
        <ListMediaProfile data={data} loadTimeline={loadTimeline} navigation={navigation} refressTimeline={() => { loadTimeline('refress') }} />
      </View>
      <Modals modalhiden={setShowmodal} modalVisible={showmodal}>
        <TouchableOpacity row paddingV-x centerV onPress={() => {
          setShowmodal(false)
          navigation.navigate('EditProfile')
        }}>
          <Icon assetName='edit' size={33} tintColor={Colors.yellow} marginH-x />
          <View>
            <Text style={{ fontFamily: BI }} >{t("profile.edit")}</Text>
            <Text color={Colors.gray}>{t("profile.edit_description")}</Text>
          </View>
        </TouchableOpacity>
      </Modals>
    </View>
  )
}

export default memo(Profile)

const styles = StyleSheet.create({
  coverphoto: {
    height: 220,
    borderRadius: 10,
    overflow: 'hidden',
  },
  linear: {
    flex: 1,
    borderRadius: 10,
  },
  name: {
    fontFamily: BI
  },
  tagname: {
    fontFamily: B
  },
  story: {
    fontFamily: SB
  },
  bordercard: {
    borderLeftWidth: 1, borderRightWidth: 1
  },
  numbercard: {
    fontFamily: SBI,
    color: 'white'
  },
})
