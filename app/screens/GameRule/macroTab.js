import React, { PropTypes } from 'react';
import { TouchableOpacity,ScrollView, Text,View, StyleSheet } from 'react-native';
import Constants from '../../config/constant';
import { Dimensions } from 'react-native';
import firebase from 'react-native-firebase';
import Moment from 'moment';

class macroTab extends React.Component
{
  constructor(props) {
    super(props);
    this.state = {
      // sectorDataArr:[],
      // sectorParseData:[],
      RealEstateDay1:"",
      InformationTechnologyDay1 :"",
      HealthCareDay1:"",
      CommunicationServicesDay1:"",
      IndustrialsDay1:"",
      FinancialsDay1:"",
      UtilitiesDay1:"",
      ConsumerDiscretionaryDay1:"",
      ConsumerStaplesDay1:"",
      MaterialsDay1:"",
      EnergyDay1:"",

      RealEstateDay5:"",
      InformationTechnologyDay5 :"",
      HealthCareDay5:"",
      CommunicationServicesDay5:"",
      IndustrialsDay5:"",
      FinancialsDay5:"",
      UtilitiesDay5:"",
      ConsumerDiscretionaryDay5:"",
      ConsumerStaplesDay5:"",
      MaterialsDay5:"",
      EnergyDay5:"",

      RealEstateDay30:"",
      InformationTechnologyDay30 :"",
      HealthCareDay30:"",
      CommunicationServicesDay30:"",
      IndustrialsDay30:"",
      FinancialsDay30:"",
      UtilitiesDay30:"",
      ConsumerDiscretionaryDay30:"",
      ConsumerStaplesDay30:"",
      MaterialsDay30:"",
      EnergyDay30:"",

      RealEstateDay90:"",
      InformationTechnologyDay90 :"",
      HealthCareDay90:"",
      CommunicationServicesDay90:"",
      IndustrialsDay90:"",
      FinancialsDay90:"",
      UtilitiesDay90:"",
      ConsumerDiscretionaryDay90:"",
      ConsumerStaplesDay90:"",
      MaterialsDay90:"",
      EnergyDay90:"",

      curdate:'',
      // prevDate:'',
      // prevDate1:'',
      // prevDate2:'',
      // prevDate3:'',
    }
    
    firebase.config().enableDeveloperMode();
    this.hitSectorFirebase();
  }   
  
  // ifSectorDataExist(url, next){
  //   firebase.database().ref(url).once('value').then((data) => {
  //     next(data.exists());
  //   }).catch((err)=>{
  //     next(false);
  //   });
  // }

  componentDidMount() {
    this.todayDate();
  }

