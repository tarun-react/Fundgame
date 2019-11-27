import React from "react";
import ReactNative from "react-native";
import styles from "./Styles";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import Rule from "./rule_tab";
import Macro from "./macroTab";
import Fundamental from "./fundamentalTab";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider
} from "react-native-popup-menu";
import { Dimensions } from "react-native";
import Container from "../Container";

class GameRule extends React.Component {
  constructor(props) {
    super(props);
    this.ruleRef = null;
    this.scrollViewRef = null;
    this.state = {
      pressStatusforTab1: true,
      pressStatusforTab2: false,
      pressStatusforTab3: false,
      heading: "Rules",
      scrollViewRef: "",
      ele: ""
    };
  }
  rulePage(t) {
    this.setState({ pressStatusforTab1: true });
    this.setState({ pressStatusforTab2: false });
    this.setState({ pressStatusforTab3: false });
    this.setState({ heading: "Rules" });
  }
  macro() {
    this.setState({ pressStatusforTab1: false });
    this.setState({ pressStatusforTab2: true });
    this.setState({ pressStatusforTab3: false });
    this.setState({ heading: "Macro Economics" });
  }
  fundamental() {
    this.setState({ pressStatusforTab1: false });
    this.setState({ pressStatusforTab2: false });
    this.setState({ pressStatusforTab3: true });
    this.setState({ heading: "Fundamental Analysis" });
  }
  back() {
    this.props.navigation.goBack();
  }
  setScrollViewRef = element => {
    this.scrollViewRef = element;
  };
  // someMethod(elew){
  //   debugger
  //   console.log(elew)
  //   this.scrollViewRef.scrollTo({x: 500, y: 500, animated: true});
  // }
  callbackFunction = childData => {
    // debugger
    this.setState({ ele: childData });
    console.log(childData);
    if (childData && this.scrollViewRef) {
      childData.measureLayout(
        ReactNative.findNodeHandle(this.scrollViewRef),
        (x, y) => {
          this.scrollViewRef.scrollTo({ x: 0, y: y, animated: true });
        }
      );
    }
  };
  handleObjective1(text) {
    //  debugger
    this.refs.rules.handleObjective();
  }
  handleRules1(text) {
    this.refs.rules.handleRules();
  }
  Assumption1(text) {
    this.refs.rules.Assumption();
  }
  render() {
    let back1 = require("./../../../assets/images/back-arrow.png");
    let viewJs = null;
    let topButtonofruletab = null;
    let MenuImg = require("./../../../assets/images/hamberger_icon.png");
    let bottomImg = require("./../../../assets/images/loginTop.png");
    let rule = require("./../../../assets/images/rules_icon.png");
    let micro = require("./../../../assets/images/macro_economics_icon.png");
    let fundamental = require("./../../../assets/images/fundamental_analysis_icon.png");
    if (this.state.pressStatusforTab1 == true) {
      viewJs = <Rule ref="rules" parentMethod={this.callbackFunction} />;
      topButtonofruletab = (
        <View style={{ height: 190 }}>
          <View style={styles.topmenu}>
            <View>
              <TouchableOpacity onPress={this.back.bind(this)}>
                <Image source={back1} style={{ width: 30, height: 30 }}></Image>
              </TouchableOpacity>
            </View>
            <View style={styles.homeText}>
              <Text style={styles.tophome}>{this.state.heading}</Text>
            </View>
          </View>
          <View style={styles.tabcontainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={
                this.state.pressStatusforTab1
                  ? styles.buttonPress
                  : styles.tabview
              }
              onPress={this.rulePage.bind(this)}
            >
              <Image source={rule}></Image>
              <Text style={styles.tabText}>Rules</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={
                this.state.pressStatusforTab2
                  ? styles.buttonPress
                  : styles.tabview
              }
              onPress={this.macro.bind(this)}
            >
              <Image source={micro}></Image>
              <Text style={styles.tabText}>Macro Economics</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={
                this.state.pressStatusforTab3
                  ? styles.buttonPress
                  : styles.tabview
              }
              onPress={this.fundamental.bind(this)}
            >
              <Image source={fundamental}></Image>
              <Text style={styles.tabText}>Fundamental Analysis </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gameScreen}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 5
              }}
            >
              <TouchableOpacity
                style={styles.calculateButton}
                onPress={this.handleObjective1.bind(this)}
              >
                <Text style={styles.buttonText}>Objective</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 5
              }}
            >
              <TouchableOpacity
                style={styles.calculateButton}
                onPress={this.handleRules1.bind(this)}
              >
                <Text style={styles.buttonText}>Rules</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 5
              }}
            >
              <TouchableOpacity
                style={styles.calculateButton}
                onPress={this.Assumption1.bind(this)}
              >
                <Text style={styles.buttonText}>Assumptions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    } else if (this.state.pressStatusforTab2 == true) {
      viewJs = <Macro />;
      topButtonofruletab = (
        <View style={{ height: 145 }}>
          <View style={styles.topmenu}>
            <View>
              <TouchableOpacity onPress={this.back.bind(this)}>
                <Image source={back1} style={{ width: 30, height: 30 }}></Image>
              </TouchableOpacity>
            </View>
            <View style={styles.homeText}>
              <Text style={styles.tophome}>{this.state.heading}</Text>
            </View>
          </View>
          <View style={styles.tabcontainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={
                this.state.pressStatusforTab1
                  ? styles.buttonPress
                  : styles.tabview
              }
              onPress={this.rulePage.bind(this)}
            >
              <Image source={rule}></Image>
              <Text style={styles.tabText}>Rules</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={
                this.state.pressStatusforTab2
                  ? styles.buttonPress
                  : styles.tabview
              }
              onPress={this.macro.bind(this)}
            >
              <Image source={micro}></Image>
              <Text style={styles.tabText}>Macro Economics</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={
                this.state.pressStatusforTab3
                  ? styles.buttonPress
                  : styles.tabview
              }
              onPress={this.fundamental.bind(this)}
            >
              <Image source={fundamental}></Image>
              <Text style={styles.tabText}>Fundamental Analysis </Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.gameScreen}>
          <View style={{width:'100%', paddingLeft:20, alignItems:'center', paddingRight:20,position:'absolute',top:0,flex:1,flexDirection:'row'}}>
            <View style={{ flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',padding:8}}>
                <TouchableOpacity style={styles.calculateButton} onPress={this.handleObjective1.bind(this)}>
                <Text style={styles.buttonText}>Objective</Text>
                </TouchableOpacity>
              </View> 
              <View style={{ flex:1, flexDirection:'row',alignItems:'center',justifyContent:'center',padding:8}}>
                <TouchableOpacity style={styles.calculateButton} onPress={this.handleRules1.bind(this)}>
                <Text style={styles.buttonText}>Rules</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',padding:8}}>
                <TouchableOpacity style={styles.calculateButton} onPress={this.Assumption1.bind(this)}>
                <Text style={styles.buttonText}>Assumptions</Text>
                </TouchableOpacity>
              </View>
          </View>
      </View> */}
        </View>
      );
    } else if (this.state.pressStatusforTab3 == true) {
      viewJs = <Fundamental />;
      topButtonofruletab = (
        <View style={{ height: 145 }}>
          <View style={styles.topmenu}>
            <View>
              <TouchableOpacity onPress={this.back.bind(this)}>
                <Image source={back1} style={{ width: 30, height: 30 }}></Image>
              </TouchableOpacity>
            </View>
            <View style={styles.homeText}>
              <Text style={styles.tophome}>{this.state.heading}</Text>
            </View>
          </View>
          <View style={styles.tabcontainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={
                this.state.pressStatusforTab1
                  ? styles.buttonPress
                  : styles.tabview
              }
              onPress={this.rulePage.bind(this)}
            >
              <Image source={rule}></Image>
              <Text style={styles.tabText}>Rules</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={
                this.state.pressStatusforTab2
                  ? styles.buttonPress
                  : styles.tabview
              }
              onPress={this.macro.bind(this)}
            >
              <Image source={micro}></Image>
              <Text style={styles.tabText}>Macro Economics</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={
                this.state.pressStatusforTab3
                  ? styles.buttonPress
                  : styles.tabview
              }
              onPress={this.fundamental.bind(this)}
            >
              <Image source={fundamental}></Image>
              <Text style={styles.tabText}>Fundamental Analysis </Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.gameScreen}>
          <View style={{width:'100%', paddingLeft:20, alignItems:'center', paddingRight:20,position:'absolute',top:0,flex:1,flexDirection:'row'}}>
            <View style={{ flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',padding:8}}>
                <TouchableOpacity style={styles.calculateButton} onPress={this.handleObjective1.bind(this)}>
                <Text style={styles.buttonText}>Objective</Text>
                </TouchableOpacity>
              </View> 
              <View style={{ flex:1, flexDirection:'row',alignItems:'center',justifyContent:'center',padding:8}}>
                <TouchableOpacity style={styles.calculateButton} onPress={this.handleRules1.bind(this)}>
                <Text style={styles.buttonText}>Rules</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',padding:8}}>
                <TouchableOpacity style={styles.calculateButton} onPress={this.Assumption1.bind(this)}>
                <Text style={styles.buttonText}>Assumptions</Text>
                </TouchableOpacity>
              </View>
          </View>
      </View> */}
        </View>
      );
    }

    return (
      <Container>
        <View style={{ flex: 1 }}>
          {topButtonofruletab}

          <ScrollView
            contentContainerStyle={styles.container}
            ref={this.setScrollViewRef.bind(this)}
          >
            {viewJs}
          </ScrollView>
        </View>
      </Container>
    );
  }
}

export default GameRule;
