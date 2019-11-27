import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, ScrollView,TextInput,Button,AppState} from 'react-native';
import styles from './styles';
import Toast, { DURATION } from 'react-native-easy-toast';
import { AsyncStorage } from "react-native"
import { StackActions, NavigationActions } from 'react-navigation';
import { ProgressDialog } from 'react-native-simple-dialogs';
import Constants from '../../config/constant';
import firebase from 'react-native-firebase';
import Moment from 'moment';
import ChartView from 'react-native-highcharts';


class BuySellScreen extends React.Component {

  allSymbols = [];
  splitdata= [];
  divData=[];
  //comment this
  q1=[1,2,3,13,14,15,25,26,27,31];
  q2=[4,5,6,16,17,18,28,29,30];
  q3=[7,8,9,19,20,21];
  q4=[10,11,12,22,23,24];
  // firstMonth = "";
  // lastMonth = "";
  // firstDate = "";
  // lastDate = "";
  coreData = {shares : [], others : [], reits: []};
  fetchStart = 0;
  willFocusSubscription;
  BBANDS_RSI_MACD_Arr = ["BBANDSv3", "RSIv3", "MACDv3", "TSDv3"];
  adjusted_close = [];

  constructor(props) {
    super(props);
    this.state = {
      curdate:'',
      // prevDate:'',
      // prevDate1:'',
      // prevDate2:'',
      // prevDate3:'',
      data: [],
      RSIXAxis:[],
      BBANDSXAxis:[],
      MACDXAxis:[],
      oneLote:100,
      InputPoints:'',
      purchasepoint:Number,
      realAmount:'',
      transation:'',
      status:'',
      defaultPoint:500000,
      Balance:'',
      lots:'',
      DreamAmount:'',
      date: '',
      date1:this.props.navigation.getParam("date"),
      Buy:this.props.navigation.getParam("Buy"),
      Sell:this.props.navigation.getParam("Sell"),
      Close:this.props.navigation.getParam("Close"),
      Screen:this.props.navigation.getParam("Screen"),
      Symbol:this.props.navigation.getParam("Symbol").replace(".","-"),
      Heigh:this.props.navigation.getParam("Heigh"),
      // timeData:this.props.navigation.getParam("timeData"),
      valueforheighandlow:this.props.navigation.getParam("valueforheighandlow"),
      //lastCloseprice:this.props.navigation.getParam('lastClosePrice'),
      lastCloseprice1:this.props.navigation.getParam('lastClosePrice1'),
      hie:this.props.navigation.getParam("Hie"),
      low:this.props.navigation.getParam("low"),
      open:this.props.navigation.getParam("open"),
      volume:this.props.navigation.getParam("volume"),
      symbolName:this.props.navigation.getParam("symbolName"),
      symbolComesUnder:this.props.navigation.getParam("symbolComesUnder"),
      quater:this.props.navigation.getParam("quater"),
      finalSellValue:'',
      BBANDS : {},
      currentDate : "",
      RSIGraph : {},
      loading : true,
      dialogVisible : false,
      MACDGraph : {},
      splitcoffee:'N/A',
      splitcoffeDate:'N/A',
      dividentDate:'N/A',
      dividentValue:'N/A',
      moneyToBuy:'',
      buySellData:'', 
      splitValue: '',
      splitDate:'',  
      splitData:'',
    } 
    let that = this; 
    that.checkSplitAndcoffee();
    console.log('default point',this.state.defaultPoint)
    var internationalDefaultPoint=this.commafy(this.state.defaultPoint);
    console.log('international default point',internationalDefaultPoint)
    this.setState({defaultPoint:internationalDefaultPoint});
    let date = new Date(Date.now()).toLocaleString().split(",");
    let obj = this.state;
    obj['currentDate'] = date[0];
    this.setState(obj); 
    this.BBANDS_RSI_MACD_Arr.forEach(function(val){
      that.hitBBandsFirebase(val);
    })
  }
  checkSplitAndcoffee(){ 
    console.log("checkdata********", "checkSplitAndcoffee"); 
    const months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
   // let url = 'divAndsplitStatus/'
    let url='divAndsplitStatusv3/'
    firebase.database().ref(url).once('value').then((data) => {
      let data1=JSON.parse(data.val());
      data1.forEach((result,index)=>{
         let checkKey=Object.keys(result)[0];
         if(checkKey==this.state.symbolName){
           console.log(result[checkKey]['Dividend'])
           if(Object.keys(result[checkKey]['Dividend']).length!=0){
            let current_datetime = new Date(result[checkKey]['Dividend']['date']);
            let formatted = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear();
              this.setState({dividentValue: '$'+parseFloat(result[checkKey]['Dividend']['lastdiv']).toFixed(2)});
              this.setState({dividentDate: formatted});
           }
           if(Object.keys(result[checkKey]['Split']).length!=0){
              let d=result[checkKey]['Split']['date']
              let current_datetime1 = new Date(d);
              let formatted_date1 = current_datetime1.getDate() + " " + months[current_datetime1.getMonth()] + " " + current_datetime1.getFullYear();
              this.setState({ splitcoffee : parseFloat(result[checkKey]['Split']['lastSplit']).toFixed(2)+'-'+'for'+'-'+'1'});
              this.setState({ splitcoffeDate : formatted_date1 });
              this.setState({splitData : result[checkKey]['Split']});
          }
         }
      })
      this.getUserSellData();
    });
  }
  // getUserSellData(){ 
  //   let flots1=0;
  //   let flots2=0;
  //   let flot;   
  //   if( this.state.splitData!=''){
  //     let dad=this.state.splitData['date'];
  //     // alert(this.state.splitData);
  //      let dividentAnnouncedate = new Date(dad); 
  //      let url = this.state.quater+'/'+this.state.user.id
  //      let that = this;
  //      firebase.database().ref(url).once('value').then((data) => {
  //        let getUserSell  = []  
  //        Object.keys(data.val()).forEach(function(key){ 
  //         if(key!='meu'){
          
  //          if(data.val()[key].Type=='Buy'){
  //            getUserSell.push(data.val()[key]) 
  //            if(data.val()[key].Name==that.state.symbolName){
  //              let pd = data.val()[key].date;
  //              let purchaseDate = new Date(pd);
  //              if(purchaseDate<dividentAnnouncedate){
  //               let val=parseFloat(that.state.splitData['lastSplit']);
  //               let lotwithSplit=data.val()[key].Lots*val;
  //               flots1= flots1 + lotwithSplit;
  //              }
  //              else{
  //               flots1= flots1 + parseInt(data.val()[key].Lots);
  //              }
  //            }
  //           }
  //           if(data.val()[key].Type=='Sell'){
  //            getUserSell.push(data.val()[key]) 
  //            if(data.val()[key].Name==that.state.symbolName){
  //              flots2= flots2 + parseInt(data.val()[key].Lots);
  //            }
  //           }
  //          flot=(flots1-flots2); 
  //          that.setState({DreamAmount: flot.toString()},()=>{
  //            that.getInputData()
  //          });
  //          that.setState({finalSellValue : flot.toString()})
  //          that.setState({buySellData:getUserSell},()=>{
  //          console.log('sellD',that.state.buySellData);
  //          })
  //         }
  //       });
  //        if(that.state.DreamAmount=='')
  //        {
   
  //        }
  //      }).catch((err)=>{
  //        // this.getInvestment()
  //        that.setState({finalSellValue :  '0'})
  //        next(false);
  //      });
  //   }
  //   else{ 
  //      debugger
  //      let url = this.state.quater+'/'+this.state.user.id
  //      let that = this;
     
  //      firebase.database().ref(url).once('value').then((data) => {
  //        let getUserSell  = []  
  //        Object.keys(data.val()).forEach(function(key){ 
  //         if(key!='meu'){
  //          if(data.val()[key].Type=='Buy'){
  //            getUserSell.push(data.val()[key]) 
  //            if(data.val()[key].Name==that.state.symbolName){
  //                // let lotwithSplit=data.val()[key].Lots*val;
  //                flots1= flots1 + data.val()[key].Lots;
  //            }
  //           }
  //           if(data.val()[key].Type=='Sell'){
  //            getUserSell.push(data.val()[key]) 
  //            if(data.val()[key].Name==that.state.symbolName){
  //              flots2= flots2 + parseInt(data.val()[key].Lots);
  //            }
  //           }
  //          flot=(flots1-flots2); 
  //          that.setState({DreamAmount: flot.toString()},()=>{
  //            that.getInputData()
  //          });
  //          that.setState({finalSellValue : flot.toString()})
  //          that.setState({buySellData:getUserSell},()=>{
  //          console.log('sellD',that.state.buySellData);
  //          })
  //         }
  //       });
  //        if(that.state.DreamAmount=='')
  //        {
   
  //        }
  //      }).catch((err)=>{
  //        // this.getInvestment()
  //        that.setState({finalSellValue :  '0'})
  //        next(false);
  //      });
  //   }  
  
  // }
   
  // checkCoffe()
  // {
  //   debugger
  //  let that = this;
  //  Object.keys(that.state.timeData).forEach(function(key){
  //   let divArray={};
  //   if(that.state.timeData[key]['7. dividend amount']!=0 ) {
  //          divArray['value']=that.state.timeData[key]['7. dividend amount'];
  //          divArray['date']=key;
  //          console.log(divArray);
  //          that.divData.push(divArray);
  //         } 
  //      });
    
