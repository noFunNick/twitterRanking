var fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { TwitterApi } = require('twitter-api-v2');

var params = {
    dateRange: "52w",
    domains: "twitter.com",
    format: "JSON"
}
var headerObj = {
    // "X-Auth-Key": /////YOUR CLOUDFLARE API KEY////,,
    // "X-Auth-Email": "Your Cloudflare email"
}
var url = "https://api.cloudflare.com/client/v4/radar/ranking/timeseries_groups?dateRange=52w&domains=twitter.com,facebook.com&format=JSON"
async function getRanks(){
    let response = await fetch(url, {method: "GET", headers: headerObj})
    if(response.ok){
        let dataObj = await response.json()
        console.log(dataObj)
        var indexProp = dataObj.result.serie_0["twitter.com"].length
        var thisWeek = dataObj.result.serie_0["twitter.com"][indexProp - 1].toString();
        var lastWeek = dataObj.result.serie_0["twitter.com"][indexProp - 8].toString();
        var OneMonthAgo = dataObj.result.serie_0["twitter.com"][indexProp - 32].toString();
        var SixMonthsAgo = dataObj.result.serie_0["twitter.com"][parseInt(indexProp/2)].toString();
        var oneYearAgo = dataObj.result.serie_0["twitter.com"][0].toString();
        function getSuffix(str){
            if(str.slice(-1) == "1"){
                return "st"
            }
            else if(str.slice(-1)=="2"){
                return "nd"
            }
            else if(str.slice(-1)== "3"){
                return "rd"
            }
            else{
                return "th"
            }
        }
        var status = "Twitter.com domain popularity ranking: "+
        "\n\nToday: " + thisWeek + getSuffix(thisWeek) +
        "\nOne Week Ago: " + lastWeek + getSuffix(lastWeek) +
        "\nOne Month Ago: " + OneMonthAgo +getSuffix(OneMonthAgo) +
        "\nSix Months Ago: " + SixMonthsAgo + getSuffix(SixMonthsAgo) +
        "\nOne Year Ago: " + oneYearAgo + getSuffix(oneYearAgo) +
        "\n\nRanking data from https://radar.cloudflare.com/domains" +
        "\nThis bot will tweet this data daily. Have a good day!"
        console.log(status);
        const userClient =  await new TwitterApi({
                
            appKey: "you twitter api Key",
            appSecret: "your twitter api secret",
            accessToken: "your twitter access token",
            accessSecret: "your twitter access secret"
            //timeout_ms: 60 * 1000,
        });
        const rwClient = userClient.readWrite;
        try{
            await rwClient.v2.tweet(status);
        }
        catch{
            console.log('probably 503')
        }
        }
    else{
        console.log('error in fetch')
    }
    
}
getRanks();

function callEveryDay() {
    setInterval(getRanks, 1000 * 60 * 24);
}
callEveryDay();




