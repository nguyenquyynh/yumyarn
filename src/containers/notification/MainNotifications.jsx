import { StyleSheet, Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import { getNotiByUser } from 'src/hooks/api/noti'


const MainNotifications = () => {
  const navigation = useNavigation()
  const [isloading, setisloading] = useState(false)
  const [page, setpage] = useState(1)
  const [notification, setnotification] = useState([])
  const getNotifi = async (page) => {
    try {
      
      setisloading(true)
      if (!isloading) {
        const reponse = await getNotiByUser(page);
        console.log(reponse)
        if (reponse.status) {
          setpage(page)
          setnotification(reponse.data)
        }
      }
    } catch (error) {
      console.log(error);
    }finally{
      setisloading(false);
    }
  }

  useEffect(() => {
    getNotifi(1);
  }, [])


  const notifications = [
    {
      _id: '1',
      user: 'Trần Nguyễn Minh Hằng',
      content: 'mentioned you in a comment',
      avatar: require('../../assets/icon/logoyumyarn.png'),
      status: 'LIKE',
      id_post: '667f9fbbfc13ae1fdb234928',
      create_by: '669933ec3b791f5255bcf2a8'
    },
    {
      _id: '2',
      user: 'Trần dần',
      content: 'liked your post',
      avatar: require('../../assets/icon/logoyumyarn.png'),
      status: 'FOLLOW',
      id_post: '667f9fbbfc13ae1fdb234928',
      create_by: '669933ec3b791f5255bcf2a8'
    },
    {
      _id: '3',
      user: 'Trần Nguyễn Minh Hằng',
      content: 'mentioned you in a comment',
      avatar: require('../../assets/icon/logoyumyarn.png'),
      status: 'NEW',
      id_post: '667f9fbbfc13ae1fdb234928',
      create_by: '669933ec3b791f5255bcf2a8'
    },
    {
      _id: '4',
      user: 'Trần dần',
      content: 'like you in her comments',
      avatar: require('../../assets/icon/logoyumyarn.png'),
      status: 'POST',
      id_post: '667f9fbbfc13ae1fdb234928',
      create_by: '669933ec3b791f5255bcf2a8'
    },
    {
      _id: '5',
      user: 'yumyarn',
      content: 'has updated some new features',
      avatar: require('../../assets/icon/logoyumyarn.png'),
      status: 'COMMENT',
      id_post: '667f9fbbfc13ae1fdb234928',
      create_by: '669933ec3b791f5255bcf2a8'
    },
  ];

  const NotificationItem = ({ item }) => {
    console.log(item)
    const image = () => {
      if (item.status == "LIKE")
        return require('../../assets/icon/fire.png')
      else if (item.status == "FOLLOW")
        return require('../../assets/icon/check_follow.png')
      else if (item.status == "COMMENT")
        return require('../../assets/icon/comment.png')
      else if (item.status == "NEW")
        return require('../../assets/icon/alarm.png')

    }

    return (
      <View style={styles.notificationContainer}>
        <View style={styles.avater}>
          <Image source={{uri : item.avatar}} style={styles.avatar} />
          <Image source={image()} style={styles.icon} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{item.user}</Text>
          <Text style={styles.actionText}>{item.content}</Text>
        </View>

      </View>
    )
  };

  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("notification.title")}>
      <View flex bg-white>
        <FlatList
          data={notification}
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
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
  },
})