import React, { PropTypes } from 'react';
import { TouchableOpacity,ScrollView, Text,View, StyleSheet, AsyncStorage, Image } from 'react-native';
import firebase from 'react-native-firebase';
import { Dimensions } from 'react-native';
import { ProgressDialog } from 'react-native-simple-dialogs';
import moment from 'moment';

class Friends extends React.Component
{
  friendList = [];
  q1 = '31/03/2019 23:59:59';
  q2 = '30/06/2019 23:59:59';
  q3 = '30/09/2019 23:59:59';
  q4 = '31/12/2019 23:59:59';
  
  constructor(props) {
    super(props);
    this.state={
      myId:'',
      friendList:[],
      quarter:this.props.quarter,
      date:this.props.date,
      loading : true, 
      user:'',
      meu:'',
      gameResetDay:'',
      gameResetHour:''
    }
    this.getMyId();
  } 
  filter(text){
    if(text=='')
    {
      this.setState({friendList:this.friendList})
    }
    else{
     let filterarr=[];
     this.friendList.forEach((da,i)=>{
      let user=da.data.name;
      if((user.toLowerCase()).includes(text.toLowerCase()) )
      {
        filterarr.push(this.friendList[i]);
      }
    })
     this.setState({friendList: filterarr})  
   }
  }
  async getMyId(){
    var user = await AsyncStorage.getItem('user');
    console.log("myid********", user);
    var userId = JSON.parse(user);
    console.log("myid*******new", userId.id);
    this.setState({user: userId},()=>{
      this.setState({myId:userId.id})
      this.getMeu(); 
    })
    this.gameReset();
  }
  getMeu(){ 
    // debugger
    let url = this.state.quarter+'/'+this.state.user.id;
    let that=this; 
    let d;
    console.log('url',url);
   
    firebase.database().ref(url).on('value', function(data){  
        console.log('dkkk',data.val()) 
        d=data.val();
        that.setState({meu: d.meu},()=>{
          that.getFriendList();
        }) 
      }); 
  }
  componentDidMount() {
    let that=this;
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => { 
        that.getMeu();
      }
    ); 
  }
  getFriendList(){
    let url = "users/"+this.state.user.id+"/friends";
    let that = this;
    this.friendList=[];
    let date=new Date();
    let count = 0;
    let length;
    let month=date.getMonth()+1;
    let myData={
      meu: that.state.meu,
      data:that.state.user,
    }
    //  if(month==1 || month==2 || month==3){ 
    //     urlMeu='Q1-'+date.getFullYear() 
    //   }
    //  else if(month==4 || month==5 || month==6){ 
    //     urlMeu='Q2-'+date.getFullYear() 
    //  }
    //  else if(month==7 || month==8 || month==9){ 
    //     urlMeu='Q3-'+date.getFullYear() 
    //  }
    //  else if(month==10 || month==11 || month==12){ 
    //     urlMeu='Q4-'+date.getFullYear() 
    //  }
    firebase.database().ref(url).once('value').then((data) => {
      if(data.val()==null){
        if(that.state.loading){
          that.setState({loading:false});
         }
      }
      else{
        Object.keys(data.val()).map((key)=>{ 
          console.log("userlistarray*********",key);
          firebase.database().ref(url+'/'+key).once('value').then((da) => { 
            let friendData=da.val();
            let tmpFrnd = {};
            firebase.database().ref(this.state.quarter+'/'+friendData.id).once('value').then((daFrnd) => { 
              length=Object.keys(data.val()).length;
              count++;
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
              if(count >= length){
                 that.friendList.push(myData);
                 that.friendList = that.friendList.sort(function(a, b){return b.meu - a.meu})
                 //that.setState({friendList:that.friendList});
                 that.checkRank(that.friendList)
              }
              }).catch((err)=>{
                console.log(JSON.stringify(err))
             });
            }).catch((err)=>{
              console.log(JSON.stringify(err))
           });
        });
      }  
     
    }).catch((err)=>{
       console.log(JSON.stringify(err))
    });
  }
  checkRank(friend){ 
    let userWithRank=[];
    let myRank;
    let index=0;
    friend.map((UserData, jIndex,array) =>{ 
     if(jIndex!=0){
       let aa=array;
       console.log(aa);
       console.log(aa[jIndex-1].meu)
       if(UserData.meu==aa[jIndex-1].meu){
           index=index;
           UserData['rank']=index
           userWithRank.push(UserData);
          }
         else{
           index=index+1;
           UserData['rank']=index
           userWithRank.push(UserData);
          }
       }
       else if(jIndex==0){
         index=index+1;
         UserData['rank']=index
         userWithRank.push(UserData);
       } 
     });
   //  userWithRank.forEach((userData,ind)=>{
     for(let i=0; i<userWithRank.length;i++){
       if(userWithRank[i]['data'].id==this.state.myId){
         userWithRank.splice(i,1)
         break;
       }
     }
         //alert(JSON.stringify(userWithRank));
    // })
    this.setState({friendList:userWithRank});
   // this.setState({loading:false})
    //  this.setState({user : userWithRank},()=>{
    //    //alert(this.state.user); 
    //   });
 }
  openUserHolding(userId, name,url,points,rank,meu, friendStatus,userData){ 
    this.props.navigation.navigate('userHolding',{date:this.props.date,'quater':this.props.quarter,'userId':userId,'name':name,'imageUrl': url,'points':points,'rank':rank,'meu':meu,'friendStatus':friendStatus,'userData':userData,'loginUserId':this.state.myId,friendPage:true});
   }

  //written by souvik..
  componentWillMount(){
    this.props.navigation.addListener('willFocus',this.willFocus)
  }

  willFocus = () => {      
    this.forceUpdate();
  }

  gameReset(){

    let currentDate = moment(new Date()).format("DD/MM/YYYY HH:mm:ss")
    console.log("dateis*****", currentDate);
    if(this.state.quarter == 'Q1-2019'){
      this.calculateDays(currentDate, this.q1);
    }
    else if(this.state.quarter == 'Q2-2019'){
      this.calculateDays(currentDate, this.q2);
    }
    else if(this.state.quarter == 'Q3-2019'){
      this.calculateDays(currentDate, this.q3);
    }
    else if(this.state.quarter == 'Q4-2019'){
      this.calculateDays(currentDate, this.q4);
    }
  }

  calculateDays(todayDate, gameQuarter){

    var ms = moment(gameQuarter,"DD/MM/YYYY HH:mm:ss").diff(moment(todayDate,"DD/MM/YYYY HH:mm:ss"));
    var d = moment.duration(ms);
    let seconds = d.asMilliseconds() / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;
    let time = days + ":" + hours % 24 + ":" + minutes % 60 + ":" + seconds % 60;
    this.state.gameResetDay = parseInt(days);
    this.state.gameResetHour = parseInt(hours % 24)
  }
  
