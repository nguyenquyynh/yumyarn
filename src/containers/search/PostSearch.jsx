import { FlatList, StyleSheet } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { Text, View } from 'react-native-ui-lib'
import { search_post } from 'src/hooks/api/search';
import PostRender from 'components/searchs/PostRender';
import { removeSpecialCharacters } from 'src/libs/InputValidate';

const PostSearch = ({ route }) => {
  const { data, keyword } = route.params;
  const [page, setPage] = useState(1)
  const [datalist, setDatalist] = useState(data.posts.data)
  useEffect(() => {
    setDatalist(data.posts.data)
  }, [data])

  const onScrollPosts = async () => {
    if (removeSpecialCharacters(keyword).trim().length > 0) {
      const resault_post = await search_post(removeSpecialCharacters(keyword), page + 1)
      if (Array.isArray(resault_post.data) && resault_post.data.length !== 0) {
        setPage(page + 1)
        setDatalist([...datalist, ...resault_post.data])
      }

    }
  }
  return (
    <View flex bg-white paddingH-v>
      <FlatList
        onEndReached={onScrollPosts}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        data={datalist}
        key={(item) => item._id}
        renderItem={({ item }) => {
          return <PostRender key={item?._id} item={item} />
        }}
      />
    </View>
  )
}

export default memo(PostSearch)

const styles = StyleSheet.create({})