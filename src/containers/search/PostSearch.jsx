import { FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native-ui-lib'
import { search_post } from 'src/hooks/api/search';
import PostRender from 'components/searchs/PostRender';

const PostSearch = ({ route }) => {
  const { data, keyword } = route.params;
  const [datalist, setDatalist] = useState(data.posts.data)
  useEffect(() => {
    setDatalist(data.posts.data)
  }, [data])

  const onScrollPosts = async () => {
    const page = Math.ceil(datalist.length / 10) + 1
    const resault_post = await search_post(keyword, page)
    setDatalist([...datalist, ...resault_post.data])
  }
  return (
    <View flex bg-white paddingH-v>
      <FlatList
        onEndReached={onScrollPosts}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={datalist}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostRender item={item} />}
      />
    </View>
  )
}

export default PostSearch

const styles = StyleSheet.create({})