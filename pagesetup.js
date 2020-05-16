// Merge RSRP, RSSI, RSCP on to same graph
MERGED = ["rsrp", "rssi", "rscp"];

const CHARTS = {
  "merged" : null,
  "ecio" : null,
  "rsrq" : null,
  "sinr" : null,
}

let PREVADV = "";
let ADVBUFFER = [];

function addAdv(adv) {
  if (ADVBUFFER.length > 20) { ADVBUFFER.shift(); }
  ADVBUFFER.push(adv);
}

function addData(dataname, item) {
  let il = CHARTS[dataname].data; 
  let remove = 0;
  let idata = {};
  if (il.length > 80) { remove = 1; }
  if (dataname === 'merged') {
    idata["date"] = new Date();
    for(const i of item) {
      idata[i[0]] = i[1];
    }
  } else {
    idata = {"date": new Date(), "value": item};
  }
  CHARTS[dataname].addData(idata, remove);
}

function createChart(name) {
  let ichart = am4core.create(name, am4charts.XYChart);
  ichart.data = [];
  ichart.xAxes.push(new am4charts.DateAxis());
  ichart.yAxes.push(new am4charts.ValueAxis());
  if (name === 'merged') {
    for (const ikey of MERGED) {
      let iseries = ichart.series.push(new am4charts.LineSeries());
      iseries.dataFields.valueY = ikey;
      iseries.dataFields.dateX = "date";
      iseries.name = ikey.toLocaleUpperCase();
    }
  } else {
    let series = ichart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.name = name.toLocaleUpperCase();
  }
  ichart.legend = new am4charts.Legend();
  ichart.legend.position = "left";
  CHARTS[name] = ichart;
}

window.addEventListener("DOMContentLoaded", () => {
  am4core.useTheme(am4themes_amchartsdark);
  am4core.useTheme(am4themes_dark);
  // Create charts
  for (let key in CHARTS) {
    createChart(key);
  }
  document.getElementById('urlinput').addEventListener('input', updateSetting);
  document.getElementById('delayinput').addEventListener('input', updateSetting);
});