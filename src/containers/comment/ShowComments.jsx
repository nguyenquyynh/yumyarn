import {
  ActivityIndicator,
  KeyboardAvoidingView,
  LayoutAnimation,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, { memo, useState } from 'react';
import { Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import Modals from 'components/BottomSheetApp';
import { createComment, getListComment } from 'src/hooks/api/comment';
import CommentSection from './CommentSection';
import { t } from 'lang';
import { useSelector } from 'react-redux';
import { isCleanContent } from 'src/middleware/contentmiddleware';

const ShowComments = props => {
  const { idPost, setOpen, open, dataPost, setDataPost } = props;
  const create_by = useSelector(state => state.auth.user);
  const [dataComment, setDataComment] = useState([]);
  const [writeComment, setWriteComment] = useState('');
  const [parent, setParent] = useState(null);
  const [disable, setDisable] = useState(false);
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
        LayoutAnimation.easeInEaseOut();
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
    if (!isLoading && dataComment?.length % 10 == 0 && idPost && MorePage) {
      setIsLoading(true);
      await getComment(idPost, dataComment);
    }
  };

  const send = async () => {
    if (!isCleanContent(writeComment)) return
    setDisable(true)
    try {
      if (!writeComment.trim() || !create_by._id || !idPost) {
        return
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
              return { ...ele, comments: ele.comments + 1 };
            }

            return ele;
          });

          if (parent) {
            // mở comment con
            setOpenReComment(prev => {
              if (prev[result.data.parent]) {
                return prev;
              }

              return { ...prev, [result.data.parent]: !prev[result.data.parent] };
            });
            //hiển thị comment con
            setDataReComment(prev => ({
              ...prev,
              [result.data.parent]: [
                {
                  ...result.data,
                  create_by: { ...create_by },
                  parent: { _id: parent._id, create_by: { name: parent.name } },
                },
                ...(prev[result.data.parent] || []),
              ],
            }));
          } else {
            setDataComment([
              { ...result.data, create_by: { ...create_by } },
              ...dataComment,
            ]);
          }
          setDataPost(commentUpdate);
          setParent(null);
          LayoutAnimation.easeInEaseOut();
        } else {
          console.log(result.data);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDisable(false)
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
        }
      }}>
      <KeyboardAvoidingView>
        <View>
          <View style={[styles.reponsiveSendComment, { elevation: 10 }]}>
            {parent && (
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <Text text>
                  {t('app.answering')}: {parent?.create_by?.name}{' '}
                  <Text
                    style={styles.colorTextWaring}
                    onPress={() => setParent(null)}>
                    {t('app.cancel')}
                  </Text>
                </Text>
              </View>
            )}
            <View row spread marginT-5 centerV style={styles.containerInput}>
              <TextInput
                textAlignVertical='top'
                textAlign='left'
                multiline
                placeholderTextColor={'black'}
                style={styles.outLineInput}
                value={writeComment}
                editable={!disable}
                onSubmitEditing={send}
                onChangeText={text => setWriteComment(text)}
                placeholder={t('app.writeComment')}
              />
              {
                disable ? <ActivityIndicator size={24} style={styles.styleSend} /> :
                  <TouchableOpacity onPress={send} style={styles.styleSend}>
                    <Icon assetName={'send'} size={22} crossOrigin='anonymous' />
                  </TouchableOpacity>
              }

            </View>
          </View>
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


        </View>
      </KeyboardAvoidingView>
    </Modals>
  );
};

export default memo(ShowComments);

const styles = StyleSheet.create({
  styleSend: { position: 'absolute', right: 10, bottom: 12 },
  containerInput: {
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: 'white',
    paddingLeft: 5,
  },
  outLineInput: {
    width: '100%',
    height: 'auto',
    textAlignVertical: 'center',
    paddingRight: 40,
    color: 'black',
  },
  colorTextWaring: {
    color: 'red',
  },
  reponsiveSendComment: {
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
});
