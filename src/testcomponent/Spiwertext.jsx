import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

const FirstRoute = () => (
  <View style={{   
 flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Posts!</Text>
  </View>
);

const SecondRoute = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>People!</Text>
  </View>
);

const initialLayout = { width: Dimensions.get('window').width };

const MyTabs = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Posts' },
    { key: 'second', title: 'People' },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}   

    />
  );
};

export default MyTabs;