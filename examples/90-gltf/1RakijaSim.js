import { Application } from '../../common/engine/Application.js';
import { vec3 } from '../../lib/gl-matrix-module.js';
import { AssetManager } from './AssetManager.js';
import * as ObjectClasses from  './ObjectClasses.js';
import { CamNode } from './CamNode.js';
import { shaders } from './shaders.js';
import { GLTFLoader } from './GLTFLoader.js';
import { PerspectiveCamera } from './PerspectiveCamera.js';
import { Physics } from './Physics.js';
import { Renderer } from './Renderer.js';
import { Player } from './Player.js';
import { Light } from './Light.js';
class App extends Application {

    async start() {
        const castlepath  = '../../common/models/castle/castle.gltf';
        const treepath = '../../common/models/tree/tree.gltf'
        const plumpath = '../../common/models/plum/plum.gltf';
        const worldpath = '../../common/models/world/shitassterrain.gltf';

        const tree = new ObjectClasses.Tree(treepath);
        const plum = new ObjectClasses.Plum(plumpath);
        
     
        //const models = [castlepath,treepath,plumpath];
        const models = [worldpath,tree,plum];
        

        this.assetmanager = new AssetManager(models);
        await this.assetmanager.loadScene();
        this.scene = await this.assetmanager.loadAssetsMod();
        let treeAABB = await this.assetmanager.getTreeAABB();
        //this.light = new Light();
        const player = new Player();

        this.camera = player.getCamera();
        this.camera.camera = player.getInnerCam();
        
      
        console.log(this.camera)
        this.time = performance.now();
        this.startTime = this.time;

        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }
       
        this.camera.updateMatrix()
        this.canvas.addEventListener('click', e => this.canvas.requestPointerLock());
        document.addEventListener('pointerlockchange', e => {
            if (document.pointerLockElement === this.canvas) {
                this.camera.enable();
            } else {
                this.camera.disable();
            }
        });
        this.scene.addNode(this.camera);
        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();


        this.physics = new Physics(this.scene, treeAABB);
    }

    update() {
        const t = this.time = performance.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;
       
        this.camera.update(dt);
        
        //for(x in this.assetmanager.loaders){
            
        //}
        //this.physics.update(dt);
        //this.camera.updateMatrix()
       
        
        
    }


    render() {
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera, this.light);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        const aspectRatio = w / h;

        if (this.camera) {
            this.camera.camera.aspect = aspectRatio;
            this.camera.camera.updateMatrix();
        }
    }

}

const canvas = document.querySelector('canvas');
const app = new App(canvas);
await app.init();
document.querySelector('.loader-container').remove();
