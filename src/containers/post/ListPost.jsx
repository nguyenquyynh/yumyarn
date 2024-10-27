import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  LayoutAnimation,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { createReport, createSaved, dePost, getPost } from 'src/hooks/api/post';
import ShowComments from 'containers/comment/ShowComments';
import RenderPost from 'components/homes/RenderPost';
import { createFollow } from 'src/hooks/api/follow';
import Modals from 'components/BottomSheetApp';
import { Colors, Icon, TouchableOpacity, Text, View } from 'react-native-ui-lib';
import { useNavigation } from '@react-navigation/native';
import { BI } from 'configs/fonts';
import { t } from 'lang';
import { ReportModel } from 'src/hooks/api/Model';

const optionReport = [
  { id: 1, value: "Nội dung kích động bạo lực mạng.", content: ReportModel.WAR },
  { id: 2, value: "Nội dung chứa hình ảnh nhạy cảm 18+.", content: ReportModel.NFSW },
  { id: 3, value: "Bài viết liên quan đến an toàn trẻ dưới vị thành niên.", content: ReportModel.KID },
  { id: 4, value: "Nội dung chia rẽ sắc tộc, tôn giáo.", content: ReportModel.RELIGION },
  { id: 5, value: "Bài viết chứa từ ngữ thô tục.", content: ReportModel.SUCK },
  { id: 6, value: "Bài viết chứa nội dung không đúng sự thật.", content: ReportModel.FAKE },
]

