import { StyleSheet } from 'react-native'
import React from 'react'
import { Icon, TouchableOpacity, View } from 'react-native-ui-lib'
import TextApp from 'components/commons/TextApp'
import { SB } from 'configs/fonts'

const OptionSetting = ({ navigation }) => {
    return (
        <View flex marginT-x>
            <View marginB-x style={styles.over}>
                <TouchableOpacity padding-x row left onPress={() => { navigation.navigate('PostSaved') }}>
                    <Icon assetName='bookmark' size={25} marginR-x tintColor='black' />
                    <TextApp style={styles.title} text={"setting.saved"} />
                </TouchableOpacity>
            </View>
            <View marginB-x style={styles.over}>
                <TouchableOpacity padding-x row left onPress={() => { navigation.navigate('Advertisement') }}>
                    <Icon assetName='recomment' size={25} marginR-x />
                    <TextApp style={styles.title} text={"setting.advertisement"} />
                </TouchableOpacity>
            </View>
            <View marginB-x style={styles.over}>
                <TouchableOpacity padding-x row left onPress={() => { navigation.navigate('Payment') }}>
                    <Icon assetName='wallet' size={25} marginR-x />
                    <TextApp style={styles.title} text={"setting.payment"} />
                </TouchableOpacity>
            </View>
            <View marginB-x style={styles.over}>
                <TouchableOpacity padding-x row left onPress={() => { }}>
                    <Icon assetName='link' size={25} marginR-x />
                    <TextApp style={styles.title} text={"setting.link"} />
                </TouchableOpacity>
            </View>
            <View marginB-x style={styles.over}>
                <TouchableOpacity padding-x row left onPress={() => { }}>
                    <Icon assetName='insurance' size={25} marginR-x />
                    <TextApp style={styles.title} text={"setting.privacy_policy"} />
                </TouchableOpacity>
            </View>
            <View marginB-x style={styles.over}>
                <TouchableOpacity padding-x row left onPress={() => { navigation.navigate('HelpSupport') }}>
                    <Icon assetName='question' size={25} marginR-x />
                    <TextApp style={styles.title} text={"setting.help"} />
                </TouchableOpacity>
            </View>
            <View marginB-x style={styles.over}>
                <TouchableOpacity padding-x row left onPress={() => { navigation.navigate('MessageSetting') }}>
                    <Icon assetName='send' size={25} marginR-x />
                    <TextApp style={styles.title} text={"setting.setting_message"} />
                </TouchableOpacity>
            </View>
            <View marginB-x style={styles.over}>
                <TouchableOpacity padding-x row left onPress={() => { navigation.navigate('About') }}>
                    <Icon assetName='info' size={25} marginR-x />
                    <TextApp style={styles.title} text={"setting.about_us"} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default OptionSetting

const styles = StyleSheet.create({
    over: {
        borderRadius: 5,
        overflow: 'hidden',
        borderWidth: 1,
    },
    title: {
        fontSize: 16,
    }
})