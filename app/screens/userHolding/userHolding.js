import React, { PropTypes } from 'react';
import { TouchableOpacity,ScrollView,Image, Text,View,Modal, StyleSheet,Animated } from 'react-native';
import styles from './styles';  
import { ProgressDialog } from 'react-native-simple-dialogs';
import { AsyncStorage } from "react-native";
import { Dimensions } from 'react-native';
import ChartView from 'react-native-highcharts';
import firebase from 'react-native-firebase'; 
import Moment from 'react-moment';
import { Card } from 'react-native-elements'; 

 class userHolding extends React.Component
{
  coreData = {shares : [], others : [], reits: []};
  visibleData = [];
  splitanddivarr=[];
  allquarter=[];
  allquarterForTest=['Q1-2019','Q2-2019','Q3-2019','Q4-2019'];
  userforRank = [];
  user = [];
  friendList = [];
  finalList = [];
  
  constructor(props) {
    super(props);
    this.state = {
        date:this.props.navigation.getParam("date"),
        quater:this.props.navigation.getParam('quater'),
        id:this.props.navigation.getParam('userId'),
        name:this.props.navigation.getParam('name'),
        rank:this.props.navigation.getParam('rank'),
        meu:this.props.navigation.getParam('meu'),
        imageUrl:this.props.navigation.getParam('imageUrl'),
        userFriendData:this.props.navigation.getParam('userData'),
        friendStatus:this.props.navigation.getParam('friendStatus'),
        loginUserId:this.props.navigation.getParam('loginUserId'),
        friendPage:this.props.navigation.getParam('friendPage'),
        friendList:[], 
        finalList:[],
        heading:'',
        loading:true,
        points:this.props.navigation.getParam('points'),
        oneLote:100,
        lastUpdatedDate:'',
        historicMeu:'',
        splitanddivarrF:[],
        data: [],
        openModal:false,
        lastActiveDays:'',
        userData : {},
        allData:{},
        investment:'',
        gainOrLoss:'', 
        userPic:'', 
        countForShare:0,
        countForReits:0,
        countForOther:0,
        userName:'',
        divamt: '',
        divdate:'', 
        uid:'', 
        quaterdata:[],
        userforRank : [],
        firstTime : true
    }; 
    console.log("meuis**********", this.state.meu); 
    this.getHistoricmeu();
    this.lastActive();
    let that=this;
    this.getData(function(val1){ 
       that.getUserSellData();  
    })
    this.getListOfFriend();
  }  
  checkIsFriend(id){
    console.log("iddddddd", id)
    console.log("friendList", this.friendList);
    console.log(this.finalList.indexOf(id)==-1 ? false : true);
    return this.finalList.indexOf(id)==-1 ? false : true;
  }
  getListOfFriend(id ,type , keyy){ 
    console.log('idddd',id);
    let url='users/'+this.state.loginUserId+'/friends';
    let that=this;
    let indexnum=Number;
    firebase.database().ref(url).once('value').then((data)=>{
      console.log('tttt',data.val())
      let friendData=data.val();
      if(friendData==null){
        that.finalList=[];
        that.setState({finalList:that.finalList});
        if(id!=undefined){
          that.finalList.push(id);
          that.setState({finalList:that.finalList});
        }
      }else{
        if(type==undefined){
           Object.keys(friendData).forEach(function(key){
             that.finalList.push(friendData[key]['id']);
             console.log('finalList',that.finalList);
             that.setState({finalList:that.finalList});
           });
        }
        else{
          if(type=='0'){
            that.finalList.push(id);
            that.setState({finalList:that.finalList});
          }
          else if(type=='1'){
            that.finalList.forEach((data,key)=>{
              if(data==id){
                indexnum=key;
                return;
              }
           });
           firebase.database().ref('users/'+this.state.loginUserId+'/friends').child(keyy).remove().then(()=>{
             that.finalList.splice(indexnum, 1);
           that.setState({finalList:that.finalList});
           });
           
          }
        }
      }
    })
  }
  addFriend(){ 
    if(this.state.finalList.length>=9999){
      alert('you can add max 9,999 number of Friends');
    }else{
      this.setState({loading:true}); 
      let url = "users/"+this.state.loginUserId+"/friends";
      let that=this;
     // this.state.user[index]['isFriend'] = true;
     // this.setState(this.state.user) ; 
      firebase.database().ref(url).push(this.state.userFriendData).then(() => {  
        that.getListOfFriend(this.state.userFriendData.id,'0');
        that.setState({loading:false}); 
      });
    }
  
    }
    removeFriend(){
      this.setState({loading:true});
       let url='users/'+this.state.loginUserId+'/friends';
       let that=this; 
       firebase.database().ref(url).once('value').then((data) => {
          let allDatalist = data.val();
          Object.keys(allDatalist).forEach(function(key){
            if(allDatalist[key]['id']==that.state.userFriendData['id']){
              that.getListOfFriend(that.state.userFriendData.id,'1',key);
              that.setState({loading:false}); 
            }
          });
       });
    }
  
  componentWillMount()
{
  this.setState({tabview:'1'});  
}
  lastActive(){ 
    let url='users/'+this.state.id+'/lastActive';
    let that=this;
    firebase.database().ref(url).once('value').then((data)=>{
      that.setState({lastUpdatedDate:data.val()},()=>{
         that.calculateDays();
      });
    })
  }
  calculateDays(){
    let one_day=1000*60*60*24;
    let date1 = new Date(this.state.lastUpdatedDate);
    let date2 = new Date(); 
    let date1_ms = date1.getTime();
    let date2_ms = date2.getTime(); 
    let difference_ms = date2_ms - date1_ms; 
    console.log('djsn',date2_ms - date1_ms)
    let days=Math.round(difference_ms/one_day)
    if(days==0){
      this.setState({lastActiveDays : 'Today'})
    }else{
      this.setState({lastActiveDays : days+' days Ago'})
    }
  }
  getData(next)
  { 
    let arrObj = {};
    let datatime;
    let that=this;
    firebase.database().ref("sharesDatav3").once('value', function(data){
      that.coreData= JSON.parse(data.val());
      Object.keys(that.coreData).forEach(function(key){
        let value=that.coreData[key];
        Object.keys(value).forEach(function(key){
                let lastday=value[key]['Meta Data']['3. Last Refreshed'].split(' ')[0];;
                let lastKey=value[key][lastday]
                arrObj=lastKey;
                that.visibleData.push(arrObj)
              });
            });
            next(true);
          });   
  }
  // getHistoricmeu(){
  //   let totalQuater=0;
  //   let date=new Date();
  //   let month = date.getMonth() + 1;
  //   let q=Math.ceil(month / 3);
  //   let year=date.getFullYear();
  //   while(this.allquarter.length<10){
  //     if(year!=date.getFullYear()){
  //      q=4;
  //     }
  //    for(let i=1;i<=q;i++){
  //       if(this.allquarter.length==10){
  //         break;
  //       }
  //       this.allquarter.push('Q'+i+'-'+year)
  //     }
  //     year=year-1;
  //   } 
  //   this.calculateHistoricMeu();
  // }
  // calculateHistoricMeu(){
  //   let meusum=0;
  //   let counter=0;
  //   let dividecounter=0;
     
