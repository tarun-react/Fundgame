var Dimensions = require('Dimensions')
var {width, height} = Dimensions.get('window')
export default {
    BASE_URL : "http://54.188.116.54:8080/api/",
    CONTENT_URL : "http://54.188.116.54:8080/Content/img/",
    WINDOW_WIDTH : width,
    WINDOW_HEIGHT : height,
    FACEBOOK_LOGIN : 0,
    GOOGLE_LOGIN : 1,
    GET_ALPHA_URL : function(type, fun){
        let funType = fun ? fun : "TIME_SERIES_DAILY_ADJUSTED";
        return "https://www.alphavantage.co/query?function=" + funType +"&symbol=" + type + "&apikey=BGNWTIMTCANMAKCY&outputsize=compact";
    },
    GET_BBANDS_URL : function(fun, type){
        return "https://www.alphavantage.co/query?function=" + fun +"&symbol=" + type + "&interval=weekly&time_period=20&series_type=close&nbdevup=3&nbdevdn=3&apikey=BGNWTIMTCANMAKCY";
    },
    GET_RSI_URL : function(fun, type){
        return "https://www.alphavantage.co/query?function=" + fun +"&symbol=" + type + "&interval=weekly&time_period=10&series_type=open&apikey=BGNWTIMTCANMAKCY";
    },
    GET_MACD_URL : function(fun, type){
        return "https://www.alphavantage.co/query?function=" + fun +"&symbol=" + type + "&interval=weekly&series_type=open&apikey=BGNWTIMTCANMAKCY";
    },
    GET_SECTOR_URL : function(){
        return "https://www.alphavantage.co/query?function=SECTOR&apikey=BGNWTIMTCANMAKCY";
    },
    GET_TIMESERIESDAILYADJUSTED_URL : function(fun, type){
        return "https://www.alphavantage.co/query?function=" + fun +"&symbol=" + type + "&apikey=BGNWTIMTCANMAKCY&outputsize=compact";
    },
};