import { StyleSheet, } from 'react-native'
import React from 'react'
import { Image, Text, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import IconApp from 'components/IconApp'

const Setting = () => {
    return (

        <Wapper
            gadient
            title={t("setting.setting")}
            renderleft
            iconleft={"back"}
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
                <View style={styles.viewIT1}>
                    <IconApp assetName={"unhappy"} size={24} />

                    <Text xviiText style={styles.text}>{t("setting.delete_the_account")}</Text>
                </View>
                <View style={styles.viewIT1}>
                    <IconApp assetName={"log_out"} size={24} />

                    <Text xviiText style={styles.text}>{t("setting.log_out")}</Text>
                </View>
            </View>
        </Wapper>




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
    viewIT1:{
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