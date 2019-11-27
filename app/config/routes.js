import { createStackNavigator, createAppContainer} from 'react-navigation';
import Login from '../screens/Login/Login';
import { fromRight } from 'react-navigation-transitions';
import Home from '../screens/Home/Home';
import BuySellScreen from '../screens/BuySellScreen/BuySellScreen';
import MillionaireDream from '../screens/MillionaireDream/MillionaireDream';
import GameRule from '../screens/GameRule/GameRule';
import HoldingScreen from '../screens/HoldingScreen/HoldingScreen';
import userHolding from '../screens/userHolding/userHolding';
import HoldingTop from '../screens/HoldingTop/HoldingTop';

const RootNavigation = createStackNavigator({
        Login: {
            screen: Login,
            navigationOptions: {
                header: () => null,
                headerTitle: 'Login'
            },
        },
        userHolding: {
            screen: userHolding,
            navigationOptions:{
                header:() => null,
                headerTitle: 'Holding'
            }
        },
        Home: {
            screen: Home,
            navigationOptions: {
                header: () => null,
                headerTitle: 'Home'
            },
        },
        BuySellScreen: {
            screen: BuySellScreen,
            navigationOptions: {
                header: () => null,
                headerTitle: 'BuySellScreen'
            },
        },
        MillionaireDream : {
            screen : MillionaireDream,
            navigationOptions: {
                header: () => null,
                headerTitle: 'MillionaireDream'
            },
        },
        HoldingScreen : {
            screen : HoldingScreen,
            navigationOptions: {
                header: () => null,
                headerTitle: 'HoldingScreen'
            },
        },
        GameRule : {
            screen: GameRule,
            navigationOptions: {
                header: () => null,
                headerTitle: 'GameRule'
            },
        },
        HoldingTop:{
            screen:HoldingTop,
            navigationOptions:{
                header:()=>null,
                headerTitle:'Top 100'
            }
        },
         
    },
    {
        initialRouteName: 'Home',
        transitionConfig: () => fromRight(200),
    }
);
export default createAppContainer(RootNavigation);