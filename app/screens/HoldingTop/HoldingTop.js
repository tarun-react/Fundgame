import React from 'react';
import styles from './styles';
import { View, Text, Image,Modal,TextInput, TouchableOpacity, Alert, ScrollView} from 'react-native';
import Friends from './friends';
import { SearchBar,Icon } from 'react-native-elements';
import MyHolding from './myHolding'; 
import firebase from 'react-native-firebase'; 
import { AsyncStorage } from "react-native"
import TopHundread from './topHundread'
import { Menu, MenuOptions, MenuOption, MenuTrigger,MenuProvider} from 'react-native-popup-menu';
import { Dimensions } from 'react-native';
import { LoginManager } from 'react-native-fbsdk';
import { GoogleSignin, GoogleSigninButton ,statusCodes} from 'react-native-google-signin';

import {ToastAndroid} from 'react-native';
import Container from '../Container';

class HoldingTop extends React.Component {
  userforRank = [];
  friendList = [];
  constructor(props) {
    super(props);
    this.state = {
       pressStatusforTab1: true ,
       userforRank : [],
       uid:'', 
       pressStatusforTab2: false,
       pressStatusforTab3: false,
       heading:'My Holding',
       userPic:'',
       userName:'',
       meu:0,
       SearchVisibility:'',
       user:'',
       friendList : [],  
       quarter: this.props.navigation.getParam('quater'),
       date:this.props.navigation.getParam('date'),
     };
     let that=this;
      that.getUser(function(val){  
        that.setState({user : val}, function(){ 
          that.setState({userPic:this.state.user.picture.data.url});
          that.setState({userName:this.state.user.name});
          that.setState({uid: this.state.user.id});
          that.checkU();
        });                    
      });
  }
  checkU()
  { 
    let url = this.state.quarter+'/'+this.state.user.id;
    let that=this; 
    let d;
    console.log('url',url)
    firebase.database().ref(url).on('value', function(data){  
        d=data.val();
        if(d!=null){
          that.setState({meu: d.meu},()=>{
            that.getUserRank(); 
            console.log('ccccc')
          })
        }
      }); 
  }
  getUserRank(){  
    let date=new Date();
    let url;
    let count = 0;
    let length;    
    let url1 = 'users/'
    let that = this;
    // let month=date.getMonth()+1;
    // let meuData1=[];
    urlQ=this.state.quarter; 
    firebase.database().ref(urlQ).once('value').then((data) => {
           this.userforRank=[];
           length=Object.keys(data.val()).length;
           Object.keys(data.val()).map((key, ind)=>{ 
             let dd=data.val()[key];
             console.log(key);
             firebase.database().ref(url1+key).once('value').then((da) => {  
               count++;
               let userd=da.val();
               userd['meu']=dd.meu;
               that.userforRank.push(userd); 
               that.setState({userforRank : that.userforRank},()=>{  
               });
               if(count == length){
                  that.rank();
                }
               }).catch((err)=>{
               console.log(JSON.stringify(err))
              });
              
           });
           
         }).catch((err)=>{
            console.log(JSON.stringify(err))
           });
  }
  getUserRankinFriend(){ 
    // debugger
      let count1=0
      this.userforRank=[];
      let that=this;
      let length; 
      urlQ=this.state.quarter; 
      that.friendList=[];
      let url = "users/"+this.state.user.id+"/friends";
      let myData={
        meu: that.state.meu,
        data:that.state.user,
      }
      firebase.database().ref(url).once('value').then((data) => {
        this.setState({loading:false});
        console.log('dddd',data.val())
        Object.keys(data.val()).map((key)=>{ 
          console.log("userlistarray*********",key);
          firebase.database().ref(url+'/'+key).once('value').then((da) => { 
            let friendData=da.val();
            let tmpFrnd = {};
            firebase.database().ref(urlQ+'/'+friendData.id).once('value').then((daFrnd) => { 
              count1++;
              length=Object.keys(data.val()).length;
              let friendMeu = daFrnd.val();
              if(friendMeu==null){
                tmpFrnd['meu'] = 0;
                tmpFrnd['data'] = friendData; 
                that.friendList.push(tmpFrnd);
              }else{
                tmpFrnd['meu'] = friendMeu.meu;
                tmpFrnd['data'] = friendData;
                that.friendList.push(tmpFrnd);
              }
             
              if(count1 == length){
                that.friendList.push(myData)
                that.friendList = that.friendList.sort(function(a, b){return b.meu - a.meu})
                that.setState({friendList:that.friendList},()=>{
                  console.log("friendData*******", that.friendList);
                  that.rankinFriend();
                });
              }
              //console.log("friendMeu*******", friendMeu);
              }).catch((err)=>{
                console.log(JSON.stringify(err))
             });
            }).catch((err)=>{
              console.log(JSON.stringify(err))
           });
        });
       
      }).catch((err)=>{
         console.log(JSON.stringify(err))
      });
  }
  rank(data){
    let tt=[]; 
    let index=0; 
    console.log(this.userforRank);
    let arr= this.userforRank.sort(function(a, b){return b.meu - a.meu}) 
    arr.map((UserData, jIndex,array) =>{ 
    if(jIndex!=0){  
      console.log(arr[jIndex-1].meu)
      if(UserData.meu==arr[jIndex-1].meu){ 
        index = index;
        tt.push({'rank': index,'id':UserData.id});
      }
      else{ 
        index = index+1;
        tt.push({'rank': index,'id':UserData.id} ); 
      }
    }
    else if(jIndex==0){ 
      index = index+1
     tt.push({'rank': index,'id':UserData.id} );
    }
  });
  console.log('arr',tt);
    this.myrank(tt);
  }
  rankinFriend(data){ 
   let tt=[];
   let index=0; 
   console.log(typeof this.state.userforRank);
   let arr= this.state.friendList.sort(function(a, b){return b.meu - a.meu})
     console.log(typeof arr);
      arr.map((UserData, jIndex,array) =>{ 
        if(jIndex!=0){  
          console.log(arr[jIndex-1].meu)
          if(UserData.meu==arr[jIndex-1].meu){
            index=index;
            tt.push({'rank': index,'id':UserData.data.id});
          }
          else{ 
            index=index+1;
            tt.push({'rank': index,'id':UserData.data.id} );
        
          }
        }
        else if(jIndex==0){ 
          index=index+1
        tt.push({'rank': index,'id':UserData.data.id} );
        }
      });
  console.log('arr',tt);
    this.myrank(tt);
  }
  saveRankInFirebase(){
    let url =  'users/'+this.state.user.id;
    let that=this; 
    firebase.database().ref(url).update({myRank:that.state.rank}).then(() => {  
        console.log('ho gya');
      },(err)=>{
        console.log('err hai');
      }); 
  }
  myrank(finallist){
   let rank; 
   finallist.forEach((uu,i)=>{
    if(uu.id==this.state.user.id){
      rank=uu.rank
    }
   });
   this.setState({rank: rank},()=>{
    // this.saveRankInFirebase();
   })
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
  search(t)
  {
    this.setState({SearchVisibility:'true'});
  }
  close()
  {  
    if(this.state.pressStatusforTab3==true){
    this.childF.filter('')
    }else if(this.state.pressStatusforTab2==true){
      this.child.filter('');
    }
    this.setState({SearchVisibility:'false'});
  }
  rule(t){
    this.getUserRank();
    this.setState({pressStatusforTab1: true});
    this.setState({pressStatusforTab2: false});
    this.setState({pressStatusforTab3: false});
    this.setState({SearchVisibility:'undefined'})
    this.setState({heading: 'My Holding'});
  }
  macro(){
    this.getUserRank();
    this.setState({pressStatusforTab1: false})
    this.setState({pressStatusforTab2: true})
    this.setState({pressStatusforTab3: false})
    this.setState({SearchVisibility:'false'})
    this.setState({heading: 'Top 100'});
  }
  fundamental(){
    this.getUserRankinFriend();
    this.setState({pressStatusforTab1: false})
    this.setState({pressStatusforTab2: false})
    this.setState({pressStatusforTab3: true})
    this.setState({SearchVisibility:'false'})
    this.setState({heading: 'Friends'});
  }
  Menu(t) {
    this.setState({MenuVisibility:true});
  }
  gotoLogin(page){
    let that = this;
    this.setState({MenuVisibility:false})
      that.props.navigation.navigate('Login');
  }
  gotoLogout(page){ 
      let that = this;
      try {
        AsyncStorage.getItem('Type').then(function(val){
          console.log(val);
          if(val!=null){
            let type=JSON.parse(val);
            if(type['type']=='Google'){
              GoogleSignin.revokeAccess();
              GoogleSignin.signOut();
            }
            else if(type['type']=='Facebook'){ 
              LoginManager.logOut()
            }
          }
          AsyncStorage.setItem('user', "").then(function(val){
              that.setState({user : val});
              ToastAndroid.show(' You have logged out successfully !', ToastAndroid.SHORT);
              that.setState({MenuVisibility:false});
              });    
             that.props.navigation.goBack(); 
        });
      
      } catch (error) {
        console.error(error);
      }
  }
  updateSearch = search1 => {
    this.setState({ search1 }); 
    if(this.state.pressStatusforTab3==true){
      this.childF.filter(search1)
    }else if(this.state.pressStatusforTab2==true){
      this.child.filter(search1)
    }
    
  };
  gotoM(page){
    let that = this;
    this.setState({MenuVisibility:false})
    that.props.navigation.navigate('MillionaireDream');
  }
  gotoG(page){
    let that = this;
    this.setState({MenuVisibility:false})
    that.props.navigation.navigate('GameRule');
   }
   gotoHolding(page){
    let that = this;
    this.setState({MenuVisibility:false})
    that.props.navigation.navigate('HoldingTop');
   }
  back(){
    this.props.navigation.goBack();   
  }
  closeMenu(){
    this.setState({MenuVisibility:false});
  }
    render() {
      let back1 = require('./../../../assets/images/back-arrow.png');
      let viewJs=null;
      if(this.state.pressStatusforTab1==true)
      {
        viewJs=<MyHolding  date={this.state.date} quarter={this.state.quarter}/>;
      }
      else if(this.state.pressStatusforTab2==true)
      {
        viewJs=<TopHundread date={this.state.date} quarter={this.state.quarter} navigation={this.props.navigation} ref={child => {this.child = child}} />;
      }
      else if(this.state.pressStatusforTab3==true)
      {
        viewJs=<Friends date={this.state.date} quarter={this.state.quarter} navigation={this.props.navigation} ref={childF => {this.childF = childF}}/>;
      }
      let SearchImg = require('./../../../assets/images/serach_icon.png');
      let bottomImg = require('./../../../assets/images/loginTop.png');
      let moneybag = require('./../../../assets/images/savings.png');
      let trophy = require('./../../../assets/images/trophy.png') ;
      let friends = require('./../../../assets/images/friends.png') ;
      let MenuImg = require('./../../../assets/images/hamberger_icon.png');  
      if(this.state.SearchVisibility=='true')
      {
           var search=(
          <View style={{width:Dimensions.get('window').width/1.1  }}>
          <View style={styles.searchSection}>
           <Icon style={styles.searchIcon} onPress={this.close.bind(this)} name="arrow-back" size={25} color="#808080"/>
             <TextInput  
               style={styles.input}
               placeholder="Type Here..."
               onChangeText= {this.updateSearch}
               underlineColorAndroid="transparent"
               />
            </View>
          </View>
         );
      }
      else if(this.state.SearchVisibility=='false')
      {
         var search=(
          <TouchableOpacity rejectResponderTermination onPress={this.search.bind(this)} style={{width: 30, height:30,marginRight:5,paddingTop:4}}>
          <Image source={SearchImg} style={styles.searchlogo}></Image>
          </TouchableOpacity>
         );
      }
      else if(this.state.SearchVisibility=='undefined'){
        var search=null
      }
      if(this.state.MenuVisibility)
    {
      if(this.state.user==null)
      {
        var menu=(
  
         <Modal 
         style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width}}          
         animationType="slide"
         transparent={true}
         visible={this.state.MenuVisibility}
          >
         <TouchableOpacity  style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width}} onPress={this.closeMenu.bind(this)}>
          <View style={{width:150 ,backgroundColor:'#fff',alignSelf: 'flex-end',margin:5}}>
          <TouchableOpacity rejectResponderTermination onPress={this.gotoLogin.bind(this)}   style={styles.menuview}>
               <Text>Login</Text>  
             </TouchableOpacity>
            <TouchableOpacity rejectResponderTermination onPress={this.gotoM.bind(this)}  style={styles.menuview}> 
               <Text>Millionaire Dream</Text>
            </TouchableOpacity>
            <TouchableOpacity rejectResponderTermination onPress={this.gotoG.bind(this)} style={styles.menuview} >
                 <Text>Game Rules</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity rejectResponderTermination onPress={this.gotoHolding.bind(this)} style={styles.menuview} >
                 <Text>Holdings</Text>
            </TouchableOpacity>   */}
         </View>
       </TouchableOpacity>
       </Modal>
        )
      }
      else{
        var menu=(
          <Modal 
          style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width}}          
          animationType="slide"
          transparent={true}
          visible={this.state.MenuVisibility} >
          <TouchableOpacity  style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width}}  onPress={this.closeMenu.bind(this)}>
       
         <View style={{width:150 ,backgroundColor:'#fff',alignSelf: 'flex-end',margin:5}}>
             <TouchableOpacity rejectResponderTermination onPress={this.gotoM.bind(this)}  style={styles.menuview}> 
                <Text>Millionaire Dream</Text>
             </TouchableOpacity>
             <TouchableOpacity rejectResponderTermination onPress={this.gotoG.bind(this)} style={styles.menuview} >
                  <Text>Game Rules</Text>
             </TouchableOpacity>
             <TouchableOpacity rejectResponderTermination onPress={this.gotoLogout.bind(this)}   style={styles.menuview}>
               <Text>Logout</Text>  
             </TouchableOpacity>
          
          </View>
        </TouchableOpacity>
        </Modal>
        )
      }
          
    }
    else if(this.state.MenuVisibility==false)
    {
      var menu= null;
    }
  
        return (
<Container>

        <View style={{flex:1 ,height:150}}>
        <View style={{height:150}}>
        <View style={styles.topmenu}>
            <View style={styles.homeText}>
               <TouchableOpacity onPress={this.back.bind(this)}> 
                <Image source={back1} style={{ width:30,height:30}}></Image>      
              </TouchableOpacity>
            </View>
            <View  style={styles.homeLogo}>
              <Text style={styles.tophome}>{this.state.heading}</Text>
            </View>
            <View style={styles.homeSideMenu}>
              <View style={styles.sidebar} >
                {search}
               <TouchableOpacity rejectResponderTermination onPress={this.Menu.bind(this)}  style={{width:Dimensions.get('window').width/15,alignItems: 'center',padding:4}}>
                 <Image source={MenuImg} style={styles.MenuImg}></Image>
              </TouchableOpacity>
              </View>
            </View>
          </View>
    
        <View style={styles.tabcontainer}>
        <TouchableOpacity activeOpacity={1} style={this.state.pressStatusforTab1 ? styles.buttonPress: styles.tabview}  onPress={this.rule.bind(this)}>
          <Image source={moneybag} style={{height:28,width:28}}></Image>
          <Text style={styles.tabText}>My holding</Text>
          
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={1} style={this.state.pressStatusforTab2 ? styles.buttonPress: styles.tabview}  onPress={this.macro.bind(this)}>
      
          <Image source={trophy}  style={{height:28,width:28}}></Image>
          <Text style={styles.tabText}>Top 100</Text></TouchableOpacity>
        
        <TouchableOpacity activeOpacity={1} style={this.state.pressStatusforTab3 ? styles.buttonPress: styles.tabview}  onPress={this.fundamental.bind(this)}>
        
          <Image source={friends} style={{height:28,width:28}} ></Image>
          <Text style={styles.tabText}>Friends</Text></TouchableOpacity>
        
        </View>
    </View>

            <ScrollView contentContainerStyle={styles.container}>
              {viewJs}
              {menu}
            </ScrollView>
            <View style={{flex:1, height:Dimensions.get('window').height,width:Dimensions.get('window').width,backgroundColor:'transparent'}}>
              {/* <Text style={{position:'absolute',bottom:60, marginRight:10,marginLeft:10,color:'#FF0000',fontWeight: 'bold'}}>My Rank</Text> */}
              <View style={styles.contain}>
              <View style={styles.rankContainer}>
              <Text style={styles.ranktext}>#{this.state.rank}</Text>
              </View>
              <View style={styles.viewContainer}>
              <Image style={{width:45,height:45,borderRadius: 45/2}} source={{uri: this.state.userPic}}></Image>
              <View style={{flex:3,flexDirection:'row',paddingLeft:10}}>
              <View style={{flex:1,flexDirection:'column'}}>
              <Text style={{fontSize:15,color:'#fff'}}>{this.state.userName}</Text>
              <Text style={{fontSize:12,color:'#fff' }}>μ = {parseFloat(this.state.meu).toFixed(3)}% p.a.</Text> 
              </View>
              </View>
              </View>
              </View>
            </View>
      </View>
</Container>

        );
    }
}
 
export default HoldingTop;

  