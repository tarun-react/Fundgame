import React from 'react';
import { View, Text, Image,TextInput, TouchableOpacity,Modal,TouchableWithoutFeedback, Alert, ScrollView } from 'react-native';
import styles from './styles';
import { SearchBar,Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import Toast, { DURATION } from 'react-native-easy-toast';
import { AsyncStorage } from "react-native"
import { MenuProvider } from 'react-native-popup-menu';
import { ProgressDialog } from 'react-native-simple-dialogs';
import Constants from '../../config/constant'; 
import firebase from 'react-native-firebase';
import REITS from './Reits';
import OTHERS from './others';
import {ToastAndroid} from 'react-native';
import SHARES from './others';
import { GoogleSignin, GoogleSigninButton ,statusCodes} from 'react-native-google-signin';
import { Dimensions } from 'react-native';
import { LoginManager } from 'react-native-fbsdk'
 import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Login from '../Login/Login';
import Container from '../Container';

let request;
const Banner = firebase.admob.Banner;
class Home extends React.Component {
  //comment this
 q1=[1,2,3];
 q2=[4,5,6];
 q3=[7,8,9];
 q4=[10,11,12]
  allSymbols = [];
 
  firebaseConfig = {};
  coreData = {shares : {}, others : {}, reits: {}};
  divAndSplitData=[];
  data={}
  fetchStart = 0;
  looperSymbols = [];
  isFirstTime = true;
  intervalLooper = null;
  divData=[];
  splitData=[];
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      user : '',
      status:'',
      searchString:'',
      date:'',
      firstTime:true,
      pressStatusforTab1: true ,
      login:this.props.navigation.getParam("isLoggin"),
      pressStatusforTab2: false,
      pressStatusforTab3: false,
      loading : true,
      first:true,
      SearchVisibility:false,
      MenuVisibility:false,
      dialogVisible:false,
      search: '',
      divRecieve:Boolean,
      dividentValue:'0',
      dividentDate:'',
      divForSecurity:'',
      splitValue:'0',
      splitDate:'',
      splitForSecurity:'',
      latest:'',
      last:'',quater:''
    } 
   // this.checkFirebaseDataExist();
 }
  shares(t)
  {
    this.changeDataonTabChage1('shares')
    this.setState({pressStatusforTab1: true})
    this.setState({pressStatusforTab2: false})
    this.setState({pressStatusforTab3: false});
   }
  reits(t)
  {  
    this.changeDataonTabChage1('reits')
    this.setState({pressStatusforTab1: false})
    this.setState({pressStatusforTab2: true})
    this.setState({pressStatusforTab3: false})
  }
  others(t)
  {
    this.changeDataonTabChage1('others')
    this.setState({pressStatusforTab1: false})
    this.setState({pressStatusforTab2: false})
    this.setState({pressStatusforTab3: true})
  }
  componentDidMount() { 
    let that=this; 
   
    try{
      this.addFirebaseDataChangeListener()
    }
    catch(err){
       alert('err1', JSON.parse(err));
    }
    try{
       firebase.config().enableDeveloperMode();
    }
    catch(err){
       alert('err2',JSON.parse(err))
    }
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => { 
        console.log("focus is***********")
        AsyncStorage.getItem('user').then(function(val){
          if(val!=null){
            console.log("userdatafound***********")
            that.setState({user:JSON.parse(val)},()=>{
              console.log("userdata************")
              let localData=JSON.parse(val) 
              let url = 'users/'+localData.id+'/lastActive';
              firebase.database().ref('users/'+localData.id).once('value',function(snapshot){
                if(snapshot.val()!=null){
                  that.calculateQuater();
                  firebase.database().ref(url).set(new Date()).then(() => { 
                   
                  });
                }
              });
            });
          }
          else if(val==null){
            that.setState({user:val});
          }
        });
      }
    ); 
  }
   
  componentWillMount(){
    const advert = firebase.admob().interstitial('ca-app-pub-4858150208765829~4487873334');
    const AdRequest = firebase.admob.AdRequest;
    request = new AdRequest();
    request.addKeyword('foo').addKeyword('bar');

    // Load the advert with our AdRequest
    advert.loadAd(request.build());
    // let that=this;
    // AsyncStorage.getItem('user').then(function(val){
    //   if(val!=null){ 
    //     that.setState({user:  JSON.parse(val)},()=>{
    //       that.calculateQuater();
    //     });
    //   }
    // });

  }

  calculateQuater(){ 
    let q='';
    let date=new Date();
    let month=date.getMonth()+1;
    let day=date.getDate();
    let urlForQuater1='Q1-'+date.getFullYear()+'/'+this.state.user.id;
    let urlForQuater2='Q2-'+date.getFullYear()+'/'+this.state.user.id;
    let urlForQuater3='Q3-'+date.getFullYear()+'/'+this.state.user.id;
    let urlForQuater4='Q4-'+date.getFullYear()+'/'+this.state.user.id;
    if(this.q1.includes(month)){
      q='Q1-'+date.getFullYear();
      this.setState({quater:q},()=>{
        this.checkQuater(q);
      });
    }
    else if(this.q2.includes(month)){
       q='Q2-'+date.getFullYear();
       this.setState({quater:q},()=>{
        this.checkQuater(q);
       });
    }
    else if(this.q3.includes(month)){
       q='Q3-'+date.getFullYear();
       this.setState({quater:q},()=>{
        this.checkQuater(q);
       });
    }
    else if(this.q4.includes(month)){
       q='Q4-'+date.getFullYear();
       this.setState({quater:q},()=>{
        this.checkQuater(q);
       });
      // this.checkQuater(q);
    }
  }
  checkQuater(q){
     let that=this; 
     let user;
     firebase.database().ref(q+'/'+this.state.user.id).once('value',function(snapshot){
       console.log('snap',snapshot);
       if(snapshot.val()==null){
         user= that.state.user
         let url="users/"+user.id;
         let url1=q+'/'+that.state.user.id;
         firebase.database().ref(url1).update({meu: 0}).then(() => {  
         
          });
        firebase.database().ref(url).update({points: 500000,total:0}).then(() => {  
          user['points']=500000;
          user['total']=0
          AsyncStorage.setItem('user', JSON.stringify(user)).then(function(val){
            console.log('val',val)
           });
        });
       }
       else{
         
       }
     });
  }
  componentWillUnmount() {
    //this.willFocusSubscription.remove();
  }
  addFirebaseDataChangeListener(){ 
    //let url = "sharesData1";
    let url = "sharesDatav3/";
    let that = this;
    firebase.database().ref(url).once('value', function(data){  
        if(data.exists()){ 
         
          that.coreData = JSON.parse(data.val());
          that.showData();
        }
        if(that.isFirstTime){
           //that.checkFirebaseDataExist(that.coreData);
          }else{ 
            //that.checkFirebaseDataExist(that.coreData);
          }
      },(err)=>{
        alert(err);
      });
   }
  
  checkDataFromAlpa(next){
    let context = this;
    let url = Constants.GET_ALPHA_URL('D05.SI');
    fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let idex = Object.keys(result['Time Series (Daily)']).sort().reverse()[0];
      console.log('gfhgfh',idex);
      next(context);
    });   
  }
  matchFirebaseAndLocalDate()
  { return false;
    //  var data=Object.keys(this.coreData['shares'][0]['Time Series (Daily)']) ;
    //  var lastDate=data.sort().reverse()[0];
    //  const date1 = new Date(lastDate);
    //  const date2 = new Date();
    //  const diffTime = Math.abs(date2.getTime() - date1.getTime());
    //  const diffDays = Math.ceil(diffTime / (1000  * 60 *  60 * 24)); 
    //  console.log(diffDays);
    //  if(diffDays<=2) {
    //   return true;
    //  } 
    //  else{
    //    return false;
    //  } 
  }
  
  changeDataonTabChage(type){
    let that=this;
    setTimeout(()=>{
      let state = that.state;
      that.setState(state);
      let stateChage = that.state;
      stateChage.data= that.visibleData[type]; 
      stateChage.data.sort(function(a, b) { 
         let textA = Object.keys(a)[0].toUpperCase();
         let textB =Object.keys(b)[0].toUpperCase(); 
         return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      stateChage.loading = false;
      that.setState(stateChage);
    },100)
  }
  changeDataonTabChage1(type){
    let that=this;
    that.setState({loading:true})
    setTimeout(()=>{
      let state = that.state;
      that.setState(state);
      let stateChage = that.state;
      stateChage.data= that.visibleData[type];
      stateChage.data.sort(function(a, b) { 
         let textA = Object.keys(a)[0].toUpperCase();
         let textB =Object.keys(b)[0].toUpperCase();
         return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
      stateChage.loading = false;
      that.setState(stateChage);
    },100);
  }
 
  getValidDate(backdate){
    let date = "";
    let currentDate = new Date();
    backdate = backdate-1==0 ? backdate : backdate+1;
    let prev = currentDate.setDate(currentDate.getDate() -backdate);
    let day = new Date(prev).toDateString().split(" ")[0];
    console.log(day);
    if(day=="Sun"){
      date = currentDate.setDate(currentDate.getDate() -2);
    }
    else if(day=="Fri")
    {
      date = currentDate.setDate(currentDate.getDate() -1);
    }
    else if(day=="Sat")
    {
      date = currentDate.setDate(currentDate.getDate() -1);
    }
    else{
      date = prev;
    }
    date =  new Date(date);
    return date.getFullYear() + "-" + ((date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1) + "-" + (date.getDate()<10 ? "0"+date.getDate() : date.getDate());
  }

  getUser(next){
    try {
      AsyncStorage.getItem('user').then(function(val){
        next(val ? JSON.parse(val): null);
      });
     } catch (error) {
       console.log("error", error);
       // Error retrieving data
     }
  }

  checkFirebaseDataExist(data){
    let index=0
    let that = this;
    that.allSymbols=[];
    this.isFirstTime = false;
    this.getFirebaseConfig(function(val){
      that.firebaseConfig = JSON.parse(val).data;
      Object.keys(that.firebaseConfig).forEach(function(val){
        that.firebaseConfig[val].forEach(function(shares){
          that.allSymbols.push({symbol : shares.symbol, type : val, name : shares.name});
        });
      });
      that.looperSymbols = that.allSymbols;
      that.checkFirebaseData1(data);
    })
  }
  checkFirebaseData1(data){  
    let that = this;
    let update=false;
    let formatted_date;
    Object.keys(data).forEach(function(shares){
      Object.keys(data[shares]).forEach(function(value){
        console.log('value'+JSON.stringify(value))
        let val=data[shares][value]
        let match = val['Meta Data'];
        const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let current_datetime = new Date();
        let formatted_date = parseInt(current_datetime.getDate()-1) + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear();
        let mydate = new Date(formatted_date); 
        console.log('formatted_date1', mydate);
        let current_datetime1 = new Date( match['3. Last Refreshed']);
        let formatted_date1 =  current_datetime1.getDate() + "-" + months[current_datetime1.getMonth()] + "-" + current_datetime1.getFullYear();
        let mydate1 = new Date(formatted_date1);
        console.log('formatted_date',mydate1);
        mydate1<  mydate ? update = true : update = false;
        if(match){
           let index = that.looperSymbols.findIndex((symbol)=>
           {
             return(symbol.symbol==match['2. Symbol'])
            });
            if(!update){
              if(index!=-1)
                that.looperSymbols.splice(index, 1);
              }
            }  
      });
    });
    console.log("looperSymbols", that.looperSymbols);
    this.getDailyalphavantage();
  }
  callgetFromAlpha(data){
    console.log('sss',data)
    let that =  this;
     data.forEach(function(data, index){
      that.getFromAlpha( data.symbol, data.type, data.name);
    });
  }
  getFromAlpha(symbol, type, name){
    let context = this;
   let url = Constants.GET_ALPHA_URL(symbol);
    fetch(url)
    .then((response) => response.json())
    .then((result) => {
      console.log("result of url " + url, result);
      if(result['Meta Data']){
        obj1={};
        obj=[];
        let datatime=result['Time Series (Daily)'];
        let latest=Object.keys(datatime).sort().reverse()[0];
        context.setState({latest: latest})
        let lastkey=Object.keys(datatime).sort().reverse()[1];
        context.setState({last: lastkey})
        obj1['Meta Data']=result['Meta Data']; 
        obj1['Meta Data']['name']=name; 
        obj1[latest]=result['Time Series (Daily)'][latest]; 
        obj1[lastkey]=result['Time Series (Daily)'][lastkey]; 
       // obj.push(obj1)
        context.coreData[type][symbol]=obj1;
        
      }
       context.visibleData=context.coreData;
       context.showData();
      console.log('pushVisible data',this.coreData);
    //  let url = "sharesData1/";
        let url = "sharesDatav3/";
    // this.coreData = this.getFilteredData(this.coreData);
    firebase.database().ref(url).set(JSON.stringify(context.coreData)).then((data) => {
      console.log('fire',context.coreData)
    }).catch((error) => {
      console.log(error);
    });
    });   
  }
  showData(){
    let that=this; 
    let finalkey;
    let symbolKey;
    let lastRefresed; 
    that.visibleData={shares : [], others : [], reits: []};
    that.divAndSplitData=[];
    that.data={};
      Object.keys(that.coreData).forEach(function(key){
       console.log(Object.keys(that.coreData).length);
       finalkey=key;
       let value=that.coreData[key];
       Object.keys(value).forEach(function(key){
          symbolKey=key;
          let arrObj = {};
          let arrObj1={};
          let val=value[key];
          arrObj['symbol']=key;
          let localdivAndSplitData={};
          let name=val['Meta Data']['name'];
          localdivAndSplitData[name]={};
          localdivAndSplitData[name]['Dividend']={};
          localdivAndSplitData[name]['Split']={};
          let lastDate=val['Meta Data']['3. Last Refreshed'].split(' ')[0];
    
          // if(val[lastDate]){
            if(val[lastDate]['7. dividend amount']!=0 ) {
              localdivAndSplitData[name]['Dividend']['lastdiv']=val[lastDate]['7. dividend amount'];  
              localdivAndSplitData[name]['Dividend']['date']=lastDate;
            }
            if(val[lastDate]['8. split coefficient']!=1){
              localdivAndSplitData[name]['Split']['lastSplit']=val[lastDate]['8. split coefficient']; 
              localdivAndSplitData[name]['Split']['date']=lastDate;
            }
          // }
           
       Object.keys(val).forEach(function(key){
          if(key=='Meta Data'){
           lastRefresed=val[key]['3. Last Refreshed'].split(' ')[0];
           arrObj['name']=val['Meta Data']['name'];
           if(that.state.date==undefined || that.state.date==''){
                const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let current_datetime = new Date(lastRefresed)
                let formatted_date = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear()
                that.setState({date:formatted_date});
           }
          }
         else if(key==lastRefresed.split(' ')[0]){
                arrObj = val[key]; 
          }
          else{
           arrObj1= val[key];
            arrObj['lastClosePrice1']=arrObj1['4. close'];
          }
         });
         if((parseFloat(arrObj['4. close']) - parseFloat(arrObj1['4. close']))>0){
           arrObj['isHeigh']=1
         }
         else if((parseFloat(arrObj['4. close']) - parseFloat(arrObj1['4. close']))==0){
           arrObj['isHeigh']=0
         }
         else if((parseFloat(arrObj['4. close']) - parseFloat(arrObj1['4. close']))<0){
           arrObj['isHeigh']=2
         }
         console.log('check arrow',arrObj['isHeigh'])
         arrObj['valueforheighandlow']=parseFloat(arrObj['4. close']) - parseFloat(arrObj1['4. close']);
         console.log('valueforheighandlow',arrObj['valueforheighandlow'])
         let oject={[symbolKey]:arrObj}
         that.visibleData[finalkey].push(oject);
         if(Object.keys(localdivAndSplitData).length != 0){
          that.divAndSplitData.push(localdivAndSplitData);
          that.data=that.divAndSplitData;
         }
       }); 
      },(err)=>{
          console.log(JSON.stringify(err))
       });
       that.changeDataonTabChage("shares");
 }
 saveSplitAndDivDataOnFirebase(){
      let url = "divAndsplitStatus/";
      console.log('coreData',this.coreData);
      firebase.database().ref(url).set(JSON.stringify(this.data)).then((data) => {
      console.log('fire',this.divAndSplitData)
      }).catch((error) => {
      console.log(error);
      });
 }
 
  checkFirebaseData(data){
    let that = this;
    Object.keys(data).forEach(function(shares){
      data[shares].forEach(function(value){
        console.log('value'+JSON.stringify(value))
        let match = value['Meta Data'];
        if(match){
           let index = that.looperSymbols.findIndex((symbol)=>{return (symbol.symbol==match['2. Symbol'])});
          if(index!=-1)
            that.looperSymbols.splice(index, 1);
        }
       
      });
    });
    console.log("looperSymbols", that.looperSymbols);
    this.getDailyalphavantage();
  }

  getFirebaseConfig(next){
    
    firebase.config().fetch(0)
    .then(() => {
      return firebase.config().activateFetched();
    })
    .then((activated) => {
      if (!activated) console.log('Fetched data not activated  ');
      return firebase.config().getValue('BASE_URL');
    })
    .then((snapshot) => {
      const hasExperimentalFeature = snapshot.val();
      if(hasExperimentalFeature) {
       next(hasExperimentalFeature);
     }
    })
    .catch(console.error);
  }  

  getDataFromAlpa(url, data,type,symbol,name, index, next){ 
      let context = this;
      fetch(url)
      .then((response) => response.json())
      .then((result) => {
        console.log("result of url " + url, result);
          if(result['Meta Data']){
          obj1={};
          obj=[];
          let datatime=result['Time Series (Daily)'];
          let latest=Object.keys(datatime).sort().reverse()[0];
          context.setState({latest: latest})
          const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          let current_datetime = new Date(latest)
          let formatted_date = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear()
          context.setState({date:formatted_date});
          let lastkey=Object.keys(datatime).sort().reverse()[1];
          context.setState({last: lastkey})
          obj1['Meta Data']=result['Meta Data']; 
          obj1['Meta Data']['name']=name;
          obj1[latest]=result['Time Series (Daily)'][latest]; 
          // if(symbol=='CSCO')
          // obj1[latest]['8. split coefficient']='2';
          // if(symbol=='FB')
          // obj1[latest]['8. split coefficient']='4';
          // if(symbol=='BAC')
          // obj1[latest]['7. dividend amount']='0.7000';
          // if(symbol=='KO')
          // obj1[latest]['7. dividend amount']='0.8000';
          // if(symbol=='BK')
          // obj1[latest]['8. split coefficient']='3';
          obj1[lastkey]=result['Time Series (Daily)'][lastkey]; 
          obj.push(obj1)
         context.coreData[type][symbol]=obj1;
          
        }
         context.visibleData=context.coreData;
        // context.showData();
        // if(result['Meta Data']){
        //   //  let isExist = context.IsSymbolExist(data.symbol);
        //     let isExist = false;
        //    if(!isExist){
        //     Object.keys(result['Time Series (Daily)']).forEach(function (key){
        //       result['Time Series (Daily)'][key]['name']=data.name;
        //     });
        //     this.coreData[data.type].push(result);
        //    }
         
        // }
        console.log('pushVisible data',this.coreData);
        next(context, index);
      });   
  }

  IsSymbolExist(symbol){
    let isExist = false;
    console.log('sss',symbol);
    console.log('ccc',this.coreData)
    Object.keys(this.coreData).forEach((key)=>{
      console.log('ccc',this.coreData[key])
      this.coreData[key].forEach((val)=>{
        console.log('IsSymbolExist',val);
        isExist = (val['Meta Data']['2. Symbol']==symbol)
      })
    })
    return isExist;
  }

  async getDailyalphavantage() {
    this.startLoadDataWithTimer();
   }

  startLoadDataWithTimer(){ 
    let that = this; 
    let count=0;
    setInterval(function(){ 
      that.fetchLimitedData(5);
      count=count+5
    }, 60000);
  }

  fetchLimitedData(max){
    let that =  this;
    this.looperSymbols.slice(this.fetchStart, this.fetchStart+max).forEach(function(data, index){
        let url = Constants.GET_ALPHA_URL(data.symbol);
        that.getDataFromAlpa(url, data,data.type,data.symbol,data.name, index, that.alphaVantageApiCallback);
    });
  }

  alphaVantageApiCallback(that, index){
    if(index==4)
      that.fetchStart = that.fetchStart + 5;
      that.showData()
    setTimeout(function(){
      that.sendDataToFirebase()
    }, 500);
  }

  sendDataToFirebase(){
    this.saveSplitAndDivDataOnFirebase();
   // let url = "sharesData1/";
    let url = "sharesDatav3/";
    console.log('coreData',this.coreData);
    firebase.database().ref(url).set(JSON.stringify(this.coreData)).then((data) => {
      console.log('fire',this.coreData)
    }).catch((error) => {
      console.log(error);
    });
    
  }

  openDetails(type, high,hie,low,open ,volume, sell,buy, closing, symbol,valueforheighandlow,lastcloseprice,lastClosePrice1,symbolName){
    let key;
    let timeData;
    let symbolComesUnder; 
  //  this.setState({dialogVisible:true});
    if(this.state.pressStatusforTab1)  key='shares';
    else if(this.state.pressStatusforTab2) key='reits';
    else if(this.state.pressStatusforTab3) ket='others';
    if(this.state.pressStatusforTab1){
      symbolComesUnder='Shares';
    }
    else if(this.state.pressStatusforTab2){
      symbolComesUnder='REITs';
    }
    else if(this.state.pressStatusforTab3){
      symbolComesUnder='Others';
    }
    let that=this;
    // let url = Constants.GET_ALPHA_URL(symbol);
    // fetch(url)
    // .then((response) => response.json())
    // .then((result) => {
    //   console.log(result['Time Series (Daily)'])
    //    timeData =  result['Time Series (Daily)'];
    //    Object.keys(timeData).forEach((val1,ind)=>{
    //       let divArray={};
    //       let splitArray={}
    //       if(timeData[val1]['7. dividend amount']!=0 ) {
    //               divArray['value']=timeData[val1]['7. dividend amount'];
    //               divArray['date']=val1;
    //               divArray['name']=symbolName
    //               that.divData.push(divArray);
    //             }
    //       if(timeData[val1]['8. split coefficient']!=1){
    //               splitArray['value']=timeData[val1]['8. split coefficient'];
    //               splitArray['date']=val1;
    //               splitArray['name']=timeData[val1]['name'];
    //               that.splitData.push(splitArray);
    //            }      
    //           });
    //        if(Object.keys(that.divData).length==0){
    //               that.state.dividentValue=0;
    //               that.state.dividentDate=''
    //               that.state.divForSecurity=''
    //               that.state.divRecieve=false;
    //        }
    //       else{ 
    //               that.state.dividentValue=that.divData[0].value;
    //               that.state.dividentDate=that.divData[0].date;
    //               that.state.divForSecurity=that.divData[0].name;
    //               that.state.divRecieve=true;
    //       }
    //       if(Object.keys(that.splitData).length==0){
    //               that.state.splitValue=0;
    //               that.state.splitDate=''
    //               that.state.splitForSecurity=''
    //              // that.state.s=false;
    //       }
    //       else{ 
    //               that.state.splitValue=that.splitData[0].value;
    //               that.state.splitDate=that.splitData[0].date;
    //               that.state.splitForSecurity=that.splitData[0].name;
    //              // that.state.divRecieve=true;
    //       }
    //       debugger
          let params = {Buy : buy, Sell : sell , Close: closing , Screen:type, Symbol : symbol, Heigh : high ,Hie:hie,low:low,open:open,volume:volume,valueforheighandlow:valueforheighandlow,lastClosePrice1:lastClosePrice1,timeData:timeData,symbolName:symbolName,date:this.state.date,symbolComesUnder:symbolComesUnder,quater:this.state.quater};
          this.setState({MenuVisibility:false});
          // this.setState({dialogVisible:false});
          this.props.navigation.navigate("BuySellScreen", params);
      
   // });  
    // this.coreData[key].forEach(function(val){
    //   if(val['Meta Data']['2. Symbol']==symbol)
    //   {
    //    timeData= val['Time Series (Daily)'];
    //   }
    // });
  
  }
 
  getShellPrice(val){ 
    val = parseFloat(val);
    let calc = (val - (this.myRound(val*0.002, 0.005)==0 ? 0.005 : this.myRound(val*0.002,0.005)));
    return calc.toFixed(3);
  }
  getBuyPrice(val){ 
    val = parseFloat(val);
    let calc = (val + (this.myRound(val*0.002,0.005)==0 ? 0.005 : this.myRound(val*0.002,0.005)));
    return calc.toFixed(3);
  }
   
  myRound(number,roundto){ 
    return roundto * Math.round(number/roundto);
  }

  gotoLogin(page){
    let that = this;
    this.setState({MenuVisibility:false})
      that.props.navigation.navigate('Login');
  }
  gotoLogout(page)
  { 
    let that = this;
    try {
      AsyncStorage.getItem('Type').then(function(val){
        console.log(val);
        if(val!=null){
          let type=JSON.parse(val);
          if(type['type']=='Google'){
            // GoogleSignin.revokeAccess();
            // GoogleSignin.signOut();
            GoogleSignin.revokeAccess()
            .then(() => GoogleSignin.signOut())
            .done()
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
      });
     
    } catch (error) {
      console.error(error);
    }
  }
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
   gotoHolding(page)
   {
    //uncomment this
    // let that = this;
    // let q='';
    // this.setState({MenuVisibility:false});
    // let date=new Date();
    // let month=date.getMonth()+1;
    // if(month==1 || month==2 || month==3){
    //  console.log('in one quarter');
    //  q='Q1-'+date.getFullYear();
    // }
    // else if(month==4 || month==5 || month==6){
    //   console.log('in two quarter');
    //   q='Q2-'+date.getFullYear();
    // }
    // else if(month==7 || month==8 || month==9){
    //   console.log('in three quarter');
    //   q='Q3-'+date.getFullYear();
    // }
    // else if(month==10 || month==11 || month==12){
    //   console.log('in four quarter');
    //   q='Q4-'+date.getFullYear();
    // }
    this.setState({MenuVisibility:false});
    this.props.navigation.navigate('HoldingTop',{date:this.state.date,'quater':this.state.quater});
   }
  search(t)
  {
    this.setState({SearchVisibility:true});
  }
  Menu(t)
  {
    this.setState({MenuVisibility:true});
  }
  
  updateSearch = search1 => {
    this.setState({ search1 });
    this.filter(search1);
  };
  filter(text)
  { 
    if(text=='')
    {
      if(this.state.pressStatusforTab1==true)
      this.state.data = this.visibleData['shares'];
      else if(this.state.pressStatusforTab2==true)
      this.state.data = this.visibleData['reits'];
      else if(this.state.pressStatusforTab3==true)
      this.state.data = this.visibleData['others'];
    }
    else{
    let filterarr=[];
    if(this.state.pressStatusforTab1==true)
    this.state.data = this.visibleData['shares'];
    else if(this.state.pressStatusforTab2==true)
    this.state.data = this.visibleData['reits'];
    else if(this.state.pressStatusforTab3==true)
    this.state.data = this.visibleData['others'];
     this.state.data.map((da,i)=>{
      let user=da[Object.keys(da)[0]]
       let symbol=Object.keys(da)[0];
     if(symbol.includes(text.toUpperCase()) || (user.name.toUpperCase()).includes(text.toUpperCase()))
     {
       filterarr.push(da);
     }
   })
     this.setState({data: filterarr})
    console.log("data1"+" "+ this.state.data );  
  }
  }
  close()
  { 
    if(this.state.pressStatusforTab1==true)
    this.state.data = this.visibleData['shares'];
    else if(this.state.pressStatusforTab2==true)
    this.state.data = this.visibleData['reits'];
    else if(this.state.pressStatusforTab3==true)
    this.state.data = this.visibleData['others'];
    this.setState({SearchVisibility:false});
  }
  closeMenu()
  {
    this.setState({MenuVisibility:false});
  }
   
  render() {
    
    let bottomImg = require('./../../../assets/images/loginTop.png');
    let SearchImg = require('./../../../assets/images/serach_icon.png');
    let MenuImg = require('./../../../assets/images/hamberger_icon.png');
    let uparr = require('./../../../assets/images/caret-arrow-up.png');
    let downarr = require('./../../../assets/images/sort-down.png'); 
    let doubleDash = require('./../../../assets/images/doubleDash1.png');
    let listingData = null;
    const { search1 } = this.state; 
    if (this.state.data.length > 0) {
      listingData = this.state.data.map((UserData, jIndex) => {
        let img;
        let user=UserData[Object.keys(UserData)[0]]
        let symbol=Object.keys(UserData)[0];
        if(user['isHeigh']==1){
            img=uparr;
        }
        else if(user['isHeigh']==0){
            img=doubleDash;
        }
        else if(user['isHeigh']==2){
            img=downarr;
        }
        return (
     <LinearGradient start={{x: 0, y: 0.25}} end={{x: 0.5, y: 1}}  colors={['#a5d4ef', '#ffffff']} style={styles.linearGradient} style={styles.listing} key={jIndex}>
         <View rejectResponderTermination style={styles.SecondeText} >
             <Text style={styles.listingText}>{this.getShellPrice(user['4. close'])}</Text> 
         </View>
          <View style={styles.SecondeText1}>         
                <View><Text style={styles.subListing} >{user['name']} </Text></View>
                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                 <View style={{flex:1,alignItems:'flex-end'}}><Image style={styles.iconColor} source={img}></Image></View> 
                 <View style={{flex:1,alignItems:'flex-start'}}><Text style={styles.listingText1} >{parseFloat(user['4. close']).toFixed(3)}</Text></View></View>
          </View>
          <View rejectResponderTermination  style={styles.SecondeEnd} >
               <Text style={styles.listingText} >{this.getBuyPrice(user['4. close'])}</Text>   
          </View>
          <View style={styles.fiftyfifty}>
              <TouchableOpacity style={{flex:1}} onPress={this.openDetails.bind(this,'Sell',user['isHeigh'],user['2. high'],user['3. low'],user['1. open'],user['6. volume'], this.getShellPrice(user['4. close']), this.getBuyPrice(user['4. close']), user['4. close'], symbol,user['valueforheighandlow'],user['lastClosePrice'],user['lastClosePrice1'],user['name'])}>
              </TouchableOpacity>
              <TouchableOpacity style={{flex:1}} onPress={this.openDetails.bind(this,'Buy',user['isHeigh'],user['2. high'],user['3. low'],user['1. open'], user['6. volume'], this.getShellPrice(user['4. close']), this.getBuyPrice(user['4. close']), user['4. close'], symbol,user['valueforheighandlow'],user['lastClosePrice'],user['lastClosePrice1'],user['name'])}>
              </TouchableOpacity>
          </View>
     </LinearGradient>
         
        );
      });
    }
    if(this.state.SearchVisibility==true)
    {
      var search=(
        <View style={{width:Dimensions.get('window').width/1.1 }}>
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
    else if(this.state.SearchVisibility==false)
    {
      var search=(
        <TouchableOpacity rejectResponderTermination onPress={this.search.bind(this)} style={{padding:4,width: 30, height:30,marginRight:8,paddingTop:5}}>
        <Image source={SearchImg} style={styles.searchlogo}></Image>
        </TouchableOpacity>
       );
    }
  
    if(this.state.MenuVisibility)
    {
      console.log("valueis******", JSON.stringify(this.state.user));
      if(this.state.user==null || this.state.user=='')
      {
        var menu=(
        //  <Modal 
        //   style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width}}          
        //   animationType="slide"
        //   transparent={true}
        //   visible={this.state.MenuVisibility} >
        //   <TouchableOpacity onPress={this.closeMenu.bind(this)} >
        //    <View style={{width:150 ,backgroundColor:'#fff',alignSelf: 'flex-end',margin:5}}>
        //      <TouchableWithoutFeedback rejectResponderTermination onPress={this.gotoLogin.bind(this)}   style={styles.menuview}>
        //        <Text>Login</Text>  
        //      </TouchableWithoutFeedback>
        //      <TouchableWithoutFeedback rejectResponderTermination onPress={this.gotoM.bind(this)}  style={styles.menuview}> 
        //         <Text>Millionaire Dream</Text>
        //      </TouchableWithoutFeedback>
        //      <TouchableWithoutFeedback rejectResponderTermination onPress={this.gotoG.bind(this)} style={styles.menuview} >
        //           <Text>Game Rules</Text>
        //      </TouchableWithoutFeedback>
        //       </View>
        //   </TouchableOpacity>
        // </Modal>
         <Modal 
         style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width,marginTop:50}}          
         animationType="slide"
         transparent={true}
         visible={this.state.MenuVisibility}
          >
         <TouchableOpacity  style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width}}  onPress={this.closeMenu.bind(this)}>
          <View style={{width:150,backgroundColor:'#fff',alignSelf: 'flex-end',margin:5,marginTop:30}}>
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
          visible={this.state.MenuVisibility}
           >
          <TouchableOpacity style={{height:Dimensions.get('window').height,width:Dimensions.get('window').width}} onPress={this.closeMenu.bind(this)}>
       
         <View style={{width:150 ,backgroundColor:'#fff',alignSelf: 'flex-end',margin:5,marginTop:10}}>
           <TouchableOpacity rejectResponderTermination onPress={this.gotoHolding.bind(this)} style={styles.menuview} >
                  <Text>Holdings</Text>
             </TouchableOpacity> 
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
  
    const renderTouchable = () => <TouchableOpacity/>;                                                 

    return (
      <View style={{flex:1}}>
<Container>

    <View style={{flex:1}}>
      <View style={styles.header}>
          <View style={styles.topmenu}>
            <View style={styles.homeText}><Text style={styles.tophome}>Fund Game</Text></View>
            <View  style={styles.homeLogo}>
              <Image style={styles.homeImg} source={bottomImg}></Image>
            </View>
            <View style={styles.homeSideMenu}>
              <View style={styles.sidebar} >
                {search}
               <TouchableOpacity rejectResponderTermination onPress={this.Menu.bind(this)} renderTouchable={renderTouchable} style={{width:Dimensions.get('window').width/15,alignItems: 'center',padding:4}}>
                 <Image source={MenuImg} style={styles.MenuImg}></Image>
              </TouchableOpacity>
              </View>
            </View>
          </View>
           <View style={styles.tabcontainer}>
            <TouchableOpacity rejectResponderTermination activeOpacity={1} style={this.state.pressStatusforTab1 ? styles.buttonPress: styles.tabview}  onPress={this.shares.bind(this)}>
              <Text style={styles.tabText}>Shares</Text>
            </TouchableOpacity>
            <TouchableOpacity rejectResponderTermination activeOpacity={1} style={this.state.pressStatusforTab2 ? styles.buttonPress: styles.tabview}  onPress={this.reits.bind(this)}>
              <Text style={styles.tabText}>REITs</Text>
              </TouchableOpacity>
            <TouchableOpacity rejectResponderTermination activeOpacity={1} style={this.state.pressStatusforTab3 ? styles.buttonPress: styles.tabview}  onPress={this.others.bind(this)}>
            
              <Text style={styles.tabText}>Others</Text>
              </TouchableOpacity> 
          </View> 
          <View style={styles.homeView}>
            <View style={styles.homeView1}><Text style={styles.sec} >Sell $ </Text></View>
            <View style={styles.homeView2}><Text style={styles.sec1}>Buy $ </Text></View>
          </View>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
       {listingData}
       <ProgressDialog
           visible={this.state.loading}
           message="Please Wait.." >
           <View> </View>
        </ProgressDialog>
        <ProgressDialog
          visible={this.state.dialogVisible}
          message="Please Wait.." >    
          <View>
              
          </View>
        </ProgressDialog>
        {menu}
      </ScrollView>
     
      <Text style={{color:'#FF0000', position:'absolute', top:130, width:'100%', textAlign:'center'}}>{this.state.date}</Text>
      </View>
</Container>
    
    <Banner
    size={"BANNER"}
    style={{alignSelf:'center'}}
    onAdFailedToLoad ={(err) => console.log(err) }
    unitId={"ca-app-pub-8514281250854623/9993644593"}
    request={request.build()}
    onAdLoaded={() => { 
    }}
  />

  </View>
);
  }

}

export default Home;