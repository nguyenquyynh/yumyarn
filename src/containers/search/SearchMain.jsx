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
import { useDispatch, useSelector } from 'react-redux'
import { history_addsearch } from 'reducers/search'
import { add_search, search_post, search_user } from 'src/hooks/api/search'

const SearchMain = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth)
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
            const resault_user = await search_user(keyword, 1, user._id)
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
                <View absF bottom paddingB-xi>
                    <View centerV row paddingH-xvi>
                        <Pressable onPress={() => { navigation.goBack() }}>
                            <IconApp assetName={"back"} size={22} />
                        </Pressable>
                        <View bg-white row flex br20 marginL-xvi centerV paddingL-x style={styles.searchinput}>
                            <View flex-14>
                                <TextInput placeholder={t("app.search")} value={keyword}
                                    onFocus={handlerFocus}
                                    onChangeText={value => setKeyword(value)} />
                            </View>
                            <View padding-x flex-1>
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
        <Wapper gadient customheader={customerHeader}>
            {
                data_search ? <SearchList data={data_search} keyword={keyword} /> : <HistoryList keyword={keyword} setKeyword={setKeyword} />
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