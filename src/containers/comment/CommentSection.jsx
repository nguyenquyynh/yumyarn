import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import RenderComment from './RenderComment';
import {getReComment} from 'src/hooks/api/comment';
import {useSharedValue, withSpring} from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';
import {t} from 'lang';
import { Text } from 'react-native-ui-lib';

const CommentSection = ({
  dataComment,
  setParent,
  parent,
  dataReComment,
  setDataReComment,
  openReComment,
  setOpenReComment,
  isLoading,
  handleLoadMore,
  setDataComment,
  setOpen
}) => {
  const {width: MAX_WIDTH, height: MAX_HEIGHT} = Dimensions.get('screen');
  const [page, setPage] = useState({});
  const [isLoadingRecomment, setIsLoadingRecomment] = useState({});
  //xem thêm những tin nhắn
  const toggleReplies = useCallback(
    async (id, page, dataReComment) => {
      try {
        setIsLoadingRecomment(prev => ({
          ...prev,
          [id]: true,
        }));
        const getReCommentIndata = dataReComment[id];
        const startingPoint = getReCommentIndata?.length
          ? getReCommentIndata[getReCommentIndata?.length - 1]._id
          : null;

        const dataRecommentParams = {
          parent: id,
          startingPoint: startingPoint,
        };
        const response = await getReComment(dataRecommentParams);
        if (response.status) {
          setOpenReComment(prev => {
            if (prev[id]) {
              return prev;
            }
            return {...prev, [id]: !prev[id]};
          });

          // Cập nhật dataReComment
          setDataReComment(prev => {
            // Tạo bản sao của dataReComment với phản hồi mới
            const updatedComments = {
              ...prev,
              [id]: [...(prev[id] || []), ...response.data],
            };

            // Tìm bình luận cha và cập nhật số lượng phản hồi
            const updatedDataReComment = Object.keys(updatedComments).reduce(
              (acc, parentId) => {
                acc[parentId] = updatedComments[parentId].map(comment => {
                  if (comment._id === id) {
                    return {
                      ...comment,
                      countReComment:
                        comment.countReComment - response.data.length,
                    };
                  }
                  return comment;
                });
                return acc;
              },
              {},
            );
            return updatedDataReComment;
          });

          setDataComment(prev =>
            prev.map(ele => {
              if (ele?._id === id) {
                return {
                  ...ele,
                  countReComment: ele.countReComment - response?.data?.length,
                };
              }
              return {...ele};
            }),
          );

          setPage(prev => ({
            ...prev,
            [id]: page,
          }));
        } else {
          console.error(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingRecomment(prev => ({
          ...prev,
          [id]: false,
        }));
      }
    },
    [openReComment, page],
  );

  const handleReComment = item => {
    setParent(item);
  };

  const heightFlatlist = {
    height: parent
      ? MAX_HEIGHT > MAX_WIDTH
        ? MAX_HEIGHT * 0.6
        : MAX_HEIGHT * 0.35
      : MAX_HEIGHT > MAX_WIDTH
      ? MAX_HEIGHT * 0.6
      : MAX_HEIGHT * 0.4,
    paddingHorizontal: 10,
    marginBottom: 10,
  };

  return (
    <FlatList
      style={heightFlatlist}
      data={dataComment}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => (
        <RenderComment
          item={item}
          openReComment={openReComment}
          dataReComment={dataReComment}
          toggleReplies={toggleReplies}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          handleReComment={handleReComment}
          isCommentMain={true}
          isLoadingRecomment={isLoadingRecomment}
          page={page}
          setOpen={setOpen}
        />
      )}
      onEndReached={handleLoadMore} // Gọi hàm khi kéo tới cuối danh sách
      onEndReachedThreshold={0.5}
      keyExtractor={item => item._id}
      ListEmptyComponent={
        <View style={{width: '100%', alignItems: 'center'}}>
          <Text color="black">{t('app.firstComment')}</Text>
        </View>
      }
      ListFooterComponent={() =>
        isLoading && <ActivityIndicator size="large" color="#0000ff" />
      }
      scrollEventThrottle={16}
    />
  );
};

export default CommentSection;
