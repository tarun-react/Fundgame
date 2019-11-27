import React, { PropTypes } from 'react';
import { TouchableOpacity,ScrollView,WebView, Text,View, StyleSheet,Linking,ActivityIndicator  } from 'react-native';
import { Dimensions } from 'react-native';

class fundamentalTab extends React.Component
{
  constructor(props) {
    super(props); 
    this.state = { visible: true }; 
  }     
  hideSpinner() {
    this.setState({ visible: false });
  }
  render()
  {
    return (
        <ScrollView style={{backgroundColor:'#000000', width: Dimensions.get('window').width,paddingBottom:10 }}>
        <WebView
              style={{height: Dimensions.get('window').height }}
              source={{ uri: 'https://fundgame.blogspot.com/' }}
              onLoad={() => this.hideSpinner()}
              scalesPageToFit={true}
            />
            {this.state.visible && (
            <ActivityIndicator
              style={{ position: "absolute", color:'#1d93d6',top: Dimensions.get('window').height/2, left: Dimensions.get('window').width/2 }}
              size="large"
          />
        )}
        </ScrollView>
     
    );
  }
}


const styles = StyleSheet.create({
 
   
});

export default fundamentalTab;