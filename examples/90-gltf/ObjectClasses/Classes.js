import { Node } from "../Node.js";
import { CamNode } from "../CamNode.js";
import { quat, vec3 } from "../../../lib/gl-matrix-module.js";
import { PerspectiveCamera } from "../PerspectiveCamera.js";
import { Utils } from '../Utils.js';
import * as Score from '../ScoreUpdater.js'

export class Plum extends Node{
    constructor(options){
        super(options);
        this.movable = true
        this.world = false
    
    }

}

export class Branch extends Node{
    constructor(options){
        super(options);
        this.movable = true
        this.world = false
    }
}


export class World extends Node{
    constructor(options){
        super(options);
        this.movable = false
        this.world = true
        
    }
}

export class Immovable extends Node{
    constructor(options){
        super(options);
        this.movable = false
        this.world = false
        
    }
}




export class Player extends Node{
    constructor(options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.updateMatrix();
        this.camera = new CamNode({translation : vec3.fromValues(2,1,0), player:this}),
        this.camera.camera = new PerspectiveCamera();
        this.movable = false
    }

    getCamera(){
        return this.camera;
    }

    update(){
        this.translation = vec3.fromValues(this.camera.translation[0],0,this.camera.translation[2]);
        this.updateMatrix()
        Score.updatePlums(this.plumno)
    }

    checkPick(){

        if(this.camera.keys['KeyE']){
            return true;
        }else{
            return false;
        }
        
    }

    pickUpHandler(scene, b){
        this.plumPickCheck(scene,b);
        this.branchPickCheck(scene,b);
    }

    plumPickCheck(scene, b){
        if(b.parseName()==="Plum"){
            scene.traverse(node => {
                if (node.name==b.name) {
                    if(this.checkPick()){
                    this.plumno++;
                    scene.removeNode(node)
                    }
                    
                }
            });
        }
    }

    branchPickCheck(scene, b){
        if(b.parseName()==="Branch"){
            scene.traverse(node => {
                if (node.name==b.name) {
                    if(this.checkPick()){
                    this.branchno++;
                    scene.removeNode(node)
                    }
                    
                }
            });
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
    aabb             : {min: [-1.5,0,-1.5], max:[1.5,2,1.5]},
    translation      : vec3.fromValues(2,0,0),
    running          : false,
    plumno           : 0,
    branchno         : 0,
};
