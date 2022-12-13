import { Node } from './Node.js';
export class Tree extends Node{

    constructor(model){
        super();
        this.model = model;

    }

}
export class Plum extends Node{

    constructor(model){
        super();
        this.model = model;
    }

}
export class Branch extends Node{

    constructor(model){
        super();
        this.model = model;
    } 
}
export class Boiler extends Node{
    
    constructor(model){
        super();
        this.model = model;
    }
}