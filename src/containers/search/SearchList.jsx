import { Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import PostSearch from './PostSearch'
import UserSearch from './UserSearch'
import { Colors, Text, TouchableOpacity, View } from 'react-native-ui-lib'
import { t } from 'lang'
import { BOLD } from 'configs/fonts'

const SearchList = ({
  keyword,
  data,
  navigation
}) => {
  const Toptab = createMaterialTopTabNavigator()

  const CustomTabBar = ({ state, descriptors, navigation
  }) => {
    return (
      <View row marginL-v>
        {state.routes.map((route) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title;

          const isFocused = state.index === state.routes.indexOf(route);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,

            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{
                marginRight: 15, height: 50,
                paddingHorizontal: 10,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: Colors.yellow,
                borderBottomWidth: isFocused ? 2.5 : 0
              }}
            >
              <Text text70BO color={Colors.black} style={{ fontWeight: isFocused ? 'bold' : '' }}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View flex bg-white paddingH-v>
      <Toptab.Navigator tabBar={props => <CustomTabBar {...props} />}>
        <Toptab.Screen name={t("app.post")} component={PostSearch} initialParams={{ data, keyword }} />
        <Toptab.Screen name={t("app.user")} component={UserSearch} initialParams={{ data, keyword }} />
      </Toptab.Navigator>
    </View>

  )
}

export default SearchList