import React, { PropTypes } from 'react';
import { TouchableOpacity,ScrollView, Text,View,Modal,Image, StyleSheet } from 'react-native';
import styles from './styles';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { AsyncStorage } from "react-native";
import { Dimensions } from 'react-native';
import ChartView from 'react-native-highcharts';
import firebase from 'react-native-firebase'; 
import Moment from 'react-moment';
import { Card } from 'react-native-elements'; 
import {ToastAndroid} from 'react-native';

class MyHolding extends React.Component
{
  coreData = {shares : [], others : [], reits: []};
  visibleData = [];
  splitanddivarr=[];
  allquarter=[];
  allquarterForTest=['Q1-2019','Q2-2019','Q3-2019','Q4-2019'];
  userforRank = [];
constructor(props) {
  super(props);
  this.state = {
    heading:'',
    loading:true,
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
    meu:'',
    userPic:'', 
    countForShare:0,
    countForReits:0,
    countForOther:0,
    userName:'',
    divamt: '',
    divdate:'',
    id:this.props.id,
    uid:'',
    rank:'',
    quaterdata:[],
    userforRank : [],
    quarter:this.props.quarter,
    firstTime : true
  }; 
  let that = this; 
  this.getUser(function(val){  
    that.setState({user : val}, function(){ 
     this.setState({userPic:this.state.user.picture.data.url});
      this.setState({userName:this.state.user.name});
      this.setState({uid: this.state.user.id},()=>{})
      that.lastActive();
      that.getData(function(val1){ 
        that.getUserSellData();  
      })
    });                    
  }); 
  //this.getData();
//  if(this.props.data1==true){
//    this.setState({divamt:this.props.data2});
//  } 
} 
lastActive(){
  let url='users/'+this.state.user.id+'/lastActive';
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
  // Calculate the difference in milliseconds
  let difference_ms = date2_ms - date1_ms;
  // Convert back to days and return 
  let days=Math.round(difference_ms/one_day)
  if(days==0){
    this.setState({lastActiveDays : 'Today'})
  }else{
    this.setState({lastActiveDays : days+' days Ago'})
  }
}
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
    let url=data+'/'+this.state.user.id
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
  checkSplitAndcoffee(symbol,date,next){  
    let that=this;
    let symarr=[];
    let total=0;
    let pointss=0;
    const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //let url = 'divAndsplitStatus/'
   let url='divAndsplitStatusv3/' 
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
              console.log("divtimeis******", divDateTime);
              console.log("buytimeis******", buyDateTime);
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
              obj1['calculation']=(parseFloat(result[checkKey]['Split']['lastSplit']));
              that.splitanddivarr.push(obj1);
              }
            }
          }
        }
      });
      this.setState({splitanddivarrF:that.splitanddivarr},()=>{
        console.log("splitarris*****", this.state.splitanddivarrF);
        this.saveToUserFirebase(); 
        next();
      //  this.saveSplitlot();
      
      });
    });
  } 
  // saveSplitlot(){
  //    alert(JSON.stringify(this.state.splitanddivarrF));
  //    this.state.splitanddivarrF.map((data,index)=>{ 
       
  //    });
  // }

  saveToUserFirebase(){  
    let tbLot=0;
    let tslLot=0;
    let totalPoint=0;
    let that=this;
    let tdate = null; 
    console.log("splitdivarris*******", this.state.splitanddivarrF);
      this.state.splitanddivarrF.map((data,index)=>{ 
                if(data.valueType=="dividends"){
                  let symbol=data.symbol.replace(/,/g, '');
                  let fsymbol=symbol.replace(/\./g, '');
                  let rl="users/"+ that.state.uid+'/lastDiv/'+fsymbol;
                  firebase.database().ref(rl).once("value", snapshot => {
                    // debugger
                      let fdate = new Date(data.date);
                      // let tdate = new Date(that.props.date);     //commented by souvik..
                      if (!snapshot.exists()){
                          // tdate = new Date();
                          tdate = new Date(new Date().getFullYear(),new Date().getMonth() , new Date().getDate())
                        }else{
                          tdate = new Date(snapshot.val().date);
                      }
                      console.log("checkdate******", tdate, fdate);
                      if (snapshot.exists() && fdate.getTime()===tdate.getTime()){
                      
                      }
                    else{
                      console.log("checkdate******", fdate, fdate.getTime());
                      console.log("checkdate******", tdate, tdate.getTime());
                      console.log("checkdate******", this.state.user);
                      // if(fdate.toDateString()===tdate.toDateString()){     //commented by souvik..
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
                          let p
                          if((typeof that.state.user.points)=='string'){
                             p=that.state.user.points.split(",").join("");
                          }else{
                            p=that.state.user.points
                          }
                          console.log(p);
                          console.log(parseFloat(p)+totalPoint);
                          let pp= parseFloat(p)+totalPoint;
                          console.log(that.commafy(pp));
                          let point= pp;
                          that.updateFireBasePointAndLocalStoragePoint(point);
                      });
                      } 
                  }
                });
              }
              if(data.valueType=="Split"){ 
                //  debugger 
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
                firebase.database().ref(that.state.quarter+'/'+that.state.user.id).once('value').then((dataarray) => { 
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
                        firebase.database().ref(that.state.quarter+'/'+that.state.user.id).push(postParams).then(() => {  
                          dataarray.val()[key]['Name']=data.symbol
                        }).catch((error) => {
                        });
                       }
                })
              }
          })

    }
  updateFireBasePointAndLocalStoragePoint(point){
    let url = 'users/'+this.state.user.id;
    let that=this;
    firebase.database().ref(url).update({
            points: that.state.user.points==''?'0' :point, 
            }).then(() => { 
              that.state.user.point=point;
              firebase.database().ref(url).once('value').then((data) => {
                let obj = that.state;
                obj.user.points =  point;
                that.setState(obj); 
                that.setUserUpdatedData(obj.user);             
              }).catch((err)=>{
              });
          }).catch((error) => {
            console.log(error);
            alert('Update failed')
      });
  }
  setUserUpdatedData(user){
   let that=this;
   AsyncStorage.setItem('user', JSON.stringify(user)).then(function(val){
    that.getData(function(val1){ 
      that.getUserSellData();  
    })
    });
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
  getInvestment()
  {
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
        
        console.log("keyis********", this.state.userData[key].length);
        for(let j=0;j<this.state.userData[key].length;j++)
        {
          this.state.splitanddivarrF.forEach(function(data){
          console.log("splitis*********", that.state.splitanddivarrF);
          if(data['valueType']=='Split' && that.state.userData[key][j].Name == data['symbol']){
              splitVal = parseFloat(data['value'])
              console.log("splitvalis*****", splitVal);
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
        // debugger
          let splitChanges = splitVal==0 ? (bamt-samt) : (bamt*splitVal-samt);
          let l = splitChanges*this.state.oneLote;
          CurrentP = (l*this.getCurrentSymbolPrice(this.state.userData[key][0]['Name']));
          final = final + CurrentP
          console.log('final****',final + "--------------" + l)
          console.log("bamt ****" +bamt + "  -- samt*** "+samt +" * "+splitVal + " -- splitChanges "+splitChanges +"***"+CurrentP+"*****"+final);
        
      });
      
      this.setState({investment: final},()=>{
        this.getGainLoss();
      }); 
    }
  }
getGainLoss()
{ 
 let coh= this.state.user ? this.state.user.points.toString().replace(/,/g,"") : 5000000;
 let data=parseFloat(coh)+parseFloat(this.state.investment);
 let data1=parseFloat(data)-500000;
 this.setState({gainOrLoss: data1},()=>{ 
  this.calculateU();
 });
}
calculateU()
{  
  let url = this.state.quarter+'/'+this.state.user.id;
  let that=this;
  this.setState({meu: ((this.state.gainOrLoss/500000)*4*100)},()=>{
    firebase.database().ref('users/'+this.state.user.id).once('value',function(snapshot){
      if(snapshot.val()!=null){
        firebase.database().ref(url).update({meu:that.state.meu}).then(() => {  
          that.saveTotal();
          that.getHistoricmeu();
          });
      }
    }); 
 });
 that.setState({loading:false});
 that.state.loading = false;
  console.log("loaderis****", this.state.loading);
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

  let url =  this.state.quarter+'/'+this.state.user.id
 
   let that = this;
   let share=0;
   let reits=0;
   let other=0;
   let shareS=0;
   let reitsS=0;
   let otherS=0;
  firebase.database().ref(url).once('value').then((data) => {
     let getUserSell  = {};  
     that.setState({firstTime:true});
     Object.keys(data.val()).forEach(function(key, index){ 
       if(key!='meu'){
         if(data.val()[key]['Type']=='Buy'){
           name=data.val()[key]['Name'];
           if(data.val()[key]['symbolForSecurity']=='Shares'){ 
             let sellamt=parseFloat(that.getCurrentSymbolPrice(data.val()[key]['Name']));
             console.log(sellamt);
             let lot= parseInt(data.val()[key]['Lots']);
             console.log(lot);
            // let buyamt= parseFloat(data.val()[key]['Buy']).toFixed(3);
             let tfee=parseFloat(data.val()[key]['Transaction']);
             console.log(tfee);
             let c= ((lot*that.state.oneLote*sellamt)+tfee) ;
             console.log(c);
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
   }).catch((err)=>{
     console.log("aksdjkajsd")
     this.getInvestment();
   });
 } 
 saveTotal(){ 
 let url = 'users/'+this.state.user.id;
  let that=this;
  console.log(Object.keys(this.state.userData).length);
  firebase.database().ref(url).once('value',function(snapshot){
    if(snapshot.val()!=null){
    firebase.database().ref(url).update({total:Object.keys(that.state.userData).length}).then(() => {  
        console.log('ho gya')
    });
  }});
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
getCurrentSymbolPrice(val) {
  console.log("valis*******", val); 
  for(let i=0; i<this.visibleData.length;i++)
    {
      if(this.visibleData[i]['name']==val)
      {
        val = parseFloat(this.visibleData[i]['4. close']);
        console.log("closeprice******", val);
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
  //return val<0.005 ? 0.005 : val;
  return roundto * Math.round(number/roundto);
}
// addFirebaseDataChangeListener(arr){
//   let url = "sharesData";
//   let finalDate = this.getValidDate();
//   let that = this;
//   firebase.database().ref(url).on('value', function(data){
//     if(data.exists()){
//       let dataVal = JSON.parse(data.val());
//       Object.keys(dataVal).forEach(function(key){
//         dataVal[key].forEach(function(val){
//           arr.forEach(function(userData, key){
//               if(userData.Symbol==val['Meta Data']['2. Symbol']){
//                 arr[key]['currentVal'] = val['Meta Data']
//               }
//           });
//         });
//       });     
//     }
//   });
// }
  getShellPrice(val){  
    val = parseFloat(val);
    let calc = (val - (this.myRound(val*0.002, 0.005)==0 ? 0.005 : this.myRound(val*0.002,0.005)));
    console.log('cal',calc)
  // return calc.toFixed(3);
  }
  myRound(number,roundto){ 
    return roundto * Math.round(number/roundto);
  }
// getValidDate(){
   
//   let date = "";
//   let currentDate = new Date();
//   let prev = currentDate.setDate(currentDate.getDate() -1);
//   let day = new Date(prev).toDateString().split(" ")[0];
//   if(day=="Sun"){
//     date = currentDate.setDate(currentDate.getDate() -2);
//   }else{
//     date = prev ;
//   }
//   date =  new Date(date);
//   return date.getFullYear() + "-" + ((date.getMonth()+1) < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1) + "-" + (date.getDate());
// }
    handleObjective(text){            
      this.setState({tabview:text});              
    }
    incrementCount(val) {       
        return   count= val + 1
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
  openModal(){
    this.setState({openModal:true})
  }
  closePopup(){
    this.setState({openModal:false})
  }
  changeCashOnHand(value, name){
    let tbLot=0;
    let tslLot=0;
    let pp=0;
    this.state.userData[name].map((UserData,j) => { 
      if(UserData.Type=='Buy'){
        tbLot=tbLot+parseInt(UserData.Lots);
       }
      else if(UserData.Type=='Sell'){
        tslLot=tslLot+parseInt(UserData.Lots);
      }
    });
    // this.state.user.points=parseInt(this.state.user.points.split(",").join(""))+((tbLot-tslLot)*value);
 
     this.pp= (((tbLot-tslLot)*value));
     return this.pp;
     //this.updateFireBasePoint(pp,this.state.user.id);
  }
  updateFireBasePoint(points,id){
    
  }
  numberWithCommas(x) {
    x = x.toString();
    let pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}
 render()
 {
 
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
  let p= this.state.user ?  this.state.user.points : 5000000
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
             // format: '<b>{point.name}</b>:<br>{point.percentage:.1f} %<br>total: {point.total}',
                
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
      // debugger;
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
            
          //  if(purchaseDate<dividentAnnouncedate){
          //    if(UserData1['Type']=='Buy'){
          //      lotWithDiv=lotWithDiv+parseInt(UserData1['Lots']);
          //    }else if(UserData1['Type']=='Sell'){
          //      lotWithDiv=lotWithDiv-parseInt(UserData1['Lots']);
          //    }
          //  }
          //  else if(purchaseDate.getDate()===dividentAnnouncedate.getDate()){
          //   if(UserData1['Type']=='Buy'){
          //     lotwithoutDiv = lotwithoutDiv + parseInt(UserData1['Lots']);
          //   }else if(UserData1['Type']=='Sell'){ 
          //     lotWithDiv = lotWithDiv - parseInt(UserData1['Lots']);
          //   }
             
          // }
          //  else if(purchaseDate> dividentAnnouncedate){
          //    if(UserData1['Type']=='Buy'){
          //      lotwithoutDiv = lotwithoutDiv + parseInt(UserData1['Lots']);
          //    }else if(UserData1['Type']=='Sell'){
               
          //      lotwithoutDiv = lotwithoutDiv - parseInt(UserData1['Lots']);
          //    }
          //  } 
          if(purchaseDate<dividentAnnouncedate){
            if(UserData1['Type']=='Buy'){
              lotWithDiv=lotWithDiv+parseInt(UserData1['Lots']);
            }else if(UserData1['Type']=='Sell'){
              lotWithDiv=lotWithDiv-parseInt(UserData1['Lots']);
              console.log("lotis*****1", lotWithDiv); 
            }
          }
          else if(purchaseDate.getDate()===dividentAnnouncedate.getDate()){
            if(UserData1['Type']=='Buy'){
              lotwithoutDiv = lotwithoutDiv + parseInt(UserData1['Lots']);
            }else if(UserData1['Type']=='Sell'){
              lotWithDiv = lotWithDiv - parseInt(UserData1['Lots']);
              console.log("lotis*****2", lotWithDiv); 
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
                  console.log("lotis*****3", lotWithDiv); 
                if(lotWithDiv!=0){
                  //commented by souvik..
                  // anounceMent=  <Text style={{color:'#000000',alignItems:'center',fontSize:16}}>
                  // {this.splitanddivarr[0]['date']}: Received {parseFloat(data['calculation']*(lotWithDiv)).toFixed(2)} lots from {data['symbol']} Stock Split {parseFloat(data['value']).toFixed(2)}-for-1
                  // </Text>

                  anounceMent=  <Text style={{color:'#000000',alignItems:'center',fontSize:16}}>
                  {this.splitanddivarr[0]['date']}: Received {parseFloat(data['calculation']*announcementVal).toFixed(2)} lots from {data['symbol']} Stock Split {parseFloat(data['value']).toFixed(2)}-for-1
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
    //holding ka screen announce
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
    // open announcementModal
    if(this.state.openModal){ 
      if(this.state.splitanddivarrF.length!=0)
      { let ind=0;
        listInsideMoal= this.state.splitanddivarrF.map((data,index)=>{
          console.log(this.splitanddivarr)
          let tbLot=0;
          let tslLot=0;
          let anounceMentDetail=null;
          let announcementValModal = null;

        {this.state.userData[data['symbol']].map((UserData,j) => { 
          if(UserData.Type=='Buy' || UserData.Type=='Split'){
            tbLot=tbLot+parseInt(UserData.Lots);
           }
          else if(UserData.Type=='Sell'){
            tslLot=tslLot+parseInt(UserData.Lots);
          }
          announcementValModal = UserData.Lots;
          console.log("valmodal********", announcementValModal);
        });
        }
        if(data['valueType']=='dividends'){ 
          let dad=data['date'];
          let pd=this.state.userData[data['symbol']][0]['date'];
          console.log('k',pd);
          console.log('k1',dad);
          let dividentAnnouncedate = new Date(dad);
          let purchaseDate = new Date(pd);
          console.log('date',dividentAnnouncedate)
          console.log('date',purchaseDate);
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
    // holding table
    // debugger;
    if(Object.keys(this.state.userData).length>0){ 
     tabRepeat = Object.keys(this.state.userData).map((key, ind) => { 
       if(ind<=10){
        let totalbuyLot=0;
        let totalsellLot=0;
        let tt;
        let tt1=<Text style={styles.holdingtextr}>{0}</Text>
        let buyPrice
        let bamt=0;
        let buyarr=[];
        let samt=0;
        let pl=null;
        let fee=null;
        let lotData=null;
        let fees=0;
       {this.state.userData[key].map((UserData,j) => {  
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
                           if(lotwithoutDiv!=0){
                              
                              console.log('aya');
                              let lotwithSplit=lotwithoutDiv;
                              console.log('lot0',lotwithSplit) 
                              let calculatewithsellPrice=lotwithSplit*this.state.oneLote*parseFloat(currentVal); 
                              console.log('lot2',calculatewithsellPrice) 
                              let div= 0;
                              nrmlplForSameDate=calculatewithsellPrice+samt-bamt-fees+div;
                              console.log('lot2',nrmlplForSameDate)
                           }
                             // let pd=this.state.userData[key][0]['date'];
                             // console.log('k',pd);
                             // console.log('k1',dad);
                             // let dividentAnnouncedate = new Date(dad);
                             // let purchaseDate = new Date(pd);
                             // console.log('date',dividentAnnouncedate)
                             // console.log('date',purchaseDate)
                              // if(purchaseDate<dividentAnnouncedate){
                              //   this.state.userData[key].forEach((data,ind)=>{
                              //     if(data.Type=='Buy'){
                              //       tbl=tbl+parseInt(data.Lots);
                              //     }else if(data.Type=='Sell'){
                              //       tsl=tsl+parseInt(data.Lots);
                              //     } 
                              //   });
                              //   console.log('sahi ni aya');
                              //   let lotwithSplit=(tbl-tsl);
                              //   console.log('lot0',lotwithSplit);
                              //   let calculatewithsellPrice=lotwithSplit*100*parseFloat(currentVal); 
                              //   console.log('lot2',calculatewithsellPrice) 
                              //   let div=(tbl-tsl)*this.state.oneLote*parseFloat(data['value']);
                              //   nrmlplForCorrectDate=calculatewithsellPrice+samt-bamt-fees+div;
                              //   console.log('lot2',nrmlplForCorrectDate)
                                
                              // }
                              // else if(purchaseDate>=dividentAnnouncedate){
                              //   console.log('aya');
                              //   let lotwithSplit=l;
                              //   console.log('lot0',lotwithSplit) 
                              //   let calculatewithsellPrice=lotwithSplit*this.state.oneLote*parseFloat(currentVal); 
                              //   console.log('lot2',calculatewithsellPrice) 
                              //   let div= 0;
                              //   nrmlplForSameDate=calculatewithsellPrice+samt-bamt-fees+div;
                              //   console.log('lot2',nrmlplForSameDate)
                              //   let fdata=nrmlpl*100;
                              //   console.log('fdata',fdata);
                              //   let plValue=parseFloat( fdata/(l*currentVal)).toFixed(2);
                              // } 
                              nrmlpl=nrmlplForCorrectDate+nrmlplForSameDate; 
                              let fdata=nrmlpl*100;
                              console.log('fdata',fdata);
                              console.log("pldatais****", nrmlpl);
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
                        //       let nlot=0; let t=0; let k=0;
                        //       let dividentAnnouncedate = new Date(dad);
                        //       this.state.userData[key].map((UserDataD,j) => { 
                        //         let pd=UserDataD['date'];
                        //         let purchaseDate = new Date(pd);
                               
                        //         if(purchaseDate<dividentAnnouncedate){
                        //           if(UserDataD['Type']=='Buy' && UserDataD['Type']=='Split'){
                        //             lotWithSplit=lotWithSplit+parseInt(UserDataD['Lots']*parseFloat(data['value']));
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
                        //       let lotwithSplit=lotwithSplit1; 
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
                // else{
                //   let lotwithSplit=totalbuyLot-totalsellLot; 
                //   let calculatewithsellPrice=lotwithSplit*100*currentVal;
                //   console.log('bxdzn',calculatewithsellPrice);
                //   let nrmlpl=calculatewithsellPrice+samt-bamt-fees+0;
                //   let fdata=(calculatewithsellPrice+samt-bamt-fees+0)*100;
                //   let plValue=parseFloat( fdata/((lotwithSplit*100)*currentVal)).toFixed(2);
                // //  let plValue=parseFloat(((((totalbuyLot-totalsellLot)*this.state.oneLote*currentVal)+samt-bamt-fees+0)*100)/((totalbuyLot-totalsellLot)*this.state.oneLote*currentVal)).toFixed(2)
                //   pl=( 
                //         <View style={styles.homeView2}>
                //           <Text style={(parseFloat(plValue))>0 ? styles.holdingtext:styles.holdingtextplred}>{nrmlpl}</Text>
                //           <Text style={(parseFloat(plValue))>0 ? styles.holdingtext:styles.holdingtextplred}>{plValue}%</Text>
                //         </View>);
                //   fee=( <View style={styles.homeView2}>
                //           <Text style={styles.holdingtextrk}>-{this.calculateK(parseFloat(fees).toFixed(2))}</Text>
                //           <Text style={styles.holdingtext1}>0</Text>
                //         </View>);
                // } 
                    if(pl==null && fee==null){
                      
                      let lotwithSplit=totalbuyLot-totalsellLot; 
                      let calculatewithsellPrice=lotwithSplit*100*parseFloat(currentVal);
                      // console.log('lotwithsplit',calculatewithsellPrice, lotwithSplit, currentVal);
                    
                      let nrmlpl=calculatewithsellPrice+samt-bamt-fees+0;
                      let fdata=(calculatewithsellPrice+samt-bamt-fees+0)*100;
                      let plValue=parseFloat(fdata/Math.abs(this.state.gainOrLoss));
                      console.log('lotwithsplit',calculatewithsellPrice, lotwithSplit, currentVal, nrmlpl);
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
                              //   if(purchaseDate<dividentAnnouncedate){
                              //     //clot=(totalbuyLot-totalsellLot)*parseInt(data['value']);
                              //     clot1=(totalbuyLot*parseFloat(data['value']))-totalsellLot;
                              //   }
                              //   else if(purchaseDate.getDate()===dividentAnnouncedate.getDate()){
                              //     this.state.userData[key].forEach((dataBuy,ind)=>{
                              //       if(dataBuy['Type']=='Sell'){
                              //         klot1=(totalbuyLot*parseFloat(data['value']))-totalsellLot;
                              //       }else{
                              //         nlot1=(totalbuyLot-totalsellLot)
                              //       }

                              //     })
                                 
                              //   }
                              //   else if(purchaseDate>dividentAnnouncedate){
                              //     nlot1=(totalbuyLot-totalsellLot)
                              //   }
                              //    if(klot1==0){
                              //     tolot=clot1+nlot1;
                              //    }
                              //  else{
                              //    tolot=klot1;
                              //  }
                                lotData=(
                                       <Text style={styles.holdingtext}>{parseInt(totalbuyLot-totalsellLot)} lots</Text>
                                      )   
                               }
                              
                             }
                              
                         })}
                        }
                        else{
                          lotData=(
                            <Text style={styles.holdingtext}>{parseInt(totalbuyLot-totalsellLot)} lots</Text>
                            )
                        }
                        if(lotData==null){ 
                          lotData=(
                            <Text style={styles.holdingtext}>{parseInt(totalbuyLot-totalsellLot)} lots</Text>
                            ) 
                         }
              //  if(totalbuyLot-totalsellLot!=0){
                return (   <View  style={{flex:1,flexDirection:'row'}} key={ind}>
                <View style={{flex:1,flexDirection:'column',backgroundColor:'#ececec', borderWidth:1, borderColor:"#e4e1e1", }}>
                  <View style={{alignItems:'center', flexDirection:'row',flex:1, paddingLeft:8,paddingTop:2,alignItems:'flex-start'}}>
                    <Image style={styles.iconColor} source={img}></Image>
                    <Text style={styles.holdingtext} numberOfLines={1}>{this.state.userData[key][0]['Symbol']}</Text>
                  </View>
                  <View style={styles.change}>
                   <Text style={{alignItems: 'center'}}>{lotData}</Text> 
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
              // }
       }
      })
    }
  if(this.state.tabview == '1') { 
   tabview =
    <View>
            <View style={styles.homeView}>                
            <View style={styles.homeView1}><Text style={styles.homeViewtext} >Cash on hand</Text></View>
            <View style={styles.homeViewdiff}><Text style={styles.homeViewtext1}>{this.state.user ? this.numberWithCommas(Math.round(this.state.user.points)) : '500,000'} </Text></View>
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
            {/* <View style={styles.holdinglisttt}><Text style={styles.holdingtext} >No.</Text></View> */}
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
   <ScrollView contentContainerStyle={styles.container}>
     {/* <ProgressDialog
           visible={this.state.loading}
           message="Please Wait.." >
           <View> </View>
        </ProgressDialog> */}
    {divInfo}
    {tabview}       
    {chart}
    <View style={{flex:1 , flexDirection:'row',marginRight:10,marginLeft:10,marginBottom:70}}>
      <View  style={{flex:2,padding:5}}>
        <Text style={{paddingTop:5,paddingBottom:5}}>Unique id: {this.state.uid}</Text>
        <Text>Historic μ {parseFloat(this.state.historicMeu).toFixed(3)}%</Text>
      </View>
      <View  style={{flex:1,padding:5,alignItems:'flex-end'}}>
        <Text>Last Active {this.state.lastActiveDays}</Text>
      </View>
    </View>
    {/* <View style={styles.contain}>
           <View style={styles.rankContainer}>
            <Text style={styles.ranktext}>#{this.state.rank}</Text>
           </View>
           <View style={styles.viewContainer}>
           <Image style={{width:45,height:45,borderRadius: 45/2}} source={{uri: this.state.userPic}}></Image>
             <View style={{flex:3,flexDirection:'row',paddingLeft:10}}>
               <View style={{flex:1,flexDirection:'column'}}>
                 <Text style={{fontSize:15,color:'#000'}}>{this.state.userName}</Text>
                  <Text style={{fontSize:12 }}>μ = {parseFloat(this.state.meu).toFixed(3)}% p.a.</Text> 
               </View>
             </View>
           </View>
    </View> */}
    {/* <TouchableOpacity style={{height:50,backgroundColor:'#4aa9de', width:Dimensions.get('window').width/1.05, marginRight:10,marginLeft:10,alignSelf:'center',alignSelf:'center',fontSize:25}}><Text style={{color:'#ffffff',height:50,width:Dimensions.get('window').width/1.05, marginRight:10,marginLeft:10,alignItems:'center',textAlign:'center',fontSize:20,paddingTop:10,paddingBottom:10}}>ADD FRIEND</Text></TouchableOpacity> */}
     {modal}
     <ProgressDialog
      visible={this.state.loading}
      message="Please Wait.." >
     </ProgressDialog>
    </ScrollView>
  );
 }
 
}
 

export default MyHolding;