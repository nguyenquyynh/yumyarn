import { Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import PostSearch from './PostSearch'
import UserSearch from './UserSearch'
import { Colors, View } from 'react-native-ui-lib'
import { t } from 'lang'
import { BOLD } from 'configs/fonts'

const SearchList = ({
  keyword,
  data
}) => {
  var windowWidth = Dimensions.get('window').width;
  const Toptab = createMaterialTopTabNavigator()
  const tabBarIndicatorStyle = {
    width: (windowWidth - 40) / 3,
    marginLeft: (windowWidth - 40) / 12,
    ...styles.tabbarindicator
  };

  return (
    <View flex bg-white paddingH-xx>
      <Toptab.Navigator screenOptions={{
        tabBarIndicatorStyle: tabBarIndicatorStyle,
        tabBarStyle: styles.tabbar,
        tabBarLabelStyle: styles.tabbarlabel,
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: 'gray',
        tabBarPressColor: Colors.transparent
      }}>
        <Toptab.Screen name={t("app.post")} component={PostSearch} initialParams={{ data, keyword }} />
        <Toptab.Screen name={t("app.user")} component={UserSearch} initialParams={{ data, keyword }} />
      </Toptab.Navigator>
    </View>

  )
}

export default SearchList

const styles = StyleSheet.create({
  tabbarindicator: {
    height: 2,
    backgroundColor: Colors.black,
    marginBottom: 1
  },
  tabbar: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  tabbarlabel: {
    fontWeight: 'bold',
  }
})