 ifSectorDataExist(url, next){
    firebase.database().ref(url).once('value').then((data) => {
      if(data.val()){
         let firebaseData = JSON.parse(data.val())
        //  console.log("url is********", firebaseData['Meta Data']['Last Refreshed'].split("ET ")[1]);
         if(url.includes("SECTORv3")){
            // if((firebaseData['Meta Data']['Last Refreshed'].split("ET ")[1] == this.state.curdate) || (firebaseData['Meta Data']['Last Refreshed'].split("ET ")[1] == this.state.prevDate)){
            //     next(true);
            // }
            // else{
            //     next(false);
            // }
            if(firebaseData['date'] == this.state.curdate){
                next(true);
            }
            else{
                next(false);
            }
         }
      }
      else{
        next(false);
      }
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
    // let previousDate = Moment(pDD).format('MM/DD/YYYY');
    // let previousDate1 = Moment(pDD1).format('MM/DD/YYYY');
    // let previousDate2 = Moment(pDD2).format('MM/DD/YYYY');
    // let previousDate3 = Moment(pDD3).format('MM/DD/YYYY');
    this.setState({curdate:DD});
    // this.setState({prevDate:previousDate});
    // this.setState({prevDate1:previousDate1});
    // this.setState({prevDate2:previousDate2});
    // this.setState({prevDate3:previousDate3});
    console.log("date************", DD);
  }

  hitSectorFirebase(){
    let dbUrl = "SECTORv3"; 
    let that = this;
    let alphaUrl;  
    this.ifSectorDataExist(dbUrl, function(data){
      that.getSectorFromFirebase(dbUrl);
      // if(!data){
      //   alphaUrl = Constants.GET_SECTOR_URL();
      //   that.getSectorFromAlpha(alphaUrl, dbUrl);
      // }else{
       
     // }
    });
  }

  // async getSectorFromAlpha(alphaUrl, dbUrl){
  //   let that = this;
  //   let result = await fetch(alphaUrl).then(response => response.json());
  //   result['date'] = this.state.curdate;
  //   if(result['Meta Data']){
  //     firebase.database().ref(dbUrl).set(JSON.stringify(result)).then(() => {
  //       console.log("successfully inserted")
  //       that.getSectorFromFirebase(dbUrl);
  //     }).catch((error) => {
  //       console.log(error);
  //     });
  //   }
  //   else{
  //     alert("Your daily limit has exceeded");
  //   }
  // }
  
  async getSectorFromFirebase(dbUrl){
    // let sectorData = [];
 
    let that = this;
    firebase.database().ref(dbUrl).once('value').then((data) => {
      var sectorParseData = JSON.parse(data.val());
      // sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Real Estate'], type:"day1"});
      // sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Information Technology'], type:"day1"});
      // sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Health Care'], type:"day1"});
      // sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Communication Services'], type:"day1"});
      // sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Industrials'], type:"day1"});
      // sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Financials'], type:"day1"});
      // sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Utilities'], type:"day1"});
      // sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Consumer Discretionary'], type:"day1"});
      // sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Consumer Staples'], type:"day1"});
      // sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Materials'], type:"day1"});
      // sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Energy'], type:"day1"});

      // sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Real Estate'], type:"day5"});
      // sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Information Technology'], type:"day5"});
      // sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Health Care'], type:"day5"});
      // sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Communication Services'], type:"day5"});
      // sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Industrials'], type:"day5"});
      // sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Financials'], type:"day5"});
      // sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Utilities'], type:"day5"});
      // sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Consumer Discretionary'], type:"day5"});
      // sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Consumer Staples'], type:"day5"});
      // sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Materials'], type:"day5"});
      // sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Energy'], type:"day5"});

      // sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Real Estate'], type:"day30"});
      // sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Information Technology'], type:"day30"});
      // sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Health Care'], type:"day30"});
      // sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Communication Services'], type:"day30"});
      // sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Industrials'], type:"day30"});
      // sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Financials'], type:"day30"});
      // sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Utilities'], type:"day30"});
      // sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Consumer Discretionary'], type:"day30"});
      // sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Consumer Staples'], type:"day30"});
      // sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Materials'], type:"day30"});
      // sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Energy'], type:"day30"});

      // sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Real Estate'], type:"day90"});
      // sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Information Technology'], type:"day90"});
      // sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Health Care'], type:"day90"});
      // sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Communication Services'], type:"day90"});
      // sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Industrials'], type:"day90"});
      // sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Financials'], type:"day90"});
      // sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Utilities'], type:"day90"});
      // sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Consumer Discretionary'], type:"day90"});
      // sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Consumer Staples'], type:"day90"});
      // sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Materials'], type:"day90"});
      // sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Energy'], type:"day90"});

      // that.setState({sectorDataArr:sectorData});

      that.setState({RealEstateDay1: sectorParseData['Rank B: 1 Day Performance']['Real Estate']});
      that.setState({InformationTechnologyDay1: sectorParseData['Rank B: 1 Day Performance']['Information Technology']});
      that.setState({HealthCareDay1: sectorParseData['Rank B: 1 Day Performance']['Health Care']});
      that.setState({CommunicationServicesDay1: sectorParseData['Rank B: 1 Day Performance']['Communication Services']});
      that.setState({IndustrialsDay1: sectorParseData['Rank B: 1 Day Performance']['Industrials']});
      that.setState({FinancialsDay1: sectorParseData['Rank B: 1 Day Performance']['Financials']});
      that.setState({UtilitiesDay1: sectorParseData['Rank B: 1 Day Performance']['Utilities']});
      that.setState({ConsumerDiscretionaryDay1: sectorParseData['Rank B: 1 Day Performance']['Consumer Discretionary']});
      that.setState({ConsumerStaplesDay1: sectorParseData['Rank B: 1 Day Performance']['Consumer Staples']});
      that.setState({MaterialsDay1:sectorParseData['Rank B: 1 Day Performance']['Materials']});
      that.setState({EnergyDay1: sectorParseData['Rank B: 1 Day Performance']['Energy']});

      that.setState({RealEstateDay5: sectorParseData['Rank C: 5 Day Performance']['Real Estate']});
      that.setState({InformationTechnologyDay5: sectorParseData['Rank C: 5 Day Performance']['Information Technology']});
      that.setState({HealthCareDay5: sectorParseData['Rank C: 5 Day Performance']['Health Care']});
      that.setState({CommunicationServicesDay5: sectorParseData['Rank C: 5 Day Performance']['Communication Services']});
      that.setState({IndustrialsDay5: sectorParseData['Rank C: 5 Day Performance']['Industrials']});
      that.setState({FinancialsDay5: sectorParseData['Rank C: 5 Day Performance']['Financials']});
      that.setState({UtilitiesDay5: sectorParseData['Rank C: 5 Day Performance']['Utilities']});
      that.setState({ConsumerDiscretionaryDay5: sectorParseData['Rank C: 5 Day Performance']['Consumer Discretionary']});
      that.setState({ConsumerStaplesDay5: sectorParseData['Rank C: 5 Day Performance']['Consumer Staples']});
      that.setState({MaterialsDay5:sectorParseData['Rank C: 5 Day Performance']['Materials']});
      that.setState({EnergyDay5: sectorParseData['Rank C: 5 Day Performance']['Energy']});

      that.setState({RealEstateDay30: sectorParseData['Rank D: 1 Month Performance']['Real Estate']});
      that.setState({InformationTechnologyDay30: sectorParseData['Rank D: 1 Month Performance']['Information Technology']});
      that.setState({HealthCareDay30: sectorParseData['Rank D: 1 Month Performance']['Health Care']});
      that.setState({CommunicationServicesDay30: sectorParseData['Rank D: 1 Month Performance']['Communication Services']});
      that.setState({IndustrialsDay30: sectorParseData['Rank D: 1 Month Performance']['Industrials']});
      that.setState({FinancialsDay30: sectorParseData['Rank D: 1 Month Performance']['Financials']});
      that.setState({UtilitiesDay30: sectorParseData['Rank D: 1 Month Performance']['Utilities']});
      that.setState({ConsumerDiscretionaryDay30: sectorParseData['Rank D: 1 Month Performance']['Consumer Discretionary']});
      that.setState({ConsumerStaplesDay30: sectorParseData['Rank D: 1 Month Performance']['Consumer Staples']});
      that.setState({MaterialsDay30:sectorParseData['Rank D: 1 Month Performance']['Materials']});
      that.setState({EnergyDay30: sectorParseData['Rank D: 1 Month Performance']['Energy']});

      that.setState({RealEstateDay90: sectorParseData['Rank E: 3 Month Performance']['Real Estate']});
      that.setState({InformationTechnologyDay90: sectorParseData['Rank E: 3 Month Performance']['Information Technology']});
      that.setState({HealthCareDay90: sectorParseData['Rank E: 3 Month Performance']['Health Care']});
      that.setState({CommunicationServicesDay90: sectorParseData['Rank E: 3 Month Performance']['Communication Services']});
      that.setState({IndustrialsDay90: sectorParseData['Rank E: 3 Month Performance']['Industrials']});
      that.setState({FinancialsDay90: sectorParseData['Rank E: 3 Month Performance']['Financials']});
      that.setState({UtilitiesDay90: sectorParseData['Rank E: 3 Month Performance']['Utilities']});
      that.setState({ConsumerDiscretionaryDay90: sectorParseData['Rank E: 3 Month Performance']['Consumer Discretionary']});
      that.setState({ConsumerStaplesDay90: sectorParseData['Rank E: 3 Month Performance']['Consumer Staples']});
      that.setState({MaterialsDay90:sectorParseData['Rank E: 3 Month Performance']['Materials']});
      that.setState({EnergyDay90: sectorParseData['Rank E: 3 Month Performance']['Energy']});

    }).catch((err)=>{
      console.log("this is error", err);
    });
   
  }
 
  render()
  {
    // let elem =  this.state.sectorDataArr.map((val, index)=>{
    //   return (
    //     <Text key={index}>{val.data}</Text>
    //   ) 
    // });
   
   return(
  <ScrollView contentContainerStyle={Styles.container}>
  {
  //  elem
  }
  {/* <View style={Styles.notes}>
     <Text style={Styles.notesHeading}>Notes : </Text>
     <Text style={Styles.notesText}>Survival years is calculated using current monthly expenses. You are encouraged to build passive income from other sources like rental from property, annvity, pension, etc.</Text>
  </View> */}
  <View style={Styles.containerr}>
    <View style={Styles.grid}>
      <Text>Industry performance for S&P 500 in U.S.A. Use as a proxy for other markets</Text>
    </View>
    <View style={{flex:1,flexDirection:'row', borderBottomWidth:1,   borderBottomColor:"#e4e1e1",backgroundColor:'#ececec', marginLeft:10,marginRight:10,paddingBottom:10}}>
     <View style={Styles.headingGridN1}>
      <View style={Styles.headingGridN}>
         <View style={{flex:1.2}}>
           <Text style={Styles.headText}>No.</Text>
         </View>
         <View style={Styles.headingGridI}>
           <Text style={Styles.headText}>Industry</Text>
         </View>
         <View style={Styles.headingGrid1}>
           <Text style={Styles.headText}>1 Day</Text>
         </View>
         <View style={Styles.headingGrid5}>
           <Text style={Styles.headText}>5 Days</Text>
         </View>
         <View style={Styles.headingGrid1m}>
           <Text style={Styles.headText}>1 Mth</Text>
         </View>
         <View style={Styles.headingGrid5m}>
           <Text style={Styles.headText}>3 Mths</Text>
         </View>
      </View>
       <View style={Styles.headingGridN}>
         <View style={{flex:1.2}}>
           <Text style={Styles.colll}>1.</Text>
         </View>
         <View style={Styles.headingGridI}>
           <Text style={Styles.colll}>Comm</Text>
         </View>
         <View style={Styles.headingGrid1}>
           <Text style={(this.state.CommunicationServicesDay1.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.CommunicationServicesDay1}</Text>
         </View>
         <View style={Styles.headingGrid5}>
           <Text style={(this.state.CommunicationServicesDay5.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.CommunicationServicesDay5}</Text>
         </View>
         <View style={Styles.headingGrid1m}>
           <Text style={(this.state.CommunicationServicesDay30.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.CommunicationServicesDay30}</Text>
         </View>
         <View style={Styles.headingGrid5m}>
           <Text style={(this.state.CommunicationServicesDay90.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.CommunicationServicesDay90}</Text>
         </View>
      </View>
       <View style={Styles.headingGridN}>
         <View style={{flex:1.2}}>
           <Text style={Styles.colll}>2.</Text>
         </View>
         <View style={Styles.headingGridI}>
           <Text style={Styles.colll}>Consumer D</Text>
         </View>
         <View style={Styles.headingGrid1}>
           <Text style={(this.state.ConsumerDiscretionaryDay1.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.ConsumerDiscretionaryDay1}</Text>
         </View>
         <View style={Styles.headingGrid5}>
           <Text style={(this.state.ConsumerDiscretionaryDay5.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.ConsumerDiscretionaryDay5}</Text>
         </View>
         <View style={Styles.headingGrid1m}>
           <Text style={(this.state.ConsumerDiscretionaryDay30.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.ConsumerDiscretionaryDay30}</Text>
         </View>
         <View style={Styles.headingGrid5m}>
           <Text style={(this.state.ConsumerDiscretionaryDay90.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.ConsumerDiscretionaryDay90}</Text>
         </View>
      </View>
      <View style={Styles.headingGridN}>
         <View style={{flex:1.2}}>
           <Text style={Styles.colll}>3.</Text>
         </View>
         <View style={Styles.headingGridI}>
           <Text style={Styles.colll}>Consumer S</Text>
         </View>
         <View style={Styles.headingGrid1}>
           <Text style={(this.state.ConsumerStaplesDay1.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.ConsumerStaplesDay1}</Text>
         </View>
         <View style={Styles.headingGrid5}>
           <Text style={(this.state.ConsumerStaplesDay5.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.ConsumerStaplesDay5}</Text>
         </View>
         <View style={Styles.headingGrid1m}>
           <Text style={(this.state.ConsumerStaplesDay30.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.ConsumerStaplesDay30}</Text>
         </View>
         <View style={Styles.headingGrid5m}>
           <Text style={(this.state.ConsumerStaplesDay90.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.ConsumerStaplesDay90}</Text>
         </View>
      </View>
      <View style={Styles.headingGridN}>
         <View style={{flex:1.2}}>
           <Text style={Styles.colll}>4.</Text>
         </View>
         <View style={Styles.headingGridI}>
           <Text style={Styles.colll}>Energy</Text>
         </View>
         <View style={Styles.headingGrid1}>
           <Text style={(this.state.EnergyDay1.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.EnergyDay1}</Text>
         </View>
         <View style={Styles.headingGrid5}>
           <Text style={(this.state.EnergyDay5.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.EnergyDay5}</Text>
         </View>
         <View style={Styles.headingGrid1m}>
           <Text style={(this.state.EnergyDay30.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.EnergyDay30}</Text>
         </View>
         <View style={Styles.headingGrid5m}>
           <Text style={(this.state.EnergyDay90.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.EnergyDay90}</Text>
         </View>
      </View>
      <View style={Styles.headingGridN}>
         <View style={{flex:1.2}}>
           <Text style={Styles.colll}>5.</Text>
         </View>
         <View style={Styles.headingGridI}>
           <Text style={Styles.colll}>Financials</Text>
         </View>
         <View style={Styles.headingGrid1}>
           <Text style={(this.state.FinancialsDay1.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.FinancialsDay1}</Text>
         </View>
         <View style={Styles.headingGrid5}>
           <Text style={(this.state.FinancialsDay5.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.FinancialsDay5}</Text>
         </View>
         <View style={Styles.headingGrid1m}>
           <Text style={(this.state.FinancialsDay30.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.FinancialsDay30}</Text>
         </View>
         <View style={Styles.headingGrid5m}>
           <Text style={(this.state.FinancialsDay90.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.FinancialsDay90}</Text>
         </View>
      </View>
      <View style={Styles.headingGridN}>
         <View style={{flex:1.2}}>
           <Text  style={Styles.colll}>6.</Text>
         </View>
         <View style={Styles.headingGridI}>
           <Text style={Styles.colll}>Health Care</Text>
         </View>
         <View style={Styles.headingGrid1}>
           <Text style={(this.state.HealthCareDay1.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.HealthCareDay1}</Text>
         </View>
         <View style={Styles.headingGrid5}>
           <Text style={(this.state.HealthCareDay5.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.HealthCareDay5}</Text>
         </View>
         <View style={Styles.headingGrid1m}>
           <Text style={(this.state.HealthCareDay30.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.HealthCareDay30}</Text>
         </View>
         <View style={Styles.headingGrid5m}>
           <Text style={(this.state.HealthCareDay90.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.HealthCareDay90}</Text>
         </View>
      </View>
      <View style={Styles.headingGridN}>
         <View style={{flex:1.2}}>
           <Text style={Styles.colll}>7.</Text>
         </View>
         <View style={Styles.headingGridI}>
           <Text style={Styles.colll}>Industrials</Text>
         </View>
         <View style={Styles.headingGrid1}>
           <Text style={(this.state.IndustrialsDay1.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.IndustrialsDay1}</Text>
         </View>
         <View style={Styles.headingGrid5}>
           <Text style={(this.state.IndustrialsDay5.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.IndustrialsDay5}</Text>
         </View>
         <View style={Styles.headingGrid1m}>
           <Text style={(this.state.IndustrialsDay30.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.IndustrialsDay30}</Text>
         </View>
         <View style={Styles.headingGrid5m}>
           <Text style={(this.state.IndustrialsDay90.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.IndustrialsDay90}</Text>
         </View>
      </View>
      <View style={Styles.headingGridN}>
         <View style={{flex:1.2}}>
           <Text style={Styles.colll}>8.</Text>
         </View>
         <View style={Styles.headingGridI}>
           <Text  style={Styles.colll}>IT</Text>
         </View>
         <View style={Styles.headingGrid1}>
           <Text style={(this.state.InformationTechnologyDay1.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.InformationTechnologyDay1}</Text>
         </View>
         <View style={Styles.headingGrid5}>
           <Text style={(this.state.InformationTechnologyDay5.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.InformationTechnologyDay5}</Text>
         </View>
         <View style={Styles.headingGrid1m}>
           <Text style={(this.state.InformationTechnologyDay30.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.InformationTechnologyDay30}</Text>
         </View>
         <View style={Styles.headingGrid5m}>
           <Text style={(this.state.InformationTechnologyDay90.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.InformationTechnologyDay90}</Text>
         </View>
      </View>
      <View style={Styles.headingGridN}>
         <View style={{flex:1.2}}>
           <Text style={Styles.colll}>9.</Text>
         </View>
         <View style={Styles.headingGridI}>
           <Text style={Styles.colll}>Materials</Text>
         </View>
         <View style={Styles.headingGrid1}>
           <Text style={(this.state.MaterialsDay1.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.MaterialsDay1}</Text>
         </View>
         <View style={Styles.headingGrid5}>
           <Text style={(this.state.MaterialsDay5.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.MaterialsDay5}</Text>
         </View>
         <View style={Styles.headingGrid1m}>
           <Text style={(this.state.MaterialsDay30.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.MaterialsDay30}</Text>
         </View>
         <View style={Styles.headingGrid5m}>
           <Text style={(this.state.MaterialsDay90.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.MaterialsDay90}</Text>
         </View>
      </View>
      <View style={Styles.headingGridN}>
         <View style={{flex:1.2}}>
           <Text style={Styles.colll}>10.</Text>
         </View>
         <View style={Styles.headingGridI}>
           <Text style={Styles.colll}>Real Estate</Text>
         </View>
         <View style={Styles.headingGrid1}>
           <Text style={(this.state.RealEstateDay1.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.RealEstateDay1}</Text>
           
         </View>
         <View style={Styles.headingGrid5}>
           <Text style={(this.state.RealEstateDay5.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.RealEstateDay5}</Text>
          
         </View>
         <View style={Styles.headingGrid1m}>
           <Text style={(this.state.RealEstateDay30.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.RealEstateDay30}</Text>
         </View>
         <View style={Styles.headingGrid5m}>
           <Text style={(this.state.RealEstateDay90.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.RealEstateDay90}</Text>
         </View>
       </View>
       <View style={Styles.headingGridN}>
         <View style={{flex:1.2}}>
           <Text style={Styles.colll}>11.</Text>
         </View>
         <View style={Styles.headingGridI}>
           <Text style={Styles.colll}>Utilities</Text>
         </View>
         <View style={Styles.headingGrid1}>
           <Text style={(this.state.UtilitiesDay1.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.UtilitiesDay1}</Text>
         </View>
         <View style={Styles.headingGrid5}>
           <Text style={(this.state.UtilitiesDay5.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.UtilitiesDay5}</Text>
         </View>
         <View style={Styles.headingGrid1m}>
           <Text style={(this.state.UtilitiesDay30.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.UtilitiesDay30}</Text>
         </View>
         <View style={Styles.headingGrid5m}>
           <Text style={(this.state.UtilitiesDay90.includes('-')) ? Styles.colllR : Styles.colll}>{this.state.UtilitiesDay90}</Text>
         </View>
       </View>  
      </View>
     </View>   
  
  </View>
    </ScrollView>
    );
  }
}
const Styles = StyleSheet.create({
  notes:{
    flex:1,
    flexDirection:'row',
    width:Dimensions.get('window').width, 
    padding:10
  },
  headText:{
    color:'#000',
    fontWeight:'bold',
    marginTop:8,
    marginBottom:8,
  },
  headText1:{
    color:'#000',
    fontWeight:'bold',
    marginTop:5,
    marginBottom:5,
  },
  notesHeading:{
    flex:2,
    color:'#000',
    padding:2,
    fontWeight:'bold'
  },
  notesText:{
    flex:8,
   paddingRight:10
  },
  grid:{
    width: '95%', 
    marginLeft:10,  
    borderWidth:1, 
    padding:5, 
    borderColor:"#e4e1e1",     
    backgroundColor:'#ececec',    
  },
  containerr:{
    width:Dimensions.get('window').width, 
    marginBottom:10,
    marginTop:20
  },
  headingGridN:{
    flex:1,
    flexDirection:'row',
    color:'#000',
    width:'100%',
    paddingLeft:4
  },
  headingGridN1:{
    flex:1,
    color:'#000',
    width:'100%',  
  },
  headingGridI:{
    flex:5, 
    color:'#000',
    paddingLeft:3
  },
  headingGrid1:{
    flex:2.5, 
  },
  headingGrid5:{
    flex:2.5,
    color:'#000', 
  },
  headingGrid1m:{
    flex:2.5,
    color:'#000',  
  },
  headingGrid5m:{
    flex:2.5 ,
    color:'#000',
    paddingRight:5
  },
  colll:{
    marginTop:5,
    marginBottom:5 
  },
  colllR:{
    marginTop:5,
    marginBottom:5,
     color:'#FF0000'
  }
});



export default macroTab;
// import React, { PropTypes } from 'react';
// import { TouchableOpacity,ScrollView, Text,View, StyleSheet } from 'react-native';
// import Constants from '../../config/constant';
// import { Dimensions } from 'react-native';
// import firebase from 'react-native-firebase';

// class macroTab extends React.Component
// {
//   constructor(props) {
//     super(props);
//     this.state = {
//       sectorDataArr:[],
//       sectorParseData:[]
//     }
    
//     firebase.config().enableDeveloperMode();
//     this.hitSectorFirebase();
//   }   
  
//   ifSectorDataExist(url, next){
//     firebase.database().ref(url).once('value').then((data) => {
//       next(data.exists());
//     }).catch((err)=>{
//       next(false);
//     });
//   }

//   hitSectorFirebase(){
//     let dbUrl = "sector"; 
//     let that = this;
//     let alphaUrl; 
//     this.ifSectorDataExist(dbUrl, function(data){
//       if(!data){
//         alphaUrl = Constants.GET_SECTOR_URL();
//         that.getSectorFromAlpha(alphaUrl, dbUrl);
//       }else{
//         that.getSectorFromFirebase(dbUrl);
//       }
//     });
//   }

//   async getSectorFromAlpha(alphaUrl, dbUrl){
//     let that = this;
//     let result = await fetch(alphaUrl).then(response => response.json());
//     if(result['Meta Data']){
//       firebase.database().ref(dbUrl).set(JSON.stringify(result)).then(() => {
//         console.log("successfully inserted")
//         that.getSectorFromFirebase(dbUrl);
//       }).catch((error) => {
//         console.log(error);
//       });
//     }
//   }
  
//   async getSectorFromFirebase(dbUrl){
//     let sectorData = [];
//     firebase.database().ref(dbUrl).once('value').then((data) => {
//       var sectorParseData = JSON.parse(data.val());
//       sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Real Estate'], type:"day1"});
//       sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Information Technology'], type:"day1"});
//       sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Health Care'], type:"day1"});
//       sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Communication Services'], type:"day1"});
//       sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Industrials'], type:"day1"});
//       sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Financials'], type:"day1"});
//       sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Utilities'], type:"day1"});
//       sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Consumer Discretionary'], type:"day1"});
//       sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Consumer Staples'], type:"day1"});
//       sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Materials'], type:"day1"});
//       sectorData.push({data : sectorParseData['Rank B: 1 Day Performance']['Energy'], type:"day1"});

//       sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Real Estate'], type:"day5"});
//       sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Information Technology'], type:"day5"});
//       sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Health Care'], type:"day5"});
//       sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Communication Services'], type:"day5"});
//       sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Industrials'], type:"day5"});
//       sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Financials'], type:"day5"});
//       sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Utilities'], type:"day5"});
//       sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Consumer Discretionary'], type:"day5"});
//       sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Consumer Staples'], type:"day5"});
//       sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Materials'], type:"day5"});
//       sectorData.push({data : sectorParseData['Rank C: 5 Day Performance']['Energy'], type:"day5"});

//       sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Real Estate'], type:"day30"});
//       sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Information Technology'], type:"day30"});
//       sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Health Care'], type:"day30"});
//       sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Communication Services'], type:"day30"});
//       sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Industrials'], type:"day30"});
//       sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Financials'], type:"day30"});
//       sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Utilities'], type:"day30"});
//       sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Consumer Discretionary'], type:"day30"});
//       sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Consumer Staples'], type:"day30"});
//       sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Materials'], type:"day30"});
//       sectorData.push({data : sectorParseData['Rank D: 1 Month Performance']['Energy'], type:"day30"});

//       sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Real Estate'], type:"day90"});
//       sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Information Technology'], type:"day90"});
//       sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Health Care'], type:"day90"});
//       sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Communication Services'], type:"day90"});
//       sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Industrials'], type:"day90"});
//       sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Financials'], type:"day90"});
//       sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Utilities'], type:"day90"});
//       sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Consumer Discretionary'], type:"day90"});
//       sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Consumer Staples'], type:"day90"});
//       sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Materials'], type:"day90"});
//       sectorData.push({data : sectorParseData['Rank E: 3 Month Performance']['Energy'], type:"day90"});

//       this.setState({sectorDataArr:sectorData});

//     }).catch((err)=>{
//       console.log("this is error", err);
//     });
   
//   }
 
//   render()
//   {
//     let elem =  this.state.sectorDataArr.map((val, index)=>{
//       return (
//         <Text key={index}>{val.data}</Text>
//       ) 
//     });
   
//    return(
//   <ScrollView contentContainerStyle={Styles.container}>
//   {
//    elem
//   }
//   <View style={Styles.notes}>
//      <Text style={Styles.notesHeading}>Notes : </Text>
//      <Text style={Styles.notesText}>Survival years is calculated using current monthly expenses. You are encouraged to build passive income from other sourceslike rental from property, annvity, pension, etc.</Text>
//   </View>
//   <View style={Styles.containerr}>
//     <View style={Styles.grid}>
//       <Text>Industry performance for S&P 500 in U.S.A. Use as a proxy other</Text>
//     </View>
//     <View style={{flex:1,flexDirection:'row', borderBottomWidth:1,   borderBottomColor:"#e4e1e1",backgroundColor:'#ececec', marginLeft:10,marginRight:10,paddingBottom:10}}>
//      <View style={Styles.headingGridN1}>
//       <View style={Styles.headingGridN}>
//          <View>
//            <Text style={Styles.headText}>No.</Text>
//          </View>
//          <View style={Styles.headingGridI}>
//            <Text style={Styles.headText}>Industry</Text>
//          </View>
//          <View style={Styles.headingGrid1}>
//            <Text style={Styles.headText}>1 Day</Text>
//          </View>
//          <View style={Styles.headingGrid5}>
//            <Text style={Styles.headText}>5 Days</Text>
//          </View>
//          <View style={Styles.headingGrid1m}>
//            <Text style={Styles.headText}>1 Month</Text>
//          </View>
//          <View style={Styles.headingGrid5m}>
//            <Text style={Styles.headText}>3 Months</Text>
//          </View>
//       </View>
//        <View style={Styles.headingGridN}>
//          <View>
//            <Text style={Styles.colll}>1.</Text>
//          </View>
//          <View style={Styles.headingGridI}>
//            <Text style={Styles.colll}>Communication Services</Text>
//          </View>
//          <View style={Styles.headingGrid1}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid1m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//       </View>
//       <View style={Styles.headingGridN}>
//          <View>
//            <Text style={Styles.colll}>2.</Text>
//          </View>
//          <View style={Styles.headingGridI}>
//            <Text style={Styles.colll}>Consumer Discretionary</Text>
//          </View>
//          <View style={Styles.headingGrid1}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid1m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//       </View>
//       <View style={Styles.headingGridN}>
//          <View>
//            <Text style={Styles.colll}>3.</Text>
//          </View>
//          <View style={Styles.headingGridI}>
//            <Text style={Styles.colll}>Consumer Staples</Text>
//          </View>
//          <View style={Styles.headingGrid1}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid1m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//       </View>
//       <View style={Styles.headingGridN}>
//          <View>
//            <Text style={Styles.colll}>4.</Text>
//          </View>
//          <View style={Styles.headingGridI}>
//            <Text style={Styles.colll}>Energy</Text>
//          </View>
//          <View style={Styles.headingGrid1}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid1m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//       </View>
//       <View style={Styles.headingGridN}>
//          <View>
//            <Text style={Styles.colll}>5.</Text>
//          </View>
//          <View style={Styles.headingGridI}>
//            <Text style={Styles.colll}>Financials</Text>
//          </View>
//          <View style={Styles.headingGrid1}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid1m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//       </View>
//       <View style={Styles.headingGridN}>
//          <View>
//            <Text  style={Styles.colll}>6.</Text>
//          </View>
//          <View style={Styles.headingGridI}>
//            <Text style={Styles.colll}>Health Care</Text>
//          </View>
//          <View style={Styles.headingGrid1}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid1m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//       </View>
//       <View style={Styles.headingGridN}>
//          <View>
//            <Text style={Styles.colll}>7.</Text>
//          </View>
//          <View style={Styles.headingGridI}>
//            <Text style={Styles.colll}>Industrials</Text>
//          </View>
//          <View style={Styles.headingGrid1}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid1m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//       </View>
//       <View style={Styles.headingGridN}>
//          <View>
//            <Text style={Styles.colll}>8.</Text>
//          </View>
//          <View style={Styles.headingGridI}>
//            <Text  style={Styles.colll}>Information Technology</Text>
//          </View>
//          <View style={Styles.headingGrid1}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid1m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//       </View>
//       <View style={Styles.headingGridN}>
//          <View>
//            <Text style={Styles.colll}>9.</Text>
//          </View>
//          <View style={Styles.headingGridI}>
//            <Text style={Styles.colll}>Materials</Text>
//          </View>
//          <View style={Styles.headingGrid1}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid1m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//       </View>
//       <View style={Styles.headingGridN}>
//          <View>
//            <Text style={Styles.colll}>10.</Text>
//          </View>
//          <View style={Styles.headingGridI}>
//            <Text style={Styles.colll}>Real Estate</Text>
//          </View>
//          <View style={Styles.headingGrid1}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid1m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//        </View>
//        <View style={Styles.headingGridN}>
//          <View>
//            <Text style={Styles.colll}>11.</Text>
//          </View>
//          <View style={Styles.headingGridI}>
//            <Text style={Styles.colll}>Utilities</Text>
//          </View>
//          <View style={Styles.headingGrid1}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid1m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//          <View style={Styles.headingGrid5m}>
//            <Text style={Styles.colll}> </Text>
//          </View>
//        </View>  
//       </View>
//      </View>   
  
//   </View>
//     </ScrollView>
//     );
//   }
// }
// const Styles = StyleSheet.create({
//   notes:{
//     flex:1,
//     flexDirection:'row',
//     width:Dimensions.get('window').width, 
//     padding:10
//   },
//   headText:{
//     color:'#000',
//     fontWeight:'bold',
//     marginTop:8,
//     marginBottom:8,
//   },
//   headText1:{
//     color:'#000',
//     fontWeight:'bold',
//     marginTop:5,
//     marginBottom:5,
//   },
//   notesHeading:{
//     flex:2,
//     color:'#000',
//     padding:2,
//     fontWeight:'bold'
//   },
//   notesText:{
//     flex:8,
//    paddingRight:10
//   },
//   grid:{
//     width: '95%', 
//     marginLeft:10,
//     marginRight:10,
//     borderWidth:1, 
//     padding:5, 
//     borderColor:"#e4e1e1",     
//     backgroundColor:'#ececec',    
//   },
//   containerr:{
//     width:Dimensions.get('window').width, 
//     marginBottom:10
//   },
//   headingGridN:{
//     flex:1,
//     flexDirection:'row',
//     color:'#000',
//     width:'95%',
//     paddingLeft:3
//   },
//   headingGridN1:{
//     flex:1,
//     color:'#000',
//     width:'95%',
//     paddingLeft:3
//   },
//   headingGridI:{
//     flex:4,
//     color:'#000',
//     paddingLeft:3
//   },
//   headingGrid1:{
//     flex:2,
//     paddingLeft:3
//   },
//   headingGrid5:{
//     flex:2,
//     color:'#000',
//     paddingLeft:3
//   },
//   headingGrid1m:{
//     flex:2,
//     color:'#000', 
//     paddingLeft:3
//   },
//   headingGrid5m:{
//     flex:2.5,
//     color:'#000', 
//     paddingLeft:3
//   },
//   colll:{
//     paddingLeft:3,marginTop:5,marginBottom:5 
//   }
// });



// export default macroTab;