  //     if(Object.keys(that.divData).length==0){
  //        that.state.dividentValue='N/A';
  //        that.state.dividentDate='N/A'
  //        that.state.divRecieve=false;
  //     }
  //     else{
  //        that.state.dividentValue=that.divData[0].value;
  //        that.state.dividentDate=that.divData[0].date;
  //        that.state.divRecieve=true;
  //     }
  // }
//  checkSplit()
//  { 
//   let splitarray={};
//   let that = this;
//   Object.keys(that.state.timeData).forEach(function(key){
//     if(that.state.timeData[key]['8. split coefficient']!=1 )  {
//             splitarray['value']=that.state.timeData[key]['8. split coefficient'];
//             splitarray['date']=key;
//             that.splitdata.push(splitarray);
//               }
//       });
//      console.log('splitData',that.splitdata);
//      if(Object.keys(that.splitdata).length==0)  {
//        that.state.splitcoffee='N/A';
//        that.state.splitcoffeDate='N/A'
//      }
//      else if(Object.keys(that.splitdata).length==1){
//       that.state.splitcoffee=that.splitdata[0].value;
//       that.state.splitcoffeDate=that.splitdata[0].key;
//      }
//      else if(Object.keys(that.splitdata).length>1){
//       let len=Object.keys(that.splitdata).length
//       that.state.splitcoffee=that.splitdata[len-1].value;;
//       that.state.splitcoffeDate=that.splitdata[len-1].key;
//      }
     
//  }
getUserSellData(){  
  console.log("checkdata********", "getuserselldata");   
  let url = this.state.quater+'/'+this.state.user.id
  let that = this;
  let flots1=0;
  let flots2=0;
  let flot;
  firebase.database().ref(url).once('value').then((data) => {
    let getUserSell  = []  
    Object.keys(data.val()).forEach(function(key){ 
     if(key!='meu'){
      if(data.val()[key].Type=='Buy' || data.val()[key].Type=='Split'){
        getUserSell.push(data.val()[key]) 
        if(data.val()[key].Name==that.state.symbolName){
          flots1= flots1 + parseInt(data.val()[key].Lots);
        }
       }
       if(data.val()[key].Type=='Sell'){
        getUserSell.push(data.val()[key]) 
        if(data.val()[key].Name==that.state.symbolName){
          flots2= flots2 + parseInt(data.val()[key].Lots);
        }
       }
      flot=(flots1-flots2);
      that.setState({DreamAmount: flot.toString()},()=>{
        that.getInputData()
      });
      that.setState({finalSellValue : flot.toString()})
      that.setState({buySellData:getUserSell},()=>{
      console.log('sellD',that.state.buySellData);
      })
     }
   });
    if(that.state.DreamAmount=='')
    {

    }
  }).catch((err)=>{
    // this.getInvestment()
    that.setState({finalSellValue :  '0'})
    next(false);
  });
}
  getInputData( )
  { 
      if(this.state.user!=null)
      { 
        if(this.state.Screen=='Buy'){
          let point= ""+this.state.user.points;
          let  point1 = point.split(",").join("");
          let n=parseInt(point1);
          let data=  n/(this.state.oneLote * this.state.Buy);
          data=parseInt(data);
          let lots =  (this.state.oneLote * data * this.state.Buy);
          let tt = (lots * 0.33705)/100;
          let tt1=tt< 50 ? 50:tt;
          let trans =  (parseFloat(tt1).toFixed(4))
          let total=lots+parseInt(trans);
          while(total>n){
            data--;
            lots =  (this.state.oneLote * data * this.state.Buy);
            tt = (lots * 0.33705)/100;
            tt1=tt< 50 ? 50:tt;
            trans =  (parseFloat(tt1).toFixed(4));
            total=lots+parseInt(trans); 
          }
           this.setState({DreamAmount: data.toString()},()=>{
            this.setState({transation : trans});
            this.setState({InputPoints : lots});
          });
           this.setState({purchasepoint:data}) 
            let cutAmount = (parseFloat(this.state.user?this.state.user.points.toString().replace(/,/g,""):500000) - parseFloat(parseFloat(trans) + parseFloat(lots) ));
            //var internationalCutAmt=this.commafy(Math.round(cutAmount));
            this.setState({Balance :  cutAmount});   
                   
        }
        if(this.state.Screen=='Sell'){ 
          let lots=this.state.oneLote* parseInt(this.state.DreamAmount) * this.state.Sell;
          let amount=parseInt(this.state.DreamAmount);
          let tt = ( lots * 0.33705)/100;
          let tt1=tt< 50 ? 50:tt;
          let trans =  (parseFloat(tt1).toFixed(4));
          this.setState({transation : trans });
          this.setState({InputPoints : lots}); 
          let cutAmount = ((parseFloat(this.state.user?this.state.user.points.toString().replace(/,/g,""):500000) + parseFloat(lots)) - parseFloat(trans));
          // var internationalCutAmt=this.commafy(Math.round(cutAmount));
          this.setState({Balance :  cutAmount}); 
        }
     }  
  }
  InputPoints(val){  
    val= val.split("-").join("");
    val=val.split(".").join("");
    console.log("checkdata********", "inputpoints"); 
      let text = val; 
      if(text!=''){
        this.setState({DreamAmount : val});
        this.setState({lots : text});    
        let lots = this.state.Screen == 'Buy' ? (this.state.oneLote * parseInt(text) * this.state.Buy) : (this.state.oneLote * parseInt(text) * this.state.Sell);
        let lot =  (parseFloat(lots).toFixed(4))   
         var res = lot.split(".0000");
        this.setState({InputPoints : res});
        let tt = (lots * 0.33705)/100;
        let tt1=tt< 50 ? 50:tt;
        let trans =  (parseFloat(tt1).toFixed(4))
        this.setState({transation : trans},()=>{
          let money=(parseInt(this.state.DreamAmount)*this.state.oneLote)+parseInt(this.state.transation);
          this.setState({moneyToBuy:money})
        });
      
        if(this.state.Screen == 'Buy'){
        let cutAmount = (parseFloat(this.state.user?this.state.user.points.toString().replace(/,/g,""):500000) - parseFloat(parseFloat(trans) + parseFloat(lots) ));
        var internationalCutAmt=cutAmount; 
        this.setState({Balance : internationalCutAmt});                    
        }
        else{
               let cutAmount = (parseFloat(parseFloat(this.state.user?this.state.user.points.toString().replace(/,/g,""):500000) + parseFloat(lots) - parseFloat(trans)  ));
               var internationalCutAmt=cutAmount;
               this.setState({Balance : internationalCutAmt});
        }
      }
      else{
        this.setState({transation : 0},()=>{
          // let money=(parseInt(this.state.DreamAmount)*this.state.oneLote)+parseInt(this.state.transation);
           //this.setState({moneyToBuy:0})
        });
        this.setState({Balance : parseFloat(this.state.user?this.state.user.points.toString().replace(/,/g,""):500000)});
        this.setState({InputPoints : 0});    
        this.setState({DreamAmount : ''});    
      }  
      
    }     
    
     
 commafy( num ) {
  console.log("checkdata********", "commafy"); 
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}
numberWithCommas(x) {
  console.log("checkdata********", "numberwithcommas"); 
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
      x = x.replace(pattern, "$1,$2");
  return x;
}
  

  // getFirebaseDatabase(Symbol){
  //   let url = "sharesData";
  //   let that = this;
  //   let adjustedClosePrice = [];
  //   firebase.database().ref(url).once('value').then((data) => {
  //     let value = JSON.parse(data.val());
  //     Object.keys(value).forEach(function(key){
  //       value[key].forEach(function(result){
  //         if(result['Meta Data'] && result['Meta Data']['2. Symbol']==Symbol){
  //           Object.keys(result['Time Series (Daily)']).forEach(function(time, index){
  //             if(index<90)
  //                adjustedClosePrice.push(parseFloat(result['Time Series (Daily)'][time]['5. adjusted close']));
  //                console.log("adjustedcloseprice**************", adjustedClosePrice)
  //           });
  //         }
  //       })
  //     });
  //     that.adjusted_close = adjustedClosePrice.reverse();
  //     console.log("adjusted close price reverse ***************", that.adjusted_close);
  //   });  
  // }

  getUser(next){
    console.log("checkdata********", "getuser"); 
    try {
      AsyncStorage.getItem('user').then(function(val){
        next(val ? JSON.parse(val): null);
       
      });
     } catch (error) {
       console.log("error", error);
     }
  }

