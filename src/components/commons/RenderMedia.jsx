import { ActivityIndicator, StyleSheet } from 'react-native';
import React, { memo, useEffect, useState } from 'react';
import { Image, View } from 'react-native-ui-lib';
import { createThumbnail } from 'react-native-create-thumbnail';
import { DEFAULT } from 'src/data/default';
const RenderMedia = ({ i, item }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState(null);
    const [load, setLoad] = useState(false);
    useEffect(() => {
        const fetchThumbnail = async () => {
            try {
                const response = await createThumbnail({
                    url: item,
                    timeStamp: 10,
                });
                if (response && response.path) {
                    setThumbnailUrl(response.path);
                } else {
                    setThumbnailUrl('https://i.imgur.com/eZLxXda.png');
                }
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
            return (<>
                <Image
                    onLoad={() => {
                        if (load !== null) {
                            setLoad(true)
                        }
                    }}
                    onLoadEnd={() => setLoad(null)}
                    source={{ uri: item || DEFAULT.IMAGE }}
                    style={{ width: '100%', height: '100%' }}
                />
                {load !== null && <View bg-yellow center style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 2 }}>
                    <ActivityIndicator color={'#FFFFFF'} size={25} />
                </View>}
            </>

            );
        } else if (item.endsWith('.mp4')) {
            return (
                <>
                    {thumbnailUrl && <Image
                        onLoad={() => setLoad(true)}
                        onLoadEnd={() => setLoad(false)}
                        source={{ uri: thumbnailUrl || DEFAULT.IMAGE }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode='cover'
                    />}
                    {load && <View bg-yellow center style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 2 }}>
                        <ActivityIndicator color={'#FFFFFF'} size={25} />
                    </View>}
                </>

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
