import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';
import IconApp from 'components/IconApp';
import { history_remaove } from 'reducers/search';

const HistoryList = ({
    keyword,
    setKeyword,
}) => {
    const dispatch = useDispatch()
    const data_history = useSelector(state => state.search.history);
    const [history, setHistory] = useState(data_history);

    useEffect(() => {
        if (keyword.trim() != "") {
            setHistory(data_history.filter(item => item.includes(keyword.trim())))
        } else {
            setHistory(data_history)
        }
    }, [keyword])

    const handlerRemoveHistory = (item) => {
        setHistory(data_history.filter(el => el != item))
        dispatch(history_remaove(item))
    }
    const renderItemHistory = (item) => {
        return (
            <View flex row padding-x centerV spread>
                <TouchableOpacity row centerV flex-9 onPress={() => { setKeyword(item) }}>
                    <IconApp assetName={"history"} />
                    <View marginL-x>
                        <Text numberOfLines={1} text70BO>{item.length > 30 ? item.substring(0, 30) + '...' : item}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity flex-1 center onPress={() => { handlerRemoveHistory(item) }}>
                    <IconApp assetName={"core"} size={15} />
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <View flex paddingH-x bg-white>
            {history && (
                <FlatList
                    data={history}
                    keyExtractor={() => Math.random() * 100}
                    renderItem={({ item }) => renderItemHistory(item)}
                />
            )}
        </View>
    );
};

export default HistoryList;
