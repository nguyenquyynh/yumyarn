import { StyleSheet, ToastAndroid } from 'react-native'
import React, { memo, useState } from 'react'
import Modals from 'components/BottomSheetApp'
import { FlatList } from 'react-native-gesture-handler'
import RenderOptionModal from './common/RenderOptionModal'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { createFollow } from 'src/hooks/api/follow'

const ShowMoreDetailPost = props => {
    const { disable, setDisable, create_post, id_post, post, setShownoti } = props
    const navigation = useNavigation()
    const auth = useSelector(state => state.auth.user)
    const role = ((auth._id === create_post) || (auth._id === post?.repost_by?._id)) ? 'ME' : 'OTHER'

    const handlerFollow = async () => {
        const follow = await createFollow(auth._id, create_post)
        if (follow.status) {
            setDisable(false)
            ToastAndroid.show(follow.data, ToastAndroid.SHORT)
        } else {
            ToastAndroid.show("Have a problem, Try again!", ToastAndroid.SHORT)
        }
    }

    const handlerEditPost = () => {
        setDisable(false)
        navigation.navigate('EditPost', { post: post })
    }
    const option = [
        { id: 1, role: "OTHER", img: "follow", title: "post.follow", disription: "post.follow_d", funt: handlerFollow },
        {
            id: 2, role: "ME", img: "recomment", title: "post.advertisement", disription: "post.advertisement_d", funt: () => {
                setDisable(false)
                navigation.navigate('BuyAdvertisement', { post: id_post })
            }
        },
        { id: 3, role: post?.repost_by ? 'DIFF' : 'ME', img: "edit", title: "post.edit", disription: "post.edit_d", funt: handlerEditPost },
        { id: 4, role: ((post?.repost_by?._id === auth?._id) || (!post?.repost_by && post?.create_by?._id === auth?._id)) ? "ME" : 'DIFF', img: "remove", title: "post.remove", disription: "post.remove_d", funt: () => {setShownoti(); setDisable(false)} },
    ]
    return (
        <>
            <Modals modalVisible={disable} modalhiden={() => { setDisable(!disable) }}>
                <FlatList
                    data={option}
                    key={(item) => item.id}
                    renderItem={({ item }) => role === item.role && <RenderOptionModal item={item} />}
                />
            </Modals>

        </>
    )
}

export default memo(ShowMoreDetailPost)

const styles = StyleSheet.create({})