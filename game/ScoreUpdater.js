const plumScore = document.getElementById('plumnumber');
const branchScore = document.getElementById('branchnumber');

const timer = document.getElementById('timer');

const fire = document.getElementById('fire');

const wplum = document.getElementById('maxp');
const wbranch = document.getElementById('maxb');

const gover = document.getElementById('gameover');

export function update(plumno, branchno, time, firetime){
    updatePlums(plumno);
    updateBranches(branchno);
    updateTime(time);
    updateFire(firetime);
}

function updatePlums(plums){
    plumScore.innerHTML="Plums: " + plums;
    plumScore.style.userSelect = 'none';
}

function updateBranches(branches){
    branchScore.innerHTML="Wood: " + branches;
    branchScore.style.userSelect = 'none';
}


function updateTime(time){
    timer.innerHTML="Time: " + secsToMinutesAndSeconds(time);
    timer.style.userSelect = 'none';
}

function updateFire(time){
    let styleElem = document.head.appendChild(document.createElement("style"));
    
    styleElem.innerHTML = ".firediv::before {width: "+time*4+"%;}";
    fire.value = time*4;
    fire.style.userSelect = 'none';
}


export function showPlumWarn(){
        wplum.style.visibility = 'visible'
        wplum.style.userSelect = 'none';
        setTimeout(()=>{wplum.style.visibility = 'hidden'}, 1000);
}

export function showBranchWarn(){
    wbranch.style.visibility = 'visible'
    wbranch.style.userSelect = 'none';
    setTimeout(()=>{wbranch.style.visibility = 'hidden'}, 1000);
}

export function gameOver(){
    gover.style.visibility = 'visible'
    gover.style.userSelect = 'none';
    document.getElementById("backbutton").style.visibility = "visible";
    document.exitPointerLock();
}


function secsToMinutesAndSeconds(seconds) {
    var minutes = Math.floor(seconds / 60).toFixed(0);
    var seconds = seconds - minutes*60;
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}