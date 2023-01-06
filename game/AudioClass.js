export class AudioClass{
    constructor(distance){

        this.audioa = new Audio('../../common/music/rakija.mp3');      
        this.audioa.volume = 0.4
        this.audioa.loop = true;
        this.aset = 0.4

        this.audiob = new Audio('../../common/music/srce.mp3');      
        this.audiob.volume = 0.4
        this.audiob.loop = true;
        this.bset = 0.4
        this.distance = distance;
        this.playing = 0;

      
    }

    playA(){
        this.audioa.play();
        this.playing = 1;
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
        this.playing = 2;
        document.addEventListener("wheel", (event) => { 
            this.volumeB(event, this) 
        }); 
        
    }

    stop(){
        this.audioa.pause();
        this.audioa.currentTime = 0;
        this.audiob.pause();
        this.audiob.currentTime = 0;
        this.playing = 0;
    }


    volumeA(e, ctx){

        if(this.playing == 1){
            if(this.distance < 1.2){
                if(0 < ctx.audioa.volume - 0.0003*e['deltaY'] && ctx.audioa.volume - 0.0003*e['deltaY'] < 1){
                    ctx.audioa.volume = ctx.audioa.volume - 0.0003*e['deltaY'];
                    this.aset = ctx.audioa.volume;
                }
            }
        }
    }
    
    volumeB(e, ctx){

        if(this.playing == 2){
            if(this.distance < 1.2){
                if(0 < ctx.audiob.volume - 0.0003*e['deltaY'] && ctx.audiob.volume - 0.0003*e['deltaY'] < 1){
                    ctx.audiob.volume = ctx.audiob.volume - 0.0003*e['deltaY'];
                    this.bset = ctx.audiob.volume;
                }
            }
        }
    }
    
    updateVolume(){
        if(this.distance > 1.2){
            if(this.aset/(this.distance/7) < this.aset){
                this.audioa.volume = this.aset/(this.distance/7);
            }
            
            if(this.bset/(this.distance/7) < this.bset){
                this.audiob.volume = this.bset/(this.distance/7);
                console.log(this.audiob.volume)
            }

        }
    }

}


