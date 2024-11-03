import { StyleSheet } from 'react-native';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native-ui-lib';

const Avatar = ({ source, size , onPress, style }) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress} height={size} width={size} style={[style, styles.over, { borderRadius: 360 }]}>
            <Image
                style={[styles.image, { width: size, height: size }]}
                source={{ uri: source?.uri || 'https://i.pinimg.com/originals/ff/a0/9a/ffa09aec412db3f54deadf1b3781de2a.png' }}
            />
        </TouchableOpacity>
        </View>
    );
};

export default Avatar;

const styles = StyleSheet.create({
    over: {
        overflow: 'hidden',
    },
    image: {
        resizeMode: 'cover' // Đảm bảo hình ảnh không bị biến dạng và lấp đầy vùng
    }
});
