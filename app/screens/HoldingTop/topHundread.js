import React, { PropTypes } from 'react';
import firebase from 'react-native-firebase';
import { TouchableOpacity,ScrollView, Text,View,Image, ActivityIndicator,StyleSheet, AsyncStorage } from 'react-native';
import { Dimensions } from 'react-native';
import { ProgressDialog } from 'react-native-simple-dialogs';
import moment from 'moment';


class TopHundread extends React.Component
{
  user = [];
  friendList = [];
  finalList = [];
  q1 = '31/03/2019 23:59:59';
  q2 = '30/06/2019 23:59:59';
  q3 = '30/09/2019 23:59:59';
  q4 = '31/12/2019 23:59:59';
  constructor(props) {
    super(props);
    this.state={
        userImage: require('./../../../assets/images/user.png'),
        name:'wilson benedict Lim',
        text:'M = 800000 % P.A.',
        user:[],
        quaterdata:[],
        loading : true,
        myId:'', 
        addingFriendIndex:'',
        friendList:[], 
        finalList:[],
        quarter:this.props.quarter,
        date:this.props.date,
        gameResetDay:'',
        gameResetHour:''
    };
   // this.setState({addingFriendIndex:0})
   
    this.getvalue();
    this.getMyId();
  }    
   filter(text){
     let alldata;
     alldata=this.state.user;
     if(text=='')
     {
       this.setState({user:this.user})
     }
     else{
     let filterarr=[];
      this.user.forEach((da,i)=>{
       let user=da.name 
      if((user.toLowerCase()).includes(text.toLowerCase()) )
      {
        filterarr.push(da);
      }
     })
      this.setState({user: filterarr})
     console.log("data1"+" "+ this.state.data );  
   }
   } 
   componentWillMount(){
     this.props.navigation.addListener('willFocus',this.willFocus)
   }

   willFocus = () => {
    
            if(this.state.addingFriendIndex.length > 0){

            }
            this.getListOfFriend(undefined,undefined,undefined,true);
   }
  //  componentDidMount() {
  //   let that=this; 
  //   alert(this.props.navigation)
  //   that.willFocusSubscription = that.props.navigation.addListener(
  //     'willFocus',
  //     () => { 
  //       () => { 
  //         
  //     }
  //       });
      