  //   this.allquarter.forEach((data,index)=>{
  //     let url=data+'/'+this.state.id
  //     firebase.database().ref(url).once('value').then((data) => {
  //       counter= counter+1;
  //        let obj=data.val();
  //         if(obj!=null){
  //          if(obj['meu']!=0){
  //           dividecounter=dividecounter+1;
  //          }
  //           meusum = meusum + obj['meu'];
  //        } 
  //      //  if(counter==10){
  //       if(counter==4){
  //         if(meusum==0 && dividecounter==0){
  //           this.setState({historicMeu:(0).toString()},()=>{
  //             console.log(this.state.historicMeu)
  //           })
  //         }
  //         else{
  //           this.setState({historicMeu:(meusum/dividecounter).toString()},()=>{
  //             console.log(this.state.historicMeu)
  //           })
  //         }
  //        }
  //     },(err)=>{
  //       console.log('eee',data);
  //     });
  //   });
  // }
  getHistoricmeu(){ 
    let totalQuater=0;
    let date=new Date();
    let month = date.getMonth() + 1;
    let q=Math.ceil(month / 3); 
    let year=date.getFullYear();
    while(this.allquarter.length<10){
      if(year!=date.getFullYear()){
       q=4;
      }
     for(let i=1;i<=q;i++){
        if(this.allquarter.length==10){
          break;
        }
        this.allquarter.push('Q'+i+'-'+year)
     }
      year=year-1;
    } 
    this.calculateHistoricMeu();
  }
  calculateHistoricMeu(){ 
    let meusum=0;
    let counter=0;
    let dividecounter=0; 
    this.allquarterForTest.forEach((data,index)=>{
      let url=data+'/'+this.state.id
      firebase.database().ref(url).once('value').then((data) => {
       
          counter= counter+1;
          let obj=data.val();
          
          if(obj!=null){
            if(obj['meu']!=0){
              dividecounter=dividecounter+1;
            }
              meusum = meusum + obj['meu'];
          } 
        //  if(counter==10){
         if(counter==4){
           if(meusum==0 && dividecounter==0){
             this.setState({historicMeu:(0).toString()},()=>{
               console.log(this.state.historicMeu)
             })
           }
           else{
             this.setState({historicMeu:(meusum/dividecounter).toString()},()=>{
               console.log(this.state.historicMeu)
             })
           }
          }
        
  
      },(err)=>{
        console.log('eee',data);
      });
    });
  }
  getUserSellData(){    
    let url = this.state.quater+'/' +this.state.id
     let that = this;
     let share=0;
     let reits=0;
     let other=0;
     let shareS=0;
     let reitsS=0;
     let otherS=0;
     let name;  
    firebase.database().ref(url).once('value').then((data) => {
       let getUserSell  = {}; 
       that.setState({firstTime:true}); 
       Object.keys(data.val()).forEach(function(key){ 
        if(key!='meu'){    
         if(data.val()[key]['Type']=='Buy'){
           name=data.val()[key]['Name'];
           console.log(data.val());
          //  that.checkSplitAndcoffee(data.val()[key]['Name'],data.val()[key]['date'],function(){
          //   // setTimeout(function(){
          //   //   that.getInvestment()
          //   // },1000)
          //   that.getInvestment()
          // })
           if(data.val()[key]['symbolForSecurity']=='Shares'){ 
             let sellamt=parseFloat(that.getCurrentSymbolPrice(data.val()[key]['Name']));
             let lot= parseInt(data.val()[key]['Lots']);
            // let buyamt= parseFloat(data.val()[key]['Buy']).toFixed(3);
             let tfee=parseFloat(data.val()[key]['Transaction']);
             let c= ((lot*that.state.oneLote*sellamt)+tfee) ;
             share=share+c;
           }
           else if(data.val()[key]['symbolForSecurity']=='REITs'){
             let lot= parseInt(data.val()[key]['Lots'])
             let sellamt=parseFloat(that.getCurrentSymbolPrice(data.val()[key]['Name']));
            // let buyamt= parseFloat(data.val()[key]['Buy']).toFixed(3);
             let tfee=parseFloat(data.val()[key]['Transaction']);
             let r= ((lot*that.state.oneLote*sellamt)+tfee) ;
             reits=reits+r;
           }   
           else if(data.val()[key]['symbolForSecurity']=='Others'){
             let lot= parseInt(data.val()[key]['Lots']);
             let sellamt=parseFloat(that.getCurrentSymbolPrice(data.val()[key]['Name']));
            // let buyamt= parseFloat(data.val()[key]['Buy']).toFixed(3);
             let tfee=parseFloat(data.val()[key]['Transaction']);
             let o= ((lot*that.state.oneLote*sellamt)+tfee) ;
             other=other+o;
           }    
         }
         else if(data.val()[key]['Type']=='Sell'){ 
           if(data.val()[key]['symbolForSecurity']=='Shares'){
             let lot= parseInt(data.val()[key]['Lots']);
             let sellamt=parseFloat(that.getCurrentSymbolPrice(data.val()[key]['Name']));
             console.log(data.val()[key]['Lots'])
            // let buyamt= parseFloat(data.val()[key]['Buy']).toFixed(3);
             let tfee=parseFloat(data.val()[key]['Transaction']);
             let c= ((lot*that.state.oneLote*sellamt)+tfee) ;
             shareS=shareS+c;
           }
           else if(data.val()[key]['symbolForSecurity']=='REITs'){
             let lot= parseInt(data.val()[key]['Lots'])
             let sellamt=parseFloat(that.getCurrentSymbolPrice(data.val()[key]['Name']));
             //let buyamt= parseFloat(data.val()[key]['Buy']).toFixed(3);
             let tfee=parseFloat(data.val()[key]['Transaction']);
             let r= ((lot*that.state.oneLote*sellamt)+tfee) ;
             reitsS=reitsS+r; 
           }   
           else if(data.val()[key]['symbolForSecurity']=='Others'){
             let lot= parseInt(data.val()[key]['Lots']);
             let sellamt=parseFloat(that.getCurrentSymbolPrice(data.val()[key]['Name']));
            // let buyamt= parseFloat(data.val()[key]['Buy']).toFixed(3);
             let tfee=parseFloat(data.val()[key]['Transaction']);
             let o= ((lot*that.state.oneLote*sellamt)+tfee);
             otherS=otherS+o;
           }    
         }
         console.log('ksajmfdklas',getUserSell);
         console.log('ksajmfdklas',data.val()[key]['Name']);
         if( !getUserSell[data.val()[key]['Name']]){
           getUserSell[data.val()[key]['Name']] = [];
         }
         getUserSell[data.val()[key]['Name']].push(data.val()[key]);
        }
         //written by souvik..
        // else{
        //   that.getInvestment();
        // }  
       });
       that.setState({userData : getUserSell},()=>{
        Object.keys(data.val()).forEach(function(key, index){ 
          that.checkSplitAndcoffee(data.val()[key]['Name'],data.val()[key]['date'], function(){
            if(index==Object.keys(data.val()).length-2 || index==0){
              that.getInvestment()
            }
          }) 
        });
      });
      this.setState({countForShare: share-shareS});
      this.setState({countForReits: reits-reitsS});
      this.setState({countForOther : other-otherS})
      //  this.setState({countForShare: share-shareS });
      //  this.setState({countForReits: reits-reitsS});
      //  this.setState({countForOther : other-otherS})
      //  that.setState({userData : getUserSell},()=>{
      //  });

      // setTimeout(function(){
      //   that.getInvestment()
      // },1000)
      //  this.getInvestment();           //commented by souvik..
     }).catch((err)=>{
       this.getInvestment();
     });
   }
   getCurrentSymbolPrice(val) {  
    for(let i=0; i<this.visibleData.length;i++)
       {
         if(this.visibleData[i]['name']==val)
         {
           val = parseFloat(this.visibleData[i]['4. close']);
           console.log(val)
           let calc = (val - (this.myRound(val*0.002,0.005)==0 ? 0.005 : this.myRound(val*0.002,0.005)));
           return calc.toFixed(3);
         }
       } 
   }
   checkHighAndLow(val){
    for(let i=0; i<this.visibleData.length;i++)
    {
      if(this.visibleData[i]['name']==val)
      {
        // val = parseFloat(this.visibleData[i]['4. close']);
        // console.log(val)
        // let calc = (val - (this.myRound(val*0.002,0.005)==0 ? 0.005 : this.myRound(val*0.002,0.005)));
        return this.visibleData[i]['isHeigh'];
      }
    }
  } 
   myRound(number,roundto){ 
     return roundto * Math.round(number/roundto);
   }
  getInvestment()
  {   
  console.log(this.state.userData)
  let CurrentP;
  let final=0;
  let that = this;
    if (Object.keys(this.state.userData).length==0)
      {
        this.setState({investment:'0'},()=>{
          this.getGainLoss();
        }); 
      }
    else 
      {
        let splitVal = 0; 
        console.log("splitdivarr*******", this.state.splitanddivarrF);
        console.log("SplitData is*******", splitVal); 
        Object.keys(this.state.userData).forEach((key,i)=>{
          let bamt=0;
          let samt=0;
          for(let j=0;j<this.state.userData[key].length;j++)
          {
            this.state.splitanddivarrF.forEach(function(data){
              if(data['valueType']=='Split' && that.state.userData[key][j].Name == data['symbol']){
                  splitVal = parseFloat(data['value'])
                }
                else {
                  splitVal = 0;
                }
              })
              console.log("userdata******", this.state.userData);
            if(this.state.userData[key][j].Type=='Buy'){ 
                bamt = bamt + parseInt(this.state.userData[key][j].Lots); 
            }
             else if(this.state.userData[key][j].Type=='Sell') {
                samt = samt + parseInt(this.state.userData[key][j].Lots);
              }
           }
            //commented by souvik..
            // let l=(bamt-samt)*this.state.oneLote;
            let splitChanges = splitVal==0 ? (bamt-samt) : (bamt*splitVal-samt);
            let l = splitChanges*this.state.oneLote;
            CurrentP =  (l*this.getCurrentSymbolPrice(this.state.userData[key][0]['Name']));
            final=final +CurrentP
            console.log('current',final)
            console.log("bamt " +bamt + "samt "+samt +" * "+splitVal + " splitChanges "+splitChanges)
          
        });
      this.setState({investment: final},()=>{
        this.getGainLoss();
      }); 
    }
  }
  getGainLoss()
  {  
  let coh=  this.state.points.toString().replace(/,/g,"");
  let data=parseFloat(coh)+parseFloat(this.state.investment);
  console.log('coh',data);
  let data1=parseFloat(data)-500000;
  this.setState({gainOrLoss: data1},()=>{ 
    this.calculateU();
  });
  }
calculateU(){ 
  let url =  this.state.quater+'/'+this.state.id;
  let that=this;
  this.setState({loading:false});
  }

