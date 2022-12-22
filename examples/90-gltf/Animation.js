export class Breathing{

    constructor(entity){
        this.entity = entity;
        this.breathing = true;
        this.bi = 1;
        this.bo = -1;
        this.speed = 0.008;
        this.cap = 0.00005
        }

    breathe(){
        let bs;
        let bi;
        if(this.entity.player.running){
            bs = 4*this.speed;
            bi = 4*this.cap
        }else{
            bs = this.speed
            bi = this.cap
        }
        if(this.breathing){ 
            this.entity.translation[1]+=bi
            this.bi-=bs;
            if(this.bi<=0){
                this.breathing = false;
                this.bi=1;
            }
        }else{
            this.entity.translation[1]-=bi
            this.bo+=bs;
            if(this.bo>=0){
                this.breathing = true;
                this.bo = -1;
            }
        }
    }
}