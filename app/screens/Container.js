import React, {Component} from 'react';
import {
  SafeAreaView,
  RefreshControl,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native';
import {withNavigation} from 'react-navigation';
export default class Container extends Component {
  state = {
    refreshing: false,
  };
  renderForIOS() {
    let {padding, style, contentPadding, scroll} = this.props;
    return (
      <>
        <SafeAreaView
          style={{backgroundColor: '#2C93D6', color: '#fff'}}
        />
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
          <StatusBar translucent={true} barStyle="light-content" />
          <ScrollView
            scrollEnabled={true}
            contentContainerStyle={{
              flexGrow:1
            }}
            keyboardShouldPersistTaps="always">
            {this.props.children}
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }

  onRefresh = () => {
    this.props.onRefresh();
  };

  renderForAndroid() {
    let {padding, style, contentPadding, scroll, onRefresh} = this.props;
    scroll = scroll ? scroll : true;
    return (
      <>
        <StatusBar backgroundColor={Colors.accent} barStyle="light-content" />
        <ScrollView
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
                title="Pull to refresh"
              />
            ) : (
              undefined
            )
          }
          nestedScrollEnabled
          scrollEnabled={scroll}
          style={[
            styles.container,
            {
              padding: padding * global.rem || 0 * global.rem,
              backgroundColor: '#fff',
              ...style,
            },
          ]}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            ...style,
            padding: padding == 0 ? 0 : 15 * global.rem,
          }}
          keyboardShouldPersistTaps="always">
          {this.props.children}
        </ScrollView>
      </>
    );
  }

  render() {
    return (
      <>
        {Platform.OS == 'android' 
          ? this.renderForAndroid()
          : this.renderForIOS()}
      </>
    );
  }
}
