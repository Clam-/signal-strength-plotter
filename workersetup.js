var myWorker = new Worker('workerscript.js');

const workerTask = (type, arg) => {
  // check if a worker has been instanced
  if (window.Worker) {
    myWorker.postMessage({type, arg});
  }
}

function log(item) {
    console.log(item);
}

myWorker.onmessage = function(e) {
    //console.log('Message received from worker');
    let msgdata = e.data.data;
    let type = e.data.type;
    if (type === 'start') {
        console.log("Started...");
    } else if (type === 'log') {
        log(msgdata);
    } else if (type === 'dataUpdate') {
        //process returned data...
        processData(msgdata);
    }    
    else {
    console.error('An Invalid type has been passed in');
    }
}

window.addEventListener("DOMContentLoaded", () => {
    workerTask('start', []);
});

function processData(incoming) {
    // process signal
    for (let key in CHARTS) {
        if (key === 'merged') {
            // mash data together
            let idata = [];
            for (const akey of MERGED) {
                idata.push([akey, incoming["signal"][akey]]);
            }
            addData(key, idata);
        } else { addData(key, incoming["signal"][key]); }
    }
    // process everything else:
    document.getElementById("batt").innerText = incoming["batt"];
    document.getElementById("conn").innerText = incoming["connection"];
    // process cell log buffer:
    if (PREVADV != incoming["adv"]){
        ADVBUFFER.push(incoming["adv"]); PREVADV = incoming["adv"];
        document.getElementById("celllog").value = ADVBUFFER.join("\n");
    }
}

function updateSetting(event) {
    if (event.target.value) {
        workerTask(event.target.id, event.target.value);
    }
}