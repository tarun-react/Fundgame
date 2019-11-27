import {
    StyleSheet
  } from 'react-native';
  import Constants from '../../config/constant';
  import { Dimensions } from 'react-native';
  export default StyleSheet.create({
    menuWrapper:{
  
      flex :1
      
    },
    menuview:{
      width:150,
      padding:8,
      height:35,
      alignItems:'flex-start',
      textAlign:'left'
  },
    topmenu: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: 50,
        backgroundColor: '#1d93d6',
        padding: 8
    },
    tophome: {
        fontSize: 20,
        color: '#ffffff',
        
    },
   
    tabview:{
        flex:1,
        textAlign:'center',
        alignItems:'center',
        padding:19,
        backgroundColor:'#4aa9de',
        shadowColor:'#ffffff',
        shadowOffset: {
           width: 0,
           height: 5,
       },
       shadowOpacity: 0.34,
       shadowRadius: 6.27,
       elevation: 10,
      
        },
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
        sidebar: {
          flex: 1,
          flexDirection: 'row',
          width: '100%',
          height: 50,
          backgroundColor: '#1d93d6',
          padding: 8,
          alignItems : 'center',
          justifyContent: 'center'
      },
      homeText: {
        flex: 1,
        fontSize: 20,
        padding:1
    },
    homeSideMenu: {
      flex: 1,
      alignItems: 'flex-end'
    },
    sidebar: {
      flex: 1,
      flexDirection: 'row',
      justifyContent : 'center',
      alignItems : 'center'
  },
  MenuImg: {
    alignItems: 'flex-end', 
},
    homeLogo: {
      flex: 1,
      alignItems: 'center',
  },
    tophome: {
      fontSize: 20,
      padding:4,
      color: '#ffffff',
     },
      topmenu: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height:50,
        backgroundColor: '#1d93d6',
        padding: 5,
        alignItems : 'center',
        justifyContent: 'center'
       
    },
    //   homeText: {
    //     fontSize: 20,
    //     flex:2,
    //     flexDirection:'row',
    //     justifyContent: 'center',
    //     alignItems: 'center'
    // },
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
        justifyContent:'center',
        alignItems:'center'
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
      borderWidth:1,   
      borderColor:"#e4e1e1",     
      backgroundColor:'#ececec',             
                      
    },
    holdinglisting:{     
      flex:1 ,          
      flexDirection:'row',   
      width:'100%',
      height:300,
                                    
    },
    homeView1:{
      flex:1,
       alignItems:'flex-start',         
        
    },
    homeViewtext:{   
      fontSize:15, 
       color:'#000000', 
       alignItems:'flex-start' , 
       marginLeft:10
    },
    homeView2:{
          flex:1,
          flexDirection:'column',
          alignItems:'flex-start', 
          borderWidth:1,
          borderColor:"#e4e1e1",     
          backgroundColor:'#ececec',  
    },
    homeViewdiff:{
      flex:1,
      alignItems:'center', 
       
},
    homeView21:{
      flex:1,
      alignItems:'flex-start', 
      flexDirection:'column',
      borderWidth:1,
      borderColor:"#e4e1e1",     
      backgroundColor:'#ececec',  
   },
   homeView21totalBuy:{
    flex:1.1,
    alignItems:'flex-start', 
    flexDirection:'column',
    borderWidth:1,
    borderColor:"#e4e1e1",     
    backgroundColor:'#ececec',  
 },
   homeView211:{
    flex:1,
    alignItems:'flex-start', 
    flexDirection:'column',
    borderWidth:1,
    borderColor:"#e4e1e1",     
    backgroundColor:'#ececec',  
 },
   change:{  
     flexDirection:'row',
     flex:1, 
     justifyContent:'flex-end',
     paddingRight:8,
 },
    holdinglist:{
          flex:.7,
          justifyContent: 'center',
           borderWidth:1,
          borderColor:"#e4e1e1",     
          backgroundColor:'#ececec',  
    },
    holdinglisttt:{
      flex:.7,
      alignItems:'flex-start',
      borderWidth:1,
      borderColor:"#e4e1e1",     
      backgroundColor:'#ececec',  
},
iconColor:{
  width:20,
  marginRight:5,
  height:20
 },
    homeViewtext1:{
          fontSize:15, 
          color:'#000000', 
          alignItems:'flex-start' , 
          fontWeight:'bold'         
    },  
    homeViewttxtt:{
      fontSize:15, 
      color:'#FF0000', 
      alignItems:'flex-start' , 
      fontWeight:'bold'         
},   
holdingtext:{
  fontSize:12, 
  color:'#000000', 
  paddingLeft:5,
  paddingTop:3,
  alignItems:'flex-start' , 
}, 
  
