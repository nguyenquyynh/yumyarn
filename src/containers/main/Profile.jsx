import { ActivityIndicator, Dimensions, ImageBackground, RefreshControl, ScrollView, StyleSheet } from 'react-native'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Avatar, Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { t } from 'lang'
import numberFormat from 'configs/ui/format'
import ListMediaProfile from 'components/profile/ListMediaProfile'
import { getTimeline } from 'src/hooks/api/profile'
import Modals from 'components/BottomSheetApp'
import { BI, I, SBI } from 'configs/fonts'
import Animated from 'react-native-reanimated'

const Profile = () => {
  const navigation = useNavigation()
  const auth = useSelector(state => state.auth.user)
  console.log(auth);
  
  const [data, setdata] = useState([])
  const [showmodal, setShowmodal] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [load, setLoad] = useState(true)
  const timeout = useRef(null)

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
          setLoad(false)
        }
        break;
    }

  }
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadTimeline('refress')
      setRefreshing(false);
    }, 1000)
  }
  const handleScroll = useCallback((event) => {
    clearTimeout(timeout.current)
    const { contentOffset, contentSize } = event.nativeEvent;
    const { height: windowHeight } = Dimensions.get('window');
    if (contentOffset.y + windowHeight > contentSize.height) {
      timeout.current = setTimeout(() => {
        setLoad(true)
        loadTimeline()
      }, 1000)
    }
  })

  useEffect(() => {
    loadTimeline()
  }, [])

  return (
    <View flex>
      <ImageBackground style={{ height: 210 }} source={{ uri: auth?.coverPhoto || 'https://cdn.pixabay.com/photo/2020/01/07/16/41/vietnam-4748105_1280.jpg' }} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={(state) => handleScroll(state)}
      >
        <TouchableOpacity style={{ position: 'absolute', right: 15, top: 15 }}  onPress={() => { setShowmodal(!showmodal) }} >
          <Icon assetName='dots' tintColor='white' size={26} />
        </TouchableOpacity>
        <View centerH paddingT-120>
          <Animated.View style={{ zIndex: 1 }}>
            <Avatar source={{ uri: auth?.avatar }} size={100} imageStyle={styles.avatar} />
          </Animated.View>
          <View bg-puper style={styles.background}>
            <View row spread padding-x>
              <TouchableOpacity flex center onPress={() => navigation.navigate('FollowerList')} >
                <Text text70BO style={styles.numbercard}>{numberFormat(auth.follower)}</Text>
                <Text ixtext style={styles.numbercard}>{t("profile.followers")}</Text>
              </TouchableOpacity>
              <View flex />
              <TouchableOpacity flex center onPress={() => navigation.navigate('FollowerList')} >
                <Text text70BO style={styles.numbercard}>{numberFormat(auth.following)}</Text>
                <Text ixtext style={styles.numbercard}>{t("profile.following")}</Text>
              </TouchableOpacity>
            </View>
            <View paddingH-l centerH >
              <Text xviiiText style={styles.name}>{auth.name}</Text>
              <Text marginB-xv style={styles.name}>@{auth.tagName}</Text>
              <Text xivtext style={styles.story}>{auth.story}</Text>
            </View>
            <View marginT-xx br50 style={{ width: '100%', height: '100%' }} bg-white padding-x>
              <ListMediaProfile data={data} loadTimeline={loadTimeline} load={load} navigation={navigation}
                refressTimeline={() => { loadTimeline('refress') }} />
            </View>
          </View>
        </View>
      </ScrollView>
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
  scroll: { width: '100%', height: '100%', position: 'absolute', bottom: 0 },
  background: {
    width: '100%',
    position: 'relative',
    top: -50,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  avatar: {
    borderColor: 'white',
    borderWidth: 3,
  },
  name: {
    fontFamily: BI
  },
  story: {
    fontFamily: I,
    textAlign: 'center',
  },
  numbercard: {
    fontFamily: SBI,
    color: 'black'
  },
})
