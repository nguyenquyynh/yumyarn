import { FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native-ui-lib'
import { search_user } from 'src/hooks/api/search';
import { useSelector } from 'react-redux';
import UserRender from 'components/searchs/UserRender';
import { removeSpecialCharacters } from 'src/libs/InputValidate';

const UserSearch = ({ route }) => {
  const { data, navigation, keyword } = route.params;
  const [datalist, setDatalist] = useState(data.user.data)
  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    setDatalist(data.user.data)
  }, [data])

  const onScrollUsers = async () => {
    if (removeSpecialCharacters(keyword).trim().length > 0) {
      const page = Math.ceil(datalist.length / 10) + 1
      const resault_user = await search_user(removeSpecialCharacters(keyword), page, user._id)
      setDatalist([...datalist, ...resault_user.data])
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
      />
    </View>
  )
}

export default UserSearch

const styles = StyleSheet.create({})