holdingtextplred:{
  fontSize:12, 
  color:'#ef3416', 
  paddingLeft:5,
  paddingTop:3,
  alignItems:'flex-start' , 
},
    holdingtextrk:{
          fontSize:12, 
          color:'#ef3416', 
          paddingLeft:5,
          paddingTop:3,
          alignItems:'flex-start' , 
     }, 
     holdingtext1:{
      fontSize:12,  
      paddingLeft:8,
      paddingTop:3,
      color:'#000',
      alignItems:'flex-start' , 
 }, 
     holdingtext11:{
      fontSize:12, 
      color:'#000000', 
      padding:2,
      alignItems:'flex-start' , 
 }, 
     holdingtextr:{
      paddingLeft:8,
      fontSize:12, 
      alignItems:'flex-start' , 
      color:'#000',
 }, 
 holdingtextrr:{
  fontSize:12, 
  paddingTop:3,
  paddingLeft:5,
  color:'#ef3416', 
  alignItems:'flex-start' , 
 },
    buttonPress:{
        flex:1,
        padding:19,
        textAlign:'center',
        alignItems:'center',
        backgroundColor:'#4aa9de',
        shadowColor:'#ffffff',
        shadowOffset: {
           width: 0,
           height: 5,
       },
      
       shadowRadius: 6.27,
       elevation: 10,
       borderBottomColor: '#ffffff',
       borderBottomWidth: 2
     },
     buttonStyleOffline: {
      borderRadius: 100,
      backgroundColor:'#7b7c74',
      padding:12,
      position:'absolute',
      width:'90%',
      bottom:0,
      marginLeft:'5%',
      marginRight:'5%',
      marginBottom:10,
      alignItems:'center',
    },
    buttonText: {
      fontSize : 18,
      color:'#ffffff',
      fontWeight : 'bold'
    },
    inputFirstHeading:{
        fontSize : 20,
        color : '#464646',
        padding: 10,
        marginTop:10,
        alignItems:'center',
        textAlign:'center',
    },
    inputSecondHeading:{
      fontSize : 15,
      color : '#b4b4b4',
      padding: 10,
      alignItems:'center',
      textAlign:'center',
  },
    modalContainer:{ 
      top:'25%',
      width:'90%',
      marginLeft:'5%',
      marginRight:'5%',
      backgroundColor: '#fff',
      flexDirection:'column',
      borderRadius: 10,
  },
  imgCross:{
      height:20,
      width:20,
      marginTop:10,
      marginRight:10,
      padding:5,
  },
     rankContainer:{
      height:60,
      flex:1,
      paddingTop:15,
      alignItems:'center'
      },
      viewContainer:{
        flex:6,
        flexDirection:'row',
       },
      ranktext:{
        fontSize:20,
        fontWeight:'bold',
        color:'#fff'
      },
      searchSection: {
        flex: 1,
        flexDirection: 'row',
       
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    input: {
      flex: 1,
      backgroundColor: '#fff',
      color: '#424242',
  },
     contain:{
      padding:5,
      position:'absolute',
      bottom:0,
      backgroundColor:'#4aa9de',
      zIndex:1000000,
      width:Dimensions.get('window').width/1.05,
      height:60,
      flex:1,
      alignItems:'center',
      flexDirection:'row',
      borderColor: '#eff0f1',
      borderWidth: 1,
      marginRight:10,
      marginLeft:10
    },
    searchIcon: {
     
      width:40,
      
   },
    tabText:{
        textAlign:'center',
        padding:5,
        alignItems:'center',
        fontSize:14,
        color:'#ffffff'
       },
    tabcontainer:{
        flexDirection:'row', 
        
       },
    container: {
        backgroundColor: '#fff',
        
       
    },
    
  });