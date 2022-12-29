import { CamNode } from "../CamNode.js";
import { quat, vec3 } from "../../../lib/gl-matrix-module.js";
import { PerspectiveCamera } from "../PerspectiveCamera.js";
import { Node } from '../Node.js';
import { Utils } from '../Utils.js';
import * as Score from '../ScoreUpdater.js'


export class Player extends Node{
    constructor(options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.updateMatrix();
        this.camera = new CamNode({translation : vec3.fromValues(2,1,0), player:this}),
        this.camera.camera = new PerspectiveCamera();
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

    plumPickCheck(scene, b){
        if(b.name.slice(0, -1)==="Plum"){
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
};
