import { CamNode } from "./CamNode.js";
import { vec3 } from "../../lib/gl-matrix-module.js";
import { PerspectiveCamera } from "./PerspectiveCamera.js";
import { Node } from './Node.js';
import { Utils } from './Utils.js';

export class Player extends Node{
    constructor(options) {
        super(options);
        this.camera = new CamNode({player: this, translation : vec3.fromValues(2,1,0)});
        this.aabb = {min: [-0.2,-0.2,-0.2], max: [0.2, 0.2, 0.2]};
        //Utils.init(this, this.constructor.defaults, options);
        this.camera.camera = new PerspectiveCamera();
    }

    getCamera(){
        return this.camera;
    }

    getAABB(){
        return this.aabb;
    }

    getInnerCam(){
        return this.camera.camera;
    }
}

/*
Player.defaults = {
    camera           : new CamNode({translation : vec3.fromValues(2,1,0)}),
    aabb             : {min: [-0.2,-0.2,-0.2], max: [0.2, 0.2, 0.2]},
};
*/