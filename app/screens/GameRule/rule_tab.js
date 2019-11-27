import React, { PropTypes } from 'react';
import { TouchableOpacity,ScrollView, Text,View, StyleSheet,Animated } from 'react-native';
import { Dimensions } from 'react-native';
import firebase from 'react-native-firebase';
var device_height = Dimensions.get('window').height;
class Rule extends React.Component
{
  constructor(props) {
    super(props);
    this.assumption=null;
    this.rules=null;
    this.objective=null;
    this.state = {
      headingobj:'',
      headingrule:'',
      headingassum:'',
      obj:'',
      rule:'',
      GameRuleData:'',
      GameRule:'',
      assumption:'',
      others:'',
      gameScore:'',
      scroll:this.props.scroll,
    };
  }     
  componentWillMount()
  {
    let that=this;
    firebase.database().ref('GameRule').once('value', function(data){  
      that.setState({GameRuleData:data.val()});
      that.setState({GameRule:data.val()['5 Game Rules']},()=>{
        console.log('test',data.val()['5 Game Rules'])
      });
      that.setState({gameScore:data.val()['5 Game Rules']['Game score']})
      that.setState({assumption:data.val()['10 Assumptions']});
      that.setState({others:data.val()['Other Strategies:']})
    })
     this.setState({headingobj: 'Objective'})
     this.setState({obj:'• Have a safe investment strategy using shares & Real Estate Investment Trusts (REITs) etc \, for your $ dream \n\n• Initial capital: $500,000 \n\n• Game Score : μ = return % per annum'});
    // this.setState({headingrule:'5 GameRules'});
    // this.setState({rule:'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here'+',' + 'making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years\, sometimes by accident\, sometimes on purpose (injected humour and the like).'})
    // this.setState({headingassum:'Assumption'});
    // this.setState({assumption:'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.'})
  } 
  handleObjective() {
    // debugger
     console.log(this.objective);
     this.props.parentMethod(this.objective);   
  }
  handleRules() {
    console.log(this.rules);
    this.props.parentMethod(this.rules);
  }
  Assumption() {
    console.log(this.assumption);
     this.props.parentMethod(this.assumption);
  }
  // assumption = (element) => {
  //   debugger
  //   this.assumption = element; 
  // };
  render()
  {
    const B = (props) => <Text style={{fontWeight: 'bold',color:'#000'}}>{props.children}</Text>
    const C = (props) => <Text style={{ color:'#4aa9de'}}>{props.children}</Text>
    //const BB = (props1) => <Text style={{fontWeight: 'bold'}}>{props.children1}</Text>
   return(
     <View style={{flex:1,width:'100%',marginBottom:20}}>
         <View style={{width:'100%',alignItems:'center'}}>
           <Text style={{fontSize:30, color:'#4aa9de'}}>{this.state.GameRuleData['Heading']}</Text>
         </View>
         <View style={{width:'100%',alignItems:'center'}}>
           <Text style={{fontSize:16,color:'#4aa9de',padding:5}}>{this.state.GameRuleData['SubHeading']}</Text>
         </View>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5}}   ref={(ref) => this.objective = ref}>
           <Text style={{fontWeight:'bold',color:'#FF0000',fontSize:20,textDecorationLine: 'underline'}}>{this.state.headingobj}</Text>
         </View>
         <Text style={{fontSize:20,paddingLeft:10 }}>{this.state.obj}</Text>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5}}  ref={(ref) => this.rules = ref}>
           <Text style={{fontWeight:'bold',color:'#FF0000',fontSize:20,textDecorationLine: 'underline'}}>5 Game Rules</Text>
         </View>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5,marginTop:10}}>
             <Text style={{fontSize:20  }}><B>1. Initial Capital:</B> {this.state.GameRule['Initial Capital']}</Text>
         </View>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5 ,marginTop:10}}>
           <Text style={{fontSize:20 }}><B>2. Game round:</B> {this.state.GameRule['Game round']}</Text>
         </View>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5,flex:1,flexDirection:'column',marginTop:10}}>
           <Text style={{fontSize:20 }}><B>3. Game score:</B> increase μ by:</Text>
           <Text style={{fontSize:20 }}>• {this.state.gameScore['point 1']}</Text>
           <Text style={{fontSize:20  }}>• {this.state.gameScore['point 2']}</Text>
           <Text style={{fontSize:20 }}>• {this.state.gameScore['point 3']}</Text>
         </View>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5,marginTop:10}}>
           <Text style={{fontSize:20}}><B>4. Lot size:</B> {this.state.GameRule['Lot size']}</Text>
         </View>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5 ,marginTop:10}}>
           <Text style={{fontSize:20  }}><B>5. Dividends income:</B> {this.state.GameRule['Dividends income']}</Text>
         </View>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5 ,marginTop:10}}>
           <Text style={{fontSize:20, color:'#4aa9de' }}>{this.state.GameRule['note']}</Text>
         </View>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5}} ref={(ref) => this.assumption = ref} >
           <Text style={{fontWeight:'bold',color:'#FF0000',fontSize:20,textDecorationLine: 'underline'}}>10 Assumptions</Text>
         </View>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5}}>
           <Text style={{fontSize:20 }}><B>1.</B>{this.state.assumption['point 1']}</Text>
           <Text style={{fontSize:20 ,marginTop:10  }}><B>2.</B>{this.state.assumption['point 2']}</Text>
           <Text style={{fontSize:20  ,marginTop:10 }}><B>3.</B>{this.state.assumption['point 3']}</Text>
           <Text style={{fontSize:20 ,marginTop:10  }}><B>4.</B>{this.state.assumption['point 4']}</Text>
           <Text style={{fontSize:20 ,marginTop:10  }}><B>5.</B>{this.state.assumption['point 5']}</Text>
           <Text style={{fontSize:20 ,marginTop:2,textAlign:'center',fontStyle: 'italic'}}>"Diversification is protection against ignorance" - Warren Buffett</Text>
           <Text style={{fontSize:20 ,marginTop:10  }}><B>6.</B>{this.state.assumption['point 6']}</Text>
           <Text style={{fontSize:20 ,marginTop:10  }}><B>7.</B>{this.state.assumption['point 7']}</Text>
           <Text style={{fontSize:20 ,marginTop:10  }}><B>8.</B>{this.state.assumption['point 8']}</Text>
           <Text style={{fontSize:20  ,marginTop:10 }}><B>9.</B>{this.state.assumption['point 9']}</Text>
           <Text style={{fontSize:20  ,marginTop:10 }}><B>10.</B>{this.state.assumption['point 10']}</Text>
         </View>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5}}>
           <Text style={{fontWeight:'bold',color:'#FF0000',fontSize:20,textDecorationLine: 'underline'}}>Other Strategies:</Text>
         </View>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5}}>
           <Text style={{color:'#FF0000',fontSize:20 }}><B>i.</B> Dollar-Cost Averaging.</Text>
           <Text style={{ fontSize:20 }}>investing a fixed amount on a regular basis. This average out the
                cost of buying stocks due to price fluctuations.</Text>
         </View>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5}}>
           <Text style={{color:'#FF0000',fontSize:20 }}><B>ii.</B> Diversification, but do not over-diversify.</Text>
           <Text style={{fontSize:20 ,marginTop:5 }}><C>Global Strategy -</C> investing into local stocks or Real Estate
                Investment trusts (REITs) with global exposures e.g. have overseas
                ventures or properties.</Text>
            <Text style={{fontSize:20 ,marginTop:5 }}><C>Sector Strategy -</C> investing into different sectors.e.g. banking,
                telecommunications etc.</Text>
            <Text style={{fontSize:20 ,marginTop:5 }}><C>Index Strategy -</C> investing 100% into index funds e.g. Exchange
                Traded Funds (ETF) since historically most professionally managed
                funds cannot beat index.</Text>
            <Text style={{fontSize:20 ,marginTop:5 }}><C>Stable Value Strategy -</C> investing into stable dividends or
                conservative fixed income investment. e.g. good dividend paying
                REITs or stocks.</Text>
         </View>
         <View style={{width:'100%',paddingLeft:10,paddingRight:10,paddingTop:5}}>
           <Text style={{color:'#FF0000',fontSize:20 }}><B>iii.</B> Time Horizon.</Text>
           <Text style={{fontSize:20 ,marginTop:5 }}>Historically, stock prices generally increase over the years due to
              economic growth and inflation.

              Investors with longer time horizon for their investments can re-
              invest their dividends using the power of compounding interest.</Text>
          <Text style={{fontSize:20 ,marginTop:5,fontStyle: 'italic',textAlign:'center' }}>"The most powerful force in the universe is compound interest" -
          Albert Einstein</Text>
         </View>
         
     </View>
     

    );
  }
}


const styles = StyleSheet.create({
 
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
  },
  gameScreen:{
    flex:1,
    height:Dimensions.get('window').height,
    width:Dimensions.get('window').width,backgroundColor:'transparent',
    flexDirection:'row',
    padding:10,
    bottom:0,
    alignItems:'center',
    height:Dimensions.get('window').height/10,
  },
  data:{
    padding:15,
    fontSize :15,
    color:'#000000'
  },
  Heading:{
    fontSize :18,
    paddingLeft:15,
    color:'#000000',
    fontWeight: 'bold',
  },
  calculateButton: {
    height:Dimensions.get('window').height/20,
    width: '90%',
    backgroundColor:'#1d93d6',
    alignItems:'center',
    textAlign:'center',
    paddingTop:8,
    paddingBottom:8,
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
});

export default Rule;