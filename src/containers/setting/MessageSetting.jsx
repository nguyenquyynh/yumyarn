import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import TextApp from 'components/commons/TextApp'
import Modals from 'components/BottomSheetApp'
import { FlatList } from 'react-native-gesture-handler'

const MessageSetting = () => {
    const navigation = useNavigation()
    const [showModal, setShowModal] = useState(false)
    const [seleted, setSeleted] = useState('ALL')
    const [status, setStatus] = useState(false)
    const [seenstatus, setSeenStatus] = useState(false)

    const handlerSeleted = (value) => {
        setSeleted(value)
    }
    return (
        <Wapper renderleft funtleft={() => navigation.goBack()} title={t("setting.setting_message")}>
            <View flex bg-white padding-16>
                <View marginB-x style={styles.over}>
                    <TouchableOpacity padding-x spread row left onPress={() => { setShowModal(true) }}>
                        <TextApp style={styles.title} text={t("setting.exepctmes")} />
                        <View centerV row>
                            <Text marginH-5>{seleted}</Text>
                            <Icon assetName='right_arrow' size={10} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View marginB-x style={styles.over}>
                    <TouchableOpacity padding-x spread row left onPress={() => { setStatus(!status) }}>
                        <TextApp style={styles.title} text={t("messenge.status")} />
                        <View centerV row>
                            <Icon assetName={status ? 'toggle_on' : 'toggle_off'} size={25} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View marginB-x style={styles.over}>
                    <TouchableOpacity padding-x left onPress={() => { setSeenStatus(!seenstatus) }}>
                        <View centerV row >
                            <View flex>
                                <TextApp flex style={styles.title} text={t("messenge.seen")} />
                            </View>
                            <Icon assetName={seenstatus ? 'toggle_on' : 'toggle_off'} size={25} />
                        </View>
                        <Text>{t("messenge.seen_d")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Modals modalVisible={showModal} modalhiden={setShowModal}>
                <View paddingH-16>
                    <Text text70BO style={styles.Text}>{t("setting.mesOptions")}</Text>
                    <Text text90R>{t("setting.whosend")}</Text>
                    <FlatList
                        data={listoptions}
                        key={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity padding-5 marginB-10 row centerV onPress={() => { handlerSeleted(item.value) }}>
                                <View flex-9>
                                    <Text text80BO>{t(item?.title)}</Text>
                                    <Text>{t(item?.content)}</Text>
                                </View>
                                <View flex>
                                    {item.value === seleted && <Icon assetName='check' tintColor={Colors.yellow} size={20} />}
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </Modals>
        </Wapper>
    )
}
export default MessageSetting

const styles = StyleSheet.create({
    Text: {
        textAlign: 'center'
    },
    over: {
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        elevation: 2,
        padding: 5
    },
    title: {
        fontSize: 16,
    }
})

var listoptions = [
    { id: 1, value: "ALL", title: "messenge.people", content: "messenge.people_d" },
    { id: 2, value: "FRIEND", title: "messenge.friend", content: "messenge.friend_d" },
    { id: 3, value: "NOBODY", title: "messenge.nobody", content: "messenge.nobody_d" }
]