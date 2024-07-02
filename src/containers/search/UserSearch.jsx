import { FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native-ui-lib'
import UserRender from 'components/commons/UserRender';

const UserSearch = ({ route }) => {
  const { data, setdata } = route.params;
  const [datalist, setDatalist] = useState(data.user.data)

  useEffect(() => {
    setDatalist(data.user.data)
  }, [data])

  return (
    <View flex bg-white>
      <FlatList
        data={datalist}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <UserRender item={item}/>}
      />
    </View>
  )
}

export default UserSearch

const styles = StyleSheet.create({})