import { Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { Text, View } from 'react-native-ui-lib';
import IconApp from 'components/IconApp';
import { t } from 'lang';
const LoadingApp = ({
}) => {
    const windowWidth = Dimensions.get('window').width;
    return (
        <View flex>
            <View flex bg-white >
                <View flex center><IconApp assetName={"starving"} size={windowWidth / 4} /></View>
                <View flex bottom absF centerH padding-x>
                    <Text style={{fontSize: windowWidth/25}}>{t("loading.content")}</Text>
                </View>
            </View>
        </View>
    )
}

export default LoadingApp

const styles = StyleSheet.create({})