import { Dimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { t } from 'lang';
import ButtonApp from 'components/ButtonApp';
import { BOLD } from 'configs/fonts';
import { createFollow } from 'src/hooks/api/follow';
import { useSelector } from 'react-redux';

const UserRender = ({ item }) => {
    const user = useSelector(state => state.auth)
    const [isfollow, setIsfollow] = useState(item?.isFollow)
    const handlerfollow = async () => {
        const followresponse = await createFollow(user._id, item?._id)
        console.log(followresponse);
        setIsfollow(!isfollow)
    }
    return (
        <View bg-white row padding-viii marginT-x centerV spread>
            <View row flex-3>
                <Avatar source={{ uri: item?.avatar }} size={44} />
                <View paddingH-x flex>
                    <Text text70BO numberOfLines={1} ellipsizeMode="tail">{item?.name}</Text>
                    <Text text numberOfLines={1} ellipsizeMode="tail" color={Colors.gray} style={styles.tagname}>{item?.tagName}</Text>
                </View>
            </View>
            <View>
                <ButtonApp onclick={handlerfollow} title={isfollow ? t("app.following") : t("app.follow")} />
            </View>
        </View>
    )
}

export default UserRender

const styles = StyleSheet.create({
    tagname: {
        fontFamily: BOLD
    }
})