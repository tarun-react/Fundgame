import {
    StyleSheet
  } from 'react-native';
  import Constants from '../../config/constant';
  import { Dimensions } from 'react-native';
  
  export default StyleSheet.create({
    menuWrapper:{
      flex :1,
    },
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    bgLayout: {
        width: '100%',
        height: '100%',
        //  top : -100,
        position: 'absolute'
    },
    searchSection: {
      flex: 1,
      flexDirection: 'row',
     
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
  },
    searchIcon: {
       
      width:40,
      
   },
  input: {
      flex: 1,
      backgroundColor: '#fff',
      color: '#424242',
  },
    bottomImg: {
        alignItems: 'center',
        width: 50,
        height: 50,    
  
    },
    inputWrapper: {
        width: '90%',
        marginTop: 200,
        paddingLeft: 20,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 30,
    },
    inputHeading: {
        fontSize: 28,
        marginTop: 60,
        fontWeight: 'bold',
        color: '#FFFFFF'
    },
    facebook: {
        borderRadius: 100,
        backgroundColor: '#3b5998',
        padding: 12,
        alignItems: 'center'
    },
    google: {
        borderRadius: 100,
        backgroundColor: '#dd5144',
        padding: 12,
        alignItems: 'center'
    },
  
    topmenu: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height:50,
        backgroundColor: '#1d93d6',
        padding: 5,
       
    },
    head: {
     
  },
    SecodeHeader: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: 45,
        backgroundColor: '#4aa9de',
        padding: 12,
        color: '#ffffff',
    },
  
    
    tophome: {
        fontSize: 20,
        padding:4,
        color: '#ffffff',
    },
    sec: {
        fontSize: 20,
        
        color: '#ef3416',
        alignItems: 'flex-start',
        fontWeight: 'bold'
    },
    sec1: {
        fontSize: 20,
        
        color: '#77b61f',
        alignItems: 'flex-end',
        fontWeight: '800'
    },
  
    homeText: {
        flex: 1,
        fontSize: 20,
        padding:1
    },
    homeLogo: {
        flex: 1,
        alignItems: 'center',
    },
    homeSideMenu: {
        flex: 1,
        alignItems: 'flex-end'
  
    },
    SecondeText: {
      flex: 1,
      alignItems: 'center',
      paddingTop:20,
      paddingBottom:20
      
    },
    SecondeEnd: {
      flex: 1,
      alignItems: 'center',
      fontSize:25,
      paddingTop:20,
      paddingBottom:20
    },
    header:{
      height : Dimensions.get('window').height/4
    },
    SecondeText00: {
      flex: 1,
      alignItems: 'flex-start',
      padding:8
    },
    SecondeText1: {
        flex: 1.5,
        alignItems: 'center',
        fontSize:20,
        padding:8
    },
    SecondeText2: {
        flex: 1,
        alignItems: 'flex-end'
  
    },
    searchImg: {
        flex: 1,
        alignItems: 'flex-start',
        width: 1,
        height: 1
  
    },
  
    homeView: {
        flex: 1,
        flexDirection: 'row',
        margin:5,
        height: 45,
        backgroundColor: '#ffffff',
        
  
    },
    homeView1: {
        flex: 1,
        alignItems: 'flex-start',
        padding:5
  
    },
    homeView2: {
        flex: 1,
        alignItems: 'flex-end',
        padding:5
    },
    MenuImg: {
        alignItems: 'flex-end', 
    },
    homeImg:{
     height:40,
     width:40,
    },
    listing: {
        flex: 1,
        flexDirection: 'row',
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#f5f3f3',
        marginTop:5,
        marginLeft:12,
        marginRight:12,
        position:'relative'
    },
    fiftyfifty:{
      flex: 1,
      flexDirection: 'row',
      width:Dimensions.get('window').width,
      height:'100%',
      position:'absolute'
    },
    sidebar: {
        flex: 1,
        flexDirection: 'row',
    },
  
    listingText1: {
        color: '#607d8b',
        fontSize:15
     
    },
  
  
    listingText2: {
        color: '#607d8b',
    },
    subListing: {
        alignItems: 'center',
        fontWeight: "bold", 
        fontSize:15
    },
    DateColor: {
      alignItems: 'center',
      fontWeight: "bold", 
      color:"#FFFFFF",
  },
  
    pullRight: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    
    buttonPress:{
      flex:1,
      padding:8,
      textAlign:'center',
      alignItems:'center',
      backgroundColor:'#4aa9de',
     
     borderBottomColor: '#ffffff',
     borderBottomWidth: 2
   },
     tabview:{
      flex:1,
      padding:8,
      textAlign:'center',
      alignItems:'center',
      backgroundColor:'#4aa9de',
     
  },
      tabcontainer:{
          flexDirection:'row',
          height:40,
          
       },
       tabText:{
          textAlign:'center',
          padding:0,
          alignItems:'center',
          fontSize:15,
          color:'#ffffff'
         },
         menuview:{
             width:150,
             padding:8,
             alignItems:'flex-start',
             textAlign:'left'
         },
         iconColor:{
          marginRight:5,
          width:20,
          height:20
         },
         
  });