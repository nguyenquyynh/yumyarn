import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {getPost} from 'src/hooks/api/post';
import ShowComments from 'containers/comment/ShowComments';
import {useSelector} from 'react-redux';
import RenderPost from 'components/homes/RenderPost';
import {createFollow} from 'src/hooks/api/follow';

const ListPost = () => {
  const [dataPost, setDataPost] = useState([]);
  const user = useSelector(state => state.auth.user);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [idPost, setIdPost] = useState('');
  const idUser = user._id;
  const [isLoading, setIsLoading] = useState(false);
  const getPostData = async (idUser, page) => {
    try {
      const dataRequest = {
        id: idUser,
        page: page,
      };
      const response = await getPost(dataRequest);
      if (response.status) {
        setDataPost(prev => [...prev, ...response.data]);
        setPage(page);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async userCreatePost => {
    try {
      const followUpdate = dataPost?.map(ele => {
        if (ele.create_by._id == userCreatePost) {
          console.log(ele.follow)
          return {...ele, follow: !ele.follow};
        }

        return ele;
      });
      setDataPost(followUpdate);
      const response = await createFollow(idUser, userCreatePost);
      if (!response.status) {
        setDataPost(dataPost);
        console.log(response.data);
      }
    } catch (error) {
      setDataPost(dataPost);
      console.log(error);
    }
  };

  useEffect(() => {
    getPostData(idUser, 1);
  }, []);

  const handleLoadMore = useCallback(
    async page => {
      if (!isLoading) {
        setIsLoading(true);
        // await getPostData(idUser, page);
        console.log('đã tải');
      }
    },
    [page, isLoading],
  );

  const handleOpenComment = id => {
    setIdPost(id);
    setOpen(true);
  };
  return (
    <>
      <FlatList
        scrollEnabled={false}
        data={dataPost}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <RenderPost
            item={item}
            handleOpenComment={handleOpenComment}
            idUser={idUser}
            handleFollow={handleFollow}
          />
        )}
        onEndReached={() => handleLoadMore(page + 1)} // Gọi hàm khi kéo tới cuối danh sách
        onEndReachedThreshold={0.5}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        ListFooterComponent={() =>
          isLoading && <ActivityIndicator size="large" color="#0000ff" />
        }
      />

      {idPost && (
        <ShowComments
          open={open}
          setOpen={setOpen}
          idPost={idPost}
          setIdPost={setIdPost}
          create_by={user}
          dataPost={dataPost}
          setDataPost={setDataPost}
        />
      )}
    </>
  );
};

export default ListPost;

const styles = StyleSheet.create({});
