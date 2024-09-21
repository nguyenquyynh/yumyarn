import {ScrollView, StyleSheet, TextInput} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native-ui-lib';
import IconApp from 'components/IconApp';
import Modals from 'components/BottomSheetApp';
import {createComment, getListComment} from 'src/hooks/api/comment';
import CommentSection from './CommentSection';
import {t} from 'lang';

const ShowComments = props => {
  const {idPost, setOpen, open, create_by, dataPost, setDataPost, setIdPost} =
    props;
  const [dataComment, setDataComment] = useState([]);
  const [writeComment, setWriteComment] = useState('');
  const [parent, setParent] = useState(null);
  const [MorePage, setMorePage] = useState(true);
  const [openReComment, setOpenReComment] = useState({});
  const [dataReComment, setDataReComment] = useState({});
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
      idPost !== '' &&
      MorePage
    ) {
      setIsLoading(true);
      await getComment(idPost, dataComment);
    }
  };

  const send = async () => {
    try {
      if (!writeComment.trim() || !create_by._id || !idPost) {
      } else {
        const body = {
          content: writeComment,
          id_post: idPost,
          create_by: create_by._id,
          parent: parent,
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
            setOpenReComment(prev => {
              if (prev[result.data.parent]) {
                return prev;
              }

              return {...prev, [result.data.parent]: !prev[result.data.parent]};
            });
            setDataReComment(prev => ({
              ...prev,
              [result.data.parent]: [
                {...result.data, create_by: {...create_by}},
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

  useEffect(() => {
    if (!open) {
      setDataComment([]);
      setParent(null);
      setMorePage(true);
      setWriteComment('');
      setIdPost('');
      console.log('đã xóa');
    }
  }, [open]);
  return (
    <Modals modalVisible={open} modalhiden={setOpen}>
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
        />

        <View style={styles.reponsiveSendComment}>
          {parent && (
            <View style={{flexDirection: 'row', width: '100%'}}>
              <Text marginB-5 marginT-5 text>
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

            <TouchableOpacity onPress={send}>
              <IconApp assetName={'send'} size={30} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modals>
  );
};

export default memo(ShowComments);

const styles = StyleSheet.create({
  containerInput: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  outLineInput: {
    flex: 1,
    borderRadius: 30,
    marginRight: 17,
    borderColor: 'black',
    borderWidth: 1,
    height: 40,
    paddingLeft: 10,
  },
  colorTextWaring: {
    color: 'red',
  },
  reponsiveSendComment: {
    position: 'fixed',
    alignSelf: 'center',
  },
});
