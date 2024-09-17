import { StyleSheet } from 'react-native'
import React from 'react'
import { Image, View } from 'react-native-ui-lib';
import Video from 'react-native-video';

const RenderMedia = ({ i, item }) => {
    const renderMedia = (item) => {
        if (item.endsWith('.jpg' || '.png' || '.jpeg' || '.gif' || '.svg')) {
            return (
                <Image source={{ uri: item }} style={{
                    width: '100%', height: i % 2 == 0 ? 250 : 150
                }} />
            )
        } else if (item.endsWith('.mp4')) {
            return (
                <Video
                    source={{ uri: item }}
                    style={{
                        width: '100%', height: i % 2 == 0 ? 200 : 250
                    }} paused resizeMode='cover' />

            )
        }
    }
    return (
        <View>
            {renderMedia(item)}
        </View>
    )
}

export default RenderMedia

const styles = StyleSheet.create({
    media: { flex: 1 },
    videoBorder: {
        overflow: 'hidden',
        borderRadius: 15,
    }
})