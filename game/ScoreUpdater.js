const plumScore = document.getElementById('plumnumber');
const branchScore = document.getElementById('branchnumber');

const timer = document.getElementById('timer');
    
export function updatePlums(plums){
    plumScore.innerHTML="Plums: " + plums;
}

export function updateBranches(branches){
    branchScore.innerHTML="Branches: " + branches;
}


export function updateTime(time){
    timer.innerHTML="Time: " + secsToMinutesAndSeconds(time);
}


function secsToMinutesAndSeconds(seconds) {
    var minutes = Math.floor(seconds / 60).toFixed(0);
    var seconds = seconds - minutes*60
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}