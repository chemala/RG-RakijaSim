const plumScore = document.getElementById('plumnumber');
const branchScore = document.getElementById('branchnumber');

const timer = document.getElementById('timer');

const fire = document.getElementById('fire');

const wplum = document.getElementById('maxp');
const wbranch = document.getElementById('maxb');

const gover = document.getElementById('gameover');

const scorediv = document.getElementById('enddialog');
const percent = document.getElementById('percent');

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


export function gameOver(score){

    //gover.style.visibility = 'visible'
    //gover.style.userSelect = 'none';

    scorediv.style.visibility = 'visible'
    scorediv.style.userSelect = 'none';
    document.getElementById("backbutton").style.visibility = "visible";
    document.exitPointerLock();

    let color = percentageToHsl(score, 255, 360)
    percent.style.color = color;
    percent.innerHTML = (score/2).toFixed(0)+"%";
}


function secsToMinutesAndSeconds(seconds) {
    var minutes = Math.floor(seconds / 60).toFixed(0);
    var seconds = seconds - minutes*60;
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function percentageToHsl(percentage, hue0, hue1) {
    let hue = (percentage * (hue1 - hue0)) + hue0;
    return 'hsl(' + hue + ', 100%, 50%)';
}