import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  LayoutAnimation,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { createSaved, getPostSaved } from 'src/hooks/api/post';
import ShowComments from 'containers/comment/ShowComments';
import RenderPost from 'components/homes/RenderPost';
import { createFollow } from 'src/hooks/api/follow';
import Modals from 'components/BottomSheetApp';
import { Colors, Icon, TouchableOpacity, Text, View } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { BI } from 'configs/fonts';
import { t } from 'lang';
import Wapper from 'components/Wapper';
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import lottie from 'configs/ui/lottie';

const PostSaved = (props) => {
  const { scrollY } = props;
  const idUser = useSelector(state => state.auth.user?._id)
  const [open, setOpen] = useState(false);
  const [idPost, setIdPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dataPost, setDataPost] = useState([]);
  const [post, setPost] = useState({})
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const navigation = useNavigation();
  const [userIdPost, setUserIdPost] = useState(null);
  const [isFollow, setIsFollow] = useState(false);

  const getPostData = async (idUser, page) => {
    try {
      const dataRequest = {
        id: idUser,
        page: page,
      };
      const response = await getPostSaved(dataRequest);
      if (response.status && response.data.length > 0) {
        if (page == 1) {
          setDataPost(response.data);
          setPage(page);
        } else {
          if (
            response.data[response.data.length - 1]._id ===
            dataPost[dataPost.length - 1]._id
          ) {
            return;
          }
          setDataPost(prev => [...prev, ...response.data]);
          setPage(page);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = async page => {
    if (!isLoading) {
      setIsLoading(true);
      setPage(page)
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getPostData(idUser, 1);
  };

  useEffect(() => {
    getPostData(idUser, 1);
  }, []);

  const handleFollow = async () => {
    try {
      if (userIdPost) {
        const followUpdate = dataPost?.map(ele => {

          if (ele?.create_by?._id == userIdPost) {
            return { ...ele, follow: !ele.follow };
          }

          return ele;
        });
        setDataPost(followUpdate);
        const response = await createFollow(idUser, userIdPost);
        if (!response.status) {
          setDataPost(dataPost);
        }
      } else {
        Alert.alert('Thông báo', 'Không tìm thấy');
      }
    } catch (error) {
      setDataPost(dataPost);
      console.log(error);
    }
  };

  const openModalFollow = (idUserCreatePost, followIs, idPost) => {
    setIdPost(idPost);
    setIsFollow(followIs);
    setUserIdPost(idUserCreatePost);
    setShowmodal(true);
  };

  const handleOpenComment = id => {
    setIdPost(id);
    setOpen(true);
  };

  const handlerUnSave = async () => {
    const resault = await createSaved({
      _id: idUser,
      post: idPost?._id
    })
    if (resault.status) {
      ToastAndroid.show(t("app.success"), ToastAndroid.SHORT)
      setDataPost(dataPost.filter((item) => item.post._id != idPost._id))
      LayoutAnimation.easeInEaseOut()
    } else {
      ToastAndroid.show(t("app.warning"), ToastAndroid.SHORT)
    }
  }
  return (
    <Wapper renderleft funtleft={() => navigation.goBack()} title={t("setting.saved")}>
      <View flex bg-white>
        <Animated.FlatList
          showsVerticalScrollIndicator={false}
          style={styles.scrollview}
          scrollEnabled
          data={dataPost}
          onScroll={state => {
            if (scrollY) {
              scrollY.setValue(state.nativeEvent.contentOffset.y);
            }
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={item => item._id}
          onEndReached={() => {
            handleLoadMore(page + 1);
          }}
          onEndReachedThreshold={0.6}
          initialNumToRender={2}
          maxToRenderPerBatch={2}
          renderItem={({ item }) => (
            <RenderPost
              item={item.post}
              handleOpenComment={handleOpenComment}
              idUser={idUser}
              openModalFollow={openModalFollow}
              setPost={setPost}
            />
          )}
          ListFooterComponent={() =>
            isLoading && (
              <ActivityIndicator
                style={{ marginBottom: 50 }}
                size="large"
                color="#0000ff"
              />
            )
          }
          ListEmptyComponent={() => <View center style={{ width: '100%', height: Dimensions.get('window').height - 100 }}>
            <LottieView source={lottie.Nodata} loop={false} autoPlay style={{ width: 150, height: 150 }} />
          </View>}
        />

        {idPost && (
          <ShowComments
            open={open}
            setOpen={setOpen}
            idPost={idPost}
            setIdPost={setIdPost}
            dataPost={dataPost}
            setDataPost={setDataPost}
          />
        )}
      </View>
      <Modals modalhiden={setShowmodal} modalVisible={showmodal}>
        {idUser !== userIdPost && (
          <TouchableOpacity
            row
            paddingV-x
            centerV
            onPress={() => {
              setShowmodal(false);
              handleFollow();
            }}>
            <Icon
              assetName={isFollow ? 'cancle_follow' : 'check_follow'}
              size={33}
              // tintColor={Colors.yellow}
              marginH-x
            />
            <View>
              <Text style={{ fontFamily: BI }}>
                {isFollow ? t('app.following') : t('app.follow')}
              </Text>
              <Text color={Colors.gray}>
                {' '}
                {isFollow ? t('post.unFollow_des') : t('post.follow_des')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          row
          paddingV-x
          centerV
          onPress={() => {
            setShowmodal(false);
            handlerUnSave()
          }}>
          <Icon
            assetName="bookmark"
            size={33}
            tintColor={Colors.yellow}
            marginH-x
          />
          <View>
            <Text style={{ fontFamily: BI }}>{t('post.unsave')}</Text>
            <Text color={Colors.gray}>{t('post.unsave_des')}</Text>
          </View>
        </TouchableOpacity>
      </Modals>
    </Wapper>
  )
}

export default PostSaved

const styles = StyleSheet.create({

})