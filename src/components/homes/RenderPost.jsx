import IconApp from 'components/IconApp';
import React, { memo } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet } from 'react-native';
import { Avatar, Colors, Icon, Image, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import ReadMore from 'react-native-read-more-text';
import Video from 'react-native-video';
import ChangeTimeApp from 'components/commons/ChangeTimeApp';
import InteractPost from 'components/commons/InteractPost';
import { EBI, ELI } from 'configs/fonts';
import { t } from 'i18next';

const { width: MAX_WIDTH } = Dimensions.get('window');
const RenderPost = props => {
  const { item, handleOpenComment, idUser, handleFollow } = props;
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
        <Text onPress={handlePress}>{t("app.hiden")}</Text>
        <View row centerV>
          <Icon assetName='location' size={20} marginR-v/>
          <Text text text80BO marginL-2>
            {address}
          </Text>
        </View>
      </View>
    );
  };
  const renderTruncatedFooter = handlePress => {
    return <Text onPress={handlePress}>{t("app.more")}</Text>;
  };

  return (
    <View paddingH-x marginB-25 bg-white style={Style.sizeContainer}>
      <View row marginB-xv paddingT-10>
        <View row center flex>
          <Avatar source={{ uri: item?.create_by?.avatar }} size={35} />
          <View marginL-15 flex>
            <Text text70BO numberOfLines={1}>
              {item?.create_by?.name}
            </Text>
            <ChangeTimeApp second={differenceInSeconds} />
          </View>
        </View>

        <View row center>
          <IconApp assetName={'dots'} size={20} />
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
      {item?.hashtags.length != 0 &&
        <Text style={{ fontFamily: EBI }} numberOfLines={1} color={Colors.yellow}>{item?.hashtags.map((el) => `#${el} `)}</Text>
      }
      <TouchableOpacity marginB-22 marginT-15 style={Style.borderRadiusSwiper}>
        <FlatList
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal
          pagingEnabled={true}
          snapToAlignment="center"
          data={listImage}
          renderItem={data => (
            <View flex style={{ overflow: 'hidden', borderRadius: 20 }}>
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
            </View>
          )}
          key={item => item.id}
        />
      </TouchableOpacity>

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
