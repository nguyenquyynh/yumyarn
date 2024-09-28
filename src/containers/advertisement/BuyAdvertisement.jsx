import { FlatList, ScrollView, StyleSheet, ToastAndroid } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import Wapper from 'components/Wapper'
import { t } from 'lang'
import { B, EB, I } from 'configs/fonts'
import { useSelector } from 'react-redux'
import { buyAdvertisement, getAllAdvertisement, getTimeOutAdvertisement } from 'src/hooks/api/post'
import { useNavigation } from '@react-navigation/native'
import { millisecondsToDate } from 'configs/ui/time'

const BuyAdvertisement = ({ route }) => {
    const { post } = route.params
    const auth = useSelector(state => state.auth)
    const navigation = useNavigation()
    const [AdvSelect, setAdvSelect] = useState()
    const [viptime, setviptime] = useState("")
    const [listAdvertisement, setListAdvertisement] = useState([])

    useEffect(() => {
        async function getTimeAdvertisement() {
            const timeoutAdvertisement = await getTimeOutAdvertisement({
                token: auth.token,
                post: post
            })
            if (timeoutAdvertisement.status) {
                setviptime(`${millisecondsToDate(timeoutAdvertisement.data.start_vip)} -> ${millisecondsToDate(timeoutAdvertisement.data.end_vip)}`)
            } else setviptime("Bạn chưa quảng bá bài viết này")
        }
        async function getListAdvertisement() {
            const listAdv = await getAllAdvertisement({ token: auth.token })
            if (listAdv.status) {
                setListAdvertisement(listAdv.data)
            }
        }
        getTimeAdvertisement()
        getListAdvertisement()
    }, [])

    const RenderAdvertisement = (item) => {
        return (
            <TouchableOpacity onPress={() => {
                setAdvSelect(item)
            }} centerV bg-white marginH-xx row style={[{ borderColor: AdvSelect?._id == item._id ? Colors.yellow : 'black' }, styles.itemAdv]}>
                <View>
                    <Icon assetName='recomment' size={33} tintColor={Colors.yellow} />
                </View>
                <View marginL-x flex>
                    <Text xviText marginB-v style={styles.fontEB}>{item.time + " " + t("app.day")}</Text>
                    <Text color='red' xiitext style={styles.fontI}>{item.cost} $</Text>
                </View>
                <View>
                    <Icon assetName='dot' size={20} tintColor={AdvSelect?._id == item._id ? Colors.yellow : 'gray'} />
                </View>
            </TouchableOpacity>
        )
    }
    return (
        <Wapper title={t("advertisement.title")} renderleft funtleft={() => { navigation.goBack() }}>
            <View flex bg-gray >
                <ScrollView>
                    <View flex bg-white paddingB-xx >
                        <Text flex marginL-xx xviText marginB-xxx style={{ fontFamily: I }}>{viptime}</Text>
                        <FlatList
                            scrollEnabled={false}
                            data={listAdvertisement}
                            key={(item) => item._id}
                            renderItem={({ item }) => RenderAdvertisement(item)}
                            ListEmptyComponent={
                                <View flex center>
                                    <Text xviText>No advertisements available</Text>
                                </View>
                            }
                        />
                    </View>
                </ScrollView>
                <View bg-white height={100} paddingH-xxx row>
                    <View flex centerV>
                        <Text text60BO>{AdvSelect?.cost} $</Text>
                    </View>
                    <TouchableOpacity center paddingH-xx br20 marginV-xxx bg-yellow onPress={() => {
                        if (AdvSelect) {
                            buyAdvertisement({
                                token: auth.token,
                                body: {
                                    post : post,
                                    cost: AdvSelect
                                }
                            })
                            // navigation.navigate("BuyAdvertisementDetail", { adv: AdvSelect })
                        } else {
                           ToastAndroid.show("Chọn gói thời gian bạn muốn !" , ToastAndroid.SHORT)
                        }
                     }}>
                        <Text style={styles.TextB} color={Colors.white}>{AdvSelect == null ? t("app.choose") : t("app.buy")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Wapper>
    )
}

export default BuyAdvertisement

const styles = StyleSheet.create({
    itemAdv: {
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 10
    },
    fontEB: {
        fontFamily: EB
    },
    fontI: {
        fontFamily: I
    },
    TextB: {
        fontFamily: B,
    }
})