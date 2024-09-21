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
import { t } from 'lang'
import ShowComments from 'containers/comment/ShowComments'
import Modals from 'components/BottomSheetApp'

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

    const getPost = async (query) => {
        const reponse = await watchPost(query)
        if (reponse.status) {
            setPost(reponse.data[0])
        }
        console.log(reponse.data[0]);
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
        const fire = await firePost(user, id)
        if (fire?.status) {
            setIsfire(!isfire)
        }
    }
    const handlerPressComment = () => {
        setiscomment(!iscomment)
    }
    const handlerPressMore = () => {
        setIsmore(!ismore)
    }
    const handlerPressDots = () => {
        setDots(!dots)
    }
    const handlerPressReport = () => {

    }
    const handlerPressSaved = () => {
        setissaved(!issaved)
    }
    const handlerPressFlag = () => {

    }
    const handlerClickAvatar = () => {

    }


    if (post == null) {

    }
    else
        return (
            <View flex right>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    pagingEnabled={true}
                    snapToAlignment='center'
                    data={post.media}
                    renderItem={item => <MediaPost data={item} />}
                    key={item => item.id}
                />
                <HearDetailPost back={() => navigation.goBack()} dot={handlerPressDots} />
                <View flex absB padding-x style={{ maxHeight: heightscreen / 2 }}>
                    <View flex row marginB-x>
                        <Avatar source={{ uri: post?.create_by?.avatar }} size={40} onPress={handlerClickAvatar} />
                        <View flex marginL-v >
                            <Text style={{ fontFamily: EB }} color='white'>{post?.create_by?.name}</Text>
                            <Text style={{ fontFamily: ELI }} text80L numberOfLines={1} color='white'>@{post?.create_by?.tagName}</Text>
                        </View>
                    </View>
                    <Text style={{ fontFamily: EBI }} color={Colors.yellow}>{post?.hashtags.map((el) => `#${el} `)}</Text>
                    <ScrollView>
                        <Text text90L style={{ fontFamily: M }} color={Colors.white} numberOfLines={ismore ? 10000 : 2}
                            onPress={handlerPressMore}>{post?.content}...{!ismore ? t("app.more") : t("app.hiden")}</Text>
                    </ScrollView>
                    <View marginT-x width={'100%'} spread row paddingH-xx>
                        <View row centerV>
                            <Pressable onPress={handlerPressFire}>
                                <Icon tintColor={!isfire && 'white'} assetName={isfire ? 'fire' : 'fire_black'} size={20} />
                            </Pressable>
                            <Text marginL-v text80BO color={'white'}>{numberFormat(!isfire ? post?.fires : (post?.fires + 1))}</Text>
                        </View>
                        <View row centerV>
                            <Pressable onPress={handlerPressComment}>
                                <Icon tintColor='white' assetName='comment' size={20} />
                            </Pressable>
                            <Text marginL-v text80BO color={'white'}>{numberFormat(post?.comments)}</Text>
                        </View>
                        <Pressable onPress={handlerPressReport}>
                            <Icon tintColor='white' assetName={'share'} size={20} />
                        </Pressable>
                        <Pressable onPress={handlerPressFlag}>
                            <Icon tintColor='white' assetName='flag' size={20} />
                        </Pressable>
                        <Pressable onPress={handlerPressSaved}>
                            <Icon assetName='bookmark' tintColor={issaved ? Colors.yellow : 'white'} size={20} />
                        </Pressable>
                    </View>
                </View>
                <ShowComments idPost={post?._id} setOpen={setiscomment} open={iscomment} create_by={post?.create_by} dataPost={[]} setDataPost={() => { }} setIdPost={() => { }} />
                <Modals modalVisible={dots} modalhiden={handlerPressDots}>
                    
                </Modals>
            </View>
        )
}

export default memo(PostDetail)
const styles = StyleSheet.create({
})