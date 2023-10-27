import React from 'react';
import {
  Button,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
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

type State = {
  data: Array<Item>;
  time: number;
};

type Props = {
  intervalTask: any;
  shouldUpdate: boolean;
};

const IS_IOS = Platform.OS === 'ios';

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

export default class App extends React.Component<Props, State> {
  state = {
    data: [{key: 1}],
    time: Date.now(),
  };
  intervalTask: any;
  delayShouldUpdateTask: any;
  shouldUpdate = true;

  onStart = () => {
    console.log('start');
    this.intervalTask = setInterval(this.onAddItem, 500);
  };

  onAddItem = () => {
    const {data} = this.state;
    console.log('onAddItem length', data.length);
    this.setState({data: [{key: data[0].key + 1}, ...data]});
  };

  onStop = () => {
    console.log('stop');
    clearInterval(this.intervalTask);
  };

  onScrollBeginDrag = () => {
    if (IS_IOS) return;
    console.log('onScrollBeginDrag');
    this.shouldUpdate = false;
    this.clearDelayShouldUpdateTask();
  };

  onMomentumScrollEnd = () => {
    if (IS_IOS) return;
    console.log('onMomentumScrollEnd');
    this.clearDelayShouldUpdateTask();
    this.delayShouldUpdateTask = setTimeout(() => {
      console.log('delayShouldUpdateTask');
      this.shouldUpdate = true;
      this.setState({time: Date.now()});
    }, 500);
  };

  clearDelayShouldUpdateTask = () => {
    if (this.delayShouldUpdateTask) {
      clearTimeout(this.delayShouldUpdateTask);
    }
  };

  shouldComponentUpdate(
    nextProps: Readonly<Props>,
    nextState: Readonly<State>,
    nextContext: any,
  ): boolean {
    console.log('shouldComponentUpdate', this.shouldUpdate, nextContext);
    return this.shouldUpdate;
  }

  render() {
    const {data} = this.state;
    console.log('class render', data.length);
    return (
      <View style={styles.content}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.lighter} />
        <FlatList
          data={data}
          renderItem={renderItem}
          style={styles.content}
          maintainVisibleContentPosition={{
            autoscrollToTopThreshold: 10,
            minIndexForVisible: 0,
          }}
          onScrollBeginDrag={this.onScrollBeginDrag}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          windowSize={321}
          inverted
        />
        <View style={styles.buttonContainer}>
          <Button title="Start" onPress={this.onStart} />
          <Text>Data size: {data.length}</Text>
          <Button title="Stop" color="#DC2740" onPress={this.onStop} />
        </View>
      </View>
    );
  }
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
