import { Dimensions, Pressable, StyleSheet } from 'react-native'
import React, { memo, useState } from 'react'
import Video from 'react-native-video'
import { Icon, Image, View } from 'react-native-ui-lib'

const MediaPost = ({
    data
}) => {
    var widthscreen = Dimensions.get('window').width
    var heightscreen = Dimensions.get('window').height

    const [pausevideo, setPausevideo] = useState(false)
    const [scale, setScale] = useState('100%')

    const handlerPauseVideo = () => {
        setPausevideo(!pausevideo)
    }

    const renderMedia = (data) => {
        const first = data
        if (first.endsWith('.jpg') || first.endsWith('.png') || first.endsWith('.jpeg')) {
            Image.getSize(data, (width, height) => {
                const heightPercentage = (100 / (heightscreen / widthscreen) * (height / width)).toFixed(0) + '%';
                setScale(heightPercentage)
            });
            return (
                <Image source={{ uri: first }} style={[styles.media, heightscreen > widthscreen ? { width: '100%', height: scale || '100%' } : { width: scale || '100%', height: '100%' }]} />
            );

        } else if (first.endsWith('.mp4')) {
            return (
                <View style={styles.container} center flex>
                    <Pressable style={styles.container} onPress={handlerPauseVideo}>
                        <Video
                            onLoad={(naturalSize) => {
                                const scale_video = (100 / (heightscreen / widthscreen) * (naturalSize.naturalSize.height / naturalSize.naturalSize.width)).toFixed(0) + '%'
                                setScale(scale_video)
                            }}
                            paused={pausevideo}
                            source={{ uri: data }}
                            style={{ width: '100%', height: scale || '100%' }}
                            resizeMode='cover'
                            repeat
                            playInBackground={false} />
                        <View center flex absF>
                            {pausevideo && <Icon assetName='play_button' size={50} tintColor='lightgray' />}
                        </View>
                    </Pressable>
                </View>
            )
        }
    }
    return (
        <View style={{ width: widthscreen }} center key={data.index} bg-black>
            {renderMedia(data.item)}
        </View>
    )
}

export default memo(MediaPost)

const styles = StyleSheet.create({
    media: {
        width: '100%',
        borderRadius: 10
    },
    container: {
        width: '100%',
        height: '100%', justifyContent: 'center',
        alignItems: 'center'
    }
})