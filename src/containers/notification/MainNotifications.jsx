import { StyleSheet, Image, FlatList, LayoutAnimation } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon, Modal, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import { getNotiByUser } from 'src/hooks/api/noti'
import NotificationModalApp from 'components/commons/NotificationModalApp'


const MainNotifications = () => {
  const navigation = useNavigation()
  const [isloading, setisloading] = useState(false)
  const [refreshing, setrefreshing] = useState(false)
  const [page, setpage] = useState(1)
  const [notification, setnotification] = useState([])
  const [showNotiAdmin, setShowNotiAdmin] = useState({ status: false, id: null })
  const [idNotify, setIdNotify] = useState('')
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
          setpage(page)
          setnotification([...notification, ...reponse.data]);
          LayoutAnimation.easeInEaseOut();
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
          setnotification(reponse.data)
          LayoutAnimation.easeInEaseOut();
        }
      }
    } catch (error) {

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
          <Text style={styles.actionText}>{item.content}</Text>
        </View>
      </TouchableOpacity>
    )
  };

  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("notification.title")}>
      <View flex bg-white>
        <FlatList
          refreshing={refreshing}
          onRefresh={handleRefes}
          data={notification}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => <NotificationItem item={item} />}
          keyExtractor={(item) => item.id}
          style={styles.container}
        />
      </View>
      <Modal visible={showNotiAdmin.status} statusBarTranslucent transparent >
        <View flex marginH-20 marginV-40 bg-white br30 padding-10 style={{ elevation: 10 }}>
          <TouchableOpacity style={{ position: 'absolute', top: 20, right: 20 }} onPress={() => { setShowNotiAdmin({ status: false }) }}>
            <Icon assetName='cancel' size={25} />
          </TouchableOpacity>
          <View flex>
            <Text>{showNotiAdmin?.id?.content}</Text>
          </View>
        </View>
      </Modal>
    </Wapper>
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
  }
})