import { Dimensions, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Icon, Text, View } from 'react-native-ui-lib'
import { search_user } from 'src/hooks/api/search';
import { useSelector } from 'react-redux';
import UserRender from 'components/searchs/UserRender';
import { removeSpecialCharacters } from 'src/libs/InputValidate';
import lottie from 'configs/ui/lottie';
import LottieView from 'lottie-react-native';

const windownsize = Dimensions.get('window').height
const UserSearch = ({ route }) => {
  const { data, keyword } = route.params;
  const [datalist, setDatalist] = useState(data.user.data)
  const [page, setPage] = useState(1)
  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    setDatalist(data.user.data)
  }, [data])

  const onScrollUsers = async () => {
    if (removeSpecialCharacters(keyword).trim().length > 0) {
      const resault_user = await search_user(removeSpecialCharacters(keyword), page + 1, user._id)
      if (Array.isArray(resault_user.data) && resault_user.length !== 0) {
        setPage(page + 1)
        setDatalist([...datalist, ...resault_user.data])
      }
    }
  }
  return (
    <View flex bg-white>
      <FlatList
        onEndReached={onScrollUsers}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        data={datalist}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <UserRender item={item} />}
        ListEmptyComponent={() => <View center style={{ width: '100%', height: Dimensions.get('window').height - 100 }}>
          <LottieView source={lottie.Nodata} loop={false} autoPlay style={{ width: 150, height: 150 }} />
        </View>}
      />
    </View>
  )
}

export default UserSearch

const styles = StyleSheet.create({})