render()
  {
    let list;
    let count=0; 
    let that=this; 
    let len=this.state.friendList.length; 
    if(this.state.friendList.length==0){
      list=(<Text style={{width:'100%',alignItems:'center',textAlign:'center'}}>You have not added anyone in your friendlist</Text>)
    }
    else {
        list=this.state.friendList.map((friendData, jIndex, array) =>{
        let imageUrl = friendData.data.picture.data.url
        let index;
        count=count+1;
        if(len==count){
          if(that.state.loading){
           that.setState({loading:false});
          }
        }
        // if(jIndex!=0){
        //   let aa=array;
        //   console.log(aa);
        //   console.log(aa[jIndex-1].meu)
        //   if(friendData.meu==aa[jIndex-1].meu){
        //     index=<Text style={styles.ranktext}>#{jIndex}</Text>
        //   }
        //   else{
        //     index=<Text style={styles.ranktext}>#{jIndex+1}</Text>
        //   }
        // }
        // else if(jIndex==0){
        //   index=<Text style={styles.ranktext}>#{jIndex+1}</Text>
        // }
        let meuView
         if(friendData.meu==undefined){
            meuView= <Text style={{fontSize:12 }}>μ =0% p.a.</Text>
         }
         else{
          meuView= <Text style={{fontSize:12 }}>μ ={parseFloat(friendData.meu).toFixed(3)}% p.a.</Text>
         }
        return(
          <View style={styles.contain} key={jIndex}>
           <TouchableOpacity style={{flex:1,height:60,flexDirection:'row',padding:5}} onPress={this.openUserHolding.bind(this,friendData.data.id,friendData.data.name,friendData.data.picture.data.url,friendData.data.points,index,friendData.meu,true,friendData.data)}> 
             <View style={styles.rankContainer}>
             <Text style={styles.ranktext}>#{friendData.rank}</Text>
             </View>
             <View style={styles.viewContainer}>
               <Image style={{width:45,height:45,borderRadius: 45/2}} source={{uri: imageUrl}}></Image>
               <View style={{flex:3,flexDirection:'row',paddingLeft:10}}>
                 <View style={{flex:1,flexDirection:'column'}}>
                   <Text style={{fontSize:15,color:'#000'}}>{friendData.data.name}</Text>
                   {meuView}
                 </View>
               </View>
            
             </View>
              </TouchableOpacity> 
          </View>
        );
      }); 
    }
   
   return(
    <View style={{height: Dimensions.get('window').height-250,}}>
    <ScrollView contentContainerStyle={styles.container}>
            <View style={{flex:1, flexDirection:'row'}}>
              <View style={{flex:1, alignItems:'flex-start'}}>
              <Text style={styles.heading}> Friend List</Text>
              </View>
              <View style={{flex:1, alignItems:'flex-end'}}>
              <Text style={styles.headingDate}>{this.props.date}</Text>
              </View>
            </View>

            <View style={{alignItems:'center', width:'100%', height:30, marginBottom:10, marginTop:-10, fontSize:21}}>
              <Text style={styles.headingDate}>Game round ends: {this.state.gameResetDay} days {this.state.gameResetHour} hrs</Text>
            </View>
    
        {/* <Text>  friends</Text> */}
        {list}

        <ProgressDialog
          visible={this.state.loading}
          message="Please Wait.." >
          <View>  
          </View>
        </ProgressDialog>
    </ScrollView>
    </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    },
    rankContainer:{
     height:60,
     flex:1,
     paddingTop:15,
     alignItems:'flex-start'
     },
     viewContainer:{
      flex:6,
      flexDirection:'row',
     },
     contain:{ 
      width:Dimensions.get('window').width/1.05, 
      flex:1,
      alignItems:'center',
     flexDirection:'row',
     borderBottomColor: '#eff0f1',
     borderBottomWidth: 1,
     marginRight:10,
     marginLeft:10
    },
  heading:{
    width:Dimensions.get('window').width,
    alignItems:'flex-start',
    textAlign:'left',
    fontWeight: "bold",
    fontSize:15,
    color:'#000000',
    padding :10,
  },
  headingDate:{  
    fontSize:15,
    color:'#FF0000',
    padding :10,
  },
  ranktext:{
    fontSize:20,
    fontWeight:'bold',
  }
 
     
});

export default Friends;