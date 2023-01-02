import { Node } from "./Node.js";
import { Player, Branch, Plum, World, Immovable } from "./ObjectClasses/Classes.js";

export function parse(node, options){

    if(node === 'Player'){
        return new Player(options)
    }
    else if(node === 'Skybox'){
        return new World(options)
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
    else{
        return new Immovable(options);
    }
}

function parseName(node){

    if(node!=null){
  
        return node.match(/^[a-zA-Z]+/)[0];
    }
}