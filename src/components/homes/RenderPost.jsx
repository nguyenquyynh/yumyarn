import IconApp from 'components/IconApp';
import React, { memo, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet } from 'react-native';
import { Avatar, Colors, Icon, Image, Text, View } from 'react-native-ui-lib';
import Video from 'react-native-video';
import ChangeTimeApp from 'components/commons/ChangeTimeApp';
import InteractPost from 'components/commons/InteractPost';
import { EBI, ELI } from 'configs/fonts';
import { t } from 'i18next';
import { useNavigation } from '@react-navigation/native';

const { width: MAX_WIDTH } = Dimensions.get('window');
const RenderPost = props => {
  const { item, handleOpenComment, idUser, handleFollow } = props;
  const navigation = useNavigation()
  const [readmore, setReadmore] = useState(false)

  const content = item?.content;
  const listImage = item?.media || [];
  const countFire = item?.fire;
  const countComment = item?.comments;
  const address = item?.address?.detail;
  const id = item?._id;
  const dateNow = new Date();
  const datePast = new Date(parseInt(item?.update_at));
  const differenceInMilliseconds = dateNow - datePast;
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
  const isFire = item.isFire;

  return (
    <View paddingH-x marginB-25 bg-white style={Style.sizeContainer}>
      <View row marginB-xv paddingT-10>
        <View row left flex>
          <Avatar source={{ uri: item?.create_by?.avatar }} size={35} onPress={() => { navigation.navigate('OtherProfile', { name: item?.create_by?.name }) }} />
          <View marginL-15>
            <Text text70BO numberOfLines={1} onPress={() => { navigation.navigate('OtherProfile', { name: item?.create_by?.name }) }}>
              {item?.create_by?.name}
            </Text>
            <ChangeTimeApp second={differenceInSeconds} />
          </View>
        </View>
        <View row center>
          <IconApp assetName={'dots'} size={20} />
        </View>
      </View>
      <Text text text85BO numberOfLines={!readmore ? 3 : 10000} onPress={() => { setReadmore(!readmore) }} >{content}</Text>
      {item?.hashtags.length != 0 &&
        <View row>
          {item?.hashtags.map((el) => (<Text key={el} onPress={() => { navigation.navigate('Search', { inputkey: el }) }} style={{ fontFamily: EBI }} color={Colors.yellow}>#{el} </Text>))}
        </View>

      }
      <View row top centerV>
        <Icon assetName='location' size={12} marginR-v />
        <Text onPress={() => { navigation.navigate('SearchMap', { defaultlocation: item?.address }) }} text text90BO marginL-2>
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
          renderItem={data => (
            <Pressable onPress={() => { navigation.navigate('PostDetail', { id: id }) }} style={{ overflow: 'hidden', borderRadius: 15, marginRight: 5 }}>
              {data.item.endsWith('.mp4') ? (
                <Video
                  source={{ uri: data.item }}
                  style={Style.styleImage}
                  resizeMode="cover"
                  paused
                  controls={false}
                />
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
        id={id}
        handleOpenComment={handleOpenComment}
        countFire={countFire}
        countComment={countComment}
        isFire={isFire}
        idUser={idUser}
      />
    </View>
  );
};

export default memo(RenderPost);

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
  },
  styleImage: {
    width: MAX_WIDTH - 24,
    height: '100%',
  },
  sizeContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    position: 'relative',
  },
});
