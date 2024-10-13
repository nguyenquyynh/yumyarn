import { StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import UserRender from '../../components/searchs/UserRender'  // Import component hiển thị từng user

// Dữ liệu giả lập cho danh sách followers
const followersData = [
  {
    _id: '1',
    name: 'John Doe',
    tagName: 'johndoe',
    avatar: 'https://via.placeholder.com/150',
    isFollow: true,
  },
  {
    _id: '2',
    name: 'Jane Smith',
    tagName: 'janesmith',
    avatar: 'https://via.placeholder.com/150',
    isFollow: false,
  },
  {
    _id: '3',
    name: 'David Brown',
    tagName: 'davidbrown',
    avatar: 'https://via.placeholder.com/150',
    isFollow: true,
  }
  // Thêm nhiều người dùng nếu cần
]

const FollowerList = ({ route }) => {
  // lấy danh sách theo user truyền vào còn kiểm tra có follow hay không theo view 
  const { user, view } = route?.params || ""
  const navigation = useNavigation()

  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("profile.followers")}>
      <View flex bg-white>
        {/* Sử dụng FlatList để hiển thị danh sách followers */}
        <FlatList
          data={followersData}
          keyExtractor={(item) => item._id}  // Mỗi item cần có key duy nhất
          renderItem={({ item }) => <UserRender item={item} />}  // Hiển thị từng user
          contentContainerStyle={{ paddingVertical: 10 }}  // Đặt padding cho FlatList
        />
      </View>
    </Wapper>
  )
}

export default FollowerList

const styles = StyleSheet.create({})
