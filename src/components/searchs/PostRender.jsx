import { Dimensions, StyleSheet, Image } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import numberFormat from 'configs/ui/format';
import { millisecondsToDate } from 'configs/ui/time';
import { useNavigation } from '@react-navigation/native';
import { createThumbnail } from 'react-native-create-thumbnail';
import Avatar from 'components/Avatar';

const PostRender = ({ item }) => {
    const navigation = useNavigation()
    const [urlThumbnail, setUrlThumbnail] = useState('')
    const screenwith = Dimensions.get('window').width < Dimensions.get('window').height ? Dimensions.get('window').width : Dimensions.get('window').height;
    itemstyle = {
        width: '49%',
        height: screenwith / 1.3,
        marginRight: '2%'
    }

    useEffect(() => {
        const fetchThumbnail = async (urlvideo) => {
            try {
                const response = await createThumbnail({
                    url: urlvideo,
                    timeStamp: 10,
                });
                setUrlThumbnail(response.path);
            } catch (err) {
                console.log(err);
                setUrlThumbnail('https://i.imgur.com/eZLxXda.png');
            }
        };
        if (item?.media[0].endsWith('.mp4')) {
            fetchThumbnail(item?.media[0]);
        }
    }, [item])

    const renderMedia = (item) => {
        const first = item?.media?.[0]
        if (first.endsWith('.jpg' || '.png' || '.jpeg' || '.gif' || '.svg')) {
            return (
                <Image source={{ uri: first }} style={styles.media} />
            )
        } else if (first.endsWith('.mp4')) {
            return (
                <Image source={{ uri: urlThumbnail || 'https://i.imgur.com/eZLxXda.png' }} style={styles.media} />
            )
        }
    }
    return (
        <View bg-white marginT-x style={itemstyle}>
            <View flex-5 style={styles.videoBorder}>
                <TouchableOpacity flex onPress={() => navigation.navigate('PostDetail', { id: item._id })}>
                    {item && renderMedia(item)}
                </TouchableOpacity>
                <View absB style={{ width: '100%', height: '20%' }} row padding-v spread>
                    <View row bottom>
                        <Avatar size={30} source={{ uri: item.create_by.avatar }} />
                        <View marginL-v>
                            <Text numberOfLines={1} color={Colors.white} text90BO >@{item.create_by.tagName}</Text>
                            <Text numberOfLines={1} color={Colors.white} text100L >{millisecondsToDate(item.create_at)}</Text>
                        </View>
                    </View>
                    <View row bottom paddingR-v>
                        <Icon assetName='fire' size={25} />
                        <Text color={Colors.white} text70BO>{numberFormat(item.fire)}</Text>
                    </View>
                </View>
            </View>
            <View flex-1>
                <Text numberOfLines={1} text80BO>{item.content}</Text>
                <Text numberOfLines={1} text80BO>{item.hashtags.map(el => `#${el} `)}</Text>
            </View>
        </View>
    )
}

export default memo(PostRender)

const styles = StyleSheet.create({
    media: { flex: 1 },
    videoBorder: {
        overflow: 'hidden',
        borderRadius: 15,
    }
})