import { vec3, mat4, vec4 } from '../../lib/gl-matrix-module.js';

import { Utils } from './Utils.js';
import { Node } from './Node.js';
import { Breathing } from './Animation.js';



export class CamNode extends Node{
    
    constructor(options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.projection = mat4.create();
        this.updateProjection();
        this.player = options.player || null;
        this.animation = new Breathing(this)
        this.pointermoveHandler = this.pointermoveHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.keys = {};
    }
    getAABB(){
        return this.aabb;
    }

    updateProjection() {
        mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
    }
    inBounds(increment){
        return (this.translation[0]+increment[0] < 15 && this.translation[0]+increment[0]>-15) && (this.translation[2]+increment[2] < 15 && this.translation[2]+increment[2]>-15)
    }

    update(dt) {
        const c = this;
 
        const forward = vec3.set(vec3.create(),
            -Math.sin(c.rotation[1]), 0, -Math.cos(c.rotation[1]));
        const right = vec3.set(vec3.create(),
            Math.cos(c.rotation[1]), 0, -Math.sin(c.rotation[1]));

        // 1: add movement acceleration
        const acc = vec3.create();
      
        if (this.keys['KeyW']) {
            vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyS']) {
            vec3.sub(acc, acc, forward);
        }
        if (this.keys['KeyD']) {
            vec3.add(acc, acc, right);
        }
        if (this.keys['KeyA']) {
            vec3.sub(acc, acc, right);
        }
        if (this.keys['ShiftLeft']) {
            this.player.running=true;
            c.maxSpeed = 4;
        }else{
            this.player.running=false;
            c.maxSpeed = 2;
        }
        // 2: update velocity
        vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);

        // 3: if no movement, apply friction
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA'])
        {
            vec3.scale(c.velocity, c.velocity, 1 - c.friction);
        }

        // 4: limit speed
        const len = vec3.len(c.velocity);
        if (len > c.maxSpeed) {
            vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
        }

        vec3.scaleAndAdd(c.translation, c.translation, c.velocity, dt);

        // Update the final transformation matrix based on the updated variables.
        //Dodano iz 13 interactions da proradi kretanje s tipkama 
        const m = c.matrix;
        mat4.identity(m);
        //let x = vec3.add(this.translation,this.translation, c.translation)
        //console.log(x)
    
        mat4.translate(m, m, c.translation);
        mat4.rotateY(m, m, c.rotation[1]);
        mat4.rotateX(m, m, c.rotation[0]);

        this.animation.breathe();
        
  
   
        }
    

    enable() {
        document.addEventListener('pointermove', this.pointermoveHandler);
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }

    disable() {
        document.removeEventListener('pointermove', this.pointermoveHandler);
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);

        for (const key in this.keys) {
            this.keys[key] = false;
        }
    }

    pointermoveHandler(e) {
        const dx = e.movementX;
        const dy = e.movementY;
        const c = this;

        c.rotation[0] -= dy * c.pointerSensitivity;
        c.rotation[1] -= dx * c.pointerSensitivity;

        const pi = Math.PI;
        const twopi = pi * 2;
        const halfpi = pi / 2;

        if (c.rotation[0] > halfpi) {
            c.rotation[0] = halfpi;
        }
        if (c.rotation[0] < -halfpi) {
            c.rotation[0] = -halfpi;
        }

        c.rotation[1] = ((c.rotation[1] % twopi) + twopi) % twopi;
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

}

CamNode.defaults = {
    aspect           : 1,
    fov              : 1,
    near             : 0.01,
    far              : Infinity,
    velocity         : [0, 0, 0],
    pointerSensitivity : 0.002,
    maxSpeed         : 1,
    friction         : 0.2,
    acceleration     : 20
};

