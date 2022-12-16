import { CamNode } from "./CamNode.js";
import { vec3 } from "../../lib/gl-matrix-module.js";
import { PerspectiveCamera } from "./PerspectiveCamera.js";

export class Player{
    constructor() {
        this.camera = new CamNode({translation : vec3.fromValues(2,1,0)})
        this.camera.camera = new PerspectiveCamera();
        this.aabb = {min: [-0.2,-0.2,-0.2], max: [0.2, 0.2, 0.2]}
    }

    getCamera(){
        return this.camera;
    }
    getAABB(){
        return this.aabb
    }

    getInnerCam(){
        return this.camera.camera
    }
    getAABB(){
        return this.aabb;
    }
}