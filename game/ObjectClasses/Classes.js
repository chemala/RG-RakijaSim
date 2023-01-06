import { Node } from "../Node.js";
import { CamNode } from "../CamNode.js";
import { quat, vec3 } from "../../lib/gl-matrix-module.js";
import { PerspectiveCamera } from "../PerspectiveCamera.js";
import { Utils } from '../Utils.js';
import { AudioClass } from "../AudioClass.js";
import * as Score from '../ScoreUpdater.js'

export class Plum extends Node{
    constructor(options){
        super(options);
        this.movable = true
        this.world = false
    
    }

    getAABB(){

        let min =  this.mesh.primitives[0].attributes.POSITION.min
        let max = this.mesh.primitives[0].attributes.POSITION.max
        max[0] = 0.8
        max[2] = 1.7
        return {min: min, max: max}
        
        
    }

}


export class Branch extends Node{
    constructor(options){
        super(options);
        this.movable = true
        this.world = false
    }

    getAABB(){

        
        let min =  this.mesh.primitives[0].attributes.POSITION.min
        let max = this.mesh.primitives[0].attributes.POSITION.max
        return {min: min, max: max}
        
        
    }
}


export class World extends Node{
    constructor(options){
        super(options);
        this.movable = false
        this.world = true
        
    }

    getAABB(){

        let min =  this.mesh.primitives[0].attributes.POSITION.min
        let max = this.mesh.primitives[0].attributes.POSITION.max
        return {min: vec3.scale(min, min, 1), max: vec3.scale(max, max, 1)}
        
        
    }
}

export class PlumTree extends Node{
    constructor(options){
        super(options);
        this.movable = false
        this.world = false
        
    }

    
    getAABB(){

        let min =  this.mesh.primitives[0].attributes.POSITION.min
        min[0] = -0.1
        min[1] = -0.1
        min[2] = -0.1
        let max = this.mesh.primitives[0].attributes.POSITION.max
        max[0] = 0.1
        max[1] = 0.1
        max[2] = 0.1
        return {min: min, max: max}
        
        
    }
}
export class AppleTree extends Node{
    constructor(options){
        super(options);
        this.movable = false
        this.world = false
        
    }

    
    getAABB(){

        let min =  this.mesh.primitives[0].attributes.POSITION.min
        min[0] = -0.8
        min[1] = -1
        min[2] = -1
        let max = this.mesh.primitives[0].attributes.POSITION.max
        max[0] = 0.8
        max[1] = 1
        max[2] = 1
        return {min: min, max: max}
        
        
    }
}

export class Radio extends Node{
    constructor(options){
        super(options);
        this.movable = false
        this.world = false
        this.interacting = false;
        this.distance
        this.audio = new AudioClass(10);
        this.audio.playB();
        
    }

    update(player){
        this.distance = vec3.sqrDist(player.translation, this.translation);
        this.audio.distance = this.distance;
        this.audio.updateVolume();
        if(player.camera.keys['KeyE'] && this.audio.distance < 1.2){
            let playing = this.audio.playing;
            if(playing ==0 || playing == 2){
                this.audio.playA();
            }else{
                this.audio.playB();
            }            
        }
    }
    
    



    getAABB(){

        let min =  this.mesh.primitives[0].attributes.POSITION.min
        let max = this.mesh.primitives[0].attributes.POSITION.max
        return {min: min, max: max}
        
        
    }
}

export class RadioLog extends Node{
    constructor(options){
        super(options);
        this.movable = false
        this.world = false
        
    }

    getAABB(){

        let min =  this.mesh.primitives[0].attributes.POSITION.min
        let max = this.mesh.primitives[0].attributes.POSITION.max
        return {min: min, max: max}
        
        
    }
}

export class PineTree extends Node{
    constructor(options){
        super(options);
        this.movable = false
        this.world = false
        
    }

    
    getAABB(){

        let min =  this.mesh.primitives[0].attributes.POSITION.min
        min[0] = -1
        min[1] = -1
        min[2] = -1
        let max = this.mesh.primitives[0].attributes.POSITION.max
        max[0] = 0.7
        max[1] = 0.7
        max[2] = 1
        return {min: min, max: max}
        
        
    }
}



export class Tree extends Node{
    constructor(options){
        super(options);
        this.movable = false
        this.world = false
        
    }

    
    getAABB(){

        let min =  this.mesh.primitives[0].attributes.POSITION.min
        min[0] = -0.2
        min[1] = -0.1
        min[2] = -0.2
        let max = this.mesh.primitives[0].attributes.POSITION.max
        max[0] = 0.2
        max[1] = 0.1
        max[2] = 0.2
        return {min: min, max: max}
        
        
    }
}


