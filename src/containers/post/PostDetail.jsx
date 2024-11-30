import {
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import {
  Colors,
  Icon,
  LoaderScreen,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import { useNavigation, useRoute } from '@react-navigation/native';
import MediaPost from 'components/posts/MediaPost';
import HearDetailPost from 'components/posts/HearDetailPost';
import numberFormat from 'configs/ui/format';
import { firePost } from 'src/hooks/api/fire';
import { useSelector } from 'react-redux';
import { createReport, createSaved, dePost, watchPost } from 'src/hooks/api/post';
import { EB, EBI, ELI, M } from 'configs/fonts';
import ShowComments from 'containers/comment/ShowComments';
import ShowMoreDetailPost from 'components/posts/ShowMoreDetailPost';
import ShowShareDetailPost from 'components/posts/ShowShareDetailPost';
import { t } from 'lang';
import { Model, ReportModel } from 'src/hooks/api/Model';
import Modals from 'components/BottomSheetApp';
import Avatar from 'components/Avatar';
import NotificationModalApp from 'components/commons/NotificationModalApp';
import LinearGradient from 'react-native-linear-gradient';

const PostDetail = ({ route }) => {
  const { id, _id, defaultdata } = route.params;

  const heightscreen = Dimensions.get('window').height;
  const navigation = useNavigation();
  const socket = useSelector(state => state.fcm.socket);
  const user = useSelector(state => state.auth.user);
  const [post, setPost] = useState(defaultdata);
  const [isfire, setIsfire] = useState(false);
  const [iscomment, setiscomment] = useState(false);
  const [ismore, setIsmore] = useState(false);
  const [dots, setDots] = useState(false);
  const [issaved, setissaved] = useState(false);
  const [isshare, setIsshare] = useState(false);
  const [report, setReport] = useState(false);
  const [shownoti, setShownoti] = useState(false)

  const getPost = async query => {
    const reponse = await watchPost(query);
    if (reponse.status) {
      setPost(reponse.data[0]);
      setissaved(reponse.data[0]?.isSaved);
      socket.emit("seenPost", { _id: user._id, idPost: post._id })
    }
    navigation.getParent()?.setParams({ _id: null });
    if (reponse.data.length === 0) {
      ToastAndroid.show(t('post.have_remove'), ToastAndroid.SHORT);
      navigation.goBack();
    }
  };

  const handlerRemove = async () => {
    const body = {
      u: user?._id,
      p: id ? id : _id
    }
    const resault = await dePost(body)
    if (resault.status) {
      ToastAndroid.show(t("app.success"), ToastAndroid.SHORT)
    } else {
      ToastAndroid.show(t("app.warning"), ToastAndroid.SHORT)
    }

    navigation.goBack()
  }

  useEffect(() => {
    getPost({
      u: user._id,
      p: id ? id : _id,
    });
  }, [id, _id]);
  useEffect(() => {
    setIsfire(post?.isfire);
  }, [post]);

  const handleContact = () => {
    navigation.navigate("Chating", { friend: post?.create_by })
  }
  const handleReport = async e => {
    const resault = await createReport({
      id_post: post?._id,
      content: e.content,
    });
    if (resault?.status) {
      ToastAndroid.show(t('error.reporting'), ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(t(resault?.data), ToastAndroid.SHORT);
    }
  };
  const handlerPressFire = async () => {
    const fire = await firePost(user._id, id ? id : _id);
    if (fire?.status) {
      setIsfire(fire?.data);
      setPost({
        ...post,
        isfire: fire?.data,
        fires: fire?.data ? post?.fires + 1 : post?.fires - 1,
      });
    }
  };
  const handlerPressSaved = async () => {
    setissaved(!issaved);
    const resault = await createSaved({
      _id: user?._id,
      post: post?._id,
    });
    if (resault?.status) {
      ToastAndroid.show(t('app.success'), ToastAndroid.SHORT);
    } else {
      ToastAndroid.show(t('app.warning'), ToastAndroid.SHORT);
    }
  };
  const handlerClickAvatar = () => {
    navigation.navigate('OtherProfile', {
      name: post?.create_by?.name,
      _id: post?.create_by?._id,
    });
  };

  return (
    <View flex right>
      {post ? (
        <FlatList
          style={{ width: '100%', height: '100%', backgroundColor: 'red' }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled={true}
          snapToAlignment="center"
          data={post.media}
          renderItem={item => <MediaPost data={item} />}
          key={item => item.id}
        />
      ) : (
        <View flex bg-black></View>
      )}
      <HearDetailPost
        back={() => {
          if (id) {
            navigation.goBack();
          } else {
            navigation.replace('Main')
          }
        }}
        dot={() => {
          setDots(!dots);
        }}
      />
      <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}
        locations={[0, 0.5, 1]}
        colors={['black', Colors.tr_black, Colors.transparent]}
        style={{ flex: 1, width: '100%', position: 'absolute', bottom: 0, padding: 10, maxHeight: heightscreen / 2 }}>
        <View flex row marginB-x>
          <Avatar
            source={{ uri: post?.create_by?.avatar }}
            size={40}
            onPress={handlerClickAvatar}
          />
          <TouchableOpacity onPress={handlerClickAvatar} flex marginL-v>
            <View row centerV>
              <Text style={{ fontFamily: EB }} color="white">
                {post?.create_by?.name}
              </Text>
              {post?.repost_by && (
                <View row centerV>
                  <Icon
                    marginH-10
                    assetName="retweet"
                    tintColor="white"
                    size={10}
                  />
                  <Text
                    onPress={() => {
                      navigation.navigate('OtherProfile', {
                        name: post?.repost_by?.name,
                        _id: post?.repost_by?._id,
                      });
                    }}
                    color="white">
                    @{post?.repost_by?.tagName}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{ fontFamily: ELI }}
              text80L
              numberOfLines={1}
              color="white">
              @{post?.create_by?.tagName}
            </Text>
          </TouchableOpacity>
        </View>
        {post?.hashtags.length != 0 && (
          <View row>
            {post?.hashtags.map(el => (
              <Text
                key={el}
                onPress={() => {
                  navigation.navigate('Search', { inputkey: el });
                }}
                style={{ fontFamily: EBI }}
                color={Colors.yellow}>
                #{el}{' '}
              </Text>
            ))}
          </View>
        )}
        {post?.address &&
          <View row top centerV>
            <Icon assetName="location" size={12} marginR-v />
            <Text
              onPress={() => {
                navigation.navigate('SearchMap', { defaultlocation: post?.address });
              }}
              text
              numberOfLines={1}
              text90BO
              color='red'
              marginR-7>
              {post?.address?.detail}
            </Text>
          </View>
        }
        <ScrollView style={{marginVertical: 10}}>
          <Text
            text90L
            style={{ fontFamily: M }}
            color={Colors.white}
            numberOfLines={ismore ? 10000 : 3}
            onPress={() => {
              setIsmore(!ismore);
            }}>
            {post?.content}
          </Text>
        </ScrollView>
        {post?.isVip && <TouchableOpacity marginV-5 padding-5 bg-yellow br30 style={{ borderColor: Colors.yellow, borderWidth: 1 }} onPress={handleContact}>
          <Text center text70BO color='white'>{t("post.contact")}</Text>
        </TouchableOpacity>}
        <View marginT-x paddingV-5 width={'100%'} spread row paddingH-xx>
          <TouchableOpacity row centerV onPress={handlerPressFire}>
            <Icon
              tintColor={!isfire && 'white'}
              assetName={isfire ? 'fire' : 'fire_black'}
              size={20}
            />
            <Text marginL-v text80BO color={'white'}>
              {numberFormat(post?.fires)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            row
            centerV
            onPress={() => {
              setiscomment(!iscomment);
            }}>
            <Icon tintColor="white" assetName="comment" size={20} />
            <Text marginL-v text80BO color={'white'}>
              {numberFormat(post?.comments)}
            </Text>
          </TouchableOpacity>
          <Pressable
            onPress={() => {
              setIsshare(!isshare);
            }}>
            <Icon tintColor="white" assetName={'share'} size={20} />
          </Pressable>
          {post?.create_by?._id !== user?._id && (
            <Pressable
              onPress={() => {
                setReport(true);
              }}>
              <Icon tintColor="white" assetName="flag" size={20} />
            </Pressable>
          )}
          <Pressable onPress={handlerPressSaved}>
            <Icon
              assetName="bookmark"
              tintColor={issaved ? Colors.yellow : 'white'}
              size={20}
            />
          </Pressable>
        </View>

      </LinearGradient>
      <NotificationModalApp modalhiden={setShownoti} modalVisible={shownoti} funt={handlerRemove} asseticon={'dont'} content={t('title_model.content_remove_post')} title={t('title_model.remove_post')} />
      {post && <ShowComments
        idPost={post?._id}
        setOpen={setiscomment}
        open={iscomment}
        create_by={post?.create_by}
        dataPost={[]}
        setDataPost={() => { }}
        setIdPost={() => { }}
      />}
      {post && <ShowMoreDetailPost
        disable={dots}
        setDisable={setDots}
        create_post={post?.create_by?._id}
        id_post={post?._id}
        post={post}
        setShownoti={() => setShownoti(true)}
      />}
      {post && <ShowShareDetailPost
        disable={isshare}
        setDisable={setIsshare}
        post_id={post?._id}
      />}
      <Modals modalhiden={setReport} modalVisible={report}>
        <View>
          <Text center margin-10 text80BO>
            {t('post.report_d')}
          </Text>
          <FlatList
            scrollEnabled={false}
            data={optionReport}
            keyExtractor={item => item._id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  handleReport(item);
                }}
                spread
                row
                centerV
                paddingV-15
                paddingH-16>
                <Text text80BO>{item?.value}</Text>
                <Icon assetName="right_arrow" size={15} />
              </TouchableOpacity>
            )}
          />
        </View>
      </Modals>
    </View>
  );
};

export default memo(PostDetail);
const styles = StyleSheet.create({});
var optionReport = [
  { value: 'Nội dung kích động bạo lực mạng.', content: ReportModel.WAR },
  { value: 'Nội dung chứ hình ảnh nhạy cảm 18+.', content: ReportModel.NFSW },
  {
    value: 'Bài viết liên quan đển an toàn trẻ dưới vị thành niên.',
    content: ReportModel.KID,
  },
  { value: 'Nội dung chia rẽ sắc tộc, tôn giáo.', content: ReportModel.RELIGION },
  { value: 'Bài viết chứa từ ngữ thô tục.', content: ReportModel.SUCK },
  {
    value: 'Bài viết chứa nội dung không đúng sự thật',
    content: ReportModel.FAKE,
  },
];
