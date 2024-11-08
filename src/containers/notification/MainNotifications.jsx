import { StyleSheet, Image, FlatList, LayoutAnimation } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import { getNotiByUser } from 'src/hooks/api/noti'


const MainNotifications = () => {
  const navigation = useNavigation()
  const [isloading, setisloading] = useState(false)
  const [refreshing, setrefreshing] = useState(false)
  const [page, setpage] = useState(1)
  const [notification, setnotification] = useState([])
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
      if (item.status === ('COMMENT' || 'LIKE')) navigation.navigate('PostDetail', { id: item?.id_post })
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