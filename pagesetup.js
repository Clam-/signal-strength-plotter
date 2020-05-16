const CHARTS = {
  "rssi" : null,
  "rscp" : null,
  "ecio" : null,
  "rsrp" : null,
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
  if (il.length > 50) { remove = 1; }
  CHARTS[dataname].addData({"date": new Date(), "value": item}, remove);
}

function createChart(name) {
  let ichart = am4core.create(name, am4charts.XYChart);
  ichart.data = [];
  ichart.xAxes.push(new am4charts.DateAxis());
  ichart.yAxes.push(new am4charts.ValueAxis());
  var series = ichart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = "value";
  series.dataFields.dateX = "date";
  series.name = name.toLocaleUpperCase();
  //ichart.scrollbarX = new am4core.Scrollbar();
  //ichart.scrollbarY = new am4core.Scrollbar();
  CHARTS[name] = ichart;
}

window.addEventListener("DOMContentLoaded", () => {
  // Create charts
  for (let key in CHARTS) {
    createChart(key);
  }
  document.getElementById('urlinput').addEventListener('input', updateSetting);
  document.getElementById('delayinput').addEventListener('input', updateSetting);
});