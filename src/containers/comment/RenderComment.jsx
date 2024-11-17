import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import Avatar from 'components/Avatar';
import { changeTime, transDate } from 'components/commons/ChangeMiliTopDate';
import { t } from 'lang';
import React, { memo, useState } from 'react';
import { FlatList, StyleSheet, ToastAndroid } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';

const RenderComment = props => {
  const {
    item,
    openReComment,
    toggleReplies,
    dataReComment,
    handleReComment,
    isCommentMain,
    page,
    isLoadingRecomment,
    setOpen,
  } = props;
  const avatar = item?.create_by?.avatar;
  const nameUser = item?.create_by?.name;
  const content = item?.content;
  const reComment = item?.countReComment;
  const nameParent = item?.parent?.create_by?.name;
  const create_at = transDate(item?.create_at);
  const paddingRecomment = {
    paddingLeft: isCommentMain ? 30 : 0,
  };
  const navigation = useNavigation();
  const [more, setMore] = useState(false)

  const handleLongPress = () => {
    ToastAndroid.show(t('app.success_copy'), ToastAndroid.SHORT);
    Clipboard.setString(item?.content);
  };

  return (
    <View>
      <View flex marginT-8 row spread>
        <Avatar
          onPress={() => {
            setOpen(false);
            navigation.navigate('OtherProfile', {
              name: nameUser,
              _id: item?.create_by?._id,
            });
          }}
          source={{ uri: avatar }}
          size={isCommentMain ? 35 : 30}
        />
        <View flex paddingR-15>
          <View
            marginL-15
            style={Style.backgroundComment}>
            <Text text80BO numberOfLines={1}>
              {nameUser}{' '}
              {!isCommentMain && (
                <Text text100M>
                  {t('app.responded')} {nameParent}
                </Text>
              )}
            </Text>
            <TouchableOpacity onPress={() => { setMore(!more) }} onLongPress={handleLongPress}>
              <Text marginV-5 text numberOfLines={more ? 10000 : 3}>
                {content}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            flex
            row
            marginT-5
            marginL-15
            gap-20
            style={{ alignItems: 'center' }}>
            <Text>{changeTime(create_at)}</Text>
            <TouchableOpacity onPress={() => handleReComment(item)}>
              <Text>{t('app.feedback')}</Text>
            </TouchableOpacity>

            {reComment >= 1 && !openReComment[item._id] && (
              <TouchableOpacity
                onPress={() => {
                  if (!isLoadingRecomment[item._id]) {
                    const returnPage = (page[item._id] || 0) + 1;
                    toggleReplies(item._id, returnPage, dataReComment);
                  }
                }}>
                <Text>
                  {t('app.more')}
                  {/* {reComment} {t('app.feedback')}{' '} */}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {openReComment[item._id] && (
        <FlatList
          style={paddingRecomment}
          scrollEnabled={false}
          data={dataReComment[item._id] || []}
          renderItem={({ item }) => (
            <RenderComment
              item={item}
              openReComment={openReComment}
              dataReComment={dataReComment}
              toggleReplies={toggleReplies}
              handleReComment={handleReComment}
              isCommentMain={false}
              page={page}
              isLoadingRecomment={isLoadingRecomment}
              setOpen={setOpen}
            />
          )}
          ListFooterComponent={
            <View flex right>
              {reComment >= 1 && (
                <TouchableOpacity
                  onPress={() => {
                    if (!isLoadingRecomment[item._id]) {
                      const returnPage = (page[item._id] || 0) + 1;
                      toggleReplies(item._id, returnPage, dataReComment);
                    }
                  }}>
                  <Text>{t('app.more')}</Text>
                </TouchableOpacity>
              )}
            </View>
          }
          keyExtractor={item => item._id.toString()}
        />
      )}
    </View>
  );
};

const Style = StyleSheet.create({
  backgroundComment: {
    width: '100%',
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#F0F0F0',
  },
});

export default memo(RenderComment);
