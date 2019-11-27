import React from 'react';
import styles from "../MillionaireDream/style";
import {View,Modal,   TouchableHighlight, Text, TextInput, Button,Image, ScrollView, TouchableOpacity} from 'react-native';
import Constants from "../../config/constant";
import Toast, { DURATION } from 'react-native-easy-toast';
import {AsyncStorage} from 'react-native';
import Tooltip from "rne-modal-tooltip";
import Container from '../Container';

class MillionaireDream extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            select: { start: 0, end: 1 } ,
            DreamAmount:'1,000,000',
            Myage:30,
            modalVisible: false,
            Calculated_age:'',
            Initial_capital:'500,000',
            Yearly_invest:'24,000',
            Monthly_income:'5,000',
            Monthly_expense:'3,000',
            InvestmentReturnAnnum: '5.00',
            monthlySaving :'2,000',
            yearlySaving: '24,000',
            MontlyPassiveIncome:'',
            MonthlyFutureExpense:'',
            NetPassiveIncome:'',
            AnotherYear:'',
            InvestmentReturnAnnumErr:'',
            Monthly_expenseErr:'',
            Monthly_incomeErr:'',
            Yearly_investErr:'',
            Initial_capitalErr:'',
            dreamAmtErr:'',
            MyageErr:'',
            nValue:'',
            mPassive_income:'',
            mFuture_expence:'',
            default:true,
            color:'',
        }
        let that = this;
        AsyncStorage.getItem('DreameData').then(function(val){
            val = JSON.parse(val);
              if(val){
                  console.log('val',val);
                let obj = that.state;
                obj.DreamAmount = val.DreamAmount;
                obj.Myage =  val.Myage;
                obj.Initial_capital=val.Initial_capital;  
                obj.Yearly_invest=val.Yearly_invest;
                obj.Monthly_income=val.Monthly_income;
                obj.Monthly_expense=val.Monthly_expense;
                obj.InvestmentReturnAnnum=val.InvestmentReturnAnnum;
                that.setState(obj, function(val){
                    var drm= that.state.DreamAmount.split(",").join("");
                    var intcapital=that.state.Initial_capital.split(",").join("");
                    var investYearly=that.state.Yearly_invest.split(",").join("");
                    var monthlyIn=that.state.Monthly_income.split(",").join("");
                    var monthExp=that.state.Monthly_expense.split(",").join("");
                    let e=parseInt(that.state.InvestmentReturnAnnum)/100;
                    let d=parseInt(investYearly)/e;
                    let a=  Math.log((parseInt(drm)+d)/(parseInt(intcapital)+d));
                    let a1=Math.log(1+e);
                    let n=a/a1;
                    let p=(parseInt(drm)*(parseInt(that.state.InvestmentReturnAnnum) /100))/12;
                    let f=(parseInt(monthExp)* (Math.pow(1.02,n)));
                    let y=(parseInt(drm)/(parseInt(monthExp)*12));
                    let finalState = that.state;
                    finalState.nValue = n+that.state.Myage;
                    finalState.mFuture_expence=f;
                    finalState.AnotherYear=y;
                    finalState.mPassive_income = p;
                    that.setState(finalState);
    
                });
            }else{
                var drm= that.state.DreamAmount.split(",").join("");
                var intcapital=that.state.Initial_capital.split(",").join("");
                var investYearly=that.state.Yearly_invest.split(",").join("");
                var monthlyIn=that.state.Monthly_income.split(",").join("");
                var monthExp=that.state.Monthly_expense.split(",").join("");
                let e= parseInt(that.state.InvestmentReturnAnnum)/100;
                let d=parseInt(investYearly)/e;
                let a=  Math.log((parseInt(drm)+d)/(parseInt(intcapital)+d));
                let a1=Math.log(1+e);
                let n=a/a1;
                let p=(parseInt(drm)*(parseInt(that.state.InvestmentReturnAnnum)/100))/12;
                let f=(parseInt(monthExp)* (Math.pow(1.02,n)));
                let y=(parseInt(drm)/(parseInt(monthExp)*12));
                let finalState = that.state;
                finalState.nValue = n+that.state.Myage;
                finalState.mFuture_expence=f;
                finalState.AnotherYear=y;
                finalState.mPassive_income = p;
                that.setState(finalState);


            }
        });
    }
    componentWillMount()
    {
      
    }
 

    // handleMonthly_income(text,type)
    // {

    //     if(type=='e')
    //         this.setState({Monthly_expense :text})
    //     else this.setState({Monthly_income : text});
    //         this.savingCalculate();
    // }

    savingCalculate() {

        this.setState({monthlySaving: this.state.Monthly_income-this.state.Monthly_expense}) ;
        this.state.yearlySaving=this.state.monthlySaving*12;
    }
    commafy(x,currency,mi){   
        x = x.split(",").join("")
        // if(mi!="" && x.includes("(")){
        //     x = x.split("(")[1].split(")")[0];
        // }
        // x = x.split(",").join("")
        // return x.replace(/./g, function(c, i, a) {
        //     return (i==0 ? 1 : i) % 3 === 0 ? "," + c : c;
        // });
        var pattern = /(-?\d+)(\d{3})/;
              while (pattern.test(x))
                  x = x.replace(pattern, "$1,$2");
              return  x  ;
    }
    handleDreamAmount(text)
    {
        if(text=='')
        {
            this.setState({DreamAmount: ''});
        }
        else
        { 
            text=text.split("-").join("");
            text=text.split(".").join("");
            this.setState({DreamAmount:this.commafy(text,'$','')});
        }


        if(text!='1,000,000' || this.state.InvestmentReturnAnnum!='5.00'|| this.state.Myage!=30 || this.state.Monthly_expense!='3,000' || this.state.Monthly_income!='5,000' || this.state.Initial_capital!='500,000' || this.state.Yearly_invest!='24,000')
        {
            this.setState({default:false});
        }
        else
        {
            this.setState({default:true});
        }
    }
    handleMyage(text)
    {

        if(text=='')
        {
            this.setState({Myage: ''})
        }
        else
        {
            // debugger
            text=text.split(".").join("");
            text==''?this.setState({Myage: ''}): this.setState({Myage: parseInt(text)});
            
        }

        if(this.state.DreamAmount!='1,000,000' || this.state.InvestmentReturnAnnum!='5.00'|| text!=30 || this.state.Monthly_expense!='3,000' || this.state.Monthly_income!='5,000' || this.state.Initial_capital!='500,000' || this.state.Yearly_invest!='24,000')
        {
            this.setState({default:false});

        }
        else
        {
            this.setState({default:true});
        }
    }
    handleInitial_capital(text)
    {
        if(text=='')
        {
            this.setState({Initial_capital: ''});
        }
        else
        {
            text=text.split("-").join("");
            text=text.split(".").join("");
            this.setState({Initial_capital:this.commafy(text,'$','')});
        }

        if(this.state.DreamAmount!='1,000,000' || this.state.InvestmentReturnAnnum!='5.00'|| this.state.Myage!=30|| this.state.Monthly_expense!='3,000' || this.state.Monthly_income!='5,000' || text!='500,000' || this.state.Yearly_invest!='24,000')
        {
            this.setState({default:false});

        }
        else
        {
            this.setState({default:true});
        }
    }
   numberWithCommas(x) {
        x = x.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(x))
            x = x.replace(pattern, "$1,$2");
        return x;
    }
    handleYearly_invest(text)
    {
        if(text=='')
        {
            this.setState({Yearly_invest: ''});
            this.setState({Monthly_income:'0'});
            this.setState({Monthly_expense:'0'});
        }
        else
        {
            text=text.split("-").join("");
            text=text.split(".").join("");
             this.setState({Yearly_invest:this.commafy(text,'$','')},
             ()=>{
                  let mi=(5*this.state.Yearly_invest.split(',').join(""))/24;
                  let me=this.state.Yearly_invest.split(',').join("")/8;
                  this.setState({Monthly_income:this.numberWithCommas(parseInt(mi)) });
                  this.setState({Monthly_expense:this.numberWithCommas(parseInt(me)) });       
             });
        }

        if( this.state.DreamAmount!='1,000,000' || this.state.InvestmentReturnAnnum!='5.00'|| this.state.Myage!=30|| this.state.Monthly_expense!='3,000' || this.state.Monthly_income!='5,000' || text!='24,000' || this.state.Initial_capital!='500,000')
        {
            this.setState({default:false});
        }
        else
        {
            this.setState({default:true});
        }
    }
    handleMonthly_income(text)
    {
        if(text=='')
        {
            this.setState({Monthly_income: ''});
            this.setState({Yearly_invest: '0'});
             
        }
        else
        {
            text=text.split("-").join("");
            text=text.split(".").join("");
            this.setState({Monthly_income:this.commafy(text,'$','')},
            ()=>
            {
                let yi=(this.state.Monthly_income.split(',').join("")-this.state.Monthly_expense.split(',').join(""))*12;  
                this.setState({Yearly_invest:this.numberWithCommas(parseInt(yi)) });    
            });
        }

        if(  this.state.DreamAmount!='1,000,000' || this.state.InvestmentReturnAnnum!='5.00'|| this.state.Myage!=30|| this.state.Monthly_expense!='3,000'  || text!='5,000' || this.state.Yearly_invest!='24,000' || this.state.Initial_capital!='500,000')
        {
            this.setState({default:false});
        }
        else
        {
            this.setState({default:true});
        }
    }
    handleMonthly_expense(text)
    {
        if(text=='')
        {
            this.setState({Monthly_expense: ''});
            this.setState({Yearly_invest:'0'});
        }
        else
        {
            text=text.split("-").join("");
            text=text.split(".").join("");
            this.setState({Monthly_expense:this.commafy(text,'$','me')},()=>{
                let yi=(this.state.Monthly_income.split(',').join("")-this.state.Monthly_expense.split(',').join(""))*12;  
                this.setState({Yearly_invest:this.numberWithCommas(parseInt(yi)) });   
            });
        }

        if(  this.state.DreamAmount!='1,000,000' || this.state.InvestmentReturnAnnum!='5.00'|| this.state.Myage!=30|| this.state.Monthly_income!='5,000' || text!='3,000' || this.state.Yearly_invest!='24,000' || this.state.Initial_capital!='500,000')
        {
            this.setState({default:false});
        }
        else
        {
            this.setState({default:true});
        }
    }
    handleInvestmentReturnAnnum(text)
    {
        if(text=='')
        {
            this.setState({InvestmentReturnAnnum:''});
        }
        else
        {
            var t = text;
            text = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
            this.setState({InvestmentReturnAnnum:text});
        }

        if( this.state.DreamAmount!='1,000,000' ||  this.state.Myage!=30|| this.state.Monthly_income!='5,000' || text!='5.00' || this.state.Yearly_invest!='24,000' || this.state.Initial_capital!='500,000' || this.state.Monthly_expense!='3,000' )
        {
            this.setState({default:false});
        }
        else
        {
            this.setState({default:true});
        }
       
    }
     

    validateAge(age)
    {
     if(age> 1 && age <=200)
      return true;
     else
         return false;
    }
    calculateData(t) {
        var drm= this.state.DreamAmount.split(",").join("");
        var intcapital=this.state.Initial_capital.split(",").join("");
        var investYearly=this.state.Yearly_invest.split(",").join("");
        var monthlyIn=this.state.Monthly_income.split(",").join("");
        var monthExp=this.state.Monthly_expense.split(",").join("");

        if (this.state.Myage <= 1 || this.state.Myage > 200) {
            this.refs.toast.show('Wrong age', DURATION.LENGTH_SHORT);
        } else if (parseInt(intcapital) < 0 || parseInt(intcapital)  >=parseInt(drm) ) {
            this.refs.toast.show('$ initial capital can not be<0 & smaller than dream amount', DURATION.LENGTH_SHORT);
        } else if (parseInt(investYearly) <= 0) {
            this.refs.toast.show('$ to invest can not be <0', DURATION.LENGTH_SHORT);
        } else if (parseInt(this.state.InvestmentReturnAnnum) <= 0) {
            this.refs.toast.show('Wrong value, Minimun value is 2% / year', DURATION.LENGTH_SHORT);
        } else if(this.state.InvestmentReturnAnnum==''){
            this.refs.toast.show('Please provide investment return p.a.', DURATION.LENGTH_SHORT);
        }
         else {
           let e = parseInt(this.state.InvestmentReturnAnnum) / 100;
           let d=parseInt(investYearly)/e;
           let a = Math.log((parseInt(drm)  + d) / (parseInt(intcapital) + d));
           let a1 = Math.log(1 + e);
           let n = a / a1; 
            this.setState({nValue: n + this.state.Myage});
           let p = (parseInt(drm) * (parseFloat(this.state.InvestmentReturnAnnum) / 100)) / 12;
            this.setState({mPassive_income: p});
           let f = (parseInt(monthExp) * (Math.pow(1.02, n)));
            this.setState({mFuture_expence: f});
           let y = (parseInt(drm) / (parseInt(monthExp) * 12));
            this.setState({AnotherYear: y});
            let obj = {};
            obj['DreamAmount'] = this.state.DreamAmount;
            obj['Myage'] = this.state.Myage;
            obj['Initial_capital'] = this.state.Initial_capital;
            obj['Yearly_invest'] = this.state.Yearly_invest;
            obj['Monthly_income'] = this.state.Monthly_income;
            obj['Monthly_expense'] = this.state.Monthly_expense;
            obj['InvestmentReturnAnnum'] = this.state.InvestmentReturnAnnum;
            console.log('obj',obj)
            AsyncStorage.setItem('DreameData', JSON.stringify(obj)).then(function (val) {
               
            });
        }
    }
    info()
    {
        alert('info');
    }
    onPressDefault()
    {
        this.setState({DreamAmount:'1,000,000'});
        this.setState({Myage:30});
        this.setState({Initial_capital:'500,000'});
        this.setState({Yearly_invest:'24,000'});
        this.setState({Monthly_income:'5,000'});
        this.setState({Monthly_expense:'3,000'});
        this.setState({InvestmentReturnAnnum:'5.00'});
        this.setState({default:true})
    }
    back(){
        this.props.navigation.goBack();   
    }
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
      }

    render() {
        let back1 = require('./../../../assets/images/back-arrow.png');
        let happy = require('./../../../assets/images/happy.png');
        let sad = require('./../../../assets/images/sad.png');   
        let info = require('./../../../assets/images/info.png');
        return (
            <Container>

            <View style={{flex:1}}>
            
            <View style={styles.header}>
                 <View  style={styles.topmenu}>
                   <View style={{flex:1,height:50}}>  
                      <TouchableOpacity onPress={this.back.bind(this)}> 
                        <Image source={back1} style={{ width:30,height:30 }}></Image>      
                      </TouchableOpacity>
                    </View>
                    <View style={styles.homeText}><Text style={styles.tophome}>Millionaire Dream</Text>
                    </View>
                </View>
            </View>
           
            
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.top}>
                    <View style={styles.designDefault}></View>
                    <View style={styles.buttonContainer}>
                     
                        <TouchableOpacity style={{backgroundColor: this.state.default==true?'#1d93d6':'#f8a89e'}}  onPress={this.onPressDefault.bind(this)}>
                            <Text style={styles.buttonText}>Default</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.infoRow}>
                        <Text style={styles.textS}>Dream Amount</Text>
                    <View style={styles.infoCol1}>
                        <TextInput
                            style={styles.butinput} maxLength={13} keyboardType = 'numeric' onChangeText={this.handleDreamAmount.bind(this)}
                            value={this.state.DreamAmount.toString()}
                        />
                        <Text  >{this.state.dreamAmtErr}</Text>
                    </View>
                    <View style={styles.infoColr}>
                        <Text style={styles.textR}>$ 1,000,000</Text>
                    </View>
                </View>
                <View style={{height : 15}}></View>
                <View style={styles.infoRow}>
                        <Text style={styles.textS}>My Age Now</Text>
                    <View style={styles.infoCol1}>
                        <TextInput
                            style={styles.butinput} keyboardType = 'numeric' onChangeText={this.handleMyage.bind(this)}
                            value={this.state.Myage.toString()}
                        />
                        <Text  >{this.state.MyageErr}</Text>
                    </View>
                    <View style={styles.infoColr}>
                        <Text style={styles.textR}> 30 Years Old</Text>
                    </View>
                </View>
                <View style={{height : 15}}></View>
                <View style={styles.infoRow}>
                        <Text style={styles.textS}>Initial Capital</Text>
                    <View style={styles.infoCol1}>
                        <TextInput
                            style={styles.butinput} keyboardType = 'numeric' onChangeText={this.handleInitial_capital.bind(this)}
                            value={this.state.Initial_capital.toString()}
                        />
                        <Text  >{this.state.Initial_capitalErr}</Text>
                    </View>
                    <View style={styles.infoColr}>
                        <Text style={styles.textR}>$ 500,000</Text>
                    </View>
                </View>
                <View style={{height : 15}}></View>
                <View style={styles.infoRow}>
                        <Text style={styles.textS}>$ Invest Yearly</Text>
                    <View style={styles.infoCol1}>
                        <TextInput
                            style={styles.butinput} keyboardType = 'numeric' onChangeText={this.handleYearly_invest.bind(this)}
                            value= {this.state.Yearly_invest.toString()}
                        />
                        <Text  >{this.state.Yearly_investErr}</Text>
                    </View>
                    <View style={styles.infoColr}>
                        <Text style={styles.textR}>$ 24,000 / Yrs</Text>
                    </View>
                </View>
                <View style={{height : 15}}></View>
                <View style={styles.infoRow}>
                        <Text style={styles.textS}>Monthly Income</Text>
                    <View style={styles.infoCol1}>
                        <TextInput
                            style={styles.butinput} keyboardType = 'numeric' onChangeText={this.handleMonthly_income.bind(this)}
                            value={this.state.Monthly_income.toString()}
                        />
                        <Text  >{this.state.Monthly_incomeErr}</Text>
                    </View>
                    <View style={styles.infoColrB}>
                       {/* <Text style={styles.textRB}>Saving ratio</Text>*/}
                    </View>
                </View>
                <View style={{height : 15}}></View>
                <View style={styles.infoRow}>
                        <Text style={styles.textS}>Monthly Expense</Text>
                    <View style={styles.infoCol1}>
                        <TextInput
                            style={styles.butinput} keyboardType = 'numeric'  onChangeText= {this.handleMonthly_expense.bind(this)}
                            value={this.state.Monthly_expense.toString()}
                        />
                        <Text  >{this.state.Monthly_expenseErr}</Text>
                    </View>
                    <View style={{flex:1,height:50,textAlign: 'right',alignItems:'flex-end',paddingTop:10,paddingBottom:10,top: 0}}>
                     <Tooltip height={140} width={300} withOverlay={false} backgroundColor={'#000000'} popover={<Text style={{color:'#f8a89e'}}>e.g. Food, Insurance expense, Loan instalments etc. This is autocomputed with a constant 40% savings ratio used to invest yearly unless expense is manually changed by user. Savings Ratio is computed by: Income minus Expense, then divided by Income</Text>}>
                       <Image style={{width:20, height:20 }} source={info}></Image>
                     </Tooltip>
                    </View>
                  {/* <TouchableOpacity onPress={() => {
                      this.setModalVisible(true);
                     }}> style={{flex:1,height:50,textAlign: 'right',alignItems:'flex-end',paddingTop:10,paddingBottom:10,top: 0}}>
                    <Image style={{width:20, height:20 }} source={info}></Image>
                  </TouchableOpacity> */}
             


                    
                    {/* <View style={styles.infoColrT}> */}
                   
                       {/* <Text style={styles.textRT}>{((this.state.Monthly_income-this.state.Monthly_expense)*100)/this.state.Monthly_income}%</Text>*/}
                    {/* </View> */}
                </View>
           
                <View style={{height : 15}}></View>
                <View style={styles.infoRow}>
                        <Text style={styles.textS}>Investment return p.a.</Text>
                    <View style={styles.infoCol1}>
                        <TextInput
                            style={styles.butinput} keyboardType = 'numeric' onChangeText={this.handleInvestmentReturnAnnum.bind(this)}
                            value={this.state.InvestmentReturnAnnum}
                        />
                        <Text  >{this.state.InvestmentReturnAnnumErr}</Text>
                    </View>
                    <View style={styles.infoColr}>
                        <Text style={styles.textR}>5.00% / Yr</Text>
                    </View>
                </View>
                <View style={{height : 25}}></View>
                <View style={{textAlign :'center',alignItems:'center',flex:1,flexDirection:'row'}}>
                    <TouchableOpacity style={styles.calculateButton} onPress={this.calculateData.bind(this)}>
                        <Text style={styles.buttonText}>Calculate</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height : 25}}></View>
                <View style={styles.borderLine}></View>
                <View style={{height : 15}}></View>
                <View style={styles.resultHeader}>
                    <Text style={styles.result}>Result</Text>
                </View>
                <View style={styles.resultHeader}>
                <Text style={{color: '#67655B',fontSize:15}}> 
                    I will have ${this.state.DreamAmount} at {parseFloat(this.state.nValue).toFixed(2)} Years Old
                </Text>
                    {/* <Text style={styles.resultCont}>I will have </Text>
                    <Text style={styles.uderline}>${this.state.DreamAmount}</Text>
                    <Text style={styles.resultCont}>{' '}at {' '}</Text>
                    <Text style={styles.uderline}>{parseFloat(this.state.nValue).toFixed(2)}</Text>
                    <Text style={styles.resultCont}>{' '}Years Old</Text> */}
                </View>
                <View style={styles.resultHeader}>
                    <Text style={styles.resultCont}>If I re-invest, my</Text>
                </View>
                <View style={styles.resultHeader}>
                    <Text style={styles.resultCont}>Monthly passive income : </Text>
                    <Text style={styles.uderline}>${parseFloat(this.state.mPassive_income).toFixed(2)} </Text>
                </View>
                <View style={styles.resultHeader}>
                    <Text style={styles.resultCont}>Monthly future expense : </Text>
                    <Text style={styles.uderline}>${parseFloat(this.state.mFuture_expence).toFixed(2)}</Text>
                </View>
                <View style={styles.resultHeader}>
                    <Text style={styles.resultContsubHeading}>(assume 2% inflation)</Text>
                </View>
                <View style={styles.resultHeader}>
                    <Text style={styles.resultCont}>Net passive income :</Text>
                    <Text style={styles.uderline}>{' '}${parseFloat(this.state.mPassive_income-this.state.mFuture_expence).toFixed(2)} /mth</Text>
                </View>
                <View style={styles.resultHeader}>
                    <Text style={styles.resultCont}>Status : Financial</Text>
                    <Text style={styles.uderline}>{' '}{this.state.mPassive_income-this.state.mFuture_expence<0 ? 'Dependent':'Independent'}</Text>
                    <Image style={{height:30,width:30,paddingLeft:5}} source={this.state.mPassive_income-this.state.mFuture_expence<0 ? sad : happy}></Image>
                </View>
                <View style={styles.resultHeader}>
                    <Text style={styles.resultCont}>If i don't re-invest,</Text>

                </View>
                <View style={styles.resultHeader1}>
                    <Text style={styles.resultCont}>I can survive another</Text>
                    <Text style={styles.uderline}>{' '}{parseFloat(this.state.AnotherYear).toFixed(2)} </Text>
                    <Text style={styles.resultCont}>{' '}Years</Text>
                   
                     <Tooltip height={130} width={300} withOverlay={false} backgroundColor={'#000000'} popover={<Text style={{color:'#f8a89e'}}>Survival years is calculated
                        using current monthly expenses. You are encouraged to build
                        passive income from other sources like rental from property,
                        annuity, pension etc.</Text>}>
                       <Image style={{width:20, height:20 }} source={info}></Image>
                     </Tooltip>    
                </View>
                <Toast ref="toast"/>
              
            </ScrollView>
            </View>

            </Container>
           
        );
    }
}
export default MillionaireDream;