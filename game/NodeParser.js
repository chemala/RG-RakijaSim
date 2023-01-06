import { Node } from "./Node.js";
import { Player, Branch, Plum, World, Immovable, House, Tree, PlumTree, AppleTree, PineTree, Grass, Boiler, Radio, RadioLog } from "./ObjectClasses/Classes.js";

export function parse(node, options){

    if(node === 'Player'){
        return new Player(options)
    }
    else if(node === 'Skybox' || node ==='Ground' || node === 'Path1'){
        return new World(options)
    }
    else if(parseName(node) === 'Plumtree'){
        return new PlumTree(options)
    }
    else if(parseName(node) === 'AppleTree'){
        return new AppleTree(options)
    }
    else if(parseName(node) === 'Pine'){
        return new PineTree(options)
    }
    else if(parseName(node) === 'Tree'){
        return new Tree(options)
    }
    else if(parseName(node) === 'Grass'){
        return new Grass(options)
    }
    else if(parseName(node) === 'Radio'){
        return new Radio(options)
    }
    else if(parseName(node) === 'RadioLog'){
        return new RadioLog(options)
    }
    else if(node === 'Ground'){
        return new World(options)
    }
    else if(parseName(node) === 'Plum'){
        return new Plum(options)
    }
    else if(parseName(node) === 'Branch'){
        return new Branch(options)
    }
    else if(parseName(node) === 'House'){
        return new House(options)
    }
    else if(parseName(node) === 'Kazan'){
        return new Boiler(options)
    }
    else{
        return new Immovable(options);
    }
}

function parseName(node){

    if(node!=null){
  
        return node.match(/^[a-zA-Z]+/)[0];
    }
}