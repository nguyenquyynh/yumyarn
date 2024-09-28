import { StyleSheet, ToastAndroid } from 'react-native'
import React, { memo } from 'react'
import Modals from 'components/BottomSheetApp'
import { FlatList } from 'react-native-gesture-handler'
import RenderOptionModal from './common/RenderOptionModal'
import { useSelector } from 'react-redux'
import { follower } from 'src/hooks/api/profile'
import { useNavigation } from '@react-navigation/native'

const ShowMoreDetailPost = props => {
    const { disable, setDisable, create_post, id_post } = props
    const navigation = useNavigation()
    const auth = useSelector(state => state.auth.user)
    const role = auth._id === create_post ? 'ME' : 'OTHER'

    const handlerFollow = async () => {
        const follow = await follower({ user: auth._id, follower: create_post })
        if (follow.status) {
            setDisable(false)
            ToastAndroid.show(follow.data, ToastAndroid.SHORT)
        } else {
            ToastAndroid.show("Have a problem, Try again!", ToastAndroid.SHORT)
        }
    }
    const option = [
        { id: 1, role: "OTHER", img: "follow", title: "post.follow", disription: "post.follow_d", funt: handlerFollow },
        { id: 2, role: "ME", img: "recomment", title: "post.advertisement", disription: "post.advertisement_d", funt: () => {
                setDisable(false)
                navigation.navigate('BuyAdvertisement', { post: id_post })
            }
        },
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