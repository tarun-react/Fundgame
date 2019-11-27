import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ScrollView} from 'react-native';
import styles from './styles';
import Toast, { DURATION } from 'react-native-easy-toast';
import { AsyncStorage } from "react-native"
import { StackActions, NavigationActions } from 'react-navigation';
import Constants from '../../config/constant';
import { ProgressDialog } from 'react-native-simple-dialogs';
import firebase from 'react-native-firebase';
import { Dimensions } from 'react-native';
import { GoogleSignin, GoogleSigninButton ,statusCodes} from 'react-native-google-signin';
import Container from '../Container';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
  AccessToken
} = FBSDK;
   

class Login extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      loading : false,
      
    }

   
    firebase.config().enableDeveloperMode();
    GoogleSignin.configure({
    //  webClientId: '114762172152-bdlthae30isb271565lbanjvnkffduvg.apps.googleusercontent.com',
      webClientId: '114762172152-6sr9guidalo4c8r5sbal5dqihpl1kccs.apps.googleusercontent.com',
      offlineAccess: true,
    });

    // this.getIsLogin();
  //  this.getFirebaseConfig();
    
   /*  GoogleSignin.configure({
      webClientId: '114762172152-6sr9guidalo4c8r5sbal5dqihpl1kccs.apps.googleusercontent.com', offlineAccess: true,
    }) */
  }

  setLogin(user,loginType, next){
    console.log("this is user data", user);
    try {
      AsyncStorage.setItem('Type', JSON.stringify({type: loginType})).then(function(val){
        AsyncStorage.setItem('user', JSON.stringify(user)).then(function(val){
          next();
        });
      })
     
    } catch (error) {
      console.log("this is prefrence error ", error);
    }
  }

  // getIsLogin(){
  //   let that = this;
  //   try {
  //     AsyncStorage.getItem('user').then(function(val){
  //       if(JSON.parse(val)){
  //         const resetAction = StackActions.reset({
  //           index: 0,
  //           actions: [NavigationActions.navigate({ routeName: 'Home'})],
  //         });
  //         that.props.navigation.dispatch(resetAction);
  //       }
  //     });
  //    } catch (error) {
  //      console.log("error", error);
  //      // Error retrieving data
  //    }
  // }

  onBlur() {
    console.log('onBlur......');
  }

  onPressButton() {
    Alert.alert('You tapped the button!');
  }

  loginWith(type){
    // debugger
    switch(type){
      case Constants.FACEBOOK_LOGIN:
     // this.props.navigation.navigate("BuySellScreen");
     //  this.props.navigation.navigate("BuySellScreen", {Buy : 23.090, Sell : 23.090 , Close: 24.010 , Screen:'Buy' });
       this.loginWithFacebook();
      break;

      case Constants.GOOGLE_LOGIN:
        this.loginWithGoogle();
      break;
    }
   
  }
  loginWithGoogle = async () => {
    that=this;
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      let userInfoGoogle={id:'',name:'',picture:{data:{height:Number,is_silhouette:Boolean,url:'',width:Number}}};
      let state = that.state;
      state.loading = true;
      that.setState(state);
      let data={token:'',tokenId:''};
      userInfoGoogle.id=userInfo.user.id;
      userInfoGoogle.name=userInfo.user.name;
      userInfoGoogle.picture.data.height=200;
      userInfoGoogle.picture.data.is_silhouette=false;
      userInfoGoogle.picture.data.url=userInfo.user.photo;
      userInfoGoogle.picture.data.width=200;
      data.token=userInfo.accessToken;
      data.tokenId=userInfo.idToken;
      console.log('Info', userInfoGoogle);
      this.loginToFirebase(data,'Google',userInfoGoogle);
    } catch (error) {
      alert(error);
     // alert(JSON.stringify(error))
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("SIGN_IN_CANCELLED");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("IN_PROGRESS");     
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("PLAY_SERVICES_NOT_AVAILABLE");      
      } else {     
        console.log(error);
      }
    }
  }; 
  getFirebaseConfig(){
    firebase.config().fetch(0)
    .then(() => {
      return firebase.config().activateFetched();
    })
    .then((activated) => {
      if (!activated) console.log('Fetched data not activated');
      return firebase.config().getValue('BASE_URL');
    })
    .then((snapshot) => {
      const hasExperimentalFeature = snapshot.val();
      if(hasExperimentalFeature) {
        console.log(hasExperimentalFeature);
      }
    })
    .catch(console.error);
  }

  loginWithFacebook(){
    let that = this;
    // debugger
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      function(result) {      
        if (result.isCancelled) {
        } else {
          that.getFacebookAccessToken();
        }
      },
      function(error) {
        alert('Login failed with error: ' + error);
      }
    );
  }

  getFacebookAccessToken(){
    let that = this;
    AccessToken.getCurrentAccessToken()
    .then((data) => {
      let acceess = data.accessToken;
      let state = that.state;
  
      state.loading = true;
      that.setState(state);
      that.loginToFirebase(acceess,'facebook');
    });
  }

  loginToFirebase(acceess,type, userInfoGoogle){
    let that = this;
     const credential= type=='facebook' ? firebase.auth.FacebookAuthProvider.credential(acceess) : firebase.auth.GoogleAuthProvider.credential(acceess.tokenId, acceess.token);
     firebase.auth().signInWithCredential(credential).then((data)=>{
      that.setState({loading:false});
        type=='facebook'? that.getFacebookUserData(acceess) : that.getGoogleUserData(userInfoGoogle);
      
      })
      .catch((error) => {
         alert(error);
         that.setState({loading:false});
      });
  } 

  async getFacebookUserData(token){
    let that = this;
    const response = await fetch('https://graph.facebook.com/me?access_token='+token+'&fields=id,name,picture.type(large)');
    const userInfo = await response.json();
    if(userInfo['error']){
      alert("error");
      return
    }
    let url = "users/"+userInfo.id;
    this.ifUserExist(url, function(isUser){
      let state = that.state;
      state.loading = false;
      that.setState(state);
      if(!isUser){
        userInfo['points'] = 500000; 
        userInfo['total']=0
        userInfo['lastActive']=new Date();
        firebase.database().ref(url).set(userInfo).then(() => {
          that.goToHome(url,'Facebook');
        }).catch((error) => {
         alert(error);
         that.goToHome(url,'Facebook');
        });
      }else{
        that.goToHome(url,'Facebook');
        
      }
    });
  }
  async getGoogleUserData(userInfo)
  {
    let that = this;
    let url = "users/"+userInfo.id;
    this.ifUserExist(url, function(isUser){
      let state = that.state;
      state.loading = false;
      that.setState(state);
      if(!isUser){
        userInfo['points'] = 500000;
        userInfo['total']=0
        userInfo['lastActive']=new Date();
        firebase.database().ref(url).set(userInfo).then(() => {
          that.goToHome(url, 'Google');
        }).catch((error) => {
         alert(error);
         that.goToHome(url, 'Google');
        });
      }else{
        that.goToHome(url, 'Google');   
      }
    });
  }

  goToHome(url,loginType){
    let that = this;
    firebase.database().ref(url).once('value').then((data) => {
        if(data.exists()){
            that.setLogin(data.val(),loginType, function(){
                    //  const resetAction = StackActions.reset({
                    //       index: 0,
                    //      actions: [NavigationActions.navigate({ routeName: 'Home'})],
                    //      });
                    //  that.props.navigation.dispatch(resetAction);
                    that.props.navigation.goBack(); 
            })
        }
    }).catch((err)=>{
      console.log(err)
    });
  }

  ifUserExist(url, next){
    firebase.database().ref(url).once('value').then((data) => {
      next(data.exists());
    }).catch((err)=>{
      
      next(false);
    });
  }

  validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  directLogin(){
   this.props.navigation.navigate("Home",{isLoggin:false});       
 // this.props.navigation.navigate("HoldingScreen");
  }

  //commented by souvik..
  // onLoginCheck(){
  //   let that = this;
  //   let url = Constants.BASE_URL + 'driverAccount/login';
  //   let body = {
  //     email: this.state.email,
  //     password: this.state.password,
  //     RememeberMe : false
  //   };

  //   fetch(url,{
  //       method:'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //       body : JSON.stringify(body)
  //     })
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       if(responseJson.StatusCode==200){
  //         that.setLogin(function(){
  //           that.setDriverId(responseJson.Data.LoginDetails.ID);
  //           const resetAction = StackActions.reset({
  //             index: 0,
  //             actions: [NavigationActions.navigate({ routeName: 'Home' ,isLoggin:true})]
  //           });
  //           that.props.navigation.dispatch(resetAction);
  //         });
  //       }else{
  //         this.refs.toast.show('Wrong username or password', DURATION.LENGTH_SHORT);
  //       } 
  //     })
  //     .catch((error) => {
  //     });    
  //   }

  // async setDriverId(id){
  //   await AsyncStorage.setItem('driverId', ""+id);
  // }

  render() {
    let topImg = require('./../../../assets/images/loginBottom.png');
    let bottomImg = require('./../../../assets/images/bull-bear.jpg') ;
    let back1 = require('./../../../assets/images/back-arrow.png');
    return (
      <Container>
      <ScrollView contentContainerStyle={styles.container}>  
        <Image source={topImg} style={styles.bgLayout}></Image>
        <View style={styles.TopImageContainer}>
         <TouchableOpacity onPress={this.directLogin.bind(this)}>
           <Image source={back1} style={{ width:30,height:30 }}></Image> 
         </TouchableOpacity> 
        </View>
        <View style={{flex:1, marginTop:50 }}>
        <View style={styles.imageMain}>
          <View style={styles.ImageContainer}>
             <Text style={styles.inputHeading}>Login</Text>
          </View>
        </View>
        <View style={styles.textMain }>
          <View style={styles.ImageContainer}>
            <Image source={bottomImg} style={styles.bottomImg}></Image>
           </View>                    
        </View>
        </View>
        
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.facebook} onPress={this.loginWith.bind(this, Constants.FACEBOOK_LOGIN)}>
            <Text style={styles.buttonText}> Login with facebook </Text>
          </TouchableOpacity>

          <View style={{height : 20}}></View>

          <TouchableOpacity style={styles.google} onPress={this.loginWith.bind(this, Constants.GOOGLE_LOGIN)}>
            <Text style={styles.buttonText}> Login with google </Text>
          </TouchableOpacity>

        </View>

       

        <Toast ref="toast"/>

        <ProgressDialog
          visible={this.state.loading}
          message="Please Wait.." >
          <View>
              
          </View>
        </ProgressDialog>
      </ScrollView>
      </Container>
    );
  }
 
}

export default Login;