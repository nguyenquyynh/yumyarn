import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, LayoutAnimation, ScrollView } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';
import IconApp from 'components/IconApp';
import { history_remaove } from 'reducers/search';
import { get_suggest } from 'src/hooks/api/search';
import { removeSpecialCharacters } from 'src/libs/InputValidate';

const HistoryList = ({
    keyword,
    setKeyword,
    hanlderSearch
}) => {
    const dispatch = useDispatch()
    const data_history = useSelector(state => state.search.history);
    const [history, setHistory] = useState(data_history);
    const [suggest, setSuggest] = useState([])
    const timeoutref = useRef(null)
    useEffect(() => {
        if (removeSpecialCharacters(keyword).trim().length > 0) {
            setHistory(data_history.filter(item => item.toLocaleLowerCase().includes(keyword.toLocaleLowerCase().trim())))
            keywordSearchChange(keyword)
        } else {
            setHistory(data_history)
            setSuggest([])
        }
        LayoutAnimation.easeInEaseOut()
    }, [keyword])
    const handlerRemoveHistory = (item) => {
        setHistory(history.filter(el => el != item))
        dispatch(history_remaove(item))
    }
    const keywordSearchChange = useCallback((keyword) => {
        clearTimeout(timeoutref.current)
        timeoutref.current = setTimeout(async () => {
            const resault = await get_suggest(removeSpecialCharacters(keyword))
            if (resault?.status) {
                setSuggest(resault?.data)
                LayoutAnimation.easeInEaseOut()
            }
        }, 1000)
        LayoutAnimation.easeInEaseOut()
    }, [])
    const renderItemHistory = (item) => {
        return (
            <View flex row padding-x centerV spread>
                <TouchableOpacity row centerV flex-9 onPress={() => {
                    setKeyword(item)
                    hanlderSearch()
                }}>
                    <IconApp assetName={"history"} />
                    <View marginL-x>
                        <Text numberOfLines={1} text70BO>{item}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity flex-1 center onPress={() => { handlerRemoveHistory(item) }}>
                    <IconApp assetName={"core"} size={15} />
                </TouchableOpacity>
            </View>
        )
    }
    const renderItemSuggest = (item) => {
        return (
            <View flex row padding-x centerV spread>
                <TouchableOpacity row centerV flex-9 onPress={() => {
                    setKeyword(item.content)
                    hanlderSearch()
                }}>
                    <IconApp assetName={"fire"} />
                    <View marginL-x>
                        <Text numberOfLines={1} text70BO>{item.content}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View flex paddingH-x bg-white>
            {history && (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <FlatList
                        scrollEnabled={false}
                        data={history}
                        keyExtractor={() => Math.random() * 100}
                        renderItem={({ item }) => renderItemHistory(item)}
                    />
                    {suggest.length > 0 &&
                        <FlatList
                            scrollEnabled={false}
                            data={suggest}
                            keyExtractor={item => item._id}
                            renderItem={({ item }) => renderItemSuggest(item)}
                        />
                    }
                </ScrollView>
            )}
        </View>
    );
};

export default HistoryList;
