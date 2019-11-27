import React, { PropTypes } from 'react';
import { TouchableOpacity,ScrollView, Text,View, StyleSheet } from 'react-native';
 

class others extends React.Component
{
  constructor(props) {
    super(props);
 }     
 
  render()
  {
   return(
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{alignItems:'center'}}>
        <Text >  Macro</Text>
      </View>
    </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
 
   
});

export default others;