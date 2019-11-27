import React from 'react';
import { Dimensions } from 'react-native';
import {Text,View,Image,ScrollView,TouchableOpacity} from 'react-native';
import styles from './styles';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation';
import {  Menu,  MenuOptions,  MenuOption,  MenuTrigger,} from 'react-native-popup-menu';
import { AsyncStorage } from "react-native" 
import firebase from 'react-native-firebase';            

class HoldingScreen extends React.Component
{
  navigationOptions={
    
    tabBarOptions: {
       activeTintColor: '#fff',
        labelStyle: {
            fontSize: 12,
            padding: 2
        },
        style: {
            backgroundColor: '#1d93d6',
        },
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
          <Image
          source={require('./../../../assets/images/rules_icon.png')}/>
        },
    }
  }
constructor(props) {
  super(props);
  this.state = {
    heading:'',
    data: [],
    userData : []
  };
  let that = this;
  this.getUser(function(val){  
    that.setState({user : val}, function(){
     this.getUserSellData();
    });                    
  }); 
 
}  
getUser(next){
  try {
    AsyncStorage.getItem('user').then(function(val){
      console.log('val',val)
      next(val ? JSON.parse(val): null);
    });
   } catch (error) {
     console.log("error", error);
   }
} 
getUserSellData(){ 
  // debugger       
  let url = 'BuySell/'+this.state.user.id
  let that = this;
  firebase.database().ref(url).once('value').then((data) => {
    let getUserSell  = []   
    Object.keys(data.val()).forEach(function(key){
      getUserSell.push(data.val()[key])     
    });
    this.addFirebaseDataChangeListener(getUserSell);
    // that.setState({userData : getUserSell});
  }).catch((err)=>{
    next(false);
  });
}  
gotoPage(page){  
  let that = this;
  if(page=="Login"){
    AsyncStorage.setItem('user', "").then(function(val){
      that.props.navigation.navigate(page);
    });
  }else{
    that.props.navigation.navigate(page);
  }
}    
componentWillMount()
{
  this.setState({tabview:'1'});  
}
getCurrentSymbolPrice(val){  
// this.addFirebaseDataChangeListener(val)
  
  // let that = this;
  // setTimeout(function()
  // {that.addFirebaseDataChangeListener(val)
  //   ({timePassed: true})}, 1000);
  
  
} 
addFirebaseDataChangeListener(arr){
  let url = "sharesData";
  let finalDate = this.getValidDate();
  let that = this;
  firebase.database().ref(url).on('value', function(data){
    if(data.exists()){
      let dataVal = JSON.parse(data.val());
      Object.keys(dataVal).forEach(function(key){
        dataVal[key].forEach(function(val){
          arr.forEach(function(userData, key){
              if(userData.Symbol==val['Meta Data']['2. Symbol']){
                arr[key]['currentVal'] = val['Meta Data']
              }
          });
        });
      });     
    }
  });
}
getShellPrice(val){  
  val = parseFloat(val);
  let calc = (val - (Math.round(val*0.002)==0 ? 0.005 : Math.round(val*0.002)));
  console.log('cal',calc)
 // return calc.toFixed(3);
}
getValidDate(){
   
  let date = "";
  let currentDate = new Date();
  let prev = currentDate.setDate(currentDate.getDate() -1);
  let day = new Date(prev).toDateString().split(" ")[0];
  if(day=="Sun"){
    date = currentDate.setDate(currentDate.getDate() -2);
  }else{
    date = prev ;
  }
  date =  new Date(date);
  return date.getFullYear() + "-" + ((date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1) + "-" + (date.getDate());
}
handleObjective(text)
      {            
        this.setState({tabview:text});              
      }
      incrementCount(val) {       
         return   count= val + 1
      }
    
 render()
 {
  let SearchImg = require('./../../../assets/images/serach_icon.png');
  let MenuImg = require('./../../../assets/images/hamberger_icon.png');
  let bottomImg = require('./../../../assets/images/loginTop.png');
  let rule = require('./../../../assets/images/rules_icon.png');
  let micro = require('./../../../assets/images/macro_economics_icon.png') ;
  let fundamental = require('./../../../assets/images/fundamental_analysis_icon.png') ;
  let tabview = null;
  let tabRepeat = null;
  tabRepeat = this.state.userData.map((UserData, jIndex) => {
    console.log("UserData UserData", UserData);
    return (

      <View style={styles.holdinglisting} key={jIndex}>       
            <View style={styles.holdinglist}><Text style={styles.holdingtext} >{jIndex+1}</Text></View>          
            <View style={styles.homeView2}><Text style={styles.holdingtext}> {UserData.Symbol} {UserData.Lots} lots </Text></View>
            <View style={styles.homeView2}>
                  <Text style={styles.holdingtext}> {UserData.Buy} </Text>
                  <Text style={styles.holdingtext1}>{this.getCurrentSymbolPrice(UserData.Symbol)}   </Text>
            </View>
            <View style={styles.homeView2}>
                  <Text style={styles.holdingtext}> 24 </Text>
                  <Text style={styles.holdingtext1}>02 </Text>
            </View>
            <View style={styles.homeView2}>
                <Text style={styles.holdingtext}> 0.23</Text>
                <Text style={styles.holdingtext1}> -85.2 </Text>
            </View>
            <View style={styles.homeView2}>
                <Text style={styles.holdingtext}> 23 </Text>
                <Text style={styles.holdingtext1}> 23 </Text>   
            </View>
         </View>
    

    );
  });
 
  if(this.state.tabview == '1') {
     
   tabview =
    <View>
            <View style={styles.homeView}>                
            <View style={styles.homeView1}><Text style={styles.homeViewtext} >Cash on hand  </Text></View>
            <View style={styles.homeView2}><Text style={styles.homeViewtext1}>{this.state.user ? this.state.user.points : 5000000} </Text></View>
            </View>
            <View style={styles.homeView}>
            <View style={styles.homeView1}><Text style={styles.homeViewtext} >Investments </Text></View>
            <View style={styles.homeView2}><Text style={styles.homeViewtext1}>{this.state.InputPoints ? this.state.InputPoints: 0} </Text></View>
            </View> 
            <View style={styles.homeView}>
            <View style={styles.homeView1}><Text style={styles.homeViewtext} > Less initial capital  </Text></View>
            <View style={styles.homeView2}><Text style={styles.homeViewtext1}>{this.state.transation ? this.state.transation : 0} </Text></View>
            </View> 
            <View style={styles.homeView}>       
            <View style={styles.homeView1}><Text style={styles.homeViewtext} >Total gain loss</Text></View>       
            <View style={styles.homeView2}><Text style={styles.homeViewtext1}> 50000000 </Text></View>
            </View>
            <View style={styles.homeView}>       
            <View style={styles.homeView1}><Text style={styles.homeViewtext} >Total gain loss</Text></View>       
            <View style={styles.homeView2}><Text style={styles.homeViewtext1}> 50000000 </Text></View>
            </View>
            <View style={styles.holding}>       
            <View style={styles.holdinglist}><Text style={styles.holdingtext} >No.</Text></View>          
            <View style={styles.homeView2}><Text style={styles.holdingtext}> Name / lots </Text></View>
            <View style={styles.homeView2}><Text style={styles.holdingtext}> last buy / Current sale </Text></View>
            <View style={styles.homeView2}><Text style={styles.holdingtext}> Total buy Sin / Total sale sin </Text></View>
            <View style={styles.homeView2}><Text style={styles.holdingtext}> Fess/ D.v </Text></View>
            <View style={styles.homeView2}><Text style={styles.holdingtext}> P/L % </Text></View>
            </View>
            {tabRepeat}
      </View>  

  }
  else if(this.state.tabview == '2'){
    tabview = <Text>hiiiiiiii 2</Text>  
  } 
  else if(this.state.tabview == '3'){
    tabview = <Text>hiiiiiiii 3</Text>     
  } 
  
  
  return (
    
    <ScrollView contentContainerStyle={styles.container}>

<View style={styles.topmenu}>   
          <View style={styles.homeText}><Text style={styles.tophome}>Holding  </Text></View>
          <View style={styles.homeLogo}></View>
          <View style={styles.homeSideMenu}>
            <View style={styles.sidebar} >
              {/* <Image source={SearchImg} style={{ marginRight: 20, paddingTop: 20 }}></Image> */}
              <Image source={SearchImg} style={styles.searchlogo}></Image>
                {/* <Menu>    
                  <MenuTrigger>
                    <Image source={MenuImg} style={styles.MenuImg}></Image>
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption onSelect={() => this.gotoPage("Login")} text='Logout' />
                     <MenuOption onSelect={() => this.gotoPage("MillionaireDream")} text='Millionaire Dream' /> 
                    <MenuOption onSelect={() => this.gotoPage("GameRule")} text='Game Rules' />
                  </MenuOptions>
                </Menu> */}
              
            </View>
          </View>
        </View>
      
    <View style={styles.gameScreen}>
    <View style={{ flex:1,flexDirection:'row',padding:5}}>
       <TouchableOpacity style={styles.calculateButton} onPress={this.handleObjective.bind(this, '1')}>
           <Text style={styles.buttonText}>Holding</Text>
        </TouchableOpacity>
    </View>
    <View style={{ flex:1,flexDirection:'row' ,padding:5}}>
       <TouchableOpacity style={styles.calculateButton} onPress={this.handleObjective.bind(this,'2')}>
            <Text style={styles.buttonText}>Top 100</Text>
       </TouchableOpacity>
    </View>
    <View style={{ flex:1,flexDirection:'row' ,padding:5}}>
        <TouchableOpacity style={styles.calculateButton} onPress={this.handleObjective.bind(this,'3')}>
           <Text style={styles.buttonText}>Friends</Text>         
        </TouchableOpacity>
    </View>
    </View>
    {tabview}           
    </ScrollView>

  );
 }
 
}

