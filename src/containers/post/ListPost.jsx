import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {createReport, createSaved, dePost, getPost} from 'src/hooks/api/post';
import RenderPost from 'components/homes/RenderPost';
import {createFollow} from 'src/hooks/api/follow';
import {View} from 'react-native-ui-lib';
import {t} from 'lang';
import {useDispatch, useSelector} from 'react-redux';
import {resetListPost, setListPost, updateFullListPost} from 'reducers/home';

const ListPost = props => {
  const {idUser, scrollY, gotoDetail} = props;
  const dispatch = useDispatch();
  const listPost = useSelector(state => state.home.listPost);
  const [isLoading, setIsLoading] = useState(false);
  // const [dataPost, setDataPost] = useState([]);

  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [end, setEnd] = useState(false);
  const flatListRef = useRef(null);
  const socket = useSelector(state => state.fcm.socket);

  const [viewedPosts, setViewedPosts] = useState(new Set());
  const timeoutRefs = useRef({});

  const handleScroll = useCallback(
    event => {
      const {contentOffset} = event.nativeEvent;
      const offsetY = contentOffset.y;

      if (scrollY) {
        scrollY.setValue(offsetY);
      }
    },
    [scrollY],
  );

  const onViewableItemsChanged = useCallback(
    ({viewableItems}) => {
      const visiblePostIds = new Set(viewableItems.map(item => item.item._id));

      // Xóa các timer của bài viết không còn trong vùng xem
      const postIds = Object.keys(timeoutRefs.current);
      for (const postId of postIds) {
        if (!visiblePostIds.has(postId) && timeoutRefs?.current[postId]) {
          clearTimeout(timeoutRefs.current[postId]);
          timeoutRefs.current[postId] = null;
        }
      }
      viewableItems.forEach(item => {
        const postId = item.item._id;
        if (!timeoutRefs.current[postId] && !viewedPosts.has(postId)) {
          handleViewPost(postId);
        }
      });
    },
    [handleViewPost, viewedPosts],
  );

  const handleViewPost = useCallback(
    postId => {
      timeoutRefs.current[postId] = setTimeout(() => {
        setViewedPosts(
          prevViewedPosts => new Set([...prevViewedPosts, postId]),
        );
        socket.emit('seenPost', {_id: idUser, idPost: postId});
        clearTimeout(timeoutRefs.current[postId]);
      }, 4000);
    },
    [viewedPosts],
  );

  useEffect(() => {
    //khi unmount thì hủy việc theo dõi lại
    return () => {
      for (const timerId in timeoutRefs.current) {
        clearTimeout(timeoutRefs.current[timerId]);
      }
    };
  }, []);

  const setDataPost = data => {
    dispatch(setListPost(data));
  };
  const getPostData = async (idUser, page) => {
    try {
      const dataRequest = {
        id: idUser,
        page: page,
        startingPoint: page == 1 ? null : listPost[listPost.length - 1]?.create_at,
      };
      const response = await getPost(dataRequest);
      if (response.status) {
        if (response.data.length == 0 && page != 1) {
          setEnd(true);
        } else if (page == 1) {
          dispatch(resetListPost());
          dispatch(setListPost(response.data));
          setPage(page);
        } else {
          dispatch(setListPost(response.data));
          setPage(page);
        }
      } else {
        setEnd(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = async page => {
    if (!isLoading && !end) {
      setIsLoading(true);
      await getPostData(idUser, page);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setEnd(false);
    await getPostData(idUser, 1);
  };

  useEffect(() => {
    getPostData(idUser, 1);
  }, []);

  const handleFollow = async userIdPost => {
    try {
      if (userIdPost) {
        const followUpdate = listPost?.map(ele => {
          if (ele.create_by._id == userIdPost) {
            return {...ele, follow: !ele.follow};
          }
          return ele;
        });

        const response = await createFollow(idUser, userIdPost);
        if (!response.status) {
          ToastAndroid.show(t('app.warning'), ToastAndroid.SHORT);
        } else {
          dispatch(updateFullListPost(followUpdate));
          ToastAndroid.show(t('app.success'), ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlerRemove = async postId => {
    const body = {
      u: idUser,
      p: postId,
    };

    const resault = await dePost(body);
    if (resault.status) {
      ToastAndroid.show(t('app.success'), ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(t('app.warning'), ToastAndroid.SHORT);
    }
  };

  const handlerSave = async (userIdPost, postId) => {
    if (userIdPost) {
      const savePostUpdate = listPost?.map(ele => {
        if (ele.create_by._id == userIdPost) {
          return {...ele, isSaved: !ele.isSaved};
        }
        return ele;
      });

      const resault = await createSaved({
        _id: idUser,
        post: postId,
      });
      if (resault?.status) {
        dispatch(updateFullListPost(savePostUpdate));
        ToastAndroid.show(t('app.success'), ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(t('app.warning'), ToastAndroid.SHORT);
      }
      // setStatusSavePost(!statusSavePost)
    }
  };

  const handleReport = async (e, postId) => {
    const resault = await createReport({
      id_post: postId,
      content: e.content,
    });
    if (resault?.status) {
      ToastAndroid.show(t('error.reporting'), ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(t(resault?.data), ToastAndroid.SHORT);
    }
  };

  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={styles.scrollview}
        data={listPost}
        extraData={listPost}
        ref={flatListRef}
        // getItemLayout={getItemLayout}
        onScroll={handleScroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        key={({index}) => index}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={() => {
          handleLoadMore(page + 1);
        }}
        onEndReachedThreshold={0.6}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 80, // Thay đổi nếu cần
        }}
        renderItem={({item, index}) => (
          <RenderPost
            item={item}
            idUser={idUser}
            listPost={listPost}
            setDataPost={setDataPost}
            handlerSave={handlerSave}
            handleReport={handleReport}
            handlerRemove={handlerRemove}
            handleFollow={handleFollow}
            gotoDetail={gotoDetail}
          />
        )}
        ListFooterComponent={() => {
          return (
            <>
              {isLoading && (
                <ActivityIndicator
                  style={{marginBottom: 50}}
                  size="large"
                  color="#0000ff"
                />
              )}
              <View height={50} />
            </>
          );
        }}
      />
    </>
  );
};

export default ListPost;

const styles = StyleSheet.create({
  scrollview: {paddingTop: 50},
});
