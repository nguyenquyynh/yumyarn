import { Dimensions, Pressable, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import Wapper from 'components/Wapper'
import { Colors, View } from 'react-native-ui-lib'
import IconApp from 'components/IconApp'
import LinearGradient from 'react-native-linear-gradient'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import HistoryList from './HistoryList'
import SearchList from './SearchList'
import { useDispatch } from 'react-redux'
import { history_addsearch } from 'reducers/search'
import { add_search, search_post, search_user } from 'src/hooks/api/search'

const SearchMain = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [keyword, setKeyword] = useState('')
    const [data_search, setData_search] = useState()
    var windowWidth = Dimensions.get('window').width;

    const gotoScreen = (srceen, props) => {
        navigation.navigate(srceen, props)
    }
    const hanlderSearch = async () => {
        if (keyword.trim().length > 0) {
            dispatch(history_addsearch(keyword))
            await add_search(keyword)
            const resault_post = await search_post(keyword, 1)
            const resault_user = await search_user(keyword, 1, "66864113e67776aad635649b")
            setData_search({
                posts: resault_post,
                user: resault_user
            })
        }
    }
    const handlerFocus = () => {
        setData_search(null)
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
                        <Pressable onPress={() => { navigation.goBack() }}>
                            <IconApp assetName={"back"} size={windowWidth / 22} />
                        </Pressable>
                        <View bg-white row flex br20 marginL-xvi centerV paddingL-x style={styles.searchinput}>
                            <View flex>
                                <TextInput placeholder={t("app.search")} value={keyword}
                                    onFocus={handlerFocus}
                                    onChangeText={value => setKeyword(value)} />
                            </View>
                            <View paddingH-x>
                                <Pressable onPress={hanlderSearch}>
                                    <IconApp assetName={"search"} size={20} />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <Wapper gadient header customheader={customerHeader}>
            {
                data_search ? <SearchList data={data_search} keyword={keyword}/> : <HistoryList keyword={keyword} setKeyword={setKeyword} />
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