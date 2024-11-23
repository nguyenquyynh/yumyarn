import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import React, {memo, useEffect, useRef, useState} from 'react';
import {createReport, createSaved, dePost, getPost} from 'src/hooks/api/post';
import RenderPost from 'components/homes/RenderPost';
import {createFollow} from 'src/hooks/api/follow';
import {View} from 'react-native-ui-lib';
import {t} from 'lang';
import {useDispatch, useSelector} from 'react-redux';
import {resetListPost, setListPost, updateFullListPost} from 'reducers/home';
import { useIsFocused } from '@react-navigation/native';

const ListPost = props => {
  const {idUser, scrollY} = props;
  const dispatch = useDispatch();
  const listPost = useSelector(state => state.home.listPost);
  const [isLoading, setIsLoading] = useState(false);
  // const [dataPost, setDataPost] = useState([]);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [end, setEnd] = useState(false);
  const [activeItems, setActiveItems] = useState([]); // Lưu trữ ID các item đang hiển thị
  const flatListRef = useRef(null);
  const isFocused = useIsFocused();
  const socket = useSelector(state => state.fcm.socket);
  const getItemLayout = (data, index) => ({
    length: 400, // chiều cao của mỗi item
    offset: 400 * index, // offset của mỗi item
    index,
  });
  const sentItems = useRef(new Set());

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;

    const visibleItems = [];
    const windowHeight = layoutMeasurement.height;
    const contentHeight = contentSize.height;
    const offsetY = contentOffset.y;
    if (scrollY) {
      scrollY.setValue(offsetY);
    }
    // for (let i = 0; i < listPost.length; i++) {
    //   const itemHeight = 400;
    //   const itemTop = i * itemHeight;
    //   const itemBottom = itemTop + itemHeight;

    //   if (itemTop < offsetY + windowHeight && itemBottom > offsetY) {
    //     visibleItems.push(listPost[i]._id);
    //   }
    // }
    // setActiveItems(visibleItems);
  };

  // useEffect(() => {
  //   let intervalId;
  //   if(isFocused){
  //     intervalId = setInterval(() => {
  //       activeItems.forEach(async (itemId) => {
  //         try{
  //           if (!sentItems.current.has(itemId)) {
  //             sentItems.current.add(itemId);
  //             console.log(idUser)
  //             console.log(itemId)
  //             socket.emit("seenPost", { _id: idUser, idPost: itemId });
  //           }
  //         }catch(error){
  //           console.error('Error sending request', error)
  //         }
  //       });
  //     }, 4000);
  //   }

  //   return () => clearInterval(intervalId);
  // }, [activeItems,isFocused]);

  const setDataPost = data => {
    dispatch(setListPost(data));
  };
  const getPostData = async (idUser, page) => {
    try {
      const dataRequest = {
        id: idUser,
        page: page,
        startingPoint : page == 1 ? null : listPost[listPost.length - 1]?._id
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
          if (
            response.data[response.data.length - 1]._id ===
            listPost[listPost.length - 1]._id
          ) {
            return;
          }
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

  const handleFollow = async (userIdPost) => {
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

export default memo(ListPost);

const styles = StyleSheet.create({
  scrollview: {paddingTop: 50},
});
