import {  StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
export default StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      // justifyContent: 'center',
    },
    bgLayout: {
      width : '100%',
      height : '100%',
    //  top : -100,
      position : 'absolute'
    },
   
    bottomImg:{
      width: 120, 
      height: 120,
      
    },
    buttonText:{
      color:'#fff'
    },
    inputWrapper: {
      width:'90%',
      marginTop: 100,
      paddingLeft: 20,
      paddingTop: 10,
      paddingRight: 10,
      paddingBottom: 30,
    },
    inputHeading: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    backHeading: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF'
    },
    facebook: {
      borderRadius: 100,
      backgroundColor:'#3b5998',
      padding:12,
      alignItems:'center'
    },
    google: {
      borderRadius: 100,
      backgroundColor:'#dd5144',
      padding:12,
      alignItems:'center'
    },
    TopImageContainer:{
       
      textAlign:'left',
      alignItems:'flex-start',
      padding:10,
      width:Dimensions.get('window').width,
       
    },
    ImageContainer:{
      flex:1,
      flexDirection:'row',
      textAlign:'center',
      alignItems:'center',
      
    },
    imageMain:{
      textAlign:'center',
      alignItems:'center',
      height:50,
      width:Dimensions.get('window').width
    },
    textMain:{
      textAlign:'center',
      alignItems:'center',
      height:120,
      width:Dimensions.get('window').width,
     
    }
  
    
});