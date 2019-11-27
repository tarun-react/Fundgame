import React, { PropTypes } from 'react';
import { TouchableOpacity,ScrollView, Text,View, StyleSheet } from 'react-native';
 

class Shares extends React.Component
{
  constructor(props) {
    super(props);
    
  }     
 
  render()
  {
   return(
  <ScrollView contentContainerStyle={styles.container}>
      <View style={{alignItems:'center'}}>
        <Text >  Shares</Text>
      </View>
    </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
 
   
});

export default Shares;