import { Alert, StyleSheet, } from 'react-native'
import React, { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { t } from 'lang'
import IconApp from 'components/IconApp'
import Wapper from 'components/Wapper'
import NotificationModalApp from 'components/commons/NotificationModalApp'
import { useNavigation } from '@react-navigation/native'
import { userLogout } from 'src/hooks/api/auth'
import { useDispatch } from 'react-redux'
import { auth_logout } from 'reducers/auth'

const Setting = () => {
    const [showModel, setShowModel] = useState(false)
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const handlerRemoveAccount = () => {
        setShowModel(true)
    }
    const gotoScreen = (screen) => {
        navigation.navigate(screen)
    }
    const handlerSignout = async () => {
        await dispatch( auth_logout())
    }
    return (
        <View flex>
            <Wapper
                gadient
                title={t("setting.setting")}
                renderleft
                iconleft={"back"}
                funtleft={() => { navigation.goBack() }}
            >
                <View flex style={styles.container}>
                    <View style={styles.viewVIT}>
                        <View style={styles.viewIT}>
                            <IconApp assetName={"languages"} size={24} />
                            <Text xviiText style={styles.text}>{t("setting.language")}</Text>
                        </View>
                        <IconApp assetName={"right_arrow"} size={15} />
                    </View>
                    <View style={styles.viewVIT}>
                        <View style={styles.viewIT}>
                            <IconApp assetName={"protection"} size={24} />
                            <Text xviiText style={styles.text}>{t("setting.Community_standards")}</Text>
                        </View>
                        <IconApp assetName={"right_arrow"} size={15} />
                    </View>
                    <View style={styles.viewVIT}>
                        <View style={styles.viewIT}>
                            <IconApp assetName={"notes"} size={24} />
                            <Text xviiText style={styles.text}>{t("profile.edit_profile")}</Text>
                        </View>
                        <IconApp assetName={"right_arrow"} size={15} />
                    </View>
                    <TouchableOpacity style={styles.viewIT1} onPress={handlerRemoveAccount}>
                        <IconApp assetName={"unhappy"} size={24} />
                        <Text xviiText style={styles.text}>{t("setting.delete_the_account")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.viewIT1} onPress={handlerSignout}>
                        <IconApp assetName={"log_out"} size={24} />
                        <Text xviiText style={styles.text}>{t("setting.log_out")}</Text>
                    </TouchableOpacity>
                </View>

            </Wapper>
            <NotificationModalApp modalVisible={showModel}
                modalhiden={setShowModel}
                funt={() => {
                    Alert.alert("Bạn đã xóa tài khoản")
                    setShowModel(false)
                }}
                asseticon={"warning"}
                title={t("title_model.remove_account")}
                content={t("title_model.content_remove_account")}
            />
        </View>
    )
}

export default Setting

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    viewVIT: {
        padding: 20,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    viewIT1: {
        padding: 20,
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    icon: {
        width: 21,
        height: 21,

    },
    text: {
        marginLeft: 22,
        fontWeight: 'bold',
    },

    viewIT: {

        justifyContent: 'flex-start',
        flexDirection: "row",
        alignItems: "center"
    },

})