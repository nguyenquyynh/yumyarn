import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import Modals from 'components/BottomSheetApp'
import { FlatList } from 'react-native-gesture-handler'
import RenderOptionModal from './common/RenderOptionModal'

const ShowShareDetailPost = props => {
    const { disable, setDisable, post_id } = props

    const option = [
        { id: 1, img: "retweet", title: "post.retweet", disription: "post.retweet_d", funt: () => { } },
        { id: 2, img: "link", title: "post.copylink", disription: "post.copylink_d", funt: () => { } },
    ]

    return (
        <Modals modalVisible={disable} modalhiden={() => { setDisable(!disable) }}>
            <View>
                <FlatList
                    data={option}
                    key={(item) => item.id}
                    renderItem={({ item }) => <RenderOptionModal item={item} />}
                />
            </View>
        </Modals>
    )
}

export default memo(ShowShareDetailPost)

const styles = StyleSheet.create({})