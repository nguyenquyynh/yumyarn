import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'
import { useNavigation } from '@react-navigation/native'

const ZaloWebView = ({ route }) => {
    const navigation = useNavigation()
    const { url } = route.params
    return (
        <WebView source={{ uri: url }} style={{ flex: 1, marginTop: 40 }} />
    )
}

export default ZaloWebView

const styles = StyleSheet.create({})