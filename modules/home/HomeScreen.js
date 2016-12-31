import React, { Component } from 'react';
import { Image, View, ListView, Text, ActivityIndicator } from 'react-native';
import Reactotron from 'reactotron-react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Colors from '../../constants/Colors';

class HomeScreen extends Component {
  state = {
    dataSource: null,
    offset: 0,
    loading: false
  }

  componentWillMount() {
    const { games } = this.props;

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(games);

    this.setState({ dataSource: this.dataSource });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: false,
      dataSource: this.state.dataSource.cloneWithRows(nextProps.games)
    });
  }

  _onRefresh() {
    this.setState({ offset: this.state.offset + 10, loading: true }, () => {
      return this.props.paginateGames(this.state.offset + 1);
    });
  }

  _renderRow(row) {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: row.game.box.large }} style={styles.image} />
      </View>
    );
  }

  // FIXME: Problem cannot import the component LoadingSpinner here
  _renderFooter() {
    return this.state.loading && (
      <View style={{ marginVertical: 20 }}>
        <ActivityIndicator size="large" color={Colors.tPurple} />
        <Text style={{ color: Colors.tPurple, fontWeight: 'bold', fontSize: 20 }}>Loading...</Text>
      </View>
    );
  }

  render() {
    return (
      <ListView
        contentContainerStyle={styles.root}
        renderRow={row => this._renderRow(row)}
        enableEmptySections
        automaticallyAdjustContentInsets={false}
        dataSource={this.state.dataSource}
        onEndReached={() => this._onRefresh()}
        renderFooter={() => this._renderFooter()}
      />
    );
  }
}

const styles = EStyleSheet.create({
  root: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingTop: '1%'
  },
  imageContainer: {
    width: '45%',
    marginVertical: '1.5%',
    marginHorizontal: '1.5%',
    height: '35%',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowColor: 'black',
    shadowOpacity: 0.8
  },
  image: {
    flex: 1,
    width: null,
    height: null
  }
});

export default HomeScreen;
