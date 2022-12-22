import { Node } from './Node.js';
import { mat4 } from '../../lib/gl-matrix-module.js';
export class Scene {

    constructor(options = {}) {
        this.nodes = [...(options.nodes || [])];
    }

    addNode(node) {
        this.nodes.push(node);
    }

    traverse(before, after) {
        for (const node of this.nodes) {
            this.traverseNode(node, before, after);
        }
    }   

    traverseNode(node, before, after) {
        if (before) {
            before(node);
        }
        for (const child of node.children) {
            this.traverseNode(child, before, after);
        }
        if (after) {
            after(node);
        }
    }

    //Function to remove a node when picked up
    removeNode(node){
        console.log(node)
        for(let i = this.nodes.length - 1; i >= 0; i--){

            if('name' in this.nodes[i]){
                if(this.nodes[i].name == node.name){
                    this.nodes.splice(i, 1);
                }
            }
        
        }
    }

    clone() {
        return new Scene({
            ...this,
            nodes: this.nodes.map(node => node.clone()),
        });
    }
}
