import { ActivityIndicator, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import RenderPost from 'components/commons/RenderPost'
import { getPost } from 'src/hooks/api/post';
import { View } from 'react-native-ui-lib';
import { useSelector } from 'react-redux';

const ListPost = () => {
    const [dataPost, setDataPost] = useState([]);
    const user = useSelector(state => state.auth)
    const [page, setPage] = useState(1);
    const idUser = user._id;
    const [isLoading, setIsLoading] = useState(false);
    const getPostData = async (idUser, page) => {
        try {
            setIsLoading(true);
            const dataRequest = {
                id: idUser,
                page: page
            };
            const response = await getPost(dataRequest);
            if (response.status) {
                setDataPost([...dataPost, ...response.data]);
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

    const handleLoadMore = async () => {
        console.log("here");
        if (dataPost.length % 5 == 0 && !isLoading) {
            await getPostData(idUser, page + 1);
            console.log('đã tải');
        }
    }
    return (
        <View bg-white>
            <FlatList
                data={dataPost}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <RenderPost item={item} />}
                onEndReached={handleLoadMore} // Gọi hàm khi kéo tới cuối danh sách
                onEndReachedThreshold={0.2}
                ListFooterComponent={() => isLoading && <ActivityIndicator size="large" color="#0000ff" />}
            />
        </View>
    )
}

export default ListPost

const styles = StyleSheet.create({})