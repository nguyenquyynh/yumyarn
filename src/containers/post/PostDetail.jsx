import { Dimensions, FlatList, Pressable, ScrollView, StyleSheet } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { Avatar, Colors, Icon, LoaderScreen, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { useNavigation } from '@react-navigation/native'
import MediaPost from 'components/posts/MediaPost'
import HearDetailPost from 'components/posts/HearDetailPost'
import numberFormat from 'configs/ui/format'
import { firePost } from 'src/hooks/api/fire'
import { useSelector } from 'react-redux'
import { watchPost } from 'src/hooks/api/post'
import { EB, EBI, ELI, M } from 'configs/fonts'
import ShowComments from 'containers/comment/ShowComments'
import ShowMoreDetailPost from 'components/posts/ShowMoreDetailPost'
import ShowShareDetailPost from 'components/posts/ShowShareDetailPost'

const PostDetail = ({ route }) => {
    const { id } = route.params
    const heightscreen = Dimensions.get('window').height
    const navigation = useNavigation()
    const user = useSelector(state => state.auth.user)
    const [post, setPost] = useState(null)
    const [isfire, setIsfire] = useState(false)
    const [iscomment, setiscomment] = useState(false)
    const [ismore, setIsmore] = useState(false)
    const [dots, setDots] = useState(false)
    const [issaved, setissaved] = useState(false)
    const [isshare, setIsshare] = useState(false)

    const getPost = async (query) => {
        const reponse = await watchPost(query)
        if (reponse.status) {
            setPost(reponse.data[0])
        }
    }
    useEffect(() => {
        getPost({
            u: user._id,
            p: id
        })
    }, [])
    useEffect(() => {
        setIsfire(post?.isfire)
    }, [post])


    const handlerPressFire = async () => {
        const fire = await firePost(user._id, id)
        if (fire?.status) {
            setIsfire(fire?.data)
            setPost({ ...post, isfire: fire?.data, fires: fire?.data ? post?.fires + 1 : post?.fires - 1 })
        }
    }
    const handlerPressSaved = () => {
        setissaved(!issaved)
    }
    const handlerClickAvatar = () => {
        navigation.navigate('OtherProfile', { name: post?.create_by?.name })
    }


    return (
        <View flex right>
            {post && <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal
                pagingEnabled={true}
                snapToAlignment='center'
                data={post.media}
                renderItem={item => <MediaPost data={item} />}
                key={item => item.id}
            />}
            <HearDetailPost back={() => navigation.goBack()} dot={() => { setDots(!dots) }} />
            <View flex absB padding-x style={{ maxHeight: heightscreen / 2 }}>
                <View flex row marginB-x>
                    <Avatar source={{ uri: post ? post?.create_by?.avatar : "https://cdn.pixabay.com/photo/2014/04/02/10/25/man-303792_1280.png" }}
                        size={40} onPress={handlerClickAvatar} />
                    <TouchableOpacity onPress={handlerClickAvatar} flex marginL-v >
                        <Text style={{ fontFamily: EB }} color='white'>{post?.create_by?.name}</Text>
                        <Text style={{ fontFamily: ELI }} text80L numberOfLines={1} color='white'>@{post?.create_by?.tagName}</Text>
                    </TouchableOpacity>
                </View>
                {post?.hashtags.length != 0 &&
                    <View row>
                        {post?.hashtags.map((el) => (
                            <Text key={el}
                                onPress={() => { navigation.navigate('Search', { inputkey: el }) }}
                                style={{ fontFamily: EBI }}
                                color={Colors.yellow}>#{el} </Text>))}
                    </View>

                }
                <ScrollView>
                    <Text text90L style={{ fontFamily: M }} color={Colors.white} numberOfLines={ismore ? 10000 : 2}
                        onPress={() => { setIsmore(!ismore) }}>{post?.content}</Text>
                </ScrollView>
                <View marginT-x width={'100%'} spread row paddingH-xx>
                    <TouchableOpacity row centerV onPress={handlerPressFire}>
                        <Icon tintColor={!isfire && 'white'} assetName={isfire ? 'fire' : 'fire_black'} size={20} />
                        <Text marginL-v text80BO color={'white'}>{numberFormat(post?.fires)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity row centerV onPress={() => { setiscomment(!iscomment) }}>
                        <Icon tintColor='white' assetName='comment' size={20} />
                        <Text marginL-v text80BO color={'white'}>{numberFormat(post?.comments)}</Text>
                    </TouchableOpacity>
                    <Pressable onPress={() => { setIsshare(!isshare) }}>
                        <Icon tintColor='white' assetName={'share'} size={20} />
                    </Pressable>
                    <Pressable onPress={() => { }}>
                        <Icon tintColor='white' assetName='flag' size={20} />
                    </Pressable>
                    <Pressable onPress={handlerPressSaved}>
                        <Icon assetName='bookmark' tintColor={issaved ? Colors.yellow : 'white'} size={20} />
                    </Pressable>
                </View>
            </View>
            <ShowComments idPost={post?._id} setOpen={setiscomment} open={iscomment} create_by={post?.create_by} dataPost={[]} setDataPost={() => { }} setIdPost={() => { }} />
            <ShowMoreDetailPost disable={dots} setDisable={setDots} create_post={post?.create_by?._id} id_post={post?._id}/>
            <ShowShareDetailPost disable={isshare} setDisable={setIsshare} post_id={post?._id} />
        </View>
    )
}

export default memo(PostDetail)
const styles = StyleSheet.create({
})