  setUserUpdatedData(user){
    console.log("checkdata********", "setuserupdatedata"); 
    AsyncStorage.setItem('user', JSON.stringify(user)).then(function(val){
    });
  }
  spread(lots){
    console.log("checkdata********", "spread"); 
          let E = ( (this.state.Close * 0.002))  
          let E7 =  (parseFloat(E).toFixed(4))
          let Buy = (this.state.Close + parseInt(E7))
          let total  = (lots +  Buy);
        this.setState({InputPoints : total.toFixed(4)});
        
  }
  pushtopage(){
    console.log("checkdata********", "pushtotoppage"); 
    this.props.navigation.navigate("HoldingTop",{
      onGoBack: () => this.refresh(),
    });
  }
  // buyNow()
  // {
  //   console.log("checkdata********", "buynow"); 
  //   this.props.navigation.navigate("Login");
  // }
  submit(){  
    if(this.state.user == null){   
        AsyncStorage.setItem('user', '');  
        this.props.navigation.navigate("Login");
      }
    else if(this.state.DreamAmount == ''){
         alert("Please enter Value")             
          return;
        }
     else if(parseInt(this.state.DreamAmount) < 0){
          alert("Please enter positive value");            
          return;
        }
        else if(parseInt(this.state.DreamAmount)== 0){
          alert("Please enter correct value");            
          return;
       }
     else {
      if(this.state.Screen=='Sell'){ 
        let that=this;
        let lots = (this.state.oneLote * this.state.DreamAmount * this.state.Sell);
        let lot =  (parseFloat(lots).toFixed(4))   
         var res = lot.split(".0000");
        this.setState({InputPoints : res});
        let tt = (lots * 0.33705)/100;
        let trans =  (parseFloat(tt).toFixed(4))
        this.setState({transation : trans},()=>{
          let money=(parseFloat(this.state.DreamAmount)*this.state.oneLote)+parseFloat(this.state.transation);
          this.setState({moneyToBuy:money})
        });
        console.log("dreamamount**********", this.state.DreamAmount);
        console.log("dreamamount**********", this.state.finalSellValue);
         if(parseInt(this.state.DreamAmount) > parseInt(this.state.finalSellValue) || this.state.finalSellValue == ""){
                 alert("For selling this security please buy the same security first")
                return;
               } 
               else{
                 this.setState({dialogVisible : true});
                 //let date1 = new Date();
                 let date1 = this.state.date1.replace(/ /gi,'-')
                 let postParams = {
                 UserID:this.state.user.id,
                 //date :  Moment(date1).format('DD-MMM-YYYY'),
                 date : date1,
                 BuyAmount:this.state.InputPoints,
                 Transaction: this.state.transation,
                 //Lots:this.state.lots==''?this.state.DreamAmount :this.state.lots ,
                 Lots: this.state.DreamAmount,
                 Buy:this.state.Sell,
                 Type:this.state.Screen,
                 Symbol:this.state.Symbol, 
                 Name:this.state.symbolName,
                 symbolForSecurity:this.state.symbolComesUnder,      
                } 
                let q='';
                let date=new Date();
                let month=date.getMonth()+1;
                let day=date.getDate()
                let urlForQuater1='Q1-'+date.getFullYear()+'/'+that.state.user.id;
                let urlForQuater2='Q2-'+date.getFullYear()+'/'+that.state.user.id
                let urlForQuater3='Q3-'+date.getFullYear()+'/'+that.state.user.id
                let urlForQuater4='Q4-'+date.getFullYear()+'/'+that.state.user.id
                //if(month == 1||2||3)
                if(that.q1.includes(day)){ 
                q='Q1-'+date.getFullYear();
                firebase.database().ref(urlForQuater1).update({meu:0}).then(() => {
                 // let url = 'BuySell/'+that.state.user.id
                  firebase.database().ref(urlForQuater1).push(postParams).then(() => {  
                  that.updateUserPoints(that.state.user.id,that.state.Balance,q)
                  }).catch((error) => {
                      console.log(error);
                      alert('error');      
                  });   
                });
                }
                else if(that.q2.includes(day)){
                  q='Q2-'+date.getFullYear();
                  firebase.database().ref(urlForQuater2).update({meu:0}).then(() => { 
                    firebase.database().ref(urlForQuater2).push(postParams).then(() => {  
                      that.updateUserPoints(that.state.user.id,that.state.Balance,q)
                      }).catch((error) => {
                          console.log(error);
                          alert('error');      
                      });  
                  });
                }
                else if(that.q3.includes(day)){
                  q='Q3-'+date.getFullYear();
                  firebase.database().ref(urlForQuater3).update({meu:0}).then(() => {  
                    firebase.database().ref(urlForQuater3).push(postParams).then(() => {  
                      that.updateUserPoints(that.state.user.id,that.state.Balance,q)
                      }).catch((error) => {
                          console.log(error);
                          alert('error');      
                      }); 
                  });
                }
                else if(that.q4.includes(day)){
                  q='Q4-'+date.getFullYear();
                  firebase.database().ref(urlForQuater4).update({meu:0}).then(() => {  
                    firebase.database().ref(urlForQuater4).push(postParams).then(() => {  
                      that.updateUserPoints(that.state.user.id,that.state.Balance,q)
                      }).catch((error) => {
                          console.log(error);
                          alert('error');      
                      }); 
                  });
                }

            //     console.log('postParams',postParams) 
            //     let url = 'BuySell/'+this.state.user.id
            //     firebase.database().ref(url).push(postParams).then(() => {  
            //     console.log('INSERTED !');
            //     this.updateUserPoints(this.state.user.id,this.state.Balance)
            // }).catch((error) => {
            //     console.log(error);
            //     alert('error');      
            // }); 
           }
        
            }
        
          else if(this.state.Screen=='Buy'){
            let isExist;
           firebase.database().ref('users/'+this.state.user.id).once('value').then((data)=>{
              let datak=data.val();
              let that=this;
              if(datak.total<10){
                if(that.state.user == null){  
                  AsyncStorage.setItem('user', '');  
                  that.props.navigation.navigate("Login");
                }
                else  if(that.state.DreamAmount == ''){
                  alert("Please enter Value")             
                  return;
                }
                else{
                  if(parseInt(that.state.DreamAmount) > parseInt(that.state.purchasepoint))
                    {
                      alert('Insufficient cash on hand to buy. Try entering a smaller number of lots to buy instead')
                    }
                  else{
                    // debugger
                    that.setState({dialogVisible : true}); 
                    let date1 = that.state.date1.replace(/ /gi,'-')
                    let postParams = {
                    UserID : that.state.user.id,
                    //date :  Moment(date1).format('DD-MMM-YYYY'),
                    date : date1,
                    BuyAmount : that.state.InputPoints,
                    Transaction : that.state.transation,
                    Lots : that.state.DreamAmount  ,
                    Buy : that.state.Buy,
                    Type : that.state.Screen,
                    Symbol : that.state.Symbol, 
                    Name : that.state.symbolName,
                    symbolForSecurity : that.state.symbolComesUnder,      
                  } 
                  let q='';
                  let date=new Date();
                  let month=date.getMonth()+1;
                  let day=date.getDate()
                  let urlForQuater1='Q1-'+date.getFullYear()+'/'+that.state.user.id;
                  let urlForQuater2='Q2-'+date.getFullYear()+'/'+that.state.user.id
                  let urlForQuater3='Q3-'+date.getFullYear()+'/'+that.state.user.id
                  let urlForQuater4='Q4-'+date.getFullYear()+'/'+that.state.user.id
                  if(that.q1.includes(day)){
                  q='Q1-'+date.getFullYear();
                  firebase.database().ref(urlForQuater1).update({meu:0}).then(() => {
                   // let url = 'BuySell/'+that.state.user.id
                    firebase.database().ref(urlForQuater1).push(postParams).then(() => {  
                    that.updateUserPoints(that.state.user.id,that.state.Balance,q)
                    }).catch((error) => {
                        console.log(error);
                        alert('error');      
                    });   
                  });
                  }
                  else if(that.q2.includes(day)){
                    
                    q='Q2-'+date.getFullYear();
                    firebase.database().ref(urlForQuater2).update({meu:0}).then(() => { 
                      firebase.database().ref(urlForQuater2).push(postParams).then(() => {  
                        that.updateUserPoints(that.state.user.id,that.state.Balance,q)
                        }).catch((error) => {
                            console.log(error);
                            alert('error');      
                        });  
                    });
                  }
                  else if(that.q3.includes(day)){
                     
                    q='Q3-'+date.getFullYear();
                    firebase.database().ref(urlForQuater3).update({meu:0}).then(() => {  
                      firebase.database().ref(urlForQuater3).push(postParams).then(() => {  
                        that.updateUserPoints(that.state.user.id,that.state.Balance,q)
                        }).catch((error) => {
                            console.log(error);
                            alert('error');      
                        }); 
                    });
                  }
                  else if(that.q4.includes(day)){
                    q='Q4-'+date.getFullYear();
                    firebase.database().ref(urlForQuater4).update({meu:0}).then(() => {  
                      firebase.database().ref(urlForQuater4).push(postParams).then(() => {  
                        that.updateUserPoints(that.state.user.id,that.state.Balance,q)
                        }).catch((error) => {
                            console.log(error);
                            alert('error');      
                        }); 
                    });
                  }
                //   console.log('param',postParams);
                // //  this.updateUserPoints(this.state.user.id,this.state.Balance)
                //   let url = 'BuySell/'+that.state.user.id
                //   firebase.database().ref(url).push(postParams).then(() => {  
                //   that.updateUserPoints(that.state.user.id,that.state.Balance)
                // }).catch((error) => {
                //     console.log(error);
                //     alert('error');      
                // }); 
                }
               }
             } 
              else{
              that.checkThisSecurityisinlist(that.state.symbolName,function(val){
                  isExist=val;
                if(datak.total>=10 && isExist){
                if(that.state.user == null){  
                  alert("Please login")
                  AsyncStorage.setItem('user', '');  
                  that.props.navigation.navigate("Login");
                }
                else  if(that.state.DreamAmount == ''){
                  alert("Please enter Value")             
                  return;
                }
              else{
                 if(parseInt(that.state.DreamAmount) > parseInt(that.state.purchasepoint))
                  {
                    alert('Insufficient cash on hand to buy. Try entering a smaller number of lots to buy instead')
                  }
                else{
                  that.setState({dialogVisible : true});
                  //let date1 = new Date();
                  let date1 = that.state.date1.replace(/ /gi,'-')
                  let postParams = {
                  UserID:that.state.user.id,
                  //date :  Moment(date1).format('DD-MMM-YYYY'),
                  date : date1,
                  BuyAmount : that.state.InputPoints,
                  Transaction : that.state.transation,
                  Lots : that.state.DreamAmount  ,
                  Buy : that.state.Buy,
                  Type : that.state.Screen,
                  Symbol : that.state.Symbol, 
                  Name : that.state.symbolName,
                  symbolForSecurity : that.state.symbolComesUnder,      
                } 
                let q='';
                let date=new Date();
                let month=date.getMonth()+1;
                let day=date.getDate()
                let urlForQuater1='Q1-'+date.getFullYear()+'/'+that.state.user.id;
                let urlForQuater2='Q2-'+date.getFullYear()+'/'+that.state.user.id
                let urlForQuater3='Q3-'+date.getFullYear()+'/'+that.state.user.id
                let urlForQuater4='Q4-'+date.getFullYear()+'/'+that.state.user.id
                if(that.q1.includes(day)){ 
                  q='Q1-'+date.getFullYear();
                  firebase.database().ref(urlForQuater1).update({meu:0}).then(() => {
                  // let url = 'BuySell/'+that.state.user.id
                    firebase.database().ref(urlForQuater1).push(postParams).then(() => {  
                    that.updateUserPoints(that.state.user.id,that.state.Balance,q)
                    }).catch((error) => {
                        console.log(error);
                        alert('error');      
                    });   
                  });
                }
                else if(that.q2.includes(day)){
                  q='Q2-'+date.getFullYear();
                  firebase.database().ref(urlForQuater2).update({meu:0}).then(() => { 
                    firebase.database().ref(urlForQuater2).push(postParams).then(() => {  
                      that.updateUserPoints(that.state.user.id,that.state.Balance,q)
                      }).catch((error) => {
                          console.log(error);
                          alert('error');      
                      });  
                  });
                }
                else if(that.q3.includes(day)){
                  q='Q3-'+date.getFullYear();
                  firebase.database().ref(urlForQuater3).update({meu:0}).then(() => {  
                    firebase.database().ref(urlForQuater3).push(postParams).then(() => {  
                      that.updateUserPoints(that.state.user.id,that.state.Balance,q)
                      }).catch((error) => {
                          console.log(error);
                          alert('error');      
                      }); 
                  });
                }
                else if(that.q4.includes(day)){
                  q='Q4-'+date.getFullYear();
                  firebase.database().ref(urlForQuater4).update({meu:0}).then(() => {  
                    firebase.database().ref(urlForQuater4).push(postParams).then(() => {  
                      that.updateUserPoints(that.state.user.id,that.state.Balance,q)
                      }).catch((error) => {
                          console.log(error);
                          alert('error');      
                      }); 
                  });
                }
              }
            }
              }
              else{
                alert('In the game rule, you are not allowed to own more than 10 different types of securities. No over-diversifying');
              }
              });
            }
            }); 
           
          
        }
     }     
  }
  checkThisSecurityisinlist(sName,next){ 
    let url = this.state.quater+'/'+this.state.user.id
    let that = this;
    let check=false;
  
    firebase.database().ref(url).once('value').then((data) => {
      Object.keys(data.val()).map(function(key){ 
        if(key!='meu'){
        name=data.val()[key]['Name'];
        if(sName==name){
          check=true;
        }
      }
      });
      next(check);
   });  
  }
     
