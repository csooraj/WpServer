import React from 'react';
import { StyleSheet, ActivityIndicator, WebView } from 'react-native';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      load: true,
    };
  }

  handleView = () => {
    this.setState({ load: false });
  }

  render() {
    return (
      <WebView
        startInLoadingState={false}
        domStorageEnabled
        onLoad={() => this.handleView()}
        style={this.state.load ? styles.hide : styles.show}
        source={{ uri: 'https://www.amazon.in/' }}
        javaScriptEnabledAndroid
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hide: {
    height: 0,
    width: 0,
  },
  show: {
    flex: 1,
  },
});

module.exports = App;
