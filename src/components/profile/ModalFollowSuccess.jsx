import { Modal, StyleSheet } from 'react-native'
import {
    View,
} from 'react-native-ui-lib';
import React from 'react'
import LottieView from 'lottie-react-native';
import lottie from 'configs/ui/lottie';

const ModalFollowSuccess = ({ statusFollowSuccess, onLottieSuccess }) => {
    return (
        <Modal visible={statusFollowSuccess} animationType='fade' transparent>
            <View flex centerH centerV>
               <LottieView source={lottie.Success} autoPlay loop={false} style={{width:300, height:300}} onAnimationFinish={onLottieSuccess} />
            </View>
        </Modal>
    )
}

export default ModalFollowSuccess

const styles = StyleSheet.create({})