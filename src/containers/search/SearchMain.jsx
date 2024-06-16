import { Dimensions, Pressable, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import Wapper from 'components/Wapper'
import { Colors, View } from 'react-native-ui-lib'
import IconApp from 'components/IconApp'
import LinearGradient from 'react-native-linear-gradient'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'

const SearchMain = () => {
    const navigation = useNavigation()
    const [keyword, setKeyword] = useState('')
    const [data_search, setData_search] = useState(false)
    var windowWidth = Dimensions.get('window').width;

    const gotoScreen = (srceen, props) => {
        navigation.navigate(srceen, props)
    }
    const customerHeader = () => {
        return (
            <View flex>
                <LinearGradient
                    start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}
                    locations={[0, 1]}
                    colors={[Colors.yellow, Colors.white]}
                    style={{ height: '100%' }}
                />
                <View absF bottom paddingB-xi>
                    <View centerV row paddingH-xvi>
                        <Pressable onPress={()=> {navigation.goBack()}}>
                            <IconApp assetName={"back"} size={windowWidth / 22} />
                        </Pressable>
                        <View bg-white flex br20 marginL-xvi paddingL-x style={styles.searchinput}>
                            <TextInput placeholder={t("app.search")} value={keyword} onChangeText={value => setKeyword(value)}/>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    const renderDataSearch = () => {
        
    }
    const renderHistory = () => {

    }
    return (
        <Wapper gadient header customheader={customerHeader}>
            {
                data_search ? renderDataSearch : renderHistory  
            }
        </Wapper>
    )
}

export default SearchMain

const styles = StyleSheet.create({
    searchinput: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5, // for Android
    }
})