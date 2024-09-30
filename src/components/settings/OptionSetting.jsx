import { FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { Icon, TouchableOpacity, View } from 'react-native-ui-lib'
import TextApp from 'components/commons/TextApp'

const OptionSetting = ({ navigation }) => {

    const options = [
        { id: 1, title: "setting.saved", icon: "crop", funt: () => { navigation.navigate('PostSaved') } },
        { id: 2, title: "setting.advertisement", icon: "flash", funt: () => { navigation.navigate('Advertisement') } },
        { id: 3, title: "setting.payment", icon: "wallet", funt: () => { navigation.navigate('Payment') } },
        { id: 4, title: "setting.link", icon: "link", funt: () => { } },
        { id: 5, title: "setting.privacy_policy", icon: "insurance", funt: () => { } },
        { id: 6, title: "setting.help", icon: "question", funt: () => { navigation.navigate('HelpSupport') } },
        { id: 7, title: "setting.setting_message", icon: "un_flash", funt: () => { navigation.navigate('MessageSetting') } },
        { id: 8, title: "setting.about_us", icon: "info", funt: () => { navigation.navigate('About') } },
    ]

    return (
        <View flex marginT-x>
            <FlatList
                scrollEnabled={false}
                data={options}
                key={(item) => item.id}
                renderItem={({ item }) => (
                    <View marginB-x style={styles.over}>
                        <TouchableOpacity padding-x row left onPress={item.funt}>
                            <Icon assetName={item.icon} size={25} marginR-x tintColor='black' />
                            <TextApp style={styles.title} text={item.title} />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    )
}

export default OptionSetting

const styles = StyleSheet.create({
    over: {
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: 'white',
        elevation: 2,
    },
    title: {
        fontSize: 16,
    }
})