import { FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';
import RenderMedia from 'components/commons/RenderMedia';
import MasonryList from '@react-native-seoul/masonry-list';
import EmptyScreen from 'components/commons/EmptyScreen';

const ListMediaProfile = ({ data, loadTimeline, navigation, refressTimeline }) => {
    const medias = []
    data.filter(item => {
        item.media.filter(el => {
            medias.push({ "_id": item._id, "media": el })
        })
    })

    return (
        <View flex >
            {!data ? <EmptyScreen /> :
                <MasonryList
                    onRefresh={refressTimeline}
                    showsVerticalScrollIndicator={false}
                    onEndReached={loadTimeline}
                    numColumns={2}
                    data={medias}
                    key={({ index }) => index}
                    renderItem={({ i, item }) => (
                        <TouchableOpacity style={styles.media} onPress={() => {
                            navigation.navigate('PostDetail', { id: item._id })
                        }}>
                            <RenderMedia item={item.media} i={i} />
                        </TouchableOpacity>
                    )
                    }
                />
            }
        </View>
    )
}

export default ListMediaProfile

const styles = StyleSheet.create({
    media: { margin: '0.5%', borderRadius: 10, overflow: 'hidden' }
})