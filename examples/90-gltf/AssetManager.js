import { Application } from '../../common/engine/Application.js';
import { vec3 , quat} from '../../lib/gl-matrix-module.js';
import { CamNode } from './CamNode.js';
import { Node } from './Node.js';
import { GLTFLoader } from './GLTFLoader.js';
import * as ObjectClasses from  './ObjectClasses.js';
import { PerspectiveCamera } from './PerspectiveCamera.js';
import { Physics } from './Physics.js';
import { Renderer } from './Renderer.js';


export class AssetManager{

    

    constructor(models){
        this.mainloader = null //main loader for the scene that will hold all other nodes/objects
        this.loaders = [] // all of the loaders for objects other than the main scene object (except)
        this.models = models // model paths specified in the constructor
        this.cam = null //camera of the main scene
        this.scene = null
        this.loadedObjects = {};
    }

    

    async loadScene(){
        const loader = new GLTFLoader();
        await loader.load(this.models[0])
        this.mainloader = loader;
        this.cam = this.mainloader.loadNode("Camera");  

        this.scene = await this.mainloader.loadScene(this.mainloader.defaultScene);
    }  
    
    async loadAssets(){
        let nodes = []
        //this.loadedObjects[new_key] = new_value;
        for(let i = 0; i < this.models.length; i++){
        
            for(let c = 0; c < 1; c++){
                
                let currLoad = new GLTFLoader();
                await currLoad.load(this.models[i]);

                let random_x = Math.floor(Math.random() * (50 - (-50) + 1)) + (-50);
                let random_y = Math.floor(Math.random() * (50 - (-50) + 1)) + (-50);
                
                let node = await currLoad.loadNode(0);
                node.translation = vec3.fromValues(random_x,0,random_y);
                //node.scale = vec3.fromValues(2,2,2)
                node.updateMatrix();
                nodes.push(node)
                
                this.scene.addNode(node);
        
                this.loaders.push(currLoad);
            }
        }
        return this.scene
    }
    async getTreeAABB(){

        for(let i = 1; i < this.models.length; i++){
            if(this.models[i] instanceof ObjectClasses.Tree){
                let currLoad = new GLTFLoader();
                await currLoad.load(this.models[i].model);
                let aabb = await currLoad.loadAccessor(0)
                let minmax = [aabb.min,aabb.max]
                return minmax
            }
        }
    }
    async loadAssetsMod(){
    
        for(let i = 1; i < this.models.length; i++){
            //Loading 100 trees for now at randomized x and z positions
            let nodes = []
            if(this.models[i] instanceof ObjectClasses.Tree){
                for(let c = 0; c < 1; c++){
                    
                    let currLoad = new GLTFLoader();
                    await currLoad.load(this.models[i].model);

                    let random_x = randomxy()[0];
                    let random_y = randomxy()[1];
                  
    
                    let random_angle = quat.fromValues(0,getRandomFloat(0,0.5,5),0,1);
            
                    let node = await currLoad.loadNode(0);
                    node.translation = vec3.fromValues(random_x,0,random_y);
                    node.rotation= random_angle
                    //node.scale = vec3.fromValues(2,2,2)
                    node.updateMatrix();
                    nodes.push(node);
                    this.scene.addNode(node);
           
                    this.loaders.push(currLoad);
                }
            }   
            else{
                    for(let c = 0; c < 10; c++){
                           
                        let currLoad = new GLTFLoader();
                        await currLoad.load(this.models[i].model);
        
                        let random_x = Math.floor(Math.random() * (50 - (-50) + 1)) + (-50);
                        let random_y = Math.floor(Math.random() * (50 - (-50) + 1)) + (-50);
                        
                        let node = await currLoad.loadNode(0);
                        node.translation = vec3.fromValues(random_x,0,random_y);
                        //node.scale = vec3.fromValues(2,2,2)
                        node.updateMatrix();
                        nodes.push(node);
                        this.scene.addNode(node);
                        
                        this.loaders.push(currLoad);
                    }
        }
        this.loadedObjects[this.models[i].constructor.name] = nodes;
        console.log(this.loadedObjects)
    }
        return this.scene
    
}

}

function randomxy(){

    let random_x = Math.floor(Math.random() * (30 - (-30) + 1)) + (-30);
    let random_y = Math.floor(Math.random() * (50 - (-50) + 1)) + (-50);
    
    return [random_x,random_y];
}

function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return str
}
