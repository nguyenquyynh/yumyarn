import { Dimensions, StyleSheet, Image } from 'react-native'
import React from 'react'
import { Avatar, Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import LinearGradient from 'react-native-linear-gradient';
import NumberApp from './NumberApp';
import Video from 'react-native-video';

const PostRender = ({ item }) => {
    const screenwith = Dimensions.get('window').width < Dimensions.get('window').height ? Dimensions.get('window').width : Dimensions.get('window').height;
    itemstyle = {
        width: '49%',
        height: screenwith / 1.5,
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
                <Video source={{ uri: first }} style={styles.media} paused />
            )
        }
    }
    const handlerClickUser = () => {

    }
    const hendlerClickMedia = () => {

    }
    return (
        <View bg-white br30 marginT-x style={itemstyle} bottom>
            <TouchableOpacity flex onPress={hendlerClickMedia}>
                {renderMedia(item)}
            </TouchableOpacity>
            <View absF bottom>
                <LinearGradient
                    start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }}
                    locations={[-1, 1]}
                    colors={[Colors.black, Colors.transparent]}
                    style={{ height: '20%', width: '100%', borderRadius: 10 }}
                >
                    <View flex row centerV spread paddingH-x>
                        <TouchableOpacity row centerV onPress={handlerClickUser}>
                            <Avatar source={{ uri: item?.create_by?.avatar }} size={30} />
                            <Text marginL-x color={Colors.white} text70BO>{item?.create_by?.name}</Text>
                        </TouchableOpacity>
                        <View row centerV>
                            <Icon assetName='fire' size={25} />
                            <NumberApp number={item?.fire.length} color='white' size={15} />
                        </View>
                    </View>
                </LinearGradient>
            </View>
        </View>
    )
}

export default PostRender

const styles = StyleSheet.create({
    media: { flex: 1, borderRadius: 10 }
})