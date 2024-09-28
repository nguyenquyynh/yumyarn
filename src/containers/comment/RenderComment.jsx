
import { t } from 'lang';
import React, { memo, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Avatar, Text, TouchableOpacity, View } from 'react-native-ui-lib';

const RenderComment = (props) => {
  const { item, openReComment, toggleReplies, dataReComment, handleReComment, isCommentMain, page, isLoadingRecomment } = props;
  const avatar = item?.create_by?.avatar;
  const nameUser = item?.create_by?.name;
  const content = item?.content;
  const reComment = item?.countReComment;
  const paddingRecomment = {
    paddingLeft: isCommentMain ? 30 : 0
  }
  console.log(item)
  return (
    <View >
      <View flex marginT-8 row spread>
        <Avatar source={{ uri: avatar }} size={isCommentMain ? 35 : 30} />
        <View flex paddingR-15>
          <View marginL-15 style={Style.backgroundComment}>
            <Text text80BO numberOfLines={1}>
              {nameUser} {!isCommentMain && <Text text100M>{t("app.responded")} {nameUser}</Text>}
            </Text>
            <Text marginT-5 text>
              {content}
            </Text>
          </View>

          <View flex row marginT-5 marginL-15>
            <TouchableOpacity onPress={() => handleReComment(item)}>
              <Text>
                {t("app.feedback")}
              </Text>
            </TouchableOpacity>

            {reComment >= 1 && !openReComment[item._id] &&
              <TouchableOpacity onPress={() => {
                if (!isLoadingRecomment[item._id]) {
                  const returnPage = (page[item._id] || 0) + 1;
                  toggleReplies(item._id, returnPage, dataReComment)
                }
              }}>
                <Text marginL-15>{t("app.see")} {reComment} {t("app.feedback")} </Text>
              </TouchableOpacity>
            }
          </View>
        </View>
      </View>

      {
        openReComment[item._id] && (
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
              />
            )}
            ListFooterComponent={
              <View flex right>
                {reComment >= 1 &&
                  <TouchableOpacity onPress={() => {
                    if (!isLoadingRecomment[item._id]) {
                      const returnPage = (page[item._id] || 0) + 1;
                      toggleReplies(item._id, returnPage, dataReComment)
                    }
                  }}>
                    <Text>
                      {t("app.see")} {reComment} {t("app.feedback")}
                    </Text>
                  </TouchableOpacity>
                }
              </View>}
            keyExtractor={item => item._id.toString()}
          />
        )
      }
    </View>
  )
}

const Style = StyleSheet.create({
  backgroundComment: {
    width: "100%",
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#F0F0F0'
  }
})

export default memo(RenderComment)