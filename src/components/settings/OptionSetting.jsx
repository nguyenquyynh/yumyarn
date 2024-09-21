import { StyleSheet } from 'react-native'
import React from 'react'
import { Icon, TouchableOpacity, View } from 'react-native-ui-lib'
import TextApp from 'components/commons/TextApp'

const OptionSetting = () => {
    return (
        <View flex>
            <View style={styles.language}>
                <TouchableOpacity padding-x row spread onPress={() => { }}>
                    <Icon assetName='languages' size={25} />
                    <TextApp style={styles.title} text={"setting.language"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default OptionSetting

const styles = StyleSheet.create({
    language: {

    },
    title: {

    }
})