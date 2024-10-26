import { Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { Text, View } from 'react-native-ui-lib';
import IconApp from 'components/IconApp';
import { t } from 'lang';
import LottieView from 'lottie-react-native';
import lottie from 'configs/ui/lottie';
const LoadingApp = ({
}) => {
    const windowWidth = Dimensions.get('window').width;
    return (
        <View flex>
            <View flex bg-white >
                <View flex center>
                    <LottieView
                        source={lottie.Loading}
                        autoPlay
                        loop
                        style={{ width: 100, height: 100}}
                    />
                   
                </View>
            </View>
        </View>
    )
}

export default LoadingApp

const styles = StyleSheet.create({})