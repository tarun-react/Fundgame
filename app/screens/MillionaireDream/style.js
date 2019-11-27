import { StyleSheet } from 'react-native';


export default StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    menu:{
        flex:1,
        height:50,
        backgroundColor:'#1d93d6',
        padding:10,
        flexDirection:'row',
        width:'100%',

    },
    topM:{
        color:'#ffffff',
        fontSize:18,

    },
    MText:{
        flex:1,
        fontSize:18,
    },
    infoRow:{
        flexDirection: 'row',
        flex:1,
        height:50,
         padding:2,
         alignItems:'center'
    },
    textL:{
        flex:1,
        height:50,
        paddingTop:8,
        paddingBottom:8,
    },
    textRR:{
        flex:2,
        height:50,
        textAlign: 'left',
        paddingTop:8,
        paddingBottom:8,
    },
    infoColl:{
        height:50,
        paddingTop:10,
        paddingBottom:10,
        backgroundColor:'red',
        width:100,
        
    },
    infoColr:{
        flex:1,
        height:50,
        textAlign: 'right',
        paddingTop:10,
        paddingBottom:10,
    },
    infoColrT:{
        flex:1,
        height:50,

        textAlign: 'right',
        paddingTop:10,
        paddingBottom:10,
        top: 0
    },
    infoColrB:{
        flex:1,
        height:50,
        textAlign: 'right',
        paddingTop:10,
        paddingBottom:10,

    },
    infoCol1:{
        flex:1,
        height:50,
        textAlign: 'center',
    },
    infoCol2:{
        flex:1,
        height:50,
        textAlign: 'right',
    },

    butinput:{
        height:40,
        backgroundColor:'#ebecf0',
         
       /* borderBottomColor: '#000000',
        borderBottomWidth: 1,*/
        textAlign: 'center',
        alignItems:'center',
        color : '#000000',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    textS:
        {
            paddingLeft:5,
            flex:1,
            marginTop:-10,
            color: '#67655B'
        },
    textR:{
        textAlign: 'right',
        alignItems: 'flex-end',
        paddingRight:5,
        color: '#67655B'
    },
    textRR1:{
        textAlign: 'left',
        alignItems: 'flex-start',
        paddingRight:5,
    },
    textRB:{
        paddingRight:5,
        color:'#f8a89e',
        textAlign: 'right',
        alignItems: 'flex-end',

    },

    textRT:{
        paddingRight:5,
        color:'#f8a89e',
        textAlign: 'right',
        alignItems: 'flex-end',
    },

    calculateButton: {
        borderRadius: 100,
        width: '70%',
        backgroundColor:'#1d93d6',
        padding:12,
        alignItems:'center',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
        margin: 5,
    },
 borderLine:{
     borderBottomColor: '#63606030',
     borderBottomWidth: 1,
     paddingRight:5,
     paddingLeft:5,
     width: '100%',
     textAlign :'center',
     alignItems:'center',
     flex:1,
     flexDirection:'row'
 },
    resultHeader:{
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex:1,
        padding:10,
        flexDirection:'row'
    },
    topmenu: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: 50,
        backgroundColor: '#1d93d6',
        padding: 8,
       
    },
    homeText: {
        flex: 5,
        fontSize: 20,
        textAlign:'left',
        alignItems:'flex-start'
    },
    tophome: {
        fontSize: 20,
        color: '#ffffff',
    },
    header:{
        height : 50
      },
    resultHeader1:{
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex:1,
        padding:10,
        flexDirection:'row',
        paddingBottom:20
    },
   result:{
       fontSize: 18,
       fontWeight: 'bold',
       color: '#67655B'
   },
    resultCont:{
        fontSize: 15,
        padding:3,
        color: '#67655B'

    },
    resultContsubHeading:{
        fontSize: 12,
        color:'#f8a89e',
    },
    uderline:{
        textDecorationLine: 'underline',
        fontSize:20,
        marginRight:8,
        top:0,
        color: '#67655B'

    },
    top:{
        flexDirection:'row',
    },
    designDefault:{
        flex:2,

    },
    buttonContainer: {
        alignItems:'flex-end',
        flex:1,
        padding:10,
        textAlign: 'right',
    },
});