  commafy( num ) {
    let str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}
                                                          
calculateK(amt){
  if(amt<1000)
  return  Math.round(amt);
  else if(amt>=1000){
   let cost=  amt/1000;
   return  Math.round(cost)+'k';
  }
  else if(amt>=100000){
    let cost1= amt/1000;
   return Math.round(cost)+'k';
  }
  else if(amt>=1000000){
    let cost1= amt/1000000;
   return Math.round(cost)+'m';
  }
  else if(amt>100000000){
    let cost1= amt/1000000;
   return Math.round(cost)+'m';
  }
  else if(amt>100000000){
    let cost1= amt/1000;
   return Math.round(cost)+'k';
  }
  else if(amt>99999999999){
    return '100 b'
  }
}
commafy1( num ) {
  let str = num.toString().split('.');
  if (str[0].length >= 5) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
  }
  if (str[1] && str[1].length >= 5) {
      str[1] = str[1].replace(/(\d{3})/g, '$1 ');
  }
  return str.join('.');
}
numberWithCommas(x) {
  x = x.toString();
  let pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
      x = x.replace(pattern, "$1,$2");
  return x;
}
  back(){
    this.props.navigation.goBack();   
  }
  checkSplitAndcoffee(symbol,date,next){ 
    let that=this;
    let symarr=[];
    let total=0;
    let pointss=0;
    const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 
    let url = 'divAndsplitStatusv3/' 
    let buyDateTime = new Date(date);
    firebase.database().ref(url).once('value').then((data) => {
      let data1=JSON.parse(data.val());
      symarr.push(symbol);
      data1.forEach((result,index)=>{
        let obj={};
        let obj1={};
        let div=false;
        let split=false;
        let checkKey=Object.keys(result)[0];
        if( checkKey==symbol){
          if(that.splitanddivarr.length!=0){
            that.splitanddivarr.forEach((data,i)=>{
                if(data.symbol==symbol && data.valueType=='dividends'){
                  div=true;
                }
                else if(data.symbol==symbol && data.valueType=='Split'){
                  split=true;
                }
            });
          }
          if(div==false){
            if(Object.keys(result[checkKey]['Dividend']).length!=0){
              let current_datetime = new Date(result[checkKey]['Dividend']['date']);
              let divDateTime = new Date(current_datetime);
              if(divDateTime>=buyDateTime){
                let formatted = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear();
                obj['symbol'] = checkKey;
                obj['date'] = formatted;
                obj['valueType'] = 'dividends';
                obj['value'] = result[checkKey]['Dividend']['lastdiv'];
                obj['calculation']=(100*parseFloat(result[checkKey]['Dividend']['lastdiv']));
                that.splitanddivarr.push(obj);
              }           
            } 
          }
          if(split==false){
            if(Object.keys(result[checkKey]['Split']).length!=0){ 
              let current_datetime1 = new Date(result[checkKey]['Split']['date']);
              let divDateTime = new Date(current_datetime1);
              if(divDateTime>=buyDateTime){
              let formatted1 = current_datetime1.getDate() + " " + months[current_datetime1.getMonth()] + " " + current_datetime1.getFullYear();
              obj1['symbol'] = checkKey; 
              obj1['date'] = formatted1;
              obj1['valueType'] = 'Split';
              obj1['value'] = result[checkKey]['Split']['lastSplit'];
              obj1['calculation']=(parseInt(result[checkKey]['Split']['lastSplit']));
              that.splitanddivarr.push(obj1);
              }
            }
          }
        }
      });
      this.setState({splitanddivarrF:that.splitanddivarr},()=>{
        console.log(this.state.splitanddivarrF);
        this.saveToUserFirebase()
        next();
      });
    });
    // firebase.database().ref(url).once('value').then((data) => {
    //   let data1=JSON.parse(data.val());
    //   symarr.push(symbol);
    //   data1.forEach((result,index)=>{
    //     let obj={};
    //     let obj1={};
    //     let div=false;
    //     let split=false;
    //     let checkKey=Object.keys(result)[0];
    //     if( checkKey==symbol){
    //       if(that.splitanddivarr.length!=0){
    //         that.splitanddivarr.forEach((data,i)=>{
    //             if(data.symbol==symbol && data.valueType=='dividends'){
    //               div=true;
    //             }
    //             else if(data.symbol==symbol && data.valueType=='Split'){
    //               split=true;
    //             }
    //         });
    //       }
    //       if(div==false){
    //         if(Object.keys(result[checkKey]['Dividend']).length!=0){
    //           let current_datetime = new Date(result[checkKey]['Dividend']['date']);
    //           let formatted = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear();
    //           obj['symbol'] = checkKey;
    //           obj['date'] = formatted;
    //           obj['valueType'] = 'dividends';
    //           obj['value'] = result[checkKey]['Dividend']['lastdiv'];
    //           obj['calculation']=(100*parseFloat(result[checkKey]['Dividend']['lastdiv']));
    //           that.splitanddivarr.push(obj);
            
    //         } 
    //       }
    //       if(split==false){
    //         if(Object.keys(result[checkKey]['Split']).length!=0){ 
              
    //           let current_datetime1 = new Date(result[checkKey]['Split']['date']);
    //           let formatted1 = current_datetime1.getDate() + " " + months[current_datetime1.getMonth()] + " " + current_datetime1.getFullYear();
    //           obj1['symbol'] = checkKey; 
    //           obj1['date'] = formatted1;
    //           obj1['valueType'] = 'Split';
    //           obj1['value'] = result[checkKey]['Split']['lastSplit'];
    //           obj1['calculation']=(parseInt(result[checkKey]['Split']['lastSplit']));
    //           that.splitanddivarr.push(obj1);
            
    //         }
    //       }
    //     }
    //   });
    //   this.setState({splitanddivarrF:that.splitanddivarr},()=>{
    //     console.log(this.state.splitanddivarrF);
    //     this.saveToUserFirebase()
    //   });
    // });
  }
  saveToUserFirebase(){ 
    let tbLot=0;
    let tslLot=0;
    let totalPoint=0;
    let that=this;
    let tdate = null; 
    this.state.splitanddivarrF.map((data,index)=>{
                if(data.valueType=="dividends"){
                  let symbol=data.symbol.replace(/,/g, '');
                  let fsymbol=symbol.replace(/\./g, '');
                  let rl="users/"+ that.state.id+'/lastDiv/'+fsymbol;
                  firebase.database().ref(rl).once("value", snapshot => {
                      let fdate = new Date(data.date);
                      // let tdate = new Date(that.state.date);
                      if (!snapshot.exists()){
                          // tdate = new Date();
                          // tdate = Moment(new Date(), "YYYY-MM-DD");
                          tdate = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate());
                      }else{
                          tdate = new Date(snapshot.val().date);
                      }
                      if (snapshot.exists() && fdate.getTime()===tdate.getTime()){
                      
                      }
                     else{
                      // if(fdate.toDateString()===tdate.toDateString()){
                      if(tdate.getTime()<=fdate.getTime()){    
                        this.state.userData[data.symbol].map((UserData,j) => {  
                            if(UserData.Type=='Buy'){
                            tbLot=tbLot+parseInt(UserData.Lots);
                            }
                            else if(UserData.Type=='Sell'){
                            tslLot=tslLot+parseInt(UserData.Lots);
                            }
                        });
                        totalPoint = totalPoint + (((tbLot-tslLot)*parseFloat(data['calculation'])));
                        let url= 'users/'+this.state.uid+'/lastDiv/'+data.symbol;
                        let coffeeData={
                          value : data.value,
                          date : data.date
                        };
                      firebase.database().ref(url).set(coffeeData).then(() => { 
                          let p=that.state.user.points.split(",").join("");
                          p= parseInt(p)+totalPoint;
                          let point=that.commafy(p);
                          that.updateFireBasePointAndLocalStoragePoint(point);
                      });
                      } 
                     }
                });
              }
              if(data.valueType=="Split"){ 
                // debugger 
                let tbLot=0;
                let tslLot=0;
                let checkExist=false;
                const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let current_datetime = new Date(data.date);
                let formatted_date = parseInt(current_datetime.getDate()-1) + "-" + months[current_datetime.getMonth()] + "-" + current_datetime.getFullYear();
            
                this.state.userData[data.symbol].map((UserData1,j) => { 
                
                 let pd=UserData1['date'];
                 let purchaseDate = new Date(pd);
                  if(purchaseDate<current_datetime){
                   if(UserData1.Type=='Buy'){
                     tbLot=tbLot+parseInt(UserData1.Lots);
                   }
                   else if(UserData1.Type=='Sell'){
                     tslLot=tslLot+parseInt(UserData1.Lots);
                   }
                 }
                });
                let allLot=tbLot-tslLot;
                let afterSplit=allLot*parseFloat(data.value); 
                let postParams = {
                 UserID : that.state.uid,
                 //date :  Moment(date1).format('DD-MMM-YYYY'),
                 date : data.date,
                 BuyAmount : 0,
                 Transaction : 0,
                 Lots : afterSplit-allLot  ,
                 Buy : 0,
                 Type : 'Split',
                 Symbol : this.state.userData[data.symbol][0].Symbol, 
                 Name : data.symbol,
                 symbolForSecurity : '',      
               } 
               firebase.database().ref(that.state.quarter+'/'+that.state.id).once('value').then((dataarray) => { 
                  Object.keys(dataarray.val()).forEach(function(key){
                    if(key!='meu'){ 
                       let pdk=dataarray.val()[key]['date'];
                       let purchaseDatek = new Date(pdk);
                       let current_datetimek = new Date(data.date); 
                       if(dataarray.val()[key]['Name']==data.symbol && purchaseDatek<=current_datetimek && dataarray.val()[key]['Type']=='Split'){
                         checkExist=true; 
                         }  
                       }
                      });   
                       
                      if(!checkExist && that.state.firstTime){
                        that.setState({firstTime:false});
                        firebase.database().ref(that.state.quarter+'/'+that.state.id).push(postParams).then(() => {  
                          dataarray.val()[key]['Name']=data.symbol
                        }).catch((error) => {
                        });
                      }
               })
               
             }
          })
    }
    
    openModal(){
      this.setState({openModal:true})
    }
    closePopup(){
      this.setState({openModal:false})
    }
    calculateBuyLot(symbol){
      Object.keys(this.state.userData).map((key, ind) => { 
        let bamt=0;
        let samt=0; 
         this.state.userData[key].map((UserData,j) => {  
          if(UserData.Type=='Buy'){
            totalbuyLot=totalbuyLot+parseInt(UserData.Lots);
            buyPrice=UserData['Buy'];
            if(Array.isArray(this.state.userData[key][j].BuyAmount))
                {
                  console.log(this.state.userData[key][j].BuyAmount[0]);
                  bamt = bamt + parseInt(this.state.userData[key][j].BuyAmount[0]);
                }
                else {
                  bamt = bamt + parseInt(this.state.userData[key][j].BuyAmount)
                }
          }
          else if(UserData.Type=='Sell'){
            totalsellLot=totalsellLot+parseInt(UserData.Lots);
           if(Array.isArray(this.state.userData[key][j].BuyAmount))
                {
                  console.log(this.state.userData[key][j].BuyAmount[0]);
                  samt = samt + parseInt(this.state.userData[key][j].BuyAmount[0]); 
                }
                else{ 
                  samt = samt + parseInt(this.state.userData[key][j].BuyAmount)
                }
          }
                });
              });
    }
  render()
  {
    let back1 = require('./../../../assets/images/back-arrow.png');
    let SearchImg = require('./../../../assets/images/serach_icon.png');
    let MenuImg = require('./../../../assets/images/hamberger_icon.png');
    let bottomImg = require('./../../../assets/images/loginTop.png');
    let rule = require('./../../../assets/images/rules_icon.png');
    let micro = require('./../../../assets/images/macro_economics_icon.png') ;
    let uparr = require('./../../../assets/images/caret-arrow-up.png');
    let downarr = require('./../../../assets/images/sort-down.png'); 
    let doubleDash = require('./../../../assets/images/doubleDash1.png');
    let fundamental = require('./../../../assets/images/fundamental_analysis_icon.png') ;
    let userp=require('./../../../assets/images/Userimage.png');
    let closee=require('./../../../assets/images/close.png');
    let tabview = null;
    let chart=null;
    let modal=null;
    let listInsideMoal=null;
    let tabRepeat = null;
    let p= this.state.points;
    let friendButton;
    console.log("value of countforshare**********", "*****"+  this.state.countForShare);
    console.log("value of countforReits**********", "*****"+  this.state.countForReits);
    console.log("value of countforOther**********", "*****"+  this.state.countForOther);
    console.log("value of countonhand**********", "*****"+parseInt(p.toString().split(',').join('')));
    console.log('test',this.state.investment);

    let co=parseInt(p.toString().split(',').join(''));
    console.log(typeof co);
    let a= parseInt(this.state.investment);
    let ss=(this.state.countForShare*100/(co+a))
    let re=(this.state.countForReits*100/(co+a))
    let ot=(this.state.countForOther*100/(co+a))
    let con=((parseInt(p.toString().split(',').join('')))*100/(co+a))

    // let co=parseInt(p.toString().split(',').join(''));
    // console.log(typeof co);
    // let a= parseInt(this.state.investment);
    // console.log(typeof a);
    // console.log("total amt", co +parseFloat(this.state.investment).toFixed(2));
    // console.log('add',  co +a)
    
    if(this.state.countForShare==0 && this.state.countForReits==0 && this.state.countForOther==0){ 
       chart= (
        <View style={{alignSelf:'center'}}>
          <Text>No Data Found</Text>
        </View>
      )
    }
    else{
      // const series = [ this.state.countForShare, this.state.countForReits,this.state.countForOther,parseInt(p.toString().split(',').join(''))]
      //  const chart_wh = 250;
      //  const sliceColor = ['#28B463','#F1C40F','#3498DB','#D0D3D4'];
      let conf = {
          chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
      },
      title: {
          text: 'Holdings'
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.y:.1f}</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>:<br>{point.percentage:.1f} %'
              }
          }
      },
      exporting: {
        enabled: false
    },
    credits: {
      enabled: false
    },
      series: [{
          name: 'Holdings',
          colorByPoint: true,
          data: [{
              name: 'Shares',
              color: '#FF0000',
              y:  ss,
              sliced: true,
              selected: true
          }, {
              name: 'Reits',
              color: '#4aa9de',
              y: re
          }, {
              name: 'Others',
              color: '#D3D3D3',
              y: ot
          }, {
              name: 'Cash on hand',
              color: '#FCE903',
              y: con
          },
         ]
      }]
    
        };
     
        const options = {
            global: {
                useUTC: false
            },
            lang: {
                decimalPoint: '.',
                thousandsSep: '.'
            }
        };
       chart=(
        <View style={{width:Dimensions.get('window').width, alignItems:'center',padding: 20}}>
          <ChartView originWhitelist={['']}  javaScriptEnabled={true} domStorageEnabled={true} style={{height:300, width : "100%"}} config={conf} options={options}>
  
          </ChartView>
            {/* <PieChart  
              chart_wh={chart_wh}
              series={series}
              sliceColor={sliceColor}
              doughnut={true}
              coverRadius={0.45}
              coverFill={'#FFF'}
            />  */}
        </View>
        )
          
    }
    let img;
    let totalbou;
    let divInfo=null;
    let announcementVal = null;
      if(this.state.splitanddivarrF.length!=0)
      { 
        let anounceMent=null;
        this.state.splitanddivarrF.map((UserData,j)=>{
           console.log(UserData);
           let dad=UserData['date'];
           let dividentAnnouncedate = new Date(dad); 
           let lotWithDiv=0;
           let lotwithoutDiv=0;
           this.state.userData[UserData['symbol']].map((UserData1,j) => { 
             console.log('userDtae',UserData1)
             let pd=UserData1['date'];
             let purchaseDate = new Date(pd);
             if(purchaseDate<dividentAnnouncedate){
              if(UserData1['Type']=='Buy'){
                lotWithDiv=lotWithDiv+parseInt(UserData1['Lots']);
              }else if(UserData1['Type']=='Sell'){
                lotWithDiv=lotWithDiv-parseInt(UserData1['Lots']);
              }
            }
            else if(purchaseDate.getDate()===dividentAnnouncedate.getDate()){
              if(UserData1['Type']=='Buy'){
                lotwithoutDiv = lotwithoutDiv + parseInt(UserData1['Lots']);
              }else if(UserData1['Type']=='Sell'){
                lotWithDiv = lotWithDiv - parseInt(UserData1['Lots']);
              }
               
            }
             else if(purchaseDate>dividentAnnouncedate){
              if(UserData1['Type']=='Buy'){
                lotwithoutDiv = lotwithoutDiv + parseInt(UserData1['Lots']);
              }else if(UserData1['Type']=='Sell'){
                lotwithoutDiv = lotwithoutDiv - parseInt(UserData1['Lots']);
              }
            }
            announcementVal = parseInt(UserData1['Lots']);
           });
  
           if(UserData['valueType']=='dividends'){ 
            this.state.splitanddivarrF.map((data,j)=>{
              if(data['symbol']==UserData['symbol']){
                if(lotWithDiv!=0){
                anounceMent=<Text style={{color:'#000000',alignItems:'center',fontSize:16}}>
                {this.splitanddivarr[0]['date']}: Received ${parseFloat(data['calculation']*lotWithDiv).toFixed(2)} {data['symbol']} {data['valueType']} @ {parseFloat(data['value']).toFixed(2)}/share
                </Text>
                }
               }
             });
             }
                else if(UserData['valueType']=='Split'){
                  console.log("splitvaluetype*********", announcementVal);
                  this.state.splitanddivarrF.map((data,j)=>{
                  if(data['symbol']==UserData['symbol']){ 
                  if(lotWithDiv!=0){
                    //commented by souvik..
                    // anounceMent=  <Text style={{color:'#000000',alignItems:'center',fontSize:16}}>
                    // {this.splitanddivarr[0]['date']}: Received {parseFloat(data['calculation']*(lotWithDiv)).toFixed(2)} lots from {data['symbol']} Stock Split {parseFloat(data['value']).toFixed(2)}-for-1
                    // </Text>
                    anounceMent=  <Text style={{color:'#000000',alignItems:'center',fontSize:16}}>
                    {this.splitanddivarr[0]['date']}: Received {parseFloat(data['value']*announcementVal).toFixed(2)} lots from {data['symbol']} Stock Split {parseFloat(data['value']).toFixed(2)}-for-1
                    </Text>
                    }
                   
                  }
                });
                }            
  });
        // this.state.splitanddivarrF.map((UserData,j) => { 
        //     let tbLot=0;
        //     let tslLot=0;
        //     this.state.userData[UserData['symbol']].map((UserData1,j) => { 
        //       if(UserData1.Type=='Buy'){
        //         tbLot=tbLot+parseInt(UserData1.Lots);
        //        }
        //       else if(UserData1.Type=='Sell'){
        //         tslLot=tslLot+parseInt(UserData1.Lots);
        //       }
        //     });
        //     if(UserData['valueType']=='dividends'){ 
        //       if(this.splitanddivarr[0]['symbol']==UserData['symbol']){
        //         let dad=UserData['date'];
        //         let pd=this.state.userData[UserData['symbol']][0]['date'];
        //         console.log('k',pd);
        //         console.log('k1',dad);
        //         let dividentAnnouncedate = new Date(dad);
        //         let purchaseDate = new Date(pd);
        //         console.log('date',dividentAnnouncedate)
        //         console.log('date',purchaseDate)
        //         if(purchaseDate<dividentAnnouncedate){
        //         anounceMent=<Text style={{color:'#000000',alignItems:'center',fontSize:16}}>
        //         {this.splitanddivarr[0]['date']}: Recieved ${this.splitanddivarr[0]['calculation']*(tbLot-tslLot)} {this.splitanddivarr[0]['symbol']} {this.splitanddivarr[0]['valueType']} @ {this.splitanddivarr[0]['value']}/share
        //         </Text>
        //         }
        //         else if(purchaseDate>=dividentAnnouncedate){
        
        //         }
        //       }  
        //     }
        //     else if(UserData['valueType']=='Split'){
        //       if(this.splitanddivarr[0]['symbol']==UserData['symbol']){
        //         let dad=UserData['date'];
        //         let pd=this.state.userData[UserData['symbol']][0]['date'];
        //         console.log('k',pd);
        //         console.log('k1',dad);
        //         let dividentAnnouncedate = new Date(dad);
        //         let purchaseDate = new Date(pd);
        //         console.log('date',dividentAnnouncedate)
        //         console.log('date',purchaseDate)
        //         if(purchaseDate<dividentAnnouncedate){
        //           anounceMent=  <Text style={{color:'#000000',alignItems:'center',fontSize:16}}>
        //           {this.splitanddivarr[0]['date']}: Recieved {this.splitanddivarr[0]['calculation']*(tbLot-tslLot)} lots from {this.splitanddivarr[0]['symbol']} Stock Split {this.splitanddivarr[0]['value']}-for-1
        //           </Text>
        //         }
        //         else if(purchaseDate>=dividentAnnouncedate){
        
        //         }
        //       }           
        //     }
        //   }); 
      
        if(anounceMent!=null){
          const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          let current_datetime = new Date(this.props.data3)
          let formatted_date = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear()
          divInfo=( 
            <View style={{flex:1,flexDirection:'row',width:Dimensions.get('window').width}}>
              <TouchableOpacity style={{flex:2}} onPress={this.openModal.bind(this)}>
                  <Card >
                    {anounceMent}
                  </Card> 
              </TouchableOpacity>
              <View style={{flex:1,alignItems:'center',justifyContent: 'center'}}>
                  <Text style={{color:'#ef3416',alignItems:'center',fontSize:16}}>{this.props.date}</Text>
              </View> 
            </View>
          )
        }
    
      }
      
      if(this.state.openModal){
        if(this.state.splitanddivarrF.length!=0)
        {let ind=0;
          listInsideMoal= this.state.splitanddivarrF.map((data,index)=>{
            console.log(this.splitanddivarr)
            let tbLot=0;
            let tslLot=0;
            let anounceMentDetail=null;
            let announcementValModal = null;
            {
            this.state.userData[data['symbol']].map((UserData,j) => { 
            if(UserData.Type=='Buy' || UserData.Type=='Split'){
              tbLot=tbLot+parseInt(UserData.Lots);
             }
            else if(UserData.Type=='Sell'){
              tslLot=tslLot+parseInt(UserData.Lots);
            }
            announcementValModal = UserData.Lots;
          });}
          if(data['valueType']=='dividends'){ 
            let dad=data['date'];
            let pd=this.state.userData[data['symbol']][0]['date'];
            console.log('k',pd);
            console.log('k1',dad);
            let dividentAnnouncedate = new Date(dad);
            let purchaseDate = new Date(pd);
            console.log('date',dividentAnnouncedate)
            console.log('date',purchaseDate) 
            if(purchaseDate<dividentAnnouncedate){
              ind=ind+1;
              anounceMentDetail=<Text style={{color:'#000000',alignItems:'center',fontSize:16}}>
              {ind}. {data['date']}: Received ${parseFloat(data['calculation']*(tbLot-tslLot)).toFixed(2)} {data['symbol']} {data['valueType']} @ {parseFloat(data['value']).toFixed(2)}/share
              </Text>
               return ( <View  style={{flex:1,flexDirection:'column',paddingTop:20,paddingLeft:20, paddingRight:20, paddingBottom:10}} key={index}>
               {anounceMentDetail}
              </View>)
            }
            else if(purchaseDate>=dividentAnnouncedate){
  
            }  
          }
          else if(data['valueType']=='Split'){
            // let dad=data['date'];
            // let pd=this.state.userData[data['symbol']][0]['date'];
            // console.log('k',pd);
            // console.log('k1',dad);
            // let dividentAnnouncedate = new Date(dad);
            // let purchaseDate = new Date(pd); 
            // let final_buy= tbLot*parseFloat(data['value']).toFixed(2);
            // let total=final_buy-tslLot;
           
            // if(purchaseDate<dividentAnnouncedate){
              //commented by souvik..
              // ind=ind+1; 
              // anounceMentDetail=  <Text style={{color:'#000000',alignItems:'center',fontSize:16}}>
              // {ind}. {data['date']}: Received {(tbLot-tslLot)} lots from {data['symbol']} Stock Split {parseFloat(data['value']).toFixed(2)}-for-1
              // </Text>

              ind=ind+1; 
              anounceMentDetail=  <Text style={{color:'#000000',alignItems:'center',fontSize:16}}>
              {ind}. {data['date']}: Received {(announcementValModal*data['value']).toFixed(2)} lots from {data['symbol']} Stock Split {parseFloat(data['value']).toFixed(2)}-for-1
              </Text>
              
               return ( <View  style={{flex:1,flexDirection:'column',paddingTop:20,paddingLeft:20, paddingRight:20, paddingBottom:10}} key={index}>
               {anounceMentDetail}
               </View>)
               
           // }
            // else if(purchaseDate>=dividentAnnouncedate){
  
            // }   
          }
         
          });
        }
        modal=(
          <Modal transparent = {true}>
             <View style={{height: Dimensions.get('window').height,width:Dimensions.get('window').width, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
             <View style={styles.modalContainer}>
               <TouchableOpacity style={{height:35, width:'100%', backgroundColor:'#a5d4ef',alignItems:"flex-end"}} onPress={this.closePopup.bind(this)}>
                 <Image style={styles.imgCross} source={closee}></Image>
               </TouchableOpacity>
               <ScrollView>{listInsideMoal}</ScrollView>
             </View>
             </View>
          </Modal>
        )   
       }
  
      if(Object.keys(this.state.userData).length>0){ 
       tabRepeat = Object.keys(this.state.userData).map((key, ind) => { 
         if(ind<=10){
          let totalbuyLot=0;
          let totalsellLot=0;
          let buyPrice
          let bamt=0;
          let samt=0; 
          let buyarr=[];
          let tt;
          let tt1=<Text style={styles.holdingtextr}>{0}</Text>;
          let pl=null;
          let fee=null;
          let lotData=null;
          let fees=0;
          { this.state.userData[key].map((UserData,j) => {  
            fees=fees + parseFloat(this.state.userData[key][j].Transaction);
             if(UserData.Type=='Buy' || UserData.Type=='Split'){ 
               buyarr.push(UserData)
               totalbuyLot=totalbuyLot+parseFloat(UserData.Lots);          
               if(Array.isArray(this.state.userData[key][j].BuyAmount))
                   {
                     console.log(this.state.userData[key][j].BuyAmount[0]);
                     bamt = bamt + parseFloat(this.state.userData[key][j].BuyAmount[0]);
                     tt= <Text style={ styles.holdingtextrr}>-{this.calculateK(bamt)}</Text>
                   }
                   else {
                     bamt = bamt + parseFloat(this.state.userData[key][j].BuyAmount)
                     tt= <Text style={ styles.holdingtextrr}>-{this.calculateK(bamt)}</Text>
                   }
             }
             else if(UserData.Type=='Sell'){
               smt=0;
               totalsellLot=totalsellLot+parseFloat(UserData.Lots);
              if(Array.isArray(this.state.userData[key][j].BuyAmount))
                   {
                     console.log(this.state.userData[key][j].BuyAmount[0]);
                     samt = samt + parseFloat(this.state.userData[key][j].BuyAmount[0]); 
                     tt1 = <Text style={styles.holdingtextr}>{this.calculateK(samt)}</Text>
                   }
                   else{ 
                     samt = samt + parseFloat(this.state.userData[key][j].BuyAmount)
                     tt1= <Text style={styles.holdingtextr}>{this.calculateK(samt)}</Text>
                   }
             }
            });}
          {
            buyarr.map((Udata,j)=>{
              if(Udata.Type!='Split'){
               buyPrice=buyarr[j]['Buy'];
               let pdate=buyarr[j]['date'];
               let pdateFormate=new Date(pdate);
               if(j!=0){
                 let pdate1=Udata['date'];
                 let pdateFormate1=new Date(pdate1);
                  if(pdateFormate1>pdateFormate){
                   buyPrice=Udata['Buy'];
                  }
               }
              }
            })
          }
          let index=0;
          let currentVal=this.getCurrentSymbolPrice(this.state.userData[key][0]['Name']) 
                  while(this.state.userData[key][index]['Type']=='Sell'){
                    index=index+1;
                  }
                  let checkHighAndLow=this.checkHighAndLow(this.state.userData[key][0]['Name'])
                  if(checkHighAndLow==0){
                      img= doubleDash;
                  }
                  else if(checkHighAndLow==1){
                      img=uparr;
                  }
                  else if(checkHighAndLow==2){
                      img=downarr;
                  } 
                  if(this.state.splitanddivarrF.length!=0){  
                  let l=(totalbuyLot-totalsellLot)*this.state.oneLote;
                    {  this.state.splitanddivarrF.forEach((data,index)=>{
                       if(data['symbol']==this.state.userData[key][0]['Name']){ 
                          if(data['valueType']=='dividends'){
                            let nrmlpl;
                            let nrmlplForSameDate=0;
                            let tbl=0;
                            let tsl=0;
                            let lotWithDiv=0;
                            let lotwithoutDiv=0;
                            let nrmlplForCorrectDate=0;
                            let dad=data['date'];
                            let dividentAnnouncedate = new Date(dad); 
                            this.state.userData[key].map((UserDataD,j) => { 
                                let pd=UserDataD['date'];
                                let purchaseDate = new Date(pd); 
                                if(purchaseDate<dividentAnnouncedate){
                                  if(UserDataD['Type']=='Buy'){
                                    lotWithDiv=lotWithDiv+parseFloat(UserDataD['Lots']);
                                  }
                                  else if(UserDataD['Type']=='Sell'){
                                    lotWithDiv=lotWithDiv-parseFloat(UserDataD['Lots']);
                                  }
                                }
                                else if(purchaseDate>=dividentAnnouncedate){
                                  if(UserDataD['Type']=='Buy'){
                                    lotwithoutDiv = lotwithoutDiv + parseFloat(UserDataD['Lots']);
                                  }else if(UserDataD['Type']=='Sell'){
                                    lotwithoutDiv = lotwithoutDiv - parseFloat(UserDataD['Lots']);
                                  }
                                }
                            });
                            if(lotWithDiv==0){
                              recieveDiv=0
                            }else{
                              recieveDiv=lotWithDiv*this.state.oneLote*parseFloat(data['value']);
                            }
                            if(lotWithDiv!=0){
                                  let lotwithSplit=lotWithDiv;
                                  console.log('lot0',lotwithSplit);
                                  let calculatewithsellPrice=lotwithSplit*100*parseFloat(currentVal); 
                                  console.log('lot2',calculatewithsellPrice) 
                                  let div=lotwithSplit*this.state.oneLote*parseFloat(data['value']);
                                  nrmlplForCorrectDate=calculatewithsellPrice+samt-bamt-fees+div;
                                  console.log('lot2',nrmlplForCorrectDate)
                             }
                             if(lotwithoutDiv!=0 ){
                                
                                console.log('aya');
                                let lotwithSplit=lotwithoutDiv;
                                console.log('lot0',lotwithSplit) 
                                let calculatewithsellPrice=lotwithSplit*this.state.oneLote*parseFloat(currentVal); 
                                console.log('lot2',calculatewithsellPrice) 
                                let div= 0;
                                nrmlplForSameDate=calculatewithsellPrice+samt-bamt-fees+div;
                                console.log('lot2',nrmlplForSameDate)
                             }
                       
                                nrmlpl=nrmlplForCorrectDate+nrmlplForSameDate; 
                                let fdata=nrmlpl*100;
                                console.log('fdata',fdata);
                                let plValue=parseFloat(fdata/Math.abs(this.state.gainOrLoss));
                                pl= (  
                                  <View style={styles.homeView2}>
                                     <Text style={(parseFloat(nrmlpl))>0 ? styles.holdingtext:styles.holdingtextplred}>{Math.round(nrmlpl)}</Text>
                                     <Text style={(parseFloat(plValue))>0 ? styles.holdingtext:styles.holdingtextplred}>{parseFloat(plValue).toFixed(2)}%</Text>
                                  </View>);
                               fee=( <View style={styles.homeView2}>
                                    <Text style={styles.holdingtextrk}>-{this.calculateK(fees)}</Text>
                                    <Text style={styles.holdingtext1}>{Math.round(recieveDiv)}</Text>
                                  </View>);
                           }
                          //  else if(data['valueType']=='Split'){ 
                          //       let dad=data['date'];
                          //       let nrmlpl;
                          //       let currectNrpl=0;
                          //       let newNrpl=0;
                          //       let clot=0;
                          //       let lotWithSplit=0;
                          //       let lotwithoutSplit=0;
                          //       let nlot=0
                          //       let dividentAnnouncedate = new Date(dad);
                          //       this.state.userData[key].map((UserDataD,j) => { 
                          //         let pd=UserDataD['date'];
                          //         let purchaseDate = new Date(pd);
                          //         if(purchaseDate<dividentAnnouncedate){
                          //           if(UserDataD['Type']=='Buy'){
                          //             lotWithSplit=lotWithSplit+parseInt(UserDataD['Lots']);
                          //           }else if(UserDataD['Type']=='Sell'){
                          //             lotWithSplit=lotWithSplit-parseInt(UserDataD['Lots']);
                          //           }
                          //         }
                          //         else if(purchaseDate.getDate()===dividentAnnouncedate.getDate()){
                          //           if(UserDataD['Type']=='Buy'){
                          //             lotwithoutSplit = lotwithoutSplit + parseInt(UserDataD['Lots']);
                          //           }else if(UserDataD['Type']=='Sell'){
                          //             lotWithSplit = lotWithSplit - parseInt(UserDataD['Lots']);
                          //           }
                                     
                          //         }
                          //          else if(purchaseDate>dividentAnnouncedate){
                          //           if(UserDataD['Type']=='Buy'){
                          //             lotwithoutSplit = lotwithoutSplit + parseInt(UserDataD['Lots']);
                          //           }else if(UserDataD['Type']=='Sell'){
                          //             lotwithoutSplit = lotwithoutSplit - parseInt(UserDataD['Lots']);
                          //           }
                          //         }
                          //     });
                          //     if(lotWithSplit!=0){
                          //       let lotwithSplit1=lotWithSplit; 
                          //       let val=parseFloat(data['value'])
                          //       let currentsell=parseFloat(currentVal)/val;
                          //       let lotwithSplit=lotwithSplit1*val; 
                          //       let calculatewithsellPrice1=lotwithSplit*100;
                          //       let calculatewithsellPrice=calculatewithsellPrice1*parseFloat(currentsell);
                          //       currectNrpl=calculatewithsellPrice+samt-bamt-fees+0;
                          //       clot=calculatewithsellPrice;
                          //     }
                          //     if(lotwithoutSplit!=0){
                          //       let lotwithSplit=lotwithoutSplit; 
                          //         let calculatewithsellPrice1=lotwithSplit*100;
                          //         let calculatewithsellPrice=calculatewithsellPrice1*currentVal;
                          //         newNrpl=calculatewithsellPrice+samt-bamt-fees+0;
                          //         nlot=calculatewithsellPrice;
                          //     }
                          //       // let pd=this.state.userData[key][0]['date'];
                          //       // console.log('k',pd);
                          //       // console.log('k1',dad);
                          //       // let purchaseDate = new Date(pd); 
                          //       // if(purchaseDate<dividentAnnouncedate){
                          //       //   let lotwithSplit1=totalbuyLot-totalsellLot; 
                          //       //   let val=parseInt(data['value'])
                          //       //   let currentsell=currentVal/val;
                          //       //   let lotwithSplit=lotwithSplit1*val; 
                          //       //   let calculatewithsellPrice1=lotwithSplit*100;
                          //       //   let calculatewithsellPrice=calculatewithsellPrice1*parseFloat(currentsell);
                          //       //   currectNrpl=calculatewithsellPrice+samt-bamt-fees+0;
                          //       //   clot=calculatewithsellPrice;
                          //       // }
                          //       // else if(purchaseDate>=dividentAnnouncedate){
                          //       //   let lotwithSplit=totalbuyLot-totalsellLot; 
                          //       //   let calculatewithsellPrice1=lotwithSplit*100;
                          //       //   let calculatewithsellPrice=calculatewithsellPrice1*currentVal;
                          //       //   newNrpl=calculatewithsellPrice+samt-bamt-fees+0;
                          //       //   nlot=calculatewithsellPrice;
                          //       // }
                          //       nrmlpl=currectNrpl+newNrpl;
                                
                          //       let fdata=nrmlpl*100;
                          //       let tlot=clot+nlot
                          //       let plValue=parseFloat( fdata/this.state.gainOrLoss);
                          //       // let lotwithSplit1=totalbuyLot-totalsellLot; 
                          //       // let val=parseInt(data['value'])
                          //       // let currentsell=currentVal/val;
                          //       // let lotwithSplit=lotwithSplit1*val; 
                          //       // let calculatewithsellPrice1=lotwithSplit*100;
                          //       // console.log('znm1',calculatewithsellPrice1);
                          //       // let calculatewithsellPrice=calculatewithsellPrice1*parseFloat(currentsell);
                          //       // console.log('bxdzn',calculatewithsellPrice);
                          //       // let nrmlpl=calculatewithsellPrice+samt-bamt-fees+0;
                          //       // console.log('nrmlpl',nrmlpl);
                          //       // let fdata=(calculatewithsellPrice+samt-bamt-fees+0)*100;
                          //       // console.log('fdata',fdata);
                          //       // let plValue=parseFloat( fdata/((lotwithSplit*100)*currentsell)).toFixed(2);
                                
                          //       pl= (  
                          //         <View style={styles.homeView2}>
                          //           <Text style={(parseFloat(nrmlpl))>0 ? styles.holdingtext:styles.holdingtextplred}>{Math.round(nrmlpl)}</Text>
                          //           <Text style={(parseFloat(plValue))>0 ? styles.holdingtext:styles.holdingtextplred}>{parseFloat(plValue).toFixed(2)}%</Text>
                          //         </View>);
                          //       fee=( <View style={styles.homeView2}>
                          //             <Text style={styles.holdingtextrk}>-{this.calculateK(fees)}</Text>
                          //             <Text style={styles.holdingtext1}>0</Text>
                          //           </View>);
                          // }
                 
                        }
                                            
                      }); }
                  }
                  // if(this.state.splitanddivarrF.length!=0){  
                  //   let l=(totalbuyLot-totalsellLot)*this.state.oneLote;
                  //     {  this.state.splitanddivarrF.forEach((data,index)=>{
                  //        if(data['symbol']==this.state.userData[key][0]['Name']){ 
                  //           if(data['valueType']=='dividends'){
                  //             let nrmlpl;
                  //             let nrmlplForSameDate=0;
                  //             let tbl=0;
                  //             let tsl=0;
                  //             let lotWithDiv=0;
                  //             let lotwithoutDiv=0;
                  //             let nrmlplForCorrectDate=0;
                  //             let dad=data['date'];
                  //             let recieveDiv=0;
                  //             let dividentAnnouncedate = new Date(dad); 
                  //             this.state.userData[key].map((UserDataD,j) => { 
                  //                 let pd=UserDataD['date'];
                  //                 let purchaseDate = new Date(pd);
                  //                 if(purchaseDate<dividentAnnouncedate){
                  //                   if(UserDataD['Type']=='Buy'){
                  //                     lotWithDiv=lotWithDiv+parseInt(UserDataD['Lots']);
                  //                   }else if(UserDataD['Type']=='Sell'){
                  //                     lotWithDiv=lotWithDiv-parseInt(UserDataD['Lots']);
                  //                   }
                  //                 }
                  //                 else if(purchaseDate>=dividentAnnouncedate){
                  //                   if(UserDataD['Type']=='Buy'){
                  //                     lotwithoutDiv = lotwithoutDiv + parseInt(UserDataD['Lots']);
                  //                   }else if(UserDataD['Type']=='Sell'){
                  //                     lotwithoutDiv = lotwithoutDiv - parseInt(UserDataD['Lots']);
                  //                   }
                  //                 }
                  //             });
                  //             if(lotWithDiv==0){
                  //               recieveDiv=0
                  //             }else{
                  //               recieveDiv=lotWithDiv*this.state.oneLote*parseFloat(data['value']);
                  //             }
                  //             if(lotWithDiv!=0){
                  //                   let lotwithSplit=lotWithDiv;
                  //                   console.log('lot0',lotwithSplit);
                  //                   let calculatewithsellPrice=lotwithSplit*100*parseFloat(currentVal); 
                  //                   console.log('lot2',calculatewithsellPrice) 
                  //                   let div=lotwithSplit*this.state.oneLote*parseFloat(data['value']);
                  //                   nrmlplForCorrectDate=calculatewithsellPrice+samt-bamt-fees+div;
                  //                   console.log('lot2',nrmlplForCorrectDate)
                  //              }
                  //              if(lotwithoutDiv>=0){
                  //                 console.log('aya');
                  //                 let lotwithSplit=lotwithoutDiv;
                  //                 console.log('lot0',lotwithSplit) 
                  //                 let calculatewithsellPrice=lotwithSplit*this.state.oneLote*parseFloat(currentVal); 
                  //                 console.log('lot2',calculatewithsellPrice) 
                  //                 let div= 0;
                  //                 nrmlplForSameDate=calculatewithsellPrice+samt-bamt-fees+div;
                  //                 console.log('lot2',nrmlplForSameDate)
                  //              }
                  //                // let pd=this.state.userData[key][0]['date'];
                  //                // console.log('k',pd);
                  //                // console.log('k1',dad);
                  //                // let dividentAnnouncedate = new Date(dad);
                  //                // let purchaseDate = new Date(pd);
                  //                // console.log('date',dividentAnnouncedate)
                  //                // console.log('date',purchaseDate)
                  //                 // if(purchaseDate<dividentAnnouncedate){
                  //                 //   this.state.userData[key].forEach((data,ind)=>{
                  //                 //     if(data.Type=='Buy'){
                  //                 //       tbl=tbl+parseInt(data.Lots);
                  //                 //     }else if(data.Type=='Sell'){
                  //                 //       tsl=tsl+parseInt(data.Lots);
                  //                 //     } 
                  //                 //   });
                  //                 //   console.log('sahi ni aya');
                  //                 //   let lotwithSplit=(tbl-tsl);
                  //                 //   console.log('lot0',lotwithSplit);
                  //                 //   let calculatewithsellPrice=lotwithSplit*100*parseFloat(currentVal); 
                  //                 //   console.log('lot2',calculatewithsellPrice) 
                  //                 //   let div=(tbl-tsl)*this.state.oneLote*parseFloat(data['value']);
                  //                 //   nrmlplForCorrectDate=calculatewithsellPrice+samt-bamt-fees+div;
                  //                 //   console.log('lot2',nrmlplForCorrectDate)
                                    
                  //                 // }
                  //                 // else if(purchaseDate>=dividentAnnouncedate){
                  //                 //   console.log('aya');
                  //                 //   let lotwithSplit=l;
                  //                 //   console.log('lot0',lotwithSplit) 
                  //                 //   let calculatewithsellPrice=lotwithSplit*this.state.oneLote*parseFloat(currentVal); 
                  //                 //   console.log('lot2',calculatewithsellPrice) 
                  //                 //   let div= 0;
                  //                 //   nrmlplForSameDate=calculatewithsellPrice+samt-bamt-fees+div;
                  //                 //   console.log('lot2',nrmlplForSameDate)
                  //                 //   let fdata=nrmlpl*100;
                  //                 //   console.log('fdata',fdata);
                  //                 //   let plValue=parseFloat( fdata/(l*currentVal)).toFixed(2);
                  //                 // } 
                              

                  //                 nrmlpl=nrmlplForCorrectDate+nrmlplForSameDate;
                  //                 let fdata=nrmlpl*100;
                  //                 console.log('fdata',fdata);
                  //                 let plValue=parseFloat( fdata/this.state.gainOrLoss);
                  //                 pl= (  
                  //                   <View style={styles.homeView2}>
                  //                      <Text style={(parseFloat(nrmlpl))>0 ? styles.holdingtext:styles.holdingtextplred}>{Math.round(nrmlpl)}</Text>
                  //                      <Text style={(parseFloat(plValue))>0 ? styles.holdingtext:styles.holdingtextplred}>{parseFloat(plValue).toFixed(2)}%</Text>
                  //                   </View>);
                  //                fee=( <View style={styles.homeView2}>
                  //                     <Text style={styles.holdingtextrk}>-{this.calculateK(fees)}</Text>
                  //                     <Text style={styles.holdingtext1}>{Math.round(recieveDiv)}</Text>
                  //                   </View>);
                  //           }
                  //            else if(data['valueType']=='Split'){ 
                  //                 let dad=data['date'];
                  //                 let nrmlpl;
                  //                 let currectNrpl=0;
                  //                 let newNrpl=0;
                  //                 let clot=0;
                  //                 let lotWithSplit=0;
                  //                 let lotwithoutSplit=0;
                  //                 let nlot=0
                  //                 let dividentAnnouncedate = new Date(dad);
                  //                 this.state.userData[key].map((UserDataD,j) => { 
                  //                   let pd=UserDataD['date'];
                  //                   let purchaseDate = new Date(pd);
                  //                   if(purchaseDate<dividentAnnouncedate){
                  //                     if(UserDataD['Type']=='Buy'){
                  //                       lotWithSplit=lotWithSplit+parseInt(UserDataD['Lots']);
                  //                     }else if(UserDataD['Type']=='Sell'){
                  //                       lotWithSplit=lotWithSplit-parseInt(UserDataD['Lots']);
                  //                     }
                  //                   }
                  //                   else if(purchaseDate>=dividentAnnouncedate){
                  //                     if(UserDataD['Type']=='Buy'){
                  //                       lotwithoutSplit = lotwithoutSplit + parseInt(UserDataD['Lots']);
                  //                     }else if(UserDataD['Type']=='Sell'){
                  //                       lotwithoutSplit = lotwithoutSplit - parseInt(UserDataD['Lots']);
                  //                     }
                  //                   }
                  //               });
                  //               if(lotWithSplit!=0){
                  //                 let lotwithSplit1=lotWithSplit; 
                  //                 let val=parseInt(data['value'])
                  //                 let currentsell=parseFloat(currentVal)/val;
                  //                 let lotwithSplit=lotwithSplit1*val; 
                  //                 let calculatewithsellPrice1=lotwithSplit*100;
                  //                 let calculatewithsellPrice=calculatewithsellPrice1*parseFloat(currentsell);
                  //                 currectNrpl=calculatewithsellPrice+samt-bamt-fees+0;
                  //                 clot=calculatewithsellPrice;
                  //               }
                  //               if(lotwithoutSplit!=0){
                  //                 let lotwithSplit=lotwithoutSplit; 
                  //                   let calculatewithsellPrice1=lotwithSplit*100;
                  //                   let calculatewithsellPrice=calculatewithsellPrice1*currentVal;
                  //                   newNrpl=calculatewithsellPrice+samt-bamt-fees+0;
                  //                   nlot=calculatewithsellPrice;
                  //               }
                  //                 // let pd=this.state.userData[key][0]['date'];
                  //                 // console.log('k',pd);
                  //                 // console.log('k1',dad);
                  //                 // let purchaseDate = new Date(pd); 
                  //                 // if(purchaseDate<dividentAnnouncedate){
                  //                 //   let lotwithSplit1=totalbuyLot-totalsellLot; 
                  //                 //   let val=parseInt(data['value'])
                  //                 //   let currentsell=currentVal/val;
                  //                 //   let lotwithSplit=lotwithSplit1*val; 
                  //                 //   let calculatewithsellPrice1=lotwithSplit*100;
                  //                 //   let calculatewithsellPrice=calculatewithsellPrice1*parseFloat(currentsell);
                  //                 //   currectNrpl=calculatewithsellPrice+samt-bamt-fees+0;
                  //                 //   clot=calculatewithsellPrice;
                  //                 // }
                  //                 // else if(purchaseDate>=dividentAnnouncedate){
                  //                 //   let lotwithSplit=totalbuyLot-totalsellLot; 
                  //                 //   let calculatewithsellPrice1=lotwithSplit*100;
                  //                 //   let calculatewithsellPrice=calculatewithsellPrice1*currentVal;
                  //                 //   newNrpl=calculatewithsellPrice+samt-bamt-fees+0;
                  //                 //   nlot=calculatewithsellPrice;
                  //                 // }
                  //                 nrmlpl=currectNrpl+newNrpl;
                  //                 let fdata=nrmlpl*100;
                  //                 let tlot=clot+nlot
                  //                 let plValue=parseFloat( fdata/this.state.gainOrLoss);
                  //                 // let lotwithSplit1=totalbuyLot-totalsellLot; 
                  //                 // let val=parseInt(data['value'])
                  //                 // let currentsell=currentVal/val;
                  //                 // let lotwithSplit=lotwithSplit1*val; 
                  //                 // let calculatewithsellPrice1=lotwithSplit*100;
                  //                 // console.log('znm1',calculatewithsellPrice1);
                  //                 // let calculatewithsellPrice=calculatewithsellPrice1*parseFloat(currentsell);
                  //                 // console.log('bxdzn',calculatewithsellPrice);
                  //                 // let nrmlpl=calculatewithsellPrice+samt-bamt-fees+0;
                  //                 // console.log('nrmlpl',nrmlpl);
                  //                 // let fdata=(calculatewithsellPrice+samt-bamt-fees+0)*100;
                  //                 // console.log('fdata',fdata);
                  //                 // let plValue=parseFloat( fdata/((lotwithSplit*100)*currentsell)).toFixed(2);
                                  
                  //                 pl= (  
                  //                   <View style={styles.homeView2}>
                  //                     <Text style={(parseFloat(nrmlpl))>0 ? styles.holdingtext:styles.holdingtextplred}>{Math.round(nrmlpl)}</Text>
                  //                     <Text style={(parseFloat(plValue))>0 ? styles.holdingtext:styles.holdingtextplred}>{parseFloat(plValue).toFixed(2)}%</Text>
                  //                   </View>);
                  //                 fee=( <View style={styles.homeView2}>
                  //                       <Text style={styles.holdingtextrk}>-{this.calculateK(fees)}</Text>
                  //                       <Text style={styles.holdingtext1}>0</Text>
                  //                     </View>);
                  //           }
                   
                  //         }
                                              
                  //       }); }
                  //   }
                
                    if(pl==null && fee==null){
                      
                      let lotwithSplit=totalbuyLot-totalsellLot; 
                      let calculatewithsellPrice=lotwithSplit*100*parseFloat(currentVal);
                      console.log('bxdzn',calculatewithsellPrice);
                    
                      let nrmlpl=calculatewithsellPrice+samt-bamt-fees+0;
                      let fdata=(calculatewithsellPrice+samt-bamt-fees+0)*100;
                      let plValue=parseFloat(fdata/Math.abs(this.state.gainOrLoss));
                    //  let plValue=parseFloat(((((totalbuyLot-totalsellLot)*this.state.oneLote*currentVal)+samt-bamt-fees+0)*100)/((totalbuyLot-totalsellLot)*this.state.oneLote*currentVal)).toFixed(2)
                      pl=( 
                            <View style={styles.homeView2}>
                              <Text style={(parseFloat(nrmlpl))>0 ? styles.holdingtext:styles.holdingtextplred}>{Math.round(nrmlpl)}</Text>
                              <Text style={(parseFloat(plValue))>0 ? styles.holdingtext:styles.holdingtextplred}>{parseFloat(plValue).toFixed(2)}%</Text>
                            </View>);
                       fee=( <View style={styles.homeView2}>
                              <Text style={styles.holdingtextrk}>-{this.calculateK(fees)}</Text>
                              <Text style={styles.holdingtext1}>0</Text>
                             </View>);
                    } 
                     
                     
                    if(this.state.splitanddivarrF.length!=0){  
                      let l=(totalbuyLot-totalsellLot)*this.state.oneLote;
                         {  this.state.splitanddivarrF.forEach((data,index)=>{
                             if(data['symbol']==key){
                               if(data['valueType']=='Split'){
                              //   let dad=data['date'];
                              //   let clot1=0;
                              //   let nlot1=0;
                              //   let klot1=0;
                              //   let tolot;
                              //   let pd=this.state.userData[key][0]['date'];
                              //   console.log('k',pd);
                              //   console.log('k1',dad);
                              //   let dividentAnnouncedate = new Date(dad);
                              //   let purchaseDate = new Date(pd);
                              //   console.log('date',dividentAnnouncedate)
                              //   console.log('date',purchaseDate)
                              //   debugger
                              //   if(purchaseDate<dividentAnnouncedate){
                              //     //clot=(totalbuyLot-totalsellLot)*parseInt(data['value']);
                              //     clot1=(totalbuyLot*parseFloat(data['value']))-totalsellLot;
                              //   }
                              //   else if(purchaseDate.getDate()===dividentAnnouncedate.getDate()){
                              //     klot1=(totalbuyLot*parseFloat(data['value']))-totalsellLot;
                              //   }
                              //   else if(purchaseDate>dividentAnnouncedate){
                              //     nlo1t=(totalbuyLot-totalsellLot)
                              //   }
                              //    if(klot1==0){
                              //     tolot=clot1+nlot1;
                              //    }
                              //  else{
                              //    tolot=klot1;
                              //  }
                                lotData=(
                                       <Text style={styles.holdingtext}>{parseInt(totalbuyLot-totalsellLot)} lots </Text>
                                      )   
                               }
                              
                             }
                              
                         })}
                        }
                          else{
                            lotData=(
                              <Text style={styles.holdingtext}>{parseInt(totalbuyLot-totalsellLot)} lots </Text>
                              )
                          }
                          if(lotData==null){
                            lotData=(
                              <Text style={styles.holdingtext}>{parseInt(totalbuyLot-totalsellLot)} lots </Text>
                              )
                           }
                 
                  return (   <View  style={{flex:1,flexDirection:'row'}} key={ind}>
                  <View style={{flex:1,flexDirection:'row',backgroundColor:'#ececec', borderWidth:1, borderColor:"#e4e1e1", }}>
                    <View style={{alignItems:'center', flex:1, paddingLeft:8,paddingTop:8,alignItems:'flex-start'}}>
                     <Image style={styles.iconColor} source={img}></Image>
                    </View>
                    <View style={styles.change}>
                     <Text style={styles.holdingtext} numberOfLines={1}>{this.state.userData[key][0]['Symbol']}</Text>
                     {lotData}
                    </View>
                 </View>
                 <View style={styles.homeView21}>
                   <Text style={styles.holdingtext}> {buyPrice} </Text>
                  <Text style={styles.holdingtext1}>{currentVal}</Text>
                </View>
                 <View style={styles.homeView21totalBuy}>
                   {tt}
                   {tt1}
                  
                 </View>
                {fee}
                {pl}
          </View>)
                 
         }
        })
      }
    if(this.state.tabview == '1') { 
     tabview =
      <View>
              <View style={styles.homeView}>                
              <View style={styles.homeView1}><Text style={styles.homeViewtext} >Cash on hand</Text></View>
              <View style={styles.homeViewdiff}><Text style={styles.homeViewtext1}>{this.numberWithCommas(Math.round(this.state.points))} </Text></View>
              </View>
              <View style={styles.homeView}>
              <View style={styles.homeView1}><Text style={styles.homeViewtext} >Investments</Text></View>
              <View style={styles.homeViewdiff}><Text style={styles.homeViewtext1}>{this.commafy(Math.round(this.state.investment))} </Text></View>
              </View> 
              <View style={styles.homeView}>
              <View style={styles.homeView1}><Text style={styles.homeViewtext} >Less Initial Capital</Text></View>
              <View style={styles.homeViewdiff}><Text style={styles.homeViewtext1}>(500,000) </Text></View>
              </View> 
              <View style={styles.homeView}>       
              <View style={styles.homeView1}><Text style={styles.homeViewtext} >Total Gain / Loss</Text></View>       
              <View style={styles.homeViewdiff}><Text style={styles.homeViewtext1}>{this.commafy(Math.round(this.state.gainOrLoss))}</Text></View>
              </View>
              <View style={styles.homeView}>       
              <View style={styles.homeView1}><Text style={styles.homeViewtext} > </Text></View>       
              <View style={styles.homeViewdiff}><Text style={(parseFloat(this.state.meu))>0 ? styles.homeViewtext1:styles.homeViewttxtt}>μ = {parseFloat(this.state.meu).toFixed(6)}% p.a.</Text></View>
              </View>
              <View style={styles.holding}>       
              {/* <View style={styles.holdinglisttt}><Text style={styles.holdingtext} >No.</Text></View>           */}
              <View style={styles.homeView211}>
                <Text style={styles.holdingtext11}>Name /</Text>
                <Text style={styles.holdingtext11}>Lots</Text>
              </View>
              <View style={styles.homeView21}>
                <Text style={styles.holdingtext11}>Last buy /</Text>
                <Text style={styles.holdingtext11}>Current sell</Text>
              </View>
              <View style={styles.homeView21totalBuy}>
                <Text style={styles.holdingtext11}>Total buy $ /</Text>
                <Text style={styles.holdingtext11}>Total sell $</Text>
              </View>
              <View style={styles.homeView2}>
                <Text style={styles.holdingtext11}>Fees/</Text>
                <Text style={styles.holdingtext11}>Div</Text>
              </View>
              <View style={styles.homeView2}>
                <Text style={styles.holdingtext11}>P/L</Text>
                <Text style={styles.holdingtext11}>%</Text>
              </View>
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

        <View style={{flex:1 }}>
           <View style={{height:50}}>
            <View style={styles.topmenu}>
             <View style={styles.homeText}>
               <TouchableOpacity onPress={this.back.bind(this)}> 
                <Image source={back1} style={{ width:30,height:30}}></Image>      
               </TouchableOpacity>
             </View>
             <View  style={styles.homeLogo}>
               <Text style={styles.tophome}>{this.state.name} Holdings</Text>
             </View>
         </View>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
      
        {divInfo}
        {tabview}       
        {chart}
        <View style={{flex:1 , flexDirection:'row',marginRight:10,marginLeft:10,marginBottom:70}}>
          <View  style={{flex:2,padding:5}}>
            <Text style={{paddingTop:5,paddingBottom:5}}>Unique id: {this.state.id}</Text>
            <Text>Historic μ {parseFloat(this.state.historicMeu).toFixed(3)}%</Text>
          </View>
          <View  style={{flex:1,padding:5,alignItems:'flex-end'}}>
            <Text>Last Active {this.state.lastActiveDays}</Text>
          </View>
        </View>
 
        {modal}
        <ProgressDialog
                    visible={this.state.loading}
                    message="Please Wait.." >
        </ProgressDialog>
      </ScrollView>
        <View style={{flex:1, height:Dimensions.get('window').height,width:Dimensions.get('window').width,backgroundColor:'transparent'}}>
                {/* <Text style={{position:'absolute', marginRight:10,marginLeft:10}}>My Rank</Text> */}
                <View style={styles.contain}>
                <View style={styles.rankContainer}>
                <Text style={styles.ranktext}>{this.state.rank}</Text>
                </View>
                <View style={styles.viewContainer}>
                <Image style={{width:45,height:45,borderRadius: 45/2}} source={{uri: this.state.imageUrl}}></Image>
                <View style={{flex:3,flexDirection:'row',paddingLeft:10}}>
                <View style={{flex:1,flexDirection:'column'}}>
                <Text style={{fontSize:15,color:'#fff'}}>{this.state.name}</Text>
                <Text style={{fontSize:12,color:'#fff' }}>μ = {parseFloat(this.state.meu).toFixed(3)}% p.a.</Text> 
                </View>
                </View>
                </View>
                </View>
                {/* // <TouchableOpacity style={styles.alreadyFriend}>
                //   <Text  style={styles.friendText} onPress={this.removeFriend.bind(this)}> Remove Friend</Text>
                // </TouchableOpacity> : 
                // <TouchableOpacity style={styles.addFriend} onPress={this.addFriend.bind(this)}>
                //   <Text style={styles.friendText}>Add Friend</Text>
                // </TouchableOpacity>} */}
        </View>
        { this.state.id!=this.state.loginUserId ?
        //commented by souvik..
        //   this.state.friendPage ?
        // <TouchableOpacity  style={{height:50,backgroundColor:'#B00020', width:Dimensions.get('window').width/1.05, marginRight:10,marginLeft:10,alignSelf:'center',alignSelf:'center',fontSize:25}}><Text style={{color:'#ffffff',height:50,width:Dimensions.get('window').width/1.05, marginRight:10,marginLeft:10,alignItems:'center',textAlign:'center',fontSize:20,paddingTop:10,paddingBottom:10}}>ALREADY FRIEND</Text></TouchableOpacity>
        // : 
        this.checkIsFriend(this.state.id)  ? 
                  <TouchableOpacity onPress={this.removeFriend.bind(this)} style={{height:50,backgroundColor:'#B00020', width:Dimensions.get('window').width/1.05, marginRight:10,marginLeft:10,alignSelf:'center',alignSelf:'center',fontSize:25}}><Text style={{color:'#ffffff',height:50,width:Dimensions.get('window').width/1.05, marginRight:10,marginLeft:10,alignItems:'center',textAlign:'center',fontSize:20,paddingTop:10,paddingBottom:10}}>REMOVE FRIEND</Text></TouchableOpacity> 
                  : 
                  <TouchableOpacity onPress={this.addFriend.bind(this)} style={{height:50,backgroundColor:'#4aa9de', width:Dimensions.get('window').width/1.05, marginRight:10,marginLeft:10,alignSelf:'center',alignSelf:'center',fontSize:25}}><Text style={{color:'#ffffff',height:50,width:Dimensions.get('window').width/1.05, marginRight:10,marginLeft:10,alignItems:'center',textAlign:'center',fontSize:20,paddingTop:10,paddingBottom:10}}>ADD FRIEND</Text></TouchableOpacity>:<View></View>}
      </View>
    
      
        );
  }
}
export default userHolding;