const ListPost = props => {
  const { idUser, scrollY } = props;
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataPost, setDataPost] = useState([]);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const navigation = useNavigation();
  const [userIdPost, setUserIdPost] = useState(null);
  const [isFollow, setIsFollow] = useState(false);
  const [report, setReport] = useState(false)

  const [statusSavePost, setStatusSavePost] = useState(false);
  const getPostData = async (idUser, page) => {
    try {
      const dataRequest = {
        id: idUser,
        page: page,
      };
      const response = await getPost(dataRequest);
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
      await getPostData(idUser, page);
      console.log('đã tải');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getPostData(idUser, 1);
  };

  useEffect(() => {
    if (!showmodal) {
      setReport(false)
      LayoutAnimation.easeInEaseOut()
    }
  }, [showmodal])

  useEffect(() => {
    getPostData(idUser, 1);
  }, []);

  const handleFollow = async () => {
    try {
      if (userIdPost) {
        const followUpdate = dataPost?.map(ele => {
          if (ele.create_by._id == userIdPost) {
            return { ...ele, follow: !ele.follow };
          }
          return ele;
        });
        setDataPost(followUpdate);
        const response = await createFollow(idUser, userIdPost);
        if (!response.status) {
          setDataPost(dataPost);
          ToastAndroid.show(t('app.warning'), ToastAndroid.SHORT);
        } else {
          ToastAndroid.show(t('app.success'), ToastAndroid.SHORT);
        }
      }
    } catch (error) {
      setDataPost(dataPost);
      console.log(error);
    }
  };

  const openModalFollow = (idUserCreatePost, followIs, data, statusSavePost) => {
    setPost(data);
    setIsFollow(followIs);
    setUserIdPost(idUserCreatePost);
    setStatusSavePost(statusSavePost)
    setShowmodal(true);
  };

  const handlerRemove = async () => {
    const body = {
      u: idUser,
      p: post._id,
    };

    const resault = await dePost(body);
    if (resault.status) {
      ToastAndroid.show(t('app.success'), ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(t('app.warning'), ToastAndroid.SHORT);
    }
  };

  const handlerSave = async () => {
    const resault = await createSaved({
      _id: idUser,
      post: post._id,
    });
    if (resault?.status) {
      ToastAndroid.show(t('app.success'), ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(t('app.warning'), ToastAndroid.SHORT);
    }
    // setStatusSavePost(!statusSavePost)
  };

  const handleOpenComment = data => {
    setPost(data);
    setOpen(true);
  };
  const handleReport = async (e) => {
    const resault = await createReport({
      id_post: post?._id, content: e.content
    })
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
        scrollEnabled
        data={dataPost}
        extraData={dataPost}
        onScroll={state => {
          if (scrollY) {
            scrollY.setValue(state.nativeEvent.contentOffset.y);
          }
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        key={({ index }) => index}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={() => {
          handleLoadMore(page + 1);
        }}
        onEndReachedThreshold={0.6}
        initialNumToRender={10}
        renderItem={({ item, index }) => (
          <RenderPost
            item={item}
            handleOpenComment={handleOpenComment}
            idUser={idUser}
            openModalFollow={openModalFollow}
          />
        )
        }

        ListFooterComponent={() => {
          return (
            <>
              {isLoading && (
                <ActivityIndicator
                  style={{ marginBottom: 50 }}
                  size="large"
                  color="#0000ff"
                />
              )}
              <View height={50} />
            </>
          );
        }}
      />
      {post?._id && (
        <ShowComments
          open={open}
          setOpen={setOpen}
          idPost={post?._id}
          setPost={setPost}
          dataPost={dataPost}
          setDataPost={setDataPost}
        />
      )}

      <Modals modalhiden={setShowmodal} modalVisible={showmodal}>
        {
          report ? <View>
            <Text center margin-10 text80BO>{t("post.report_d")}</Text>
            <FlatList
              scrollEnabled={false}
              data={optionReport}
              keyExtractor={item => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => {
                  handleReport(item)
                  setReport(false)
                  LayoutAnimation.easeInEaseOut()
                }} spread row centerV paddingV-15 paddingH-16 style={{ borderBottomWidth: 0.5 }}>
                  <Text text80BO>{item?.value}</Text>
                  <Icon assetName='right_arrow' size={15} />
                </TouchableOpacity>
              )}
            />
          </View>
            :
            <View>
              {idUser === userIdPost && (
                <TouchableOpacity
                  row
                  paddingV-x
                  centerV
                  onPress={() => {
                    navigation.navigate('EditPost', { post: post });
                    setShowmodal(false);
                  }}>
                  <Icon
                    assetName="edit"
                    size={33}
                    tintColor={Colors.yellow}
                    marginH-x
                  />
                  <View>
                    <Text style={{ fontFamily: BI }}>{t('profile.edit')}</Text>
                    <Text color={Colors.gray}>{t('post.edit_d')}</Text>
                  </View>
                </TouchableOpacity>
              )}
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
              {(idUser !== post?.create_by?._id && idUser !== post?.repost_by?._id) && (
                <TouchableOpacity
                  row
                  paddingV-x
                  centerV
                  onPress={() => {
                    setReport(true)
                    LayoutAnimation.easeInEaseOut()
                  }}>
                  <Icon
                    assetName="flag"
                    size={33}
                    tintColor={Colors.yellow}
                    marginH-x
                  />
                  <View>
                    <Text style={{ fontFamily: BI }}>{t('post.report')}</Text>
                    <Text color={Colors.gray}>{t('post.report_d')}</Text>
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                row
                paddingV-x
                centerV
                onPress={() => {
                  setShowmodal(false);
                  handlerSave();
                }}>
                <Icon
                  assetName="bookmark"
                  size={33}
                  tintColor={Colors.yellow}
                  marginH-x
                />
                <View>
                  <Text style={{ fontFamily: BI }}>
                    {statusSavePost ? t('post.unsave') : t('post.save')}
                  </Text>
                  {
                    !statusSavePost && (
                      <Text color={Colors.gray}>{t('post.save_des')}</Text>
                    )
                  }
                </View>
              </TouchableOpacity>
            </View>
        }
        {idUser === userIdPost ? (
          <TouchableOpacity
            row
            paddingV-x
            centerV
            onPress={() => {
              setShowmodal(false);
              handlerRemove();
            }}>
            <Icon
              assetName="remove"
              size={33}
              tintColor={Colors.yellow}
              marginH-x
            />
            <View>
              <Text style={{ fontFamily: BI }}>{t('post.remove')}</Text>
              <Text color={Colors.gray}>{t('post.remove_d')}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </Modals>
    </>
  );
};

export default memo(ListPost);

const styles = StyleSheet.create({
  scrollview: { paddingTop: 50 },
});
