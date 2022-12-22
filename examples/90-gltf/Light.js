import { Node } from './Node.js';

export class Light extends Node {

    constructor() {
        super();
        this.position = [0, 2, 0];
        this.translation = [0,2,0]
        this.ambient = 0.2,
        this.color = [255, 255, 255],
        this.attenuation = [1.0, 0, 0.02]
        this.world = true;
    }

}