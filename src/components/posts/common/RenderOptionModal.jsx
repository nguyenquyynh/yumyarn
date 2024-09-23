import { StyleSheet } from 'react-native'
import React from 'react'
import { Colors, Icon, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { BI } from 'configs/fonts'
import { t } from 'lang'

const RenderOptionModal = ({
    item
}) => {
    return (
        <TouchableOpacity centerV row padding-v style={{ marginBottom: 10 }} onPress={item.funt}>
            <Icon assetName={item.img} size={33} tintColor={Colors.yellow} />
            <View marginL-x >
                <Text xviText style={{ fontFamily: BI }}>{t(item.title)}</Text>
                <Text ixtext color={Colors.gray}>{t(item.disription)}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default RenderOptionModal

const styles = StyleSheet.create({})