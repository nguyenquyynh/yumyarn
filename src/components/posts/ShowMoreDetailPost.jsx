import { StyleSheet } from 'react-native'
import React, { memo } from 'react'
import Modals from 'components/BottomSheetApp'
import { FlatList } from 'react-native-gesture-handler'
import RenderOptionModal from './common/RenderOptionModal'
import { useSelector } from 'react-redux'

const ShowMoreDetailPost = props => {
    const { disable, setDisable, create_post } = props
    const auth = useSelector(state => state.auth.user)
    const role = auth._id === create_post ? 'ME' : 'OTHER'

    const option = [
        { id: 1, role: "OTHER", img: "follow", title: "post.follow", disription: "post.follow_d", funt: () => { } },
        { id: 2, role: "ME", img: "recomment", title: "post.advertisement", disription: "post.advertisement_d", funt: () => { } },
        { id: 3, role: "ME", img: "edit", title: "post.edit", disription: "post.edit_d", funt: () => { } },
        { id: 4, role: "ME", img: "remove", title: "post.remove", disription: "post.remove_d", funt: () => { } },
    ]

    return (
        <Modals modalVisible={disable} modalhiden={() => { setDisable(!disable) }}>
            <FlatList
                data={option}
                key={(item) => item.id}
                renderItem={({ item }) => role === item.role && <RenderOptionModal item={item} />}
            />
        </Modals>
    )
}

export default memo(ShowMoreDetailPost)

const styles = StyleSheet.create({})