import { Dimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { t } from 'lang';
import ButtonApp from 'components/ButtonApp';
import { BOLD } from 'configs/fonts';
import { useSelector } from 'react-redux';
import { checkFollow } from 'src/hooks/api/follow';

const UserRender = ({ item }) => {
    console.log(item);
    const [isfollow, setIsfollow] = useState(item?.isfollow)
    const handlerfollow = () => {

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