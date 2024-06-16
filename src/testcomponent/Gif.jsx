import { Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { Text, View } from 'react-native-ui-lib';
import IconApp from 'components/IconApp';
import { t } from 'lang';
const Gif = ({
    loading = false,
}) => {
    const windowWidth = Dimensions.get('window').width;
    return (
        <View flex>
            {loading && <View flex bg-white >
                <View flex center><IconApp assetName={"starving"} size={windowWidth / 4} /></View>
                <View flex bottom absF centerH padding-x>
                    <Text text70BO>{t("loading.content")}</Text>
                </View>
            </View>}
        </View>
    )
}

export default Gif

const styles = StyleSheet.create({

})