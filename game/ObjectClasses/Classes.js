import { Node } from "../Node.js";
import { CamNode } from "../CamNode.js";
import { quat, vec3 } from "../../lib/gl-matrix-module.js";
import { PerspectiveCamera } from "../PerspectiveCamera.js";
import { Utils } from '../Utils.js';
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
            console.log(b.name)
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
    aabb             : {min: [-1,-0.1,0], max:[0.5,1,0.5]},
    translation      : vec3.fromValues(2,0,0),
    running          : false,
    plumno           : 0,
    branchno         : 0,
};
