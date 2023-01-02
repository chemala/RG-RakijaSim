import { vec3, mat4, quat } from '../../lib/gl-matrix-module.js';
import { Primitive } from './Primitive.js';

export class Node {

    constructor(options = {}) {
        this.translation = options.translation
            ? vec3.clone(options.translation)
            : vec3.fromValues(0, 0, 0);
        this.rotation = options.rotation
            ? quat.clone(options.rotation)
            : quat.fromValues(0, 0, 0, 1);
        this.scale = options.scale
            ? vec3.clone(options.scale)
            : vec3.fromValues(1, 1, 1);
        this.matrix = options.matrix
            ? mat4.clone(options.matrix)
            : mat4.create();

        if (options.matrix) {
            mat4.getRotation(this.rotation, this.matrix);
            mat4.getTranslation(this.translation, this.matrix);
            mat4.getScaling(this.scale, this.matrix);
        } else if (options.translation || options.rotation || options.scale) {
            this.updateMatrix();
        }

        if(options.name){
            this.name=options.name
        }

        this.exists = true;
        this.camera = options.camera || null;
        this.mesh = options.mesh || null;
        this.world = this.isWorld() || false;
        this.movable = this.isMovable() || false;
        this.children = [...(options.children || [])];
        for (const child of this.children) {
            child.parent = this;
        }
        this.parent = null;
    }

    getGlobalTransform() {
        if (!this.parent) {
            return mat4.clone(this.matrix);
        } else {
            const matrix = this.parent.getGlobalTransform();
            return mat4.mul(matrix, matrix, this.matrix);
        }
    }


    updateMatrix() {
        mat4.fromRotationTranslationScale(
            this.matrix,
            this.rotation,
            this.translation,
            this.scale);
    }
    getAABB(){
        let min =  this.mesh.primitives[0].attributes.POSITION.min
        let max = this.mesh.primitives[0].attributes.POSITION.max
 
        return {min: vec3.scale(min, min, 0.5), max: vec3.scale(max, max, 0.5)}
        
    }

    addChild(node) {
        this.children.push(node);
        node.parent = this;
    }

    removeChild(node) {
        const index = this.children.indexOf(node);
        if (index >= 0) {
            this.children.splice(index, 1);
            node.parent = null;
        }
    }

    clone() {
        return new Node({
            ...this,
            children: this.children.map(child => child.clone()),
        });
    }

    parseName(){
        if(this.name){
        return this.name.match(/^[a-zA-Z]+/)[0];
        }else{
            return 'shit'
        }
    }

    isWorld(){
        let name = this.parseName(this.name);
        if(name == 'Skybox' || name == 'Ground'){
            return true;
        }else{
            return false;
        }
    }

    isMovable(){
        let name = this.parseName(this.name);
        console.log(name)
        if(name =='Tree' || name=='Plumtree' || name=='Player' ){
            return false;
        }else{
            return true;
        }
    }

}