  updateUserPoints(id,points,q) {
    console.log("checkdata********", "updateuserpoints");  
    let url = 'users/'+id;
    // let q='';
    // let date=new Date();
    // let month=date.getMonth()+1;
    // let day=date.getDate()
    // let urlForQuater1='Q1-'+date.getFullYear()+'/'+id;
    // let urlForQuater2='Q2-'+date.getFullYear()+'/'+id
    // let urlForQuater3='Q3-'+date.getFullYear()+'/'+id
    // let urlForQuater4='Q4-'+date.getFullYear()+'/'+id
    // debugger
    // if(this.q1.includes(day)){
    //  alert('in one quarter');
    //  q='Q1-'+date.getFullYear();
    //  firebase.database().ref(urlForQuater1).update({meu:0}).then(() => {  
    //  });
    // }
    // else if(this.q2.includes(day)){
    //   alert('in two quarter');
    //   q='Q2-'+date.getFullYear();
    //   firebase.database().ref(urlForQuater2).update({meu:0}).then(() => {  
    //   });
    // }
    // else if(this.q3.includes(day)){
    //   alert('in three quarter');
    //   q='Q3-'+date.getFullYear();
    //   firebase.database().ref(urlForQuater3).update({meu:0}).then(() => {  
    //   });
    // }
    // else if(this.q4.includes(day)){
    //   alert('in four quarter');
    //   q='Q4-'+date.getFullYear();
    //   firebase.database().ref(urlForQuater4).update({meu:0}).then(() => {  
    //   });
    // }

    // if(month==1 || month==2 || month==3){
    //  console.log('in one quarter');
    //  q='Q1-'+date.getFullYear();
    // //  firebase.database().ref(urlForQuater1).update({meu:0}).then(() => {  
    // // });
    // }
    // else if(month==4 || month==5 || month==6){
    //   console.log('in two quarter');
    //   q='Q2-'+date.getFullYear();
    //   // firebase.database().ref(urlForQuater2).update({meu:0}).then(() => {  
    //   // });
    // }
    // else if(month==7 || month==8 || month==9){
    //   console.log('in three quarter');
    //   q='Q3-'+date.getFullYear();
    //   // firebase.database().ref(urlForQuater3).update({meu:0}).then(() => {  
    //   // });
    // }
    // else if(month==10 || month==11 || month==12){
    //   console.log('in four quarter');
    //   q='Q4-'+date.getFullYear();
    //   // firebase.database().ref(urlForQuater4).update({meu:0}).then(() => {  
    //   // });
    // }
     firebase.database().ref(url).update({
        points: points==''?'0' :points, 
        }).then(() => { 
       this.getUpDateData(url,q)
     }).catch((error) => {
      console.log(error);
      alert('Update failed')
  });      
 }  
  
  getUpDateData(url ,q){
    console.log("checkdata********", "getupdatedata"); 
    let that = this;
    firebase.database().ref(url).once('value').then((data) => {
      let obj = that.state;
      obj.user.points = data.val().points;
      that.setState(obj); 
      that.setUserUpdatedData(data.val());  
      this.setState({dialogVisible : false}); 
    
      this.props.navigation.navigate("HoldingTop",{'quater':q,date:this.state.date1});           
    }).catch((err)=>{
      next(false);
    });
  }
  todayDate(){
    console.log("checkdata********", "todaydate"); 
    let date = new Date();
    let DD = Moment(date).format('YYYY-MM-DD');
    // let pDD = Moment(date).subtract(1, 'day')
    // let pDD1 = Moment(date).subtract(2, 'day')
    // let pDD2 = Moment(date).subtract(3, 'day')
    // let pDD3 = Moment(date).subtract(4, 'day')
    // let previousDate = Moment(pDD).format('YYYY-MM-DD');
    // let previousDate1 = Moment(pDD1).format('YYYY-MM-DD');
    // let previousDate2 = Moment(pDD2).format('YYYY-MM-DD');
    // let previousDate3 = Moment(pDD3).format('YYYY-MM-DD');
    this.setState({curdate:DD});
    // this.setState({prevDate:previousDate});
    // this.setState({prevDate1:previousDate1});
    // this.setState({prevDate2:previousDate2});
    // this.setState({prevDate3:previousDate3});
    console.log("date************", DD);
  }
    loginWith(type){
      console.log("checkdata********", "loginwith"); 
    switch(type){
      case Constants.FACEBOOK_LOGIN:
      this.props.navigation.navigate("BuySellScreen");
   
      break;

      case Constants.GOOGLE_LOGIN:
   
      break;
    }
   
  }
  // ifBBandsDataExist(url, next){
  //   firebase.database().ref(url).once('value').then((data) => {
  //     next(data.exists());
  //   }).catch((err)=>{
  //     next(false);
  //   });
  // }
  ifBBandsDataExist(url, next){
    firebase.database().ref(url).once('value').then((data) => {
      if(data.val()){
         let firebaseData = JSON.parse(data.val())
         if(url.includes("BBANDSv3")){
            if(firebaseData['date'] == this.state.curdate){
                next(true);
            }
            else{
                next(false);
            }
         }
        else if(url.includes("RSIv3")){
          if(firebaseData['date'] == this.state.curdate){
              next(true);
          }
          else{
              next(false);
          }
        }
        else if(url.includes("MACDv3")){
          if(firebaseData['date'] == this.state.curdate){
              next(true);
          }
          else{
              next(false);
          }
        }
      else if(url.includes("TSDv3")){
        if(firebaseData['date'] == this.state.curdate){
            next(true);
        }
        else{
            next(false);
        }
      }
        //  console.log("url is********", firebaseData['Meta Data']['3: Last Refreshed'].split[" "][0]);
        //  if(url.includes("BBANDS") || url.includes("RSI") || url.includes("MACD")){
        //    if(firebaseData['Meta Data']['3: Last Refreshed'].includes(" ")){
        //       if(firebaseData['Meta Data']['3: Last Refreshed'].split[" "][0] == this.state.curdate){
        //         next(true);
        //       }
        //       else{
        //         next(false);
        //       }
        //    }
        //     else if(firebaseData['Meta Data']['3: Last Refreshed'] == this.state.prevDate){
        //         next(true);
        //     }
        //     else{
        //       next(false);
        //    }
        //  }
        //  else if(url.includes("TIME_SERIES_DAILY_ADJUSTED")){
        //     if(firebaseData['Meta Data']['3. Last Refreshed'].includes(" ")){
        //       if(firebaseData['Meta Data']['3. Last Refreshed'].split[" "][0] == this.state.curdate){
        //         next(true);
        //       }
        //       else{
        //         next(false);
        //       }
        //     }
        //     else if(firebaseData['Meta Data']['3. Last Refreshed'] == this.state.prevDate){
        //       next(true);
        //     }
        //     else{
        //       next(false);
        //    }
        //  }
      }
      else{
        next(false);
      }
    }).catch((err)=>{
      next(false);
    });
  }
  back(){
    console.log("checkdata********", "back"); 
    this.props.navigation.goBack();   
  }
  hitBBandsFirebase(val){
    console.log("checkdata********", "hitbbandsfirebase"); 
    let dbUrl = val + "/" + this.state.Symbol; 
    let that = this;
    let alphaUrl; 
    this.ifBBandsDataExist(dbUrl, function(data){
      // if(!data){
      //   if(dbUrl.includes("BBANDSv3")){
      //      alphaUrl = Constants.GET_BBANDS_URL(val, that.state.Symbol.replace("-","."));
      //   }
      //   else if(dbUrl.includes("RSIv3")){
      //      alphaUrl = Constants.GET_RSI_URL(val, that.state.Symbol.replace("-","."));
      //   }
      //   else if(dbUrl.includes("MACDv3")){
      //      alphaUrl = Constants.GET_MACD_URL(val, that.state.Symbol.replace("-","."));
      //   }
      //   else if(dbUrl.includes("TIME_SERIES_DAILY_ADJUSTED")){
      //     alphaUrl = Constants.GET_TIMESERIESDAILYADJUSTED_URL(val, that.state.Symbol);
      //   }
      //   that.getBBandsDataFromAlpha(alphaUrl, dbUrl, that.state.Symbol);
      // }else{
        that.getBBandsDatafromFirebase(dbUrl);
     // }
    });
  }
  componentWillMount(){
    console.log("checkdata********", "componentwillmount"); 
    let that =this;
     this.getUser(function(val){
       if(val==null)
       {
         that.setState({status:'false'})
       }
       else{
         that.setState({status:'true'});
       }
       }); 
   }
   componentDidMount() { 
    this.todayDate();
     this.props.navigation.addListener('willFocus',this.willFocus);
    
   }
    
