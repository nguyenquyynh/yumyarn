import {ActivityIndicator, Animated, FlatList, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {getPost} from 'src/hooks/api/post';
import ShowComments from 'containers/comment/ShowComments';
import {useSelector} from 'react-redux';
import RenderPost from 'components/homes/RenderPost';
import {createFollow} from 'src/hooks/api/follow';

const ListPost = props => {
  const {
    idUser,
    setDataPost,
    dataPost,
    handleLoadMore,
    page,
    scrollY,
    isLoading,
  } = props;
  const [open, setOpen] = useState(false);
  const [idPost, setIdPost] = useState('');

  const handleFollow = async userCreatePost => {
    try {
      const followUpdate = dataPost?.map(ele => {
        if (ele.create_by._id == userCreatePost) {
          console.log(ele.follow);
          return {...ele, follow: !ele.follow};
        }

        return ele;
      });
      setDataPost(followUpdate);
      const response = await createFollow(idUser, userCreatePost);
      if (!response.status) {
        setDataPost(dataPost);
        console.log(response.data);
      }
    } catch (error) {
      setDataPost(dataPost);
      console.log(error);
    }
  };

  const handleOpenComment = id => {
    setIdPost(id);
    setOpen(true);
  };
  return (
    <>
      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        style={styles.scrollview}
        scrollEnabled
        data={dataPost}
        onScroll={state => {
          scrollY.setValue(state.nativeEvent.contentOffset.y);
        }}
        keyExtractor={item => item._id}
        onEndReached={() => {
          handleLoadMore(page + 1);
        }}
        onEndReachedThreshold={0.6}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        renderItem={({item}) => (
          <RenderPost
            item={item}
            handleOpenComment={handleOpenComment}
            idUser={idUser}
            handleFollow={handleFollow}
          />
        )}
        ListFooterComponent={() =>
          isLoading && <ActivityIndicator size="large" color="#0000ff" />
        }
      />

      {idPost && (
        <ShowComments
          open={open}
          setOpen={setOpen}
          idPost={idPost}
          setIdPost={setIdPost}
          create_by={idUser}
          dataPost={dataPost}
          setDataPost={setDataPost}
        />
      )}
    </>
  );
};

export default ListPost;

const styles = StyleSheet.create({
  scrollview: {paddingTop: 50},
});
