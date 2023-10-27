import React, {useState} from 'react';
import {
  Button,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ListRenderItemInfo} from '@react-native/virtualized-lists/Lists/VirtualizedList';

const ColorArr = [
  '#e77676',
  '#dccda6',
  '#bdbbde',
  '#85e187',
  '#93f1e0',
  '#fff',
];

type Item = {
  key: number;
};

function renderItem({item}: ListRenderItemInfo<Item>) {
  let i = (item.key - 1) % ColorArr.length;
  const height = (ColorArr.length - i) * 130;
  return (
    <View
      style={{
        height,
        backgroundColor: ColorArr[i],
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={styles.itemTitle}>{item.key}</Text>
    </View>
  );
}

let intervalTask: any;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [data, setData] = useState([{key: 1}]);
  function onStart() {
    console.log('start');
    intervalTask = setInterval(() => {
      setData(preData => {
        console.log('preData length', preData.length);
        return [{key: preData[0].key + 1}, ...preData];
      });
    }, 500);
  }
  function onStop() {
    console.log('stop');
    clearInterval(intervalTask);
  }
  console.log('render', data.length);
  return (
    <View style={styles.content}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? Colors.darker : Colors.lighter}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        style={styles.content}
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: 10,
          minIndexForVisible: 0,
        }}
        // windowSize={320}
        inverted
      />
      <View style={styles.buttonContainer}>
        <Button title="Start" onPress={onStart} />
        <Text>Data size: {data.length}</Text>
        <Button title="Stop" color="#DC2740" onPress={onStop} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  itemTitle: {
    color: '#333',
    fontSize: 38,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
  },
});

export default App;
