importScripts('stringinterp.js')
importScripts('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js')

// http://optus.ac800s/api/model.json?internalapi=1
// let URL = "http://localhost:8010/proxy/data.json?internalapi=1;"
//let URL = "http://localhost:8010/proxy/api/model.json?internalapi=1";
let URL = "http://localhost:8008/http://optus.ac800s/api/model.json";
let DELAY = 3000;
let INTERVALID = null;

axios.defaults.headers.common['Accept'] = '*/*';
axios.defaults.headers.common['Accept-Language'] = 'en-AU,en-US;q=0.9,en;q=0.8';

function log(item) {
    postMessage({
        type: "log",
        data: item,
    });
}

function reset() {
  // reset
  if (INTERVALID) { clearInterval(INTERVALID); }
  INTERVALID = setInterval(fetchdata, DELAY);
}

onmessage = function(e) {
    const type = e.data.type;
    const arg = e.data.arg;
    // console.log('Message received from main script');
    switch (type) {
      case 'start':
        // console.log('Posting message back to main script');
        INTERVALID = setInterval(fetchdata, DELAY);
        postMessage({
          type: type,
          data: true,
        });
        break;
      case 'urlinput':
        if (arg) { URL = arg; }
        break;
      case 'delayinput':
        if (arg) {
          let i = parseInt(arg);
          if (i && i >= 100) { DELAY = i; reset(); }
        }
        break;
      default:
        console.error('invalid type passed in');
        break;
    }
}

async function fetchdata() {
    let response = await axios.get(URL); //  + "&x=" + Math.floor(1E5 * Math.random() + 1)
    if (response.status == 200) {
      let wwan = response["data"]["wwan"];
      let wwanadv = response["data"]["wwanadv"];
      let sig = response["data"]["wwan"]["signalStrength"];
      let datastruct = {
        "batt" : response["data"]["power"]["battChargeLevel"],
        "connection" : "{0} - {1} ({2}  {3})".format(wwan["connection"], wwan["IP"], wwan["connectionText"], wwan["registerNetworkDisplay"]),
        "signal" : {
          "rssi" : sig["rssi"],
          "rscp" : sig["rscp"],
          "ecio" : sig["ecio"],
          "rsrp" : sig["rsrp"],
          "rsrq" : sig["rsrq"],
          "sinr" : sig["sinr"],
        },
        "adv" : [wwanadv["LAC"], wwanadv["MCC"], wwanadv["MNC"], wwanadv["RAC"], wwanadv["cellId"], wwanadv["chanId"], wwanadv["curBand"]].join(", ")
      }
      postMessage({
        type: "dataUpdate",
        data: datastruct,
      });
    }
}