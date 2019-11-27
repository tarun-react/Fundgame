import {
    StyleSheet
  } from 'react-native';
  import Constants from '../../config/constant';
  import { Dimensions } from 'react-native';
  
  export default StyleSheet.create({
    menuWrapper:{
  
      flex :1
      
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
        height: 50,
        backgroundColor: '#1d93d6',
        padding: 8
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
  
    homeView: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: 45,
        backgroundColor: '#ffffff',
        padding: 8,
    },
    tophome: {
        fontSize: 20,
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
        textAlign:'center',
        alignItems:'center'
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
        alignItems: 'flex-start',
        color: '#ffffff',
   },
    SecondeText1: {
        flex: 1,
        alignItems: 'center',
  
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
        width: '100%',
        height: 45,
        backgroundColor: '#ffffff',
        padding: 8,
  
    },
    homeView1: {
        flex: 1,
        alignItems: 'flex-start',
  
    },
    homeView2: {
        flex: 1,
        alignItems: 'flex-end',
    },
    MenuImg: {
        alignItems: 'flex-end', 
        padding:2   
          
    },
    listing: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        padding: 5,
        color: '#ffffff',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    sidebar: {
        flex: 1,
        flexDirection: 'row',
    },
  
    listingText1: {
        color: '#607d8b'
    },
  
  
    listingText2: {
        color: '#607d8b',
    },
    subListing: {
        alignItems: 'center',
        fontWeight: "bold",   
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
    searchlogo: {
        marginRight: 20,
        paddingTop: 20,
        width: 25,
        height: 25,       
    },
    tabcontainer:{
     flexDirection:'row',
     height:95,  
    },
    calculateButton: {
        height:Dimensions.get('window').height/20,
        width: '100%',
        backgroundColor:'#1d93d6',
        alignItems:'center',
        textAlign:'center',
        justifyContent:'center',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
      },
      buttonText: {
        color: '#ffffff',
        fontSize: 15,
        textAlignVertical:'center',
      },
    gameScreen:{
        flex:1,
        height:55,
        width:'100%', 
        flexDirection:'row',
        padding:5,
      },
    tabview:{
     flex:1,
     padding:8,
     textAlign:'center',
     alignItems:'center',
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
     buttonPress:{
        flex:1,
        padding:8,
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
     
    tabText:{
     textAlign:'center',
     padding:5,
     alignItems:'center',
     fontSize:14,
     color:'#ffffff'
    },
  });