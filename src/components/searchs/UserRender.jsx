import { Dimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { t } from 'lang';
import ButtonApp from 'components/ButtonApp';
import { BOLD } from 'configs/fonts';
import { createFollow } from 'src/hooks/api/follow';
import { useSelector } from 'react-redux';

const UserRender = ({ item }) => {
    const user = useSelector(state => state.auth.user)
    const [isfollow, setIsfollow] = useState(item?.isFollow)

    const styleButtonFollow = {
        backgroundColor: isfollow ? Colors.yellow : Colors.white,
        borderWidth: 1.5,
        borderColor: isfollow ? Colors.yellow : Colors.black,
        borderRadius: 30,
        paddingHorizontal: 25,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center'
    }
    const handlerfollow = async () => {
        const followresponse = await createFollow(user._id, item?._id)
        console.log(followresponse);
        setIsfollow(!isfollow)
    }
    const handlerClickAvatar = () => {

    }
    return (
        <View bg-white padding-viii marginT-x centerV center spread>
            <View row>
                <View row flex-3>
                    <Avatar source={{ uri: item?.avatar }} size={44} onPress={handlerClickAvatar} />
                    <View paddingH-x flex>
                        <Text text70BO numberOfLines={1} ellipsizeMode="tail">{item?.name}</Text>
                        <Text text80L numberOfLines={1} ellipsizeMode="tail" color={Colors.black}>@{item?.tagName}</Text>
                    </View>
                </View>
                <View>
                    <TouchableOpacity onclick={handlerfollow} style={styleButtonFollow}>
                        <Text color={isfollow ? Colors.white : Colors.yellow}>{isfollow ? t("app.following") : t("app.follow")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View bg-gray marginT-xv width={'90%'} height={1}></View>
        </View>
    )
}

export default UserRender
