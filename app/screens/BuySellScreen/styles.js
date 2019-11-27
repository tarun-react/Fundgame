import {  StyleSheet } from 'react-native';
import Constants from '../../config/constant';

export default StyleSheet.create({
    container: {
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
     alignItems:'center',               
      width: 40, 
      height: 40,
    },
    inputWrapper: {
      width:'90%',
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

    topmenu:{ 
        flex:1,    
        flexDirection:'row',   
        width:'100%', 
        height:45, 
       backgroundColor:'#1d93d6',  
       padding:8    
    },
    SecodeHeader:{ 
        flex:1 ,          
        flexDirection:'row',   
        width:'100%', 
        height:50, 
       backgroundColor:'#4aa9de',             
       padding:12,
       color:'#ffffff',             
    },
 
    homeView:{ 
      flex:1 ,          
      flexDirection:'row',   
      width:'100%', 
      height:45, 
     backgroundColor:'#ffffff',             
     padding:8   ,
                      
  },
  iconColor:{
    width:20,
    marginRight:5,
    height:20
   },
    tophome:{
   fontSize:20, 
    color:'#ffffff',                
    }, 
    homeViewtext:{
      fontSize:15, 
       padding:8,
       color:'#000000', 
       alignItems:'flex-start' , 
       }, 
       homeViewtext1:{
        fontSize:15, 
         color:'#ef3416', 
         alignItems:'flex-start' , 
         fontWeight:'bold'         
         }, 
         homeViewtextSell:{
          fontSize:15, 
          color:'#000', 
          alignItems:'flex-start' , 
          fontWeight:'bold'  
         },
         homeViewtext2:{
          fontSize:15, 
           color:'#000000', 
           alignItems:'flex-start' , 
           fontWeight:'bold'         
           }, 
    sec:{
      fontSize:20, 
       color:'#ef3416', 
       alignItems:'flex-start' , 
       fontWeight:'bold'         
       }, 
       sec1:{
        fontSize:20, 
         color:'#77b61f', 
         alignItems:'flex-end' ,  
         fontWeight:'800'                  
         },       
            
        homeText:{
            flex:40,
        fontSize:20,
        alignItems:'center',        
        },
        homeLogo:{
            flex:1,  
            alignItems:'center',            
        },        
        homeSideMenu:{
            flex:1 ,
            alignItems:'flex-end'          
              
        },
        SecondeText:{
          flex:1,
          alignItems: 'flex-start', 
          color:'#ffffff',
          padding:10                                              
                                                                       
      },   
    SecondeText2:{
       flex:1,
       alignItems:'flex-end' ,
       paddingRight:10,
        
  },
  searchImg:{
    flex:1,
    alignItems: 'flex-start',
    width:1,
    height:1  
                             
},   
MenuImg:{
  flex:1,
  alignItems: 'flex-end', 
},
  homeView:{ 
    flex:1 ,          
    flexDirection:'row',   
    width:'100%', 
    height:45, 
   backgroundColor:'#ffffff',             
   padding:8   ,
                    
},
homeView1:{
  flex:1,
   alignItems:'flex-start',         
    
},
            homeView2:{
                flex:1,
                 alignItems:'flex-end', 
                    },
            MenuImg:{
               alignItems:'flex-end' 
                 },
                    listing:{ 
                      flex:1 ,          
                      flexDirection:'row',   
                      width:'100%', 
                      height:60,
                      padding:5,           
                      color:'#ffffff', 
                      borderWidth: 1,
                      borderColor:'#ccc',                  
                  },
                  sidebar:{ 
                    flexDirection:'row', 
                },
                  
                    listingText1:{
                    color:'#607d8b'  
                    },

                 
                    listingText2:{
                    color:'#607d8b',
                    },  
                    subListing:{     
                    alignItems:'center',
                    fontWeight:"bold",
                    color:'#4aa9de' 
                    } ,

                pullRight:{
                  flex:1,
                  justifyContent:'flex-end', 
                  alignItems : 'flex-end'
                },
                BuyBlock:{
                 backgroundColor:'#ececec',
                 flexDirection:'row',  
                },
                Blocklabel:{
                  padding:30,
                  color:'#4aa9de',
                  fontWeight:'600',
                  fontSize:30
                },
                Blocklabel1:{
                  color:'#4aa9de',
                  fontWeight:'100',
                  fontSize:10
                },
                butinput:{
               flex:1,
                  backgroundColor:'#dedddd',
                  textAlign: 'center',                    
                  color : '#4aa9de',
                  fontWeight:"bold"
              },
              SecondeText1: {
                flex: 2,
                alignItems: 'center',
          
            },
              buttonStyle: {
                borderRadius: 100,
                backgroundColor:'#4aa9de',
                padding:12,
                alignItems:'center',
                width:200
              },
              buttonLogin: {
                marginTop:10,
                marginLeft:50,
              },
              lotsHeader :{
                marginTop : 10,
                width : '95%',  
                height :120,
                paddingTop : 10,  
                paddingBottom: 10,
                paddingLeft: 40,
                paddingRight: 40,
                backgroundColor : '#ececec'
              },
              lotsHeader2:{
                flexDirection : 'row',
                textAlign:'center',
                alignItems:'center'
              },
              lots :{
                flexDirection : 'column'
              },
              enterLots :{
                color: '#3b5998'
              },
              inputLots : {
                width : 200,    
                height : 50,
                marginLeft: 20,
                padding : 2,
                backgroundColor : "#e3e3e3",
              },
              inputText : {
                color : "#FFFFFF",
              }, 
              buttonText:{
                color:'#ffffff'
              } ,
              Technical:{
                fontSize: 15,      
                textDecorationLine: 'underline' ,
                color: '#000000' ,
                fontWeight: 'bold',    
              },
              Analysis_High:{
                fontSize:15, 
                 color:'#000000', 
                 alignItems:'flex-end' , 
                 fontWeight:'bold'         
                 }, 
                 Analysis_Open:{
                  fontSize:15, 
                   color:'#000000', 
                   alignItems:'flex-end' , 
                   fontWeight:'bold'         
                   }, 
                   Analysis_View:{
                    flex:1,
                     alignItems:'flex-end', 
                        },
                        Technical_Symbol:{ 
                          flex:1 ,          
                          flexDirection:'row',   
                          width:'100%', 
                         color:'#000000',             
                      },
});