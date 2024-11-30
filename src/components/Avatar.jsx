import { StyleSheet } from 'react-native';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native-ui-lib';
import { DEFAULT } from 'src/data/default';

const Avatar = ({ source, size, onPress, style }) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress} height={size} width={size} style={[style, styles.over, { borderRadius: 360 }]}>
                <Image
                    style={[styles.image, { width: size, height: size }]}
                    source={{ uri: source?.uri || DEFAULT.AVATAR }}
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