  willFocus = () => { 
    let that=this;
    this.getUser(function(val){
      that.setState({user : val}, function() { 
        if(that.state.user!=null){
          that.calculateQuater();
          that.setState({status:'true'});
        }
        if( that.state.Screen=='Sell' && that.state.user!=null){
         // that.getUserSellData();
         that.checkSplitAndcoffee();
         }
         else{
          that.getInputData( );
         } 
      });        
    });
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
    if(this.q1.includes(day)){
      q='Q1-'+date.getFullYear();
      this.setState({quater:q},()=>{
        this.checkQuater(q);
      });
    }
    else if(this.q2.includes(day)){
       q='Q2-'+date.getFullYear();
       this.setState({quater:q},()=>{
        this.checkQuater(q);
       });
    }
    else if(this.q3.includes(day)){
       q='Q3-'+date.getFullYear();
       this.setState({quater:q},()=>{
        this.checkQuater(q);
       });
    }
    else if(this.q4.includes(day)){
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
    console.log("checkdata********", "componentwillunmount");  
    console.log('aaaaaaaaa')
   // this.willFocusSubscription.remove();
   }  
  // async getBBandsDataFromAlpha(alphaUrl, dbUrl){
  //   console.log("checkdata********", "getbbandsfromalpha"); 
  //   let that = this;
  //   let result = await fetch(alphaUrl).then(response => response.json());
  //   result['date'] = this.state.curdate;
  //   if(result['Meta Data']){
  //     firebase.database().ref(dbUrl).set(JSON.stringify(result)).then(() => {
  //       console.log("successfully inserted")
  //       that.getBBandsDatafromFirebase(dbUrl);
  //     }).catch((error) => {
  //       console.log(error);
  //     });
  //   }
  //   else{
  //     that.state.loading = false;
  //     alert("Please wait a few minutes while we populate new data for this security today. Thank you for your patience.");
  //   }
  // }

  // async getBBandsDatafromFirebase(dbUrl){
  //   let that = this;
  //   let BBands = {upper : [], middle : [], lower : []};
  //   let Rsi = {RSI:[], overBought:[], overSold:[]};
  //   let Macd = {MACD:[], MACDSignal:[], MACDHist:[]};
  //   firebase.database().ref(dbUrl).once('value').then((data) => {
  //     if(dbUrl.includes("BBANDS")){
  //        var BBandsParseData = JSON.parse(data.val());
  //        var BBandsParseArr = Object.keys(BBandsParseData['Technical Analysis: BBANDS']).slice(0, 14);
  //        that.getFirstMonthCalculation(BBandsParseArr[0]);
  //        that.getLastMonthCalculation(BBandsParseArr[13]);
  //        BBandsParseArr.forEach(function(val){
  //           BBands.upper.push(parseFloat(BBandsParseData['Technical Analysis: BBANDS'][val]['Real Upper Band']))
  //           BBands.middle.push(parseFloat(BBandsParseData['Technical Analysis: BBANDS'][val]['Real Middle Band']))
  //           BBands.lower.push(parseFloat(BBandsParseData['Technical Analysis: BBANDS'][val]['Real Lower Band']))
  //        })
  //         let BBandsReverse = {upperReverse : [], middleReverse : [], lowerReverse : []};
  //         BBandsReverse.upperReverse = BBands.upper.reverse();
  //         BBandsReverse.middleReverse = BBands.middle.reverse();
  //         BBandsReverse.lowerReverse = BBands.lower.reverse();
  //         that.setState({BBANDS : BBandsReverse});
  //     }
  //     else if(dbUrl.includes("RSI")){
  //       var RSIParseData = JSON.parse(data.val());
  //       console.log("parse data RSI********", RSIParseData);
  //       var RSIParseArr = Object.keys(RSIParseData['Technical Analysis: RSI']).slice(0, 14);
  //       that.getFirstMonthCalculation(RSIParseArr[0]);
  //       that.getLastMonthCalculation(RSIParseArr[13]);
  //       console.log("parse Arr RSI********", RSIParseArr);
  //       RSIParseArr.forEach(function(val){
  //           Rsi.RSI.push(parseFloat(RSIParseData['Technical Analysis: RSI'][val]['RSI']))
  //       })
  //       for(i = 0; i < 14; i++){
  //           Rsi.overBought.push(70);
  //           Rsi.overSold.push(30);
  //       }
  //       let RsiReverse = {RSIReverse:[], overBoughtReverse:[], overSoldReverse:[]};
  //       RsiReverse.RSIReverse = Rsi.RSI.reverse();
  //       RsiReverse.overBoughtReverse = Rsi.overBought.reverse();
  //       RsiReverse.overSoldReverse = Rsi.overSold.reverse();
  //       that.setState({RSIGraph : RsiReverse});
  //     }
  //     else if(dbUrl.includes("MACD")){
  //       var MACDParseData = JSON.parse(data.val());
  //       console.log("parse data RSI********", MACDParseData);
  //       var MACDParseArr = Object.keys(MACDParseData['Technical Analysis: MACD']).slice(0, 14);
  //       that.getFirstMonthCalculation(MACDParseArr[0]);
  //       that.getLastMonthCalculation(MACDParseArr[13]);
  //       console.log("parse Arr RSI********", MACDParseArr);
  //       MACDParseArr.forEach(function(val){
  //         Macd.MACD.push(parseFloat(MACDParseData['Technical Analysis: MACD'][val]['MACD']));
  //         Macd.MACDSignal.push(parseFloat(MACDParseData['Technical Analysis: MACD'][val]['MACD_Signal']));
  //         Macd.MACDHist.push(parseFloat(MACDParseData['Technical Analysis: MACD'][val]['MACD_Hist']));
  //       })
  //       let MacdReverse = {MACDReverse:[], MACDSignalReverse:[], MACDHistReverse:[]};
  //       MacdReverse.MACDReverse = Macd.MACD.reverse();
  //       MacdReverse.MACDSignalReverse = Macd.MACDSignal.reverse();
  //       MacdReverse.MACDHistReverse = Macd.MACDHist.reverse();
  //       that.setState({MACDGraph : MacdReverse});
  //     }
  //     let stat = that.state;
  //     stat.loading = false;
  //     that.setState(stat);
  //   }).catch((err)=>{
  //     console.log("this is error", err);
  //   });
  // }
  // getFirstMonthCalculation(date){
  //   var bbandsMonth = date.split("-");
  //   if(bbandsMonth[1] == "01"){
  //      this.firstMonth = "Jan";
  //   }
  //   if(bbandsMonth[1] == "02"){
  //      this.firstMonth = "Feb";
  //   }
  //   if(bbandsMonth[1] == "03"){
  //      this.firstMonth = "Mar";
  //   }
  //   if(bbandsMonth[1] == "04"){
  //      this.firstMonth = "Apr";
  //   }
  //   if(bbandsMonth[1] == "05"){
  //      this.firstMonth = "May";
  //   }
  //   if(bbandsMonth[1] == "06"){
  //      this.firstMonth = "Jun";
  //   }
  //   if(bbandsMonth[1] == "07"){
  //      this.firstMonth = "Jul";
  //   }
  //   if(bbandsMonth[1] == "08"){
  //      this.firstMonth = "Aug";
  //   }
  //   if(bbandsMonth[1] == "09"){
  //      this.firstMonth = "Sep";
  //   }
  //   if(bbandsMonth[1] == "10"){
  //      this.firstMonth = "Oct";
  //   }
  //   if(bbandsMonth[1] == "11"){
  //      this.firstMonth = "Nov";
  //   }
  //   if(bbandsMonth[1] == "12"){
  //      this.firstMonth = "Dec";
  //   }
  //   this.firstDate = bbandsMonth[2]+" "+this.firstMonth+" "+bbandsMonth[0];
  // }

  // getLastMonthCalculation(date){
  //   var bbandsMonth = date.split("-");
  //   if(bbandsMonth[1] == "01"){
  //      this.lastMonth = "Jan";
  //   }
  //   if(bbandsMonth[1] == "02"){
  //      this.lastMonth = "Feb";
  //   }
  //   if(bbandsMonth[1] == "03"){
  //      this.lastMonth = "Mar";
  //   }
  //   if(bbandsMonth[1] == "04"){
  //      this.lastMonth = "Apr";
  //   }
  //   if(bbandsMonth[1] == "05"){
  //      this.lastMonth = "May";
  //   }
  //   if(bbandsMonth[1] == "06"){
  //      this.lastMonth = "Jun";
  //   }
  //   if(bbandsMonth[1] == "07"){
  //      this.lastMonth = "Jul";
  //   }
  //   if(bbandsMonth[1] == "08"){
  //      this.lastMonth = "Aug";
  //   }
  //   if(bbandsMonth[1] == "09"){
  //      this.lastMonth = "Sep";
  //   }
  //   if(bbandsMonth[1] == "10"){
  //      this.lastMonth = "Oct";
  //   }
  //   if(bbandsMonth[1] == "11"){
  //      this.lastMonth = "Nov";
  //   }
  //   if(bbandsMonth[1] == "12"){
  //      this.lastMonth = "Dec";
  //   }
  //   this.lastDate = bbandsMonth[2]+" "+this.lastMonth+" "+bbandsMonth[0];
  // }
  async getBBandsDatafromFirebase(dbUrl){
    console.log("checkdata********", "getbbandsfromfirebase"); 
    let that = this;
    let BBands = {upper : [], middle : [], lower : []};
    let Rsi = {RSI:[], overBought:[], overSold:[]};
    let Macd = {MACD:[], MACDSignal:[], MACDHist:[]};
    let RSIxAxisArr = [];
    let BBANDSxAxisArr = [];
    let MACDxAxisArr = [];
    let timeSeriesClosePrice = []
    firebase.database().ref(dbUrl).once('value').then((data) => {
      if(dbUrl.includes("BBANDSv3")){
         var BBandsParseData = JSON.parse(data.val());
         var BBandsParseArr = Object.keys(BBandsParseData['Technical Analysis: BBANDS']).slice(0, 14);
        //  that.getFirstMonthCalculation(BBandsParseArr[0]);
        //  that.getLastMonthCalculation(BBandsParseArr[13]);

        
        var firstDate = Moment(BBandsParseArr[13]).format("DD MMM YY").toString();
        var secondDate = Moment(BBandsParseArr[9]).format("DD MMM YY").toString();
        var thirdDate = Moment(BBandsParseArr[5]).format("DD MMM YY").toString();
        var lastDate = Moment(BBandsParseArr[0]).format("DD MMM YY").toString();
        // this.setState({date:NewDate});
        BBANDSxAxisArr.push(firstDate);
        BBANDSxAxisArr.push('');
        BBANDSxAxisArr.push('');
        BBANDSxAxisArr.push('');
        BBANDSxAxisArr.push(secondDate);
        BBANDSxAxisArr.push('');
        BBANDSxAxisArr.push('');
        BBANDSxAxisArr.push('');
        BBANDSxAxisArr.push(thirdDate);
        BBANDSxAxisArr.push('');
        BBANDSxAxisArr.push('');
        BBANDSxAxisArr.push('');
        BBANDSxAxisArr.push('');
        BBANDSxAxisArr.push(lastDate);

        that.setState({BBANDSXAxis:BBANDSxAxisArr});


         BBandsParseArr.forEach(function(val){
            BBands.upper.push(parseFloat(BBandsParseData['Technical Analysis: BBANDS'][val]['Real Upper Band']))
            BBands.middle.push(parseFloat(BBandsParseData['Technical Analysis: BBANDS'][val]['Real Middle Band']))
            BBands.lower.push(parseFloat(BBandsParseData['Technical Analysis: BBANDS'][val]['Real Lower Band']))
         })
          let BBandsReverse = {upperReverse : [], middleReverse : [], lowerReverse : []};
          BBandsReverse.upperReverse = BBands.upper.reverse();
          BBandsReverse.middleReverse = BBands.middle.reverse();
          BBandsReverse.lowerReverse = BBands.lower.reverse();
          that.setState({BBANDS : BBandsReverse});
      }
      else if(dbUrl.includes("RSI")){
        var RSIParseData = JSON.parse(data.val());
        console.log("parse data RSI********", RSIParseData);
        var RSIParseArr = Object.keys(RSIParseData['Technical Analysis: RSI']).slice(0, 14);
        // that.getFirstMonthCalculation(RSIParseArr[0]);
        // that.getLastMonthCalculation(RSIParseArr[13]);
        console.log("parse Arr RSI********", RSIParseArr);

        var firstDate = Moment(RSIParseArr[13]).format("DD MMM YY").toString();
        var secondDate = Moment(RSIParseArr[9]).format("DD MMM YY").toString();
        var thirdDate = Moment(RSIParseArr[5]).format("DD MMM YY").toString();
        var lastDate = Moment(RSIParseArr[0]).format("DD MMM YY").toString();
        // this.setState({date:NewDate});
        RSIxAxisArr.push(firstDate);
        RSIxAxisArr.push('');
        RSIxAxisArr.push('');
        RSIxAxisArr.push('');
        RSIxAxisArr.push(secondDate);
        RSIxAxisArr.push('');
        RSIxAxisArr.push('');
        RSIxAxisArr.push('');
        RSIxAxisArr.push(thirdDate);
        RSIxAxisArr.push('');
        RSIxAxisArr.push('');
        RSIxAxisArr.push('');
        RSIxAxisArr.push('');
        RSIxAxisArr.push(lastDate);

        that.setState({RSIXAxis:RSIxAxisArr});

        RSIParseArr.forEach(function(val){
            Rsi.RSI.push(parseFloat(RSIParseData['Technical Analysis: RSI'][val]['RSI']))
        })
        for(i = 0; i < 14; i++){
            Rsi.overBought.push(70);
            Rsi.overSold.push(30);
        }
        let RsiReverse = {RSIReverse:[], overBoughtReverse:[], overSoldReverse:[]};
        RsiReverse.RSIReverse = Rsi.RSI.reverse();
        RsiReverse.overBoughtReverse = Rsi.overBought.reverse();
        RsiReverse.overSoldReverse = Rsi.overSold.reverse();
        that.setState({RSIGraph : RsiReverse});
      }
      else if(dbUrl.includes("MACD")){
        var MACDParseData = JSON.parse(data.val());
        console.log("parse data RSI********", MACDParseData);
        var MACDParseArr = Object.keys(MACDParseData['Technical Analysis: MACD']).slice(0, 14);
        // that.getFirstMonthCalculation(MACDParseArr[0]);
        // that.getLastMonthCalculation(MACDParseArr[13]);
        console.log("parse Arr MACD********", MACDParseArr);


        var firstDate = Moment(MACDParseArr[13]).format("DD MMM YY").toString();
        var secondDate = Moment(MACDParseArr[9]).format("DD MMM YY").toString();
        var thirdDate = Moment(MACDParseArr[5]).format("DD MMM YY").toString();
        var lastDate = Moment(MACDParseArr[0]).format("DD MMM YY").toString();
        // this.setState({date:NewDate});
        MACDxAxisArr.push(firstDate);
        MACDxAxisArr.push('');
        MACDxAxisArr.push('');
        MACDxAxisArr.push('');
        MACDxAxisArr.push(secondDate);
        MACDxAxisArr.push('');
        MACDxAxisArr.push('');
        MACDxAxisArr.push('');
        MACDxAxisArr.push(thirdDate);
        MACDxAxisArr.push('');
        MACDxAxisArr.push('');
        MACDxAxisArr.push('');
        MACDxAxisArr.push('');
        MACDxAxisArr.push(lastDate);

        that.setState({MACDXAxis:MACDxAxisArr});


        MACDParseArr.forEach(function(val){
          Macd.MACD.push(parseFloat(MACDParseData['Technical Analysis: MACD'][val]['MACD']));
          Macd.MACDSignal.push(parseFloat(MACDParseData['Technical Analysis: MACD'][val]['MACD_Signal']));
          Macd.MACDHist.push(parseFloat(MACDParseData['Technical Analysis: MACD'][val]['MACD_Hist']));
        })
        let MacdReverse = {MACDReverse:[], MACDSignalReverse:[], MACDHistReverse:[]};
        MacdReverse.MACDReverse = Macd.MACD.reverse();
        MacdReverse.MACDSignalReverse = Macd.MACDSignal.reverse();
        MacdReverse.MACDHistReverse = Macd.MACDHist.reverse();
        that.setState({MACDGraph : MacdReverse});
      }
      else if(dbUrl.includes("TSDv3")){
        var timeSeriesDailyAdjustedData = JSON.parse(data.val());
        console.log("parse data time series********", timeSeriesDailyAdjustedData);
        var timeSeriesDailyAdjustedArr = Object.keys(timeSeriesDailyAdjustedData['Time Series (Daily)']).slice(0, 14);
        timeSeriesDailyAdjustedArr.forEach(function(val){
          timeSeriesClosePrice.push(parseFloat(timeSeriesDailyAdjustedData['Time Series (Daily)'][val]['5. adjusted close']));
        })
        that.adjusted_close = timeSeriesClosePrice.reverse();
      }
      let stat = that.state;
      stat.loading = false;
      that.setState(stat);
    }).catch((err)=>{
      console.log("this is error", err);
      stat.loading = false;
    });
  }
  // getFirstMonthCalculation(date){
  //   var bbandsMonth = date.split("-");
  //   if(bbandsMonth[1] == "01"){
  //      this.firstMonth = "Jan";
  //   }
  //   if(bbandsMonth[1] == "02"){
  //      this.firstMonth = "Feb";
  //   }
  //   if(bbandsMonth[1] == "03"){
  //      this.firstMonth = "Mar";
  //   }
  //   if(bbandsMonth[1] == "04"){
  //      this.firstMonth = "Apr";
  //   }
  //   if(bbandsMonth[1] == "05"){
  //      this.firstMonth = "May";
  //   }
  //   if(bbandsMonth[1] == "06"){
  //      this.firstMonth = "Jun";
  //   }
  //   if(bbandsMonth[1] == "07"){
  //      this.firstMonth = "Jul";
  //   }
  //   if(bbandsMonth[1] == "08"){
  //      this.firstMonth = "Aug";
  //   }
  //   if(bbandsMonth[1] == "09"){
  //      this.firstMonth = "Sep";
  //   }
  //   if(bbandsMonth[1] == "10"){
  //      this.firstMonth = "Oct";
  //   }
  //   if(bbandsMonth[1] == "11"){
  //      this.firstMonth = "Nov";
  //   }
  //   if(bbandsMonth[1] == "12"){
  //      this.firstMonth = "Dec";
  //   }
  //   this.firstDate = bbandsMonth[2]+" "+this.firstMonth+" "+bbandsMonth[0];
  // }

  // getLastMonthCalculation(date){
  //   var bbandsMonth = date.split("-");
  //   if(bbandsMonth[1] == "01"){
  //      this.lastMonth = "Jan";
  //   }
  //   if(bbandsMonth[1] == "02"){
  //      this.lastMonth = "Feb";
  //   }
  //   if(bbandsMonth[1] == "03"){
  //      this.lastMonth = "Mar";
  //   }
  //   if(bbandsMonth[1] == "04"){
  //      this.lastMonth = "Apr";
  //   }
  //   if(bbandsMonth[1] == "05"){
  //      this.lastMonth = "May";
  //   }
  //   if(bbandsMonth[1] == "06"){
  //      this.lastMonth = "Jun";
  //   }
  //   if(bbandsMonth[1] == "07"){
  //      this.lastMonth = "Jul";
  //   }
  //   if(bbandsMonth[1] == "08"){
  //      this.lastMonth = "Aug";
  //   }
  //   if(bbandsMonth[1] == "09"){
  //      this.lastMonth = "Sep";
  //   }
  //   if(bbandsMonth[1] == "10"){
  //      this.lastMonth = "Oct";
  //   }
  //   if(bbandsMonth[1] == "11"){
  //      this.lastMonth = "Nov";
  //   }
  //   if(bbandsMonth[1] == "12"){
  //      this.lastMonth = "Dec";
  //   }
  //   this.lastDate = bbandsMonth[2]+" "+this.lastMonth+" "+bbandsMonth[0];
  // }

 
  render() {
    let bottomImg = require('./../../../assets/images/loginTop.png');
    let SearchImg = require('./../../../assets/images/serach_icon.png');
    let MenuImg = require('./../../../assets/images/hamberger_icon.png');
    let back = require('./../../../assets/images/back-arrow.png');
    let uparr = require('./../../../assets/images/caret-arrow-up.png');
    let downarr = require('./../../../assets/images/sort-down.png'); 
    let doubleDash = require('./../../../assets/images/doubleDash1.png');
       if(this.state.Heigh==1){
            img=uparr;
        }
       else if(this.state.Heigh==0){
            img=doubleDash;
        }
       else if(this.state.Heigh==2){
            img=downarr;
        }
    let that = this;
    console.log("date**3***", this.state.volume);
    var conf = {
            
            title: {
                text: 'Bollinger Bands Graph'
            },
            xAxis: {
                 
                plotLines: [{
                  value: 0,
                  width: 1,
                  color: '#808080'
                }],
               // categories: [that.state.currentDate]
               categories: that.state.BBANDSXAxis,
            },
            yAxis: {
              title: {
                  text: null
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            credits: {
              enabled: false
            },
            series: [{
                name: 'over-bought',
                color: '#ff0000',
                data: (function () {
                  
                    var data = that.state.BBANDS.upperReverse;
                  
                    return data;
                }())
            },
            {
              name: 'middle data',
              color: '#000000',
              data: (function () {
                 
                  var data = that.state.BBANDS.middleReverse;
                
                  return data;
              }())
          },
          {
            name: 'over-sold',
            color: '#ff0000',
            data: (function () {
              
                var data = that.state.BBANDS.lowerReverse;
            
                return data;
            }())
          },
          {
            name: 'adjusted close price',
            color: '#0000ff',
            data: (function () {
             
                var data = that.adjusted_close;
               
                return data;
            }())
          }
        ]
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

    var RSIConf = {
    
      title: {
          text: 'RSI Graph'
      },
      xAxis: {
        
          // title: {
          //   text: 'Value'
          // },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080',
          }],
          //categories: [that.state.currentDate]
          categories: that.state.RSIXAxis,
          // categories:['22-07-2019', '','','','','', '20-07-2019', '18-07-2019', '16-07-2019'],
      },
      yAxis: {
          title: {
              text: null
          },
          plotLines: [{
              value: 0,
              width: 1,
              color: '#808080'
          }]
      },
      credits: {
        enabled: false
      },
      legend: {
          enabled: false
      },
      exporting: {
          enabled: false
      },
      series: [{
          name: 'RSI data',
          color: '#000000',
          data: (function () {
            
              var data = that.state.RSIGraph.RSIReverse;
              console.log("data********", data);
            
              return data;
          }())
      },
      {
        name: 'over-bought',
        color: '#ff0000',
        data: (function () {
            var data = that.state.RSIGraph.overBoughtReverse
            return data;
        }())
    },
    {
      name: 'over-sold',
      color: '#ff0000',
      data: (function () {
         
          var data = that.state.RSIGraph.overSoldReverse;
         
          return data;
      }())
    }]
  };
  const RSIOptions = {
    global: {
        useUTC: false
    },
    lang: {
        decimalPoint: '.',
        thousandsSep: '.'
    }
  };
  var MACDConf = {
    
    title: {
        text: 'MACD Graph'
    },
    xAxis: {
        
        // title: {
        //   text: 'Value'
        // },
        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }],
       // categories: [that.state.currentDate]
       categories: that.state.BBANDSXAxis,
    },
    yAxis: {
        // title: {
        //     text: 'Value'
        // },
        title: {
          text: null
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
   
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    credits: {
      enabled: false
    },
    series: [{
        name: '9-days signal',
        color: '#ff0000',
        data: (function () {
            
            var data = that.state.MACDGraph.MACDSignalReverse;
            console.log("data********", data);
           
            return data;
        }())
    },
    {
      name: '12 & 26-days period',
      color: '#0000ff',
      data: (function () {
          
          var data = that.state.MACDGraph.MACDReverse
         
          return data;
      }())
  },
  {
    name: 'MACD Hist',
    // color: '#ff0000',
    color: '#000000',
    data: (function () {
        
        var data = that.state.MACDGraph.MACDHistReverse;
       
        return data;
    }())
  }]
};
const MACDOptions = {
  global: {
      useUTC: false
  },
  lang: {
      decimalPoint: '.',
      thousandsSep: '.'
  }
};
let data=null; 
 console.log(this.state.status);
  if(this.state.status=='true')
  {
    data= (
     <View style={{height:300}}>
      <View style={styles.topmenu}>
      <View>  
        <TouchableOpacity onPress={this.back.bind(this)}> 
          <Image source={back} style={{ width:30,height:30 }}></Image>      
        </TouchableOpacity>
      </View>
        <View style={styles.homeText}><Text style={styles.tophome}>{this.state.Screen}  </Text></View>
      </View>
      <View style={styles.homeView}>
        <View style={styles.homeView1}><Text style={styles.sec} >Sell $  </Text></View>   
        <View style={styles.homeView2}><Text style={styles.sec1}>Buy $ </Text></View>
      </View> 
      <View style={styles.listing}> 
          <View style={styles.SecondeText}><Text style={styles.listingText} >{this.state.Sell }</Text></View> 
          <View style={styles.SecondeText1}>         
                    <View><Text style={styles.subListing} >{this.state.symbolName} </Text></View>
                   <View style={{flex:1,flexDirection:'row'}}>
                    <Image style={styles.iconColor} source={img} ></Image>
                    <Text style={styles.listingText1} >{parseFloat(this.state.Close).toFixed(3)}</Text>
                   </View>
                  </View>
          <View style={[styles.SecondeText, styles.pullRight]}><Text style={styles.listingText} >{this.state.Buy}  </Text>
          </View>
       </View>
       <View style = {styles.lotsHeader}>
        <View style = {styles.lotsHeader2}>
         <View style = {styles.lots}>     
          < Text style = {styles.enterLots}>Enter Lots</Text>
          
         </View>
      <View style = {styles.inputLots}>           
       <TextInput style={styles.butinput} keyboardType = 'numeric' placeholder='1 lot = 100 units'  onChangeText={this.InputPoints.bind(this)} value={this.state.DreamAmount} />
      </View>
      </View>
      <View  style={styles.buttonLogin} >
        <TouchableOpacity style={styles.buttonStyle} onPress={this.submit.bind(this)}> 
         <Text style={styles.buttonText}>{this.state.Screen =='Buy' ? 'Buy Now' : 'Sell Now'} </Text>
        </TouchableOpacity>      
    </View>   
    </View>
    
    </View>
);
  var data1=(  <View style={styles.homeView}>
    <View style={styles.homeView1}><Text style={styles.homeViewtext} >Cash on hand (Before) </Text></View>
    <View style={styles.homeView2}><Text style={styles.homeViewtext2}>{this.state.user ? this.numberWithCommas(Math.round(this.state.user.points)) : this.numberWithCommas(this.state.defaultPoint)} </Text></View>
  </View>);
  var data2=( <View style={styles.homeView}>
    <View style={styles.homeView1}><Text style={styles.homeViewtext} >Cash on hand (After)</Text></View>
    <View style={styles.homeView2}><Text style={styles.homeViewtext2}> {this.state.Balance=='' ?  (this.state.user ? this.numberWithCommas(Math.round(this.state.user.points)) : this.numberWithCommas(this.state.defaultPoint)) : this.numberWithCommas(Math.round(this.state.Balance)) } </Text></View>
  
  </View> );
  }
  else if(this.state.status=='false'){
    data= (
     <View style={{height:290}}>
      <View style={styles.topmenu}>
      <View>  
        <TouchableOpacity onPress={this.back.bind(this)}> 
          <Image source={back} style={{ width:30,height:30 }}></Image>      
        </TouchableOpacity>
      </View>
        <View style={styles.homeText}><Text style={styles.tophome}>{this.state.Screen}  </Text></View>
      </View>
      <View style={styles.homeView}>
        <View style={styles.homeView1}><Text style={styles.sec} >Sell $  </Text></View>   
        <View style={styles.homeView2}><Text style={styles.sec1}>Buy $ </Text></View>
      </View> 
      <View style={styles.listing}> 
          <View style={styles.SecondeText}><Text style={styles.listingText} >{this.state.Buy}</Text></View> 
          <View style={styles.SecondeText1}>         
                    <View><Text style={styles.subListing} >{this.state.symbolName} </Text></View>
                    <View style={{flex:1,flexDirection:'row'}}><Image style={styles.iconColor} source={img}></Image>
                    <Text style={styles.listingText1} >{parseFloat(this.state.Close).toFixed(3)}</Text></View>
                    </View>
          <View style={[styles.SecondeText, styles.pullRight]}><Text style={styles.listingText} >{this.state.Sell}  </Text>
          </View>
       </View> 
       <View style = {styles.lotsHeader}>
        <View style = {styles.lotsHeader2}>
         <View style = {styles.lots}>     
          < Text style = {styles.enterLots}>Enter Lots</Text>
          
         </View>
      <View style = {styles.inputLots}>           
       <TextInput
              style={styles.butinput} keyboardType = 'numeric' placeholder='1 lot = 100 units'  onChangeText={this.InputPoints.bind(this)}
              value={this.state.DreamAmount}
              />
      </View>
      </View>
      <View  style={styles.buttonLogin} >
        <TouchableOpacity style={styles.buttonStyle} onPress={this.submit.bind(this)}> 
         <Text style={styles.buttonText}>{this.state.Screen =='Buy' ? 'Buy Now' : 'Sell Now'} </Text>
        </TouchableOpacity>      
    </View>   
    </View>  
    </View>
);
 
  }  
  let cost=null;
  if(this.state.Screen=='Sell'){
    cost=(  <View style={styles.homeView}>
      <View style={styles.homeView1}><Text style={styles.homeViewtext}>Total {this.state.Screen}</Text></View>
      <View style={styles.homeView2}><Text style={styles.homeViewtextSell}>{this.state.InputPoints ? this.numberWithCommas(Math.round(parseFloat(this.state.InputPoints))): parseInt(0)} </Text></View>
    </View> );
  }else{
 cost=(  <View style={styles.homeView}>
    <View style={styles.homeView1}><Text style={styles.homeViewtext}>Total {this.state.Screen} Cost</Text></View>
    <View style={styles.homeView2}><Text style={styles.homeViewtext1}>{this.state.InputPoints ? '('+this.numberWithCommas(Math.round(parseFloat(this.state.InputPoints)))+')': '('+parseFloat(0).toFixed(2)+')'} </Text></View>
  </View> );
  }
  return (
   

    <View style={{flex:1}}>
      {data}
      <ScrollView contentContainerStyle={styles.container}>
       {data1}
       {cost}
        {/* <View style={styles.homeView}>
          <View style={styles.homeView1}><Text style={styles.homeViewtext}>Total {this.state.Screen} Cost</Text></View>
          <View style={styles.homeView2}><Text style={styles.homeViewtext1}>{this.state.InputPoints ? '('+this.commafy(parseFloat(this.state.InputPoints).toFixed(2))+')': '('+parseFloat(0).toFixed(2)+')'} </Text></View>
        </View>  */}
        <View style={styles.homeView}>
          <View style={styles.homeView1}><Text style={styles.homeViewtext}>Transaction Fees</Text></View>
          <View style={styles.homeView2}><Text style={styles.homeViewtext1}>{this.state.transation ? '('+this.numberWithCommas(Math.round(this.state.transation))+')' : '(0)'} </Text></View>
        </View> 
       {data2}
       <View style={styles.homeView}>     
          <View style={styles.homeView1}><Text style={styles.Technical} >Technical Analysis</Text></View>  
          <View style={styles.homeView2}><Text style={styles.subListing} >{this.state.date1}</Text></View>        
        </View>
        <View style={{flex:1,flexDirection:'row',padding:2}}>
          <View style={{flex:2, alignItems:'flex-start'}}>
            <Text style={{ color: '#000000',padding:8 }} >Symbol : {this.state.Symbol.replace("-",".")} </Text>
            <Text style={styles.homeViewtext} >Volume : {this.commafy(this.state.volume)} </Text>
            {this.state.dividentValue == 'N/A' ? <Text style={{ color: '#000000', padding:8}} >Last Div = {this.state.dividentDate}, {this.state.dividentValue}</Text> 
            : <Text style={{ color: '#000000', padding:8}} >Last Div = {this.state.dividentDate}, {this.state.dividentValue} /unit</Text>}

            {/* commented by souvik..
            <Text style={{ color: '#000000', padding:8}} >Last Div = {this.state.dividentDate}, {this.state.dividentValue} /unit</Text> */}

            <Text style={{ color: '#000000' ,padding:8}} >Last Split = {this.state.splitcoffeDate}, {this.state.splitcoffee} </Text>
          </View>
          <View style={{flex:1, alignItems:'flex-end'}}>
            <Text style={{ color: '#000000' ,padding:8}} >Open: {parseFloat (this.state.open).toFixed(2)}</Text>
            <Text style={{ color: '#000000',padding:8}} >High: {parseFloat(this.state.hie).toFixed(2)}</Text> 
            <Text style={{ color: '#000000' ,padding:8}}> Low: {parseFloat(this.state.low).toFixed(2)}</Text>
            <View style={styles.SecondeText2}>
              <View  >
               <Text style={{ color: '#000000' }}><Image source={img} style={{ width: 20 , height: 20 , marginRight:10}}></Image> : {parseFloat(this.state.valueforheighandlow).toFixed(2)}   </Text>   
              </View>
              <View  >
                <Text style={{ color: '#000000' }} >  {parseFloat((this.state.valueforheighandlow/this.state.lastCloseprice1)*100).toFixed(2)}%</Text>                 
              </View> 
            </View>
          </View>
        </View> 
        <ChartView originWhitelist={['']} javaScriptEnabled={true} domStorageEnabled={true} style={{height:300, width : "100%"}} config={conf} options={options}></ChartView>
        {/* <View style={{flex:1, flexDirection:'row', padding:10}}>
        <Text style={{width:'50%', textAlign:'left'}}>{this.lastDate}</Text>
          <Text style={{width:'50%', textAlign:'right'}}>{this.firstDate}</Text>
        </View> */}
        <ChartView originWhitelist={['']} javaScriptEnabled={true} domStorageEnabled={true} style={{height:300, width : "100%"}} config={RSIConf} options={RSIOptions}></ChartView>
        {/* <View style={{flex:1, flexDirection:'row', padding:10}}>
        <Text style={{width:'50%', textAlign:'left'}}>{this.lastDate}</Text>
          <Text style={{width:'50%', textAlign:'right'}}>{this.firstDate}</Text>
        </View> */}
        <ChartView originWhitelist={['']} javaScriptEnabled={true} domStorageEnabled={true} style={{height:300, width : "100%"}} config={MACDConf} options={MACDOptions}></ChartView>
        {/* <View style={{flex:1, flexDirection:'row', padding:10}}>
        <Text style={{width:'50%', textAlign:'left'}}>{this.lastDate}</Text>
          <Text style={{width:'50%', textAlign:'right'}}>{this.firstDate}</Text>
        </View> */}
       <ProgressDialog
          visible={this.state.loading}
          message="Please Wait.." >
          <View>
              
          </View>
        </ProgressDialog>
       
        <ProgressDialog
          visible={this.state.dialogVisible}
          message="Please Wait.." >    
          <View>
              
          </View>
        </ProgressDialog>
        
      </ScrollView>
      </View>

);
  }

}

export default BuySellScreen;