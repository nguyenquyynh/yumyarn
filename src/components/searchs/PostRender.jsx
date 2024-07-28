import { Dimensions, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Avatar, Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import numberFormat from 'configs/ui/format';

const PostRender = ({ item }) => {
    const screenwith = Dimensions.get('window').width < Dimensions.get('window').height ? Dimensions.get('window').width : Dimensions.get('window').height;
    itemstyle = {
        width: '49%',
        height: screenwith / 1.3,
        marginRight: '2%'
    }
    const renderMedia = (item) => {
        const first = item?.media[0]
        if (first.endsWith('.jpg')) {
            return (
                <Image source={{ uri: first }} style={styles.media} />
            )
        } else if (first.endsWith('.mp4')) {
            return (
                <Video 
                    source={{ uri: first }}
                    style={styles.media} paused resizeMode='cover' />
            )
        }
    }
    const handlerClickUser = () => {

    }
    const hendlerClickMedia = () => {

    }
    return (
        <View bg-white marginT-x style={itemstyle} bottom>
            <TouchableOpacity flex onPress={hendlerClickMedia}>
                {renderMedia(item)}
            </TouchableOpacity>
            <View absF bottom>
                <LinearGradient
                    start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }}
                    locations={[-1, 1]}
                    colors={[Colors.black, Colors.transparent]}
                    style={{ height: '20%', width: '100%' }}
                >
                    <View flex row centerV spread paddingH-x>
                        <TouchableOpacity row centerV onPress={handlerClickUser} flex-7>
                            <Avatar source={{ uri: item?.create_by?.avatar }} size={25} />
                            <Text flex numberOfLines={1} marginL-x color={Colors.white} text90BO>{item?.create_by?.name}</Text>
                        </TouchableOpacity>
                        <View row centerV flex-2>
                            <Icon assetName='fire' size={18} />
                            <Text text80BO color='white'>{numberFormat(item?.fire)}</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </View>
    )
}

export default PostRender

const styles = StyleSheet.create({
    media: { flex: 1 }
})