import {  StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

export default StyleSheet.create({
    viewBack :{
        height:Dimensions.get('window').height/8,
      
    },
    gameScreen:{
      flex:1,
      flexDirection:'row',
      padding:10,
      bottom:0,
      height:Dimensions.get('window').height/10,
    },
    topmenu: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      height: 50,
      backgroundColor: '#1d93d6',
      padding: 8
  },
  homeText: {
    flex: 1,
    fontSize: 20,
},
tophome: {
  fontSize: 20,
  color: '#ffffff',
},
homeLogo: {
  flex: 1,
  alignItems: 'center',
},
bottomImg: {
  alignItems: 'center',
  width: 50,
  height: 50,    

},
homeSideMenu: {
  flex: 1,
  alignItems: 'flex-end'

},
sidebar: {
  flex: 1,
  flexDirection: 'row',
},
MenuImg: {
  alignItems: 'flex-end',    
    
},
    Heading:{
   fontSize :18,
   padding:15,
   color:'#000000',
   fontWeight: 'bold',
    },
    viewBack1 :{
        height:Dimensions.get('window').height,
        backgroundColor: '#FFC0CB'  
      },
      viewBack2 :{
        height:Dimensions.get('window').height,
        backgroundColor: '#ff4081'  
      },
      calculateButton: {
        height:Dimensions.get('window').height/20,
        width: '90%',
        backgroundColor:'#1d93d6',
        padding:10,
        alignItems:'center',
        textAlign:'center',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
      },
      
    buttonText: {
      textAlign: 'center',
      alignItems:'center',
      color: 'white',
      
  },
  menu:{
    flex:1,
    height:50,
    backgroundColor:'#1d93d6',
    padding:10,
    width:'100%',
    textAlign:'center',
    alignItems:'center',

},
tabstyle:{
  backgroundColor:'#1d93d6',
},
topIcon:{
  padding:5
},
data:{
  padding:15,
  fontSize :15,
  color:'#000000'

},
homeView:{ 
  flex:1 ,          
  flexDirection:'row',   
  width:'100%', 
  height:45, 
 backgroundColor:'#ffffff',             
 padding:8   ,
                  
},
holding:{ 
  flex:1 ,          
  flexDirection:'row',   
  width:'100%', 
  height:55,        
  borderBottomWidth:1,
  borderTopWidth:1,    
  borderBottomColor:"#000",     
 backgroundColor:'#ffffff',             
 padding:8   ,
                  
},
holdinglisting:{     
  flex:1 ,          
  flexDirection:'row',   
  width:'100%', 
  
  borderBottomWidth:1,
  borderTopWidth:1,    
  borderBottomColor:"#000",     
 backgroundColor:'#ffffff',             
 padding:8   ,
                  
},
homeView1:{
  flex:1,
   alignItems:'flex-start',         
    
},
homeViewtext:{   
  fontSize:15, 
   color:'#000000', 
   alignItems:'flex-start' , 
         
   },
   homeView2:{
    flex:1,
     alignItems:'flex-end', 
        },
        holdinglist:{
          flex:1,
           alignItems: 'flex-start',    
              },
        homeViewtext1:{
          fontSize:15, 
           color:'#000000', 
           alignItems:'flex-start' , 
           fontWeight:'bold'         
           },     
           holdingtext:{
            fontSize:12, 
             color:'#000000', 
             alignItems:'flex-start' , 
                         
             }, 
});