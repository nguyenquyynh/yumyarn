import { StyleSheet } from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { Image, View } from 'react-native-ui-lib';
import { createThumbnail } from 'react-native-create-thumbnail';

const RenderMedia = ({ i, item }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState(null);

    useEffect(() => {
        const fetchThumbnail = async () => {
            try {
                const response = await createThumbnail({
                    url: item,
                    timeStamp: 10,
                });
                setThumbnailUrl(response.path);
            } catch (err) {
                console.log(err);
                setThumbnailUrl('https://i.imgur.com/eZLxXda.png');
            }
        };

        if (item.endsWith('.mp4')) {
            fetchThumbnail();
        }
    }, [item]);

    const renderMedia = () => {
        if (item.endsWith('.jpg') || item.endsWith('.png') || item.endsWith('.jpeg') || item.endsWith('.gif') || item.endsWith('.svg')) {
            return (
                <Image
                    source={{ uri: item || 'https://i.imgur.com/eZLxXda.png' }}
                    style={{ width: '100%', height: i % 3 === 0 ? 230 :  i % 2 === 0 ? 200 : 230}}
                />
            );
        } else if (item.endsWith('.mp4')) {
            return (
                <Image
                    source={{ uri: thumbnailUrl || 'https://i.imgur.com/eZLxXda.png' }}
                    style={{ width: '100%', height: i % 3 === 0 ? 230 :  i % 2 === 0 ? 200 : 230}}
                    resizeMode='cover'
                />
            );
        }
        return null;
    };

    return (
        <View>
            {renderMedia()}
        </View>
    );
};

export default memo(RenderMedia);

const styles = StyleSheet.create({
    media: { flex: 1 },
    videoBorder: {
        overflow: 'hidden',
        borderRadius: 15,
    },
});
