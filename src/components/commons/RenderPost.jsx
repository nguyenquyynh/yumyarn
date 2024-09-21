import IconApp from 'components/IconApp';
import React, {memo, useState} from 'react';
import {Dimensions, FlatList, Pressable, StyleSheet} from 'react-native';
import {Avatar, Image, Text, View} from 'react-native-ui-lib';
import ReadMore from 'react-native-read-more-text';
import Video from 'react-native-video';
import ChangeTimeApp from 'components/commons/ChangeTimeApp';
import InteractPost from './InteractPost';
import {createFollow} from 'src/hooks/api/follow';
const {width: MAX_WIDTH} = Dimensions.get('window');
const RenderPost = props => {
  const {item, handleOpenComment, idUser, handleFollow} = props;
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
  const userCreatePost = item.create_by._id;
  const followStatus = item?.follow;

  const renderRevealedFooter = handlePress => {
    return (
      <View>
        <View row>
          <IconApp
            assetName={'location'}
            size={15}
            props={{alignSelf: 'center'}}
          />
          <Text text text70BO marginL-2>
            {address}
          </Text>
        </View>
        <Text onPress={handlePress}>Ẩn bớt</Text>
      </View>
    );
  };

  const renderTruncatedFooter = handlePress => {
    return <Text onPress={handlePress}>Xem thêm</Text>;
  };

  return (
    <View paddingH-12 marginB-20 bg-white style={Style.sizeContainer}>
      <View row spread marginB-28 paddingH-11 paddingT-10>
        <View row center flex>
          <Avatar source={{uri: item?.create_by?.avatar}} size={40} />
          <View marginL-15 flex>
            <Text xviText text60BO numberOfLines={1}>
              {item?.create_by?.name}
            </Text>

            <ChangeTimeApp second={differenceInSeconds} />
          </View>
        </View>

        <View row center>
          {followStatus !== 'you' && (
            <Pressable
              style={Style.outline}
              onPress={() => handleFollow(userCreatePost)}>
              <Text text text70BO>
                {followStatus ? 'Đang theo dõi' : 'Theo dõi'}
              </Text>
            </Pressable>
          )}
          <IconApp assetName={'dots'} size={24} />
        </View>
      </View>

      <ReadMore
        numberOfLines={3}
        renderTruncatedFooter={renderTruncatedFooter}
        renderRevealedFooter={renderRevealedFooter}>
        <Text text text85BO>
          {content}
        </Text>
      </ReadMore>

      <View marginB-22 marginT-15 style={Style.borderRadiusSwiper}>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled={true}
          snapToAlignment="center"
          data={listImage}
          renderItem={data => (
            <View flex style={{overflow: 'hidden', borderRadius: 20}}>
              {data.item.endsWith('.mp4') ? (
                <Video
                  source={{uri: data.item}}
                  style={Style.styleImage}
                  resizeMode="cover"
                  paused
                  controls
                />
              ) : (
                <Image
                  source={{uri: data.item}}
                  style={Style.styleImage}
                  resizeMode="cover"
                />
              )}
            </View>
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
    borderRadius: 20,
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
