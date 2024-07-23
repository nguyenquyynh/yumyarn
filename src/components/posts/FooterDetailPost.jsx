import { Dimensions, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { t } from 'lang'

const FooterDetailPost = ({
    hashtags,
    content,
}) => {
    const [showfullcontent, setShowfullcontent] = useState(false)

    const handlerShowFullContent = () => {
        setShowfullcontent(!showfullcontent)
    }
    return (
        <View flex>
            <View row>
                <ScrollView horizontal>{hashtags.map(hag => <Text text80BO color={Colors.orange} key={hag}> {hag} </Text>)}</ScrollView>
            </View>
            <Text onPress={handlerShowFullContent} color='white' text90BO numberOfLines={!showfullcontent ? 3 : 10000} ellipsizeMode="tail">
                {content}
            </Text>
        </View>
    )
}

export default FooterDetailPost

const styles = StyleSheet.create({
})