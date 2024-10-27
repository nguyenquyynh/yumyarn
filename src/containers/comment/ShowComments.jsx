import {Alert, LayoutAnimation, StyleSheet, TextInput} from 'react-native';
import React, {memo, useEffect, useLayoutEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native-ui-lib';
import IconApp from 'components/IconApp';
import Modals from 'components/BottomSheetApp';
import {createComment, getListComment} from 'src/hooks/api/comment';
import CommentSection from './CommentSection';
import {t} from 'lang';
import {useSelector} from 'react-redux';

const ShowComments = props => {
  const {idPost, setOpen, open, dataPost, setDataPost, setPost} = props;
  const create_by = useSelector(state => state.auth.user);
  const [dataComment, setDataComment] = useState([]);
  const [writeComment, setWriteComment] = useState('');
  const [parent, setParent] = useState(null);
  const [MorePage, setMorePage] = useState(true);
  const [openReComment, setOpenReComment] = useState({}); //status xem thêm comment có con
  const [dataReComment, setDataReComment] = useState({}); // các tin nhắn bên trong comment cha
  const [isLoading, setIsLoading] = useState(false);
  // phải lưu như vậy vì tất cả các recomment của từng comment main đều liên kết với nhau thông qua state này
  // nên phải lưu thành nhiều object để biết recomment nào của comment main để hiển thị
  const getComment = async (id, dataComment) => {
    try {
      const startingPoint = dataComment?.length
        ? dataComment[dataComment?.length - 1]._id
        : null;
      const dataCommentParams = {
        id: id,
        startingPoint: startingPoint,
      };
      const result = await getListComment(dataCommentParams);
      if (result.status && result.data.length > 0) {
        setDataComment([...dataComment, ...result.data]);
        setMorePage(true);
        LayoutAnimation.easeInEaseOut()
      } else {
        setMorePage(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (
      !isLoading &&
      dataComment?.length % 10 == 0 &&
      idPost &&
      MorePage
    ) {
      setIsLoading(true);
      await getComment(idPost, dataComment);
    }
  };

  const send = async () => {
    try {
      if (!writeComment.trim() || !create_by._id || !idPost) {
        Alert.alert('Thông báo', 'Không được bỏ trống ô nhập');
      } else {
        const body = {
          content: writeComment,
          id_post: idPost,
          create_by: create_by._id,
          parent: parent?._id || null,
        };

        const result = await createComment(body);
        if (result.status) {
          setWriteComment('');
          const commentUpdate = dataPost?.map(ele => {
            if (ele._id == idPost) {
              return {...ele, comments: ele.comments + 1};
            }

            return ele;
          });

          if (parent) {
            // mở comment con
            setOpenReComment(prev => {
              if (prev[result.data.parent]) {
                return prev;
              }

              return {...prev, [result.data.parent]: !prev[result.data.parent]};
            });
            //hiển thị comment con
            setDataReComment(prev => ({
              ...prev,
              [result.data.parent]: [
                {
                  ...result.data,
                  create_by: {...create_by},
                  parent: {_id: parent._id, create_by: {name: parent.name}},
                },
                ...(prev[result.data.parent] || []),
              ],
            }));
          } else {
            setDataComment([
              {...result.data, create_by: {...create_by}},
              ...dataComment,
            ]);
          }
          setDataPost(commentUpdate);
          setParent(null);
        } else {
          console.log(result.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modals
      modalVisible={open}
      modalhiden={value => {       
        setOpen(value);
        if (!value) {
          setDataComment([]);
          setParent(null);
          setMorePage(true);
          setWriteComment('');
          setPost?.(null);
        }
      }}>
      <View>
        <CommentSection
          dataComment={dataComment}
          setParent={setParent}
          parent={parent}
          dataReComment={dataReComment}
          setDataReComment={setDataReComment}
          openReComment={openReComment}
          setOpenReComment={setOpenReComment}
          isLoading={isLoading}
          handleLoadMore={handleLoadMore}
          setDataComment={setDataComment}
          setOpen={setOpen}
        />

        <View style={styles.reponsiveSendComment}>
          {parent && (
            <View style={{flexDirection: 'row', width: '100%'}}>
              <Text marginT-5 text>
                {t('app.answering')}: {parent?.create_by?.name}{' '}
                <Text
                  style={styles.colorTextWaring}
                  onPress={() => setParent(null)}>
                  {t('app.cancel')}
                </Text>
              </Text>
            </View>
          )}
          <View row spread style={styles.containerInput}>
            <TextInput
              style={styles.outLineInput}
              value={writeComment}
              onChangeText={text => setWriteComment(text)}
              placeholder={t('app.writeComment')}
            />

            <TouchableOpacity onPress={send} style={styles.styleSend}>
              <IconApp assetName={'send'} size={25} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modals>
  );
};

export default memo(ShowComments);

const styles = StyleSheet.create({
  styleSend: {position: 'absolute', top: 7, right: 10, padding: 10},
  containerInput: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 10,
  },
  outLineInput: {
    flex: 1,
    borderRadius: 30,
    borderColor: 'black',
    marginBottom: 10,
    borderWidth: 1,
    height: 40,
    paddingLeft: 10,
    paddingRight: 25,
    color: 'black',
  },
  colorTextWaring: {
    color: 'red',
  },
  reponsiveSendComment: {
    position: 'fixed',
    alignSelf: 'center',
    borderColor: 'black',
    borderTopWidth: 1,
    paddingHorizontal: 10,
  },
});
