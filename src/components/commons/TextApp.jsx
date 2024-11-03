import { StyleSheet } from 'react-native'
import React from 'react'
import { Translation } from 'react-i18next'
import { Colors, Text } from 'react-native-ui-lib'

const TextApp = ({
  style,
  text,
  color,
  size,
  props
}) => {
  return (
    <Translation>
      {(t, { i18n }) => <Text title color={color || Colors.black} style={[style, size && { fontSize: size }]}>{t(text)} </Text>}
    </Translation>
  )
}

export default TextApp

const styles = StyleSheet.create({})