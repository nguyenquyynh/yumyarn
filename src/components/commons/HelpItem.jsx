import { LayoutAnimation, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Colors, Image, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { ChevronDown, ChevronRight } from 'lucide-react-native'
import { millisecondsToDate } from 'configs/ui/time'

const REQUEST_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  REFUSE: 'REFUSE',
}

const HelpItem = ({
  item
}) => {
  const [open, setOpen] = useState(false)

  const onPress = () => {
    setOpen(!open)
    LayoutAnimation.easeInEaseOut()
  }

  const returnColor = (status) => {
    switch (status) {
      case REQUEST_STATUS.PENDING:
        return Colors.pendding

      case REQUEST_STATUS.SUCCESS:
        return Colors.success

      case REQUEST_STATUS.REFUSE:
        return Colors.cancel

      default:
        break;
    }
  }

  return (
    <TouchableOpacity onPress={onPress} marginB-5 paddingV-10 style={{borderBottomWidth: 1}}>
      <View row spread>
        <View centerV>
          <Text text90BO center style={{ paddingHorizontal: 5, backgroundColor: returnColor(item.status), borderRadius: 10 }}>{item.status}</Text>
          <Text >{millisecondsToDate(item.create_at)}</Text>
        </View>
        {!open ? <ChevronRight /> : <ChevronDown />}
      </View>
      <Text numberOfLines={open ? 1000 : 1}>{item.content}</Text>
    </TouchableOpacity>
  )
}

export default HelpItem

const styles = StyleSheet.create({

})