export class Grass extends Node{
    constructor(options){
        super(options);
        this.movable = false
        this.world = true
        
    }
}


export class Boiler extends Node{
    constructor(options){
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.movable = false
        this.world = false
    
    }

    getAABB(){

        let min =  this.mesh.primitives[0].attributes.POSITION.min
        let max = this.mesh.primitives[0].attributes.POSITION.max
        return {min: min, max: max}
        
        
    }

}

export class Immovable extends Node{
    constructor(options){
        super(options);
        this.movable = false
        this.world = false
        
    }

    getAABB(){

        let min =  this.mesh.primitives[0].attributes.POSITION.min
        let max = this.mesh.primitives[0].attributes.POSITION.max
        return {min: vec3.scale(min, min, 1), max: vec3.scale(max, max, 1)}
        
        
    }
}

export class House extends Node{

    constructor(options){
        super(options);
        this.movable = false
        this.world = false
        
    }

    getAABB(){

        let min =  this.mesh.primitives[0].attributes.POSITION.min
        min[0] = -2.5
        min[1] = -1.3
        let max = this.mesh.primitives[0].attributes.POSITION.max
        max[0] = 8
        max[1] = 1.3
        return {min: min, max: max}
        
    }
}




export class Player extends Node{
    constructor(options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.updateMatrix();
        this.camera = new CamNode({translation : vec3.fromValues(2,1,0), player:this});
        this.camera.camera = new PerspectiveCamera();
        this.time = 180
        this.fire = 25

        setInterval(() => {
            console.log('game over')
        }, 180*1000);

        setInterval(() => {
        this.time-=1;
        this.fire-=1;
        }, 1000);
    }

    getCamera(){
        return this.camera;
    }


   

    update(){
        this.translation = vec3.fromValues(this.camera.translation[0],0,this.camera.translation[2]);
        this.updateMatrix();
        if(this.fire == 0){
         
            this.score -= 5
            this.fire = 30;
            if(this.score < 0){
                this.score = 0;
            }
        }
        Score.updatePlums(this.plumno);
        Score.updateBranches(this.branchno);
    }
    
    checkPick(){

        if(this.camera.keys['KeyE']){
            return true;
        }else{
            return false;
        }
        
    }

    plumSelected(){
        return this.selected == 1;
    }

    branchSelected(){
        return this.selected == 2;
    }


    pickUpHandler(scene, b){
       
        this.plumPickCheck(scene,b);
        this.branchPickCheck(scene,b);
        this.depositCheck(b);
        
    }

    radioCheck(b){
        if(b instanceof RadioLog){
            if(this.checkPick()){
                let playing = b.parent.audio.playing;
                if(playing=0 || playing == 2){
                    b.audio.playA();
                }else{
                    b.audio.playB();
                }            
            }
        }
    }

    plumPickCheck(scene, b){
        if(b instanceof Plum){
            scene.traverse(node => {
                if (node.name==b.name) {
                    if(this.checkPick()){
                    this.plumno++;
                    scene.removeNode(node);
                    }
                    
                }
            });
        }
    }

    branchPickCheck(scene, b){
        if(b instanceof Branch){
            scene.traverse(node => {
                if (node.name==b.name) {
                    if(this.checkPick()){
                    this.branchno++
                    scene.removeNode(node);
                    }
                    
                }
            });
        }
    }

    depositCheck(b){

        if(b instanceof Boiler){
            if(this.plumSelected() && this.checkPick()){
                if(this.plumno>0){
                    b.plumno += this.plumno;
                    this.score += this.plumno*1.7;
                    console.log(this.plumno + ' Plums deposited!');
                    this.plumno = 0;
                    
                }

            }
            if(this.branchSelected() && this.checkPick()){
                if(this.branchno>0){
                    b.branchno += this.branchno;
                    this.fire+= this.branchno*4
                    console.log(this.branchno + ' Wood deposited!');
                    this.branchno = 0;
                }

            }
        }
        
    }

    getAABB(){
        return this.aabb;
    }

    getInnerCam(){
        return this.camera.camera;
    }
}


Player.defaults = {
    aabb             : {min: [-1,-0.1,0], max:[0.5,1,0.5]},
    translation      : vec3.fromValues(2,0,0),
    running          : false,
    movable          : false,
    plumno           : 0,
    branchno         : 0,
    selected         : 1,
    score            : 0
};

Boiler.defaults = {
    plumno           : 0,
    branchno         : 0,
    fire             : 0,
    purity           : 0
};