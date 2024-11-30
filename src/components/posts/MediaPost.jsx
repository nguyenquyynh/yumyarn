import { Dimensions, Pressable, StyleSheet } from 'react-native'
import React, { memo, useRef, useState } from 'react'
import Video from 'react-native-video'
import { Icon, Image, View } from 'react-native-ui-lib'

const MediaPost = ({ data }) => {
    var widthscreen = Dimensions.get('window').width
    var heightscreen = Dimensions.get('window').height
    const refVideo = useRef();
    const [pausevideo, setPausevideo] = useState(true)
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
            if (heightscreen >= widthscreen) {
                return (
                    <Image source={{ uri: first }} style={[styles.media, { width: '100%', height: scale }]} />
                );
            } else {
                return (
                    <Image source={{ uri: first }} style={[styles.media, { width: scale, height: '100%' }]} />
                );
            }


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
                            style={{ width: '100%', height: scale }}
                            resizeMode='cover'
                            ref={refVideo}
                            onEnd={() => {
                                setPausevideo(true);
                                refVideo?.current?.seek(0);
                            }}
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
        borderRadius: 10,
        overflow: 'hidden',
    },
    container: {
        width: '100%',
        height: '100%', justifyContent: 'center',
        alignItems: 'center',
    }
})