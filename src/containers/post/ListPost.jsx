import { ActivityIndicator, FlatList, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { getPost } from 'src/hooks/api/post';
import { View } from 'react-native-ui-lib';
import ShowComments from 'containers/comment/ShowComments';
import { useSelector } from 'react-redux';
import RenderPost from 'components/homes/RenderPost';

const ListPost = () => {
    const [dataPost, setDataPost] = useState([]);
    const user = useSelector(state => state.auth)
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState(false);
    const [idPost, setIdPost] = useState('');
    const idUser = user._id;
    const [isLoading, setIsLoading] = useState(false);
    const getPostData = async (idUser, page) => {
        try {
            const dataRequest = {
                id: idUser,
                page: page
            };
            const response = await getPost(dataRequest);
            if (response.status) {
                setDataPost((prev) => [...prev, ...response.data]);
                setPage(page);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        };
    };

    useEffect(() => {
        getPostData(idUser, 1);
    }, []);

    const handleLoadMore = useCallback(async (page) => {
        if (!isLoading) {
            setIsLoading(true);
            await getPostData(idUser, page);
            console.log('đã tải');
        }
    },[page, isLoading]);


    const handleOpenComment = (id) => {
        setIdPost(id);
        setOpen(true);
    }
    return (
        <View bg-white>
            <FlatList
                data={dataPost}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <RenderPost item={item} handleOpenComment={handleOpenComment} />}
                onEndReached={() => handleLoadMore(page+1)} // Gọi hàm khi kéo tới cuối danh sách
                onEndReachedThreshold={0.5}
                initialNumToRender={2}
                maxToRenderPerBatch={2}
                ListFooterComponent={() => isLoading && <ActivityIndicator size="large" color="#0000ff" />}
            />

            {idPost && <ShowComments
                open={open}
                setOpen={setOpen}
                idPost={idPost}
                setIdPost={setIdPost}
                create_by={user}
                dataPost= {dataPost}
                setDataPost={setDataPost} />
            }
        </View>
    )
}

export default ListPost

const styles = StyleSheet.create({})