  // }
  // //  componentDidMount() {
  //   let that=this;
  //   debugger
  //   this.willFocusSubscription = this.props.navigation.addListener(
  //     'willFocus',
  //     () => { 
  //         that.setState({loading:true});
  //         that.getListOfFriend(undefined,undefined,undefined,true); 
  //     }
  //   ); 
  // }

  
   getListOfFriend(id ,type , keyy,loderType){  
     console.log('idddd',id);
     let url='users/'+this.state.myId+'/friends';
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
           this.finalList=[];
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
            firebase.database().ref('users/'+this.state.myId+'/friends').child(keyy).remove().then(()=>{
              that.finalList.splice(indexnum, 1);
            that.setState({finalList:that.finalList});
            });
            
           }
         } 
       }
       this.setState({addingFriendIndex:''}); 
     });
   }
   getvalue(){  
      let date=new Date();
      let url;
      let url1 = 'users/'
      let that = this;
      let month=date.getMonth()+1;
      let meuData1=[];
      let tempUser=[];
      let lengthk=0; 
      url=this.state.quarter;
      console.log("quarter****", this.state.quarter);
      // debugger
     firebase.database().ref(url).once('value').then((data) => {
       lengthk=Object.keys(data.val()).length;
       let count=0
          Object.keys(data.val()).map((key)=>{ 
            let dd=data.val()[key]; 
            console.log("userlistarray*********",key);
            firebase.database().ref(url1+key).once('value').then((da) => {
              count=count+1 
              let userd=da.val();
              length=Object.keys(da.val()).length;
              userd['meu']=dd.meu;
              that.user.push(userd);
              that.user = that.user.sort(function(a, b){return b.meu - a.meu})
              if(count==lengthk){
                that.getMyFriends(that.user);
              }
              }).catch((err)=>{
              console.log(JSON.stringify(err))
               });
           });
          //  console.log(that.state.user);
          //  that.setState({quaterdata: meuData1},()=>{
          // });
         // that.getMyFriends();
        }).catch((err)=>{
           console.log(JSON.stringify(err))
        });

        this.gameReset();
    }
 

    addFriend = (friendData, index) =>{
     // alert(this.checkIsFriend(friendData.id));
      this.setState({addingFriendIndex:index}) 
    if(this.state.finalList.length>=9999){
      alert('you can add max 9,999 number of Friends');
    }else{
     
      let url = "users/"+this.state.myId+"/friends";
      let that=this;
      this.state.user[index]['isFriend'] = true;
      this.setState(this.state.user)
       ; 
      firebase.database().ref(url).push(friendData).then(() => {  
        that.getListOfFriend(friendData.id,'0','',true);
      });
    }
  
    }
    removeFriend = (allData,ind) =>{
      this.setState({addingFriendIndex:ind})
       let url='users/'+this.state.myId+'/friends';
       let that=this; 
       firebase.database().ref(url).once('value').then((data) => {
          let allDatalist = data.val();
          Object.keys(allDatalist).forEach(function(key){
            if(allDatalist[key]['id']==allData['id']){
              that.getListOfFriend(allData.id,'1',key,true);
            }
          });
       });
    }
    delete(){
      
    }
    getMyFriends(user){
       let friendsUrl = "users/"+this.state.myId+"/friends";
             let that = this;
              firebase.database().ref(friendsUrl).once('value').then((data) => {
                 
                  console.log("friends array************", data.val());
                  let arr = [];
                  if(data.val()!=null){
                    Object.keys(data.val()).map((key)=>{ 
                      let dd=data.val()[key];
                      console.log("Key**********",key);
                      console.log("value**********", dd);
                      arr.push(dd.id);
                    });
                  }
                  that.friendList = arr;
                  that.setState({friendList:that.friendList},()=>{
                    that.checkRank(user);
                  });
                
                // that.getSelectedOne(that.friendList);
              }).catch((err)=>{
                console.log("this is error", err);
              });  
    }
    checkRank(allUser){
       //alert(allUser);
       let userWithRank=[];
       let myRank;
       let index=0;
       allUser.map((UserData, jIndex,array) =>{ 
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
        // for(let i=0; i<userWithRank.length;i++){
        //   if(userWithRank[i].id==this.state.myId){
        //     userWithRank.splice(i,1)
        //     break;
        //   }
        // }
            //alert(JSON.stringify(userWithRank));
       // })
        this.setState({user : userWithRank},()=>{
          //alert(this.state.user); 
         });
         if(this.state.loading){
          this.setState({loading:false});
         }
    }
    async getMyId(){
      let user = await AsyncStorage.getItem('user');
      console.log("myid********", user);
      let userId = JSON.parse(user);
      console.log("myid*******new", userId.id);
      this.setState({myId:userId.id},()=>{
        this.getListOfFriend();
      })
    }
    // openHolding(id){ 
    //   debugger
    //   this.props.all.props.navigation.navigate('userHolding',{date:this.props.date,'quater':this.props.quarter,'id':id});
    //   // this.props.navigation.navigate('userHolding',{date:this.state.date,'quater':q});
    // }
  checkIsFriend(id){
    console.log("iddddddd", id)
    console.log("friendList", this.friendList);
    console.log(this.finalList.indexOf(id)==-1 ? false : true);
    return this.finalList.indexOf(id)==-1 ? false : true;
  }
  openUserHolding(userId, name,url,points,rank,meu, friendStatus,userData,index){ 
    this.setState({addingFriendIndex:index})
   this.props.navigation.navigate('userHolding',{date:this.props.date,'quater':this.props.quarter,'userId':userId,'name':name,'imageUrl': url,'points':points,'rank':rank,'meu':meu,'friendStatus':friendStatus,'userData':userData,'loginUserId':this.state.myId,friendPage:false});
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
    let mydata;
    let mydatavalue =null;
    let myRank;
    let d;
    let meu;
    let id;
    let len=this.state.user.length;
    let count=0; 
    let that=this; 
    console.log('user',this.state.user);
    let list;
    if(this.state.user.length==0){
      list=(<Text style={{width:'100%',alignItems:'center',textAlign:'center'}}>No user found.</Text>)
   }
   else {
    list=this.state.user.map((UserData, jIndex,array) =>{ 
        let index;
        // if(jIndex!=0){
        //   let aa=array;
        //   console.log(aa);
        //   console.log(aa[jIndex-1].meu)
        //   debugger
        //   if(UserData.meu==aa[jIndex-1].meu){
        //       myRank=jIndex;
        //       index=<Text style={styles.ranktext}>#{jIndex}</Text>
        //      }
        //     else{
        //       myRank=jIndex+1;
        //       index=<Text style={styles.ranktext}>#{jIndex+1}</Text>
        //      }
        //   }
        //   else if(jIndex==0){
        //     myRank=jIndex+1;
        //     index=<Text style={styles.ranktext}>#{jIndex+1}</Text>
        //   } 
        //   if(UserData.id==this.state.myId){
        //     mydatavalue=UserData;
        //   }
         let d=UserData.picture.data.url;
         let id=UserData.id;
         let meuView;
         if(UserData.meu==undefined){
            meuView= <Text style={{fontSize:12 }}>μ =0% p.a.</Text>
            meu=0
         }
         else{
          console.log("meuis********", UserData.meu);
          meuView= <Text style={{fontSize:12 }}>μ ={parseFloat(UserData.meu).toFixed(3)}% p.a.</Text>
          meu=parseFloat(UserData.meu).toFixed(6)
         }
       count=count+1;
       if(len==count){
         if(that.state.loading){
          that.setState({loading:false});
         }
       }
       //debugger
      //  alert(this.state.addingFriendIndex === jIndex);
      // alert(UserData.id!=this.state.user.id)
        return ( <View style={styles.contain} key={jIndex}>
                    <View style={styles.rankContainer}>
                    <Text style={styles.ranktext}>#{UserData.rank}</Text>
                    </View>
                    <View style={styles.viewContainer}>
                        <TouchableOpacity style={{flex:2,flexDirection:'row'}}onPress={this.openUserHolding.bind(this,UserData.id,UserData.name,UserData.picture.data.url,UserData.points,index,meu,this.checkIsFriend(UserData.id),UserData,jIndex)}>
                          <View style={{flex:1}}>
                           <Image  style={{width:45,height:45,borderRadius: 45/2}} source={{uri: d}}></Image>
                          </View>
                          <View style={{flex:3,flexDirection:'row',paddingLeft:10}}>
                            <View style={{flex:1,flexDirection:'column'}}>
                              <Text style={{fontSize:15,color:'#000'}}>{UserData.name}</Text>
                              {meuView}
                            </View>
                          </View>
                        </TouchableOpacity> 
                        
                        {this.state.addingFriendIndex === jIndex   && UserData.id!=this.state.myId ?
                        //loader
                        <ActivityIndicator size='large' color='#000' />
                        :

                        //view
                        <>

                        {  this.checkIsFriend(UserData.id) ? 
                        
                          <TouchableOpacity style={this.state.myId==UserData.id?'':styles.alreadyFriend}>
                              <Text  style={styles.friendText} onPress={this.removeFriend.bind(this, UserData, jIndex)}> Remove Friend</Text>
                          </TouchableOpacity> : 
                           <TouchableOpacity style={this.state.myId==UserData.id?'':styles.addFriend} onPress={this.addFriend.bind(this, UserData, jIndex)}>
                              <Text style={styles.friendText}> Add Friend</Text>
                          </TouchableOpacity> }
                      </>
                      
                        }
                    </View>
               </View>
        ); 
      //}
  });   
}
    return( 
      <View style={{height: Dimensions.get('window').height-250,}}>
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{flex:1, flexDirection:'row'}}>
              <View style={{flex:1, alignItems:'flex-start'}}>
              <Text style={styles.heading}> Top 100 this Quarter</Text>
              </View>
              <View style={{flex:1, alignItems:'flex-end'}}>
              <Text style={styles.headingDate}>{this.props.date}</Text>
              </View>
            </View>
            <View style={{alignItems:'center', width:'100%', height:30, marginBottom:10, marginTop:-10, fontSize:21}}>
              <Text style={styles.headingDate}>Game round ends: {this.state.gameResetDay} days {this.state.gameResetHour} hrs</Text>
            </View>
        
            {list}

            <ProgressDialog
                visible={this.state.loading}
                message="Please Wait.." >
        
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
   
     ranktext:{
       fontSize:20,
       fontWeight:'bold',
     },
     viewContainer:{
      flex:6,
      flexDirection:'row',
     },
     img:{
        width:50,
        height:50
     },
    contain:{
      padding:5,
      width:Dimensions.get('window').width/1.05,
      height:60,
      alignItems:'center',
     flexDirection:'row',
     borderBottomColor: '#eff0f1',
     borderBottomWidth: 1,
     marginRight:10,
     marginLeft:10
    },
    contain2:{
      padding:5,
     width:Dimensions.get('window').width/1.05,
     height:60,
     alignItems:'center',
     flexDirection:'row',
     borderBottomColor: '#eff0f1',
     borderBottomWidth: 1,
     marginRight:10,
     marginLeft:10,
     backgroundColor: '#E91E63',
  
    },
  heading:{ 
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
 
  addFriend:{
    height:30,
    width:90,
    alignItems: 'center',
    right:0,
    padding:5,
    backgroundColor:'#1d93d6'
  },
  alreadyFriend:{
    
    height:30,
    right:0,
    padding:5,
    alignItems: 'center',
    backgroundColor:'#B00020'
  },
  friendText:{
    fontSize:12,
    color:'#FFFFFF',
    height:'100%',
    textAlign:'center'
  }
});

export default TopHundread;