class MacoEco extends React.Component
{
  navigationOptions={
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('./../../../assets/images/rules_icon.png')}
      //  style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
    tabBarOptions: {
       activeTintColor: '#fff',
        labelStyle: {
            fontSize: 12,
            padding: 2
        },
        style: {
            backgroundColor: '#1d93d6',
        },
    }
  }
  render()
  {
    return(
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
       <Text>MacoEco</Text>
      </View>
    );
  }
}
class Assumtion extends React.Component
{
  navigationOptions={
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('./../../../assets/images/rules_icon.png')}
       // style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
    tabBarOptions: {
       activeTintColor: '#fff',
        labelStyle: {
            fontSize: 12,
            padding: 2
        },
        style: {
            backgroundColor: '#1d93d6',
        },
    }
  }
  render()
  {
    return(
      <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
       <Text>Assumtion</Text>
      </View>
    );
  }
}
//export default TabNavigator({
  //Rule:{screen: Rule},
 // MacoEco:{screen: MacoEco},
 // Assumtion:{screen: Assumtion},

//});
const TabNavigator = createMaterialTopTabNavigator({
  'HoldingScreen': HoldingScreen,
  'Macro Economics': MacoEco,
  'Fundamental Analysis':Assumtion,
}
);

// export default createAppContainer(TabNavigator);
export default HoldingScreen;