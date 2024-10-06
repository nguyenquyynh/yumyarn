import { Pressable, StyleSheet, TextInput } from 'react-native'
import React, { useState } from 'react'
import Wapper from 'components/Wapper'
import { Colors, Icon, TouchableOpacity, View } from 'react-native-ui-lib'
import IconApp from 'components/IconApp'
import { t } from 'lang'
import { useNavigation } from '@react-navigation/native'
import HistoryList from './HistoryList'
import SearchList from './SearchList'
import { useDispatch, useSelector } from 'react-redux'
import { history_addsearch } from 'reducers/search'
import { search_post, search_user } from 'src/hooks/api/search'

const SearchMain = ({ route }) => {
    const inputkey = route.params?.inputkey
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const [keyword, setKeyword] = useState(inputkey || '')
    const [data_search, setData_search] = useState()

    const hanlderSearch = async () => {
        if (keyword.trim().length > 0) {
            dispatch(history_addsearch(keyword))
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
            <View flex bg-white>
                <View absF bottom paddingB-xi>
                    <View centerV row paddingH-xvi>
                        <TouchableOpacity br40 bg-yellow padding-x onPress={() => navigation.goBack()}>
                            <Icon assetName='arrow_back' size={15} tintColor='white' />
                        </TouchableOpacity>
                        <View row spread flex-1 br100 marginH-x centerV paddingH-x style={styles.searchinput}>
                            <Pressable onPress={hanlderSearch}>
                                <IconApp assetName={"search"} size={20} />
                            </Pressable>
                            <TextInput style={{ flex: 1, color: 'black' }} placeholder={t("app.search")} value={keyword}
                                onFocus={handlerFocus}
                                onChangeText={value => setKeyword(value)} />
                            <Pressable onPress={() => { setKeyword('') }}>
                                <IconApp assetName={"cancel"} size={20} />
                            </Pressable>
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
        height: 40,
        borderBottomWidth: 1,
        borderWidth: 1,
        backgroundColor: "white",
        borderColor: 'black',
        elevation: 10,
    },
    content: {
        borderTopWidth: 1,
        borderColor: Colors.gray,
    }
})