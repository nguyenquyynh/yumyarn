import { StyleSheet, Image, FlatList, LayoutAnimation, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Icon, Modal, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import { getNotiByUser } from 'src/hooks/api/noti'
import NotificationModalApp from 'components/commons/NotificationModalApp'
import LottieView from 'lottie-react-native'
import lottie from 'configs/ui/lottie'
import Avatar from 'components/Avatar'
import Markdown from 'react-native-markdown-display';
import { millisecondsToDate } from 'configs/ui/time'

const MainNotifications = () => {
  const navigation = useNavigation()
  const [isloading, setisloading] = useState(false)
  const [refreshing, setrefreshing] = useState(false)
  const [page, setpage] = useState(1)
  const [notification, setnotification] = useState([])
  const [showNotiAdmin, setShowNotiAdmin] = useState({ status: false, id: null })
  const getNotifi = async (page) => {
    try {
      setisloading(true)
      if (!isloading) {
        const reponse = await getNotiByUser(page);
        if (reponse.status) {
          if (reponse.data.length == 0) {
            setpage(null)
            return
          }
          setnotification([...notification, ...reponse.data]);
          setpage(page)
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisloading(false);
    }
  }

  const handleLoadMore = () => {
    if (!page) return
    getNotifi(page + 1);
  }

  const handleRefes = async () => {
    try {
      setrefreshing(true)
      if (!isloading) {
        const reponse = await getNotiByUser(1);
        if (reponse.status) {
          setpage(1)
          setnotification([...reponse.data])
        }
      }
    } catch (error) {
      return
    } finally {
      setrefreshing(false)
    }

  }

  useEffect(() => {
    getNotifi(1);
  }, [])

  const NotificationItem = ({ item }) => {
    const image = () => {
      if (item.status == "LIKE")
        return "fire"
      else if (item.status == "FOLLOW")
        return "check_follow"
      else if (item.status == "COMMENT")
        return "comment"
      else if (item.status == "NEW")
        return "messenger"

    }

    const gotoNavidation = () => {
      if (item.status === 'FOLLOW') navigation.navigate('OtherProfile', { _id: item?.create_by })
      if ((item.status === 'COMMENT') || (item.status === 'LIKE')) navigation.navigate('PostDetail', { id: item?.id_post })
      if (item.status === 'NEW') {
        setShowNotiAdmin({ status: true, id: item })
      }
    }
    return (
      <TouchableOpacity key={item._id} style={styles.notificationContainer} onPress={gotoNavidation}>
        <View style={styles.avater}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Icon assetName={image()} style={styles.icon} size={24} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{item.user}</Text>
          <Text numberOfLines={2} style={styles.actionText}>{item.content}</Text>
          <Text text90BO>{millisecondsToDate(item?.create_at)}</Text>
        </View>
      </TouchableOpacity>
    )
  };

  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("notification.title")}>
      <View flex bg-white>
        <View paddingH-5 center>
          <Text text80BO color={Colors.yellow}>{t("messenge.delete_noti")}</Text>
        </View>
        <FlatList
          refreshing={refreshing}
          onRefresh={handleRefes}
          data={notification}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          renderItem={({ item }) => <NotificationItem item={item} />}
          keyExtractor={(item) => item.id}
          style={styles.container}
        />
      </View>
      <Modal visible={showNotiAdmin.status} statusBarTranslucent transparent>
        <View flex bg-tr_black center>
          <View center marginH-10 bg-white br30 padding-10 style={{ elevation: 20, width: '98%', height: '90%' }}>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
              <View center padding-10>
                <LottieView source={lottie.Noti} style={{ width: 200, height: 200 }} loop autoPlay />
                <View padding-10 row>
                  <Text center text50BO>{t("chat.app_noti")}</Text>
                </View>
                <Markdown style={styles.text}>
                  {showNotiAdmin?.id?.content}
                </Markdown>
              </View>
            </ScrollView>
            <TouchableOpacity marginT-40 style={{ width: '100%' }} centerH br100 marginH-10 padding-10 bg-yellow onPress={() => { setShowNotiAdmin({ status: false }) }}>
              <Text text65BO color='white'>{t("chat.allow")}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
    </Wapper >
  )
}
export default MainNotifications

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  avater: {
    position: "relative"
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    left: 20,
  },
  userName: {
    fontWeight: 'bold',
  },
  actionText: {
    color: '#555',
  },
  icon: {
    position: 'absolute',
    zIndex: 2,
    bottom: 0,
    right: 0,
  },
  text: {
    text: {
      color: 'black',
    },
  }
})