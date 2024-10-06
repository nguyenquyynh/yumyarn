import { Dimensions, StyleSheet } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { createThumbnail } from 'react-native-create-thumbnail'
import { Image } from 'react-native-ui-lib'
const { width: MAX_WIDTH } = Dimensions.get('window');
const RenderVideo = ({ urlvideo }) => {
    const [urlthumbnail, seturlthumbnail] = useState('')

    useEffect(() => {
        const fetchThumbnail = async (urlvideo) => {
            try {
                const response = await createThumbnail({
                    url: urlvideo,
                    timeStamp: 10,
                });
                seturlthumbnail(response.path);
            } catch (err) {
                console.log(err);
                seturlthumbnail('https://i.imgur.com/eZLxXda.png');
            }
        };
        fetchThumbnail(urlvideo);
    }, [urlvideo])

    return (
        <Image
            source={{ uri: urlthumbnail || 'https://i.imgur.com/eZLxXda.png' }}
            style={styles.styleImage}
            resizeMode="cover"
        />
    )
}

export default memo(RenderVideo)

const styles = StyleSheet.create({
    styleImage: {
        width: MAX_WIDTH - 20,
        maxWidth: 480,
        height: '100%',
    },
})