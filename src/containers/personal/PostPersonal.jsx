import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { Text } from 'react-native-ui-lib';

const screenHeight = Dimensions.get('window').height;

const PostPersonal = () => {
  const list = [
    { "_id": "1", "name": "khoi" },
    { "_id": "2", "name": "khoi" },
    { "_id": "3", "name": "khoi" },
    { "_id": "4", "name": "khoi" },
    { "_id": "5", "name": "khoi" },
    { "_id": "6", "name": "khoi" },
    { "_id": "7", "name": "khoi" },
    { "_id": "8", "name": "khoi" },
    { "_id": "9", "name": "khoi" },
    { "_id": "10", "name": "khoi" },
  ];

  const [data, setdata] = useState(list);

  const renderItem = ({ item }) => (
    <Text text10BO>{item.name}</Text>
  );

  const renderHeader = () => (
    <View>
      <Text>các thông tin</Text>
      <Text>các thông tin</Text>
      <Text>các thông tin</Text>
      <Text>các thông tin</Text>
      <Text>các thông tin</Text>
      <Text>các thông tin</Text>
      <Text>các thông tin</Text>
      <Text>các thông tin</Text>
      <Text>các thông tin</Text>
      <Text>các thông tin</Text>
      <Text>các thông tin</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={{ 
          height: screenHeight / 3, 
          justifyContent: 'center',
        }}
        contentContainerStyle={{ 
          flexGrow: 1 
        }}
      />
    </View>
  );
};

export default PostPersonal;

const styles = StyleSheet.create({});
