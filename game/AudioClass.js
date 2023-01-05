export class AudioClass{
    constructor(){

        this.audioa = new Audio('../../common/music/rakija.mp3');      
        this.audioa.volume = 0.3
        this.audioa.loop = true;

        this.audiob = new Audio('../../common/music/srce.mp3');      
        this.audiob.volume = 0.3
        this.audiob.loop = true;

        this.playing = 0;

      
    }

    playA(){
        this.audioa.play();
        this.audiob.pause();
        this.audiob.currentTime = 0;

        document.addEventListener("wheel", (event) => { 
            this.volumeA(event, this) 
        }); 
        
    }

    playB(){
        this.audioa.pause();
        this.audioa.currentTime = 0;
        this.audiob.play();

        document.addEventListener("wheel", (event) => { 
            this.volumeB(event, this) 
        }); 
        
    }

    stop(){
        this.audioa.pause();
        this.audioa.currentTime = 0;
        this.audiob.pause();
        this.audiob.currentTime = 0;
    }


    volumeA(e, ctx){
        if(ctx.audioa.volume - 0.0003*e['deltaY'] > 0){
        ctx.audioa.volume = ctx.audioa.volume - 0.0003*e['deltaY']
        }
    }
    
    volumeB(e, ctx){
        if(ctx.audiob.volume - 0.0003*e['deltaY'] > 0){
        ctx.audiob.volume = ctx.audiob.volume - 0.0003*e['deltaY']
        }
    }
    

}


