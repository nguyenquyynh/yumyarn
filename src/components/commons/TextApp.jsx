import React from 'react'
import { Translation } from 'react-i18next'
import { Colors, Text } from 'react-native-ui-lib'

const TextApp = ({
  funt = () => { },
  style,
  text,
  color,
  size,
  props
}) => {
  return (
    <Translation>
      {(t) => <Text onPress={funt} title color={color || Colors.black} style={[style, size && { fontSize: size }]}>{t(text)} </Text>}
    </Translation>
  )
}

export default TextApp
