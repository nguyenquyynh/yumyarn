import IconApp from 'components/IconApp';
import React, {memo, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  LayoutAnimation,
  Pressable,
  StyleSheet,
} from 'react-native';
import {
  Colors,
  Icon,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import InteractPost from 'components/commons/InteractPost';
import {BI, EBI} from 'configs/fonts';
import {useNavigation} from '@react-navigation/native';
import RenderVideo from './RenderVideo';
import {changeTime, transDate} from 'components/commons/ChangeMiliTopDate';
import Avatar from 'components/Avatar';
import TextApp from 'components/commons/TextApp';
import ShowComments from 'containers/comment/ShowComments';
import Modals from 'components/BottomSheetApp';
import {ReportModel} from 'src/hooks/api/Model';
import {t} from 'lang';

const optionReport = [
  {id: 1, value: 'Nội dung kích động bạo lực mạng.', content: ReportModel.WAR},
  {
    id: 2,
    value: 'Nội dung chứa hình ảnh nhạy cảm 18+.',
    content: ReportModel.NFSW,
  },
  {
    id: 3,
    value: 'Bài viết liên quan đến an toàn trẻ dưới vị thành niên.',
    content: ReportModel.KID,
  },
  {
    id: 4,
    value: 'Nội dung chia rẽ sắc tộc, tôn giáo.',
    content: ReportModel.RELIGION,
  },
  {id: 5, value: 'Bài viết chứa từ ngữ thô tục.', content: ReportModel.SUCK},
  {
    id: 6,
    value: 'Bài viết chứa nội dung không đúng sự thật.',
    content: ReportModel.FAKE,
  },
];

const {width: MAX_WIDTH} = Dimensions.get('window');
const RenderPost = memo(props => {
  const {
    item,
    listPost,
    setDataPost,
    idUser,
    handlerSave,
    handleReport,
    handlerRemove,
    handleFollow
  } = props;
  const navigation = useNavigation();
  const [readmore, setReadmore] = useState(false);
  const content = item?.content;
  const listImage = item?.media || [];
  const countFire = item?.fire;
  const countComment = item?.comments;
  const address = item?.address?.detail;
  const id = item?._id;
  const differenceInSeconds = transDate(item?.create_at);
  const isFire = item?.isFire;
  const statusSavePost = item?.isSaved;
  const userIdPost = item?.repost_by?._id
    ? item?.repost_by._id
    : item?.create_by?._id;
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState(false);
  const [openFollow, setOpenFollow] = useState(false);
  const isFollow = item?.follow;

  useEffect(() => {
    if (!openFollow) {
      setReport(false);
      LayoutAnimation.easeInEaseOut();
    }
  }, [openFollow]);
  return (
    <View paddingH-x marginB-20 bg-white style={Style.sizeContainer}>
      <View row marginB-v paddingT-10>
        <View row left flex>
          <Avatar
            source={{uri: item?.create_by?.avatar}}
            size={35}
            onPress={() => {
              navigation.navigate('OtherProfile', {
                name: item?.create_by?.name,
                _id: item?.create_by?._id,
              });
            }}
          />
          <View marginL-15>
            <View row centerV>
              <Text
                text70BO
                numberOfLines={1}
                onPress={() => {
                  navigation.navigate('OtherProfile', {
                    name: item?.create_by?.name,
                    _id: item?.create_by?._id,
                  });
                }}>
                {item?.create_by?.name}
              </Text>
              {item?.repost_by && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('OtherProfile', {
                      name: item?.repost_by?.name,
                      _id: item?.repost_by?._id,
                    });
                  }}
                  row
                  centerV>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('OtherProfile', {
                        name: item?.repost_by?.name,
                        _id: item?.repost_by?._id,
                      });
                    }}
                    row
                    centerV>
                    <Icon marginH-10 assetName="retweet" size={10} />
                    <Text text80BO>@{item?.repost_by?.tagName}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            </View>
            <TextApp
              size={12}
              style={{color: '#BEBEBE', lineHeight: 16}}
              text={item?.isVip ? 'post.ads' : changeTime(differenceInSeconds)}
            />
          </View>
        </View>
        <TouchableOpacity onPress={() => setOpenFollow(true)} row center>
          <IconApp assetName={'dots'} size={20} />
        </TouchableOpacity>
      </View>
      <Text
        text
        text85BO
        numberOfLines={!readmore ? 3 : 10000}
        onPress={() => {
          setReadmore(!readmore);
        }}>
        {content}
      </Text>
      {item?.hashtags.length != 0 && (
        <View row>
          {item?.hashtags.map(el => (
            <Text
              key={el}
              onPress={() => {
                navigation.navigate('Search', {inputkey: el});
              }}
              style={{fontFamily: EBI}}
              color={Colors.yellow}>
              #{el}{' '}
            </Text>
          ))}
        </View>
      )}
      <View row top centerV>
        <Icon assetName="location" size={12} marginR-v />
        <Text
          onPress={() => {
            navigation.navigate('SearchMap', {defaultlocation: item?.address});
          }}
          text
          numberOfLines={1}
          text90BO
          marginR-7>
          {address}
        </Text>
      </View>

      <View marginB-22 marginT-15 style={Style.borderRadiusSwiper}>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled={true}
          snapToAlignment="center"
          data={listImage}
          initialNumToRender={1}
          renderItem={data => (
            <Pressable
              onPress={() => {
                navigation.navigate('PostDetail', {id: id, defaultdata: item});
              }}
              style={{overflow: 'hidden', borderRadius: 15}}>
              {data.item.endsWith('.mp4') ? (
                <RenderVideo urlvideo={data.item} />
              ) : (
                <Image
                  source={{uri: data.item}}
                  style={Style.styleImage}
                  resizeMode="cover"
                />
              )}
            </Pressable>
          )}
          key={item => item.id}
        />
      </View>

      <InteractPost
        item={item}
        handleOpenComment={() => setOpen(true)}
        countFire={countFire}
        countComment={countComment}
        isFire={isFire}
        idUser={idUser}
      />

      <ShowComments
        open={open}
        setOpen={setOpen}
        idPost={id}
        dataPost={listPost}
        setDataPost={setDataPost}
      />

      <Modals modalVisible={openFollow} modalhiden={setOpenFollow}>
        {report ? (
          <View>
            <Text center margin-10 text80BO>
              {t('post.report_d')}
            </Text>
            <FlatList
              scrollEnabled={false}
              data={optionReport}
              keyExtractor={item => item.id}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => {
                    handleReport(item, id);
                    setReport(false);
                    LayoutAnimation.easeInEaseOut();
                  }}
                  spread
                  row
                  centerV
                  paddingV-15
                  paddingH-16
                  style={{borderBottomWidth: 0.5}}>
                  <Text text80BO>{item?.value}</Text>
                  <Icon assetName="right_arrow" size={15} />
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          <View>
            {idUser === userIdPost && (
              <TouchableOpacity
                row
                paddingV-x
                centerV
                onPress={() => {
                  navigation.navigate('EditPost', {post: post});
                  setShowmodal(false);
                }}>
                <Icon
                  assetName="edit"
                  size={33}
                  tintColor={Colors.yellow}
                  marginH-x
                />
                <View>
                  <Text style={{fontFamily: BI}}>{t('profile.edit')}</Text>
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
                  handleFollow(userIdPost);
                }}>
                <Icon
                  assetName={isFollow ? 'cancle_follow' : 'check_follow'}
                  size={33}
                  // tintColor={Colors.yellow}
                  marginH-x
                />
                <View>
                  <Text style={{fontFamily: BI}}>
                    {isFollow ? t('app.following') : t('app.follow')}
                  </Text>
                  <Text color={Colors.gray}>
                    {' '}
                    {isFollow ? t('post.unFollow_des') : t('post.follow_des')}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            {idUser !== item?.create_by?._id &&
              idUser !== item?.repost_by?._id && (
                <TouchableOpacity
                  row
                  paddingV-x
                  centerV
                  onPress={() => {
                    setReport(true);
                    LayoutAnimation.easeInEaseOut();
                  }}>
                  <Icon
                    assetName="flag"
                    size={33}
                    tintColor={Colors.yellow}
                    marginH-x
                  />
                  <View>
                    <Text style={{fontFamily: BI}}>{t('post.report')}</Text>
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
                handlerSave(userIdPost, id);
              }}>
              <Icon
                assetName="bookmark"
                size={33}
                tintColor={Colors.yellow}
                marginH-x
              />
              <View>
                <Text style={{fontFamily: BI}}>
                  {statusSavePost ? t('post.unsave') : t('post.save')}
                </Text>
                {!statusSavePost && (
                  <Text color={Colors.gray}>{t('post.save_des')}</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}
        {idUser === userIdPost ? (
          <TouchableOpacity
            row
            paddingV-x
            centerV
            onPress={() => {
              setShowmodal(false);
              handlerRemove(id);
            }}>
            <Icon
              assetName="remove"
              size={33}
              tintColor={Colors.yellow}
              marginH-x
            />
            <View>
              <Text style={{fontFamily: BI}}>{t('post.remove')}</Text>
              <Text color={Colors.gray}>{t('post.remove_d')}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </Modals>
    </View>
  );
});

export default RenderPost;

const Style = StyleSheet.create({
  outline: {
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 10,
    padding: 7,
    marginRight: 10,
  },
  borderRadiusSwiper: {
    width: '100%',
    height: 210,
    borderRadius: 20,
    overflow: 'hidden',
  },
  styleImage: {
    width: MAX_WIDTH - 20,
    width: MAX_WIDTH - 20,
    maxWidth: 480,
    height: '100%',
  },
  sizeContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    position: 'relative',
  },
});
