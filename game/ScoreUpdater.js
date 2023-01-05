const plumScore = document.getElementById('plumnumber');
const branchScore = document.getElementById('branchnumber');
    
export function updatePlums(plums){
    plumScore.innerHTML="Plums: " + plums;
}

export function updateBranches(branches){
    branchScore.innerHTML="Branches: " + branches;
}



