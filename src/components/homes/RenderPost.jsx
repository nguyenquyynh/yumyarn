import IconApp from 'components/IconApp';
import React, { memo, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet } from 'react-native';
import {
  Colors,
  Icon,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native-ui-lib';
import InteractPost from 'components/commons/InteractPost';
import { EBI } from 'configs/fonts';
import { useNavigation } from '@react-navigation/native';
import RenderVideo from './RenderVideo';
import { changeTime, transDate } from 'components/commons/ChangeMiliTopDate';
import Avatar from 'components/Avatar';
import TextApp from 'components/commons/TextApp';

const { width: MAX_WIDTH } = Dimensions.get('window');
const RenderPost = memo(props => {
  const { item, handleOpenComment, idUser, openModalFollow } =
    props;
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

  return (
    <View paddingH-x marginB-20 bg-white style={Style.sizeContainer}>
      <View row marginB-v paddingT-10>
        <View row left flex>
          <Avatar
            source={{ uri: item?.create_by?.avatar }}
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
                <TouchableOpacity onPress={() => { navigation.navigate('OtherProfile', { name: item?.repost_by?.name, _id: item?.repost_by?._id }) }} row centerV>
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
            <TextApp size={12} style={{ color: '#BEBEBE', lineHeight: 16 }} text={item?.isVip ? "post.ads" : changeTime(differenceInSeconds)} />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            openModalFollow(
              item?.repost_by?._id ? item?.repost_by._id : item?.create_by?._id,
              item?.follow,
              item,
              statusSavePost
            );
          }}
          row
          center>
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
                navigation.navigate('Search', { inputkey: el });
              }}
              style={{ fontFamily: EBI }}
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
            navigation.navigate('SearchMap', { defaultlocation: item?.address });
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
                navigation.navigate('PostDetail', { id: id, defaultdata: item });
              }}
              style={{ overflow: 'hidden', borderRadius: 15 }}>
              {data.item.endsWith('.mp4') ? (
                <RenderVideo urlvideo={data.item} />
              ) : (
                <Image
                  source={{ uri: data.item }}
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
        handleOpenComment={handleOpenComment}
        countFire={countFire}
        countComment={countComment}
        isFire={isFire}
        idUser={idUser}
      />
      {/* <Modal visible={true} >
      <NotificationModalApp modalhiden={setShownoti} modalVisible={shownoti} funt={handlerRemove} asseticon={'dont'} content={t('title_model.content_remove_post')} title={t('title_model.remove_post')} />
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
      </Modal> */}

    </View>

  );
})

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
    overflow: 'hidden'
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
