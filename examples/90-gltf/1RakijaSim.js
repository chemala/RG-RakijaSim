import { Application } from '../../common/engine/Application.js';
import { vec3 } from '../../lib/gl-matrix-module.js';
import { AssetManager } from './Unused/AssetManager.js';
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
        /*
        const castlepath  = '../../common/models/castle/castle.gltf';
        const treepath = '../../common/models/tree/tree.gltf'
        const plumpath = '../../common/models/plum/plum.gltf';
        const worldpath = '../../common/models/world/shitassterrain.gltf';

        const tree = new ObjectClasses.Tree(treepath);
        const plum = new ObjectClasses.Plum(plumpath);
        */

        let gtfo = new GLTFLoader()
        await gtfo.load('../../common/models/test1terrain/test1.gltf')
        this.scene = await gtfo.loadScene(0);
        console.log(this.scene.nodes[0])
        this.scene.nodes[0].world=true;
        this.scene.nodes[1].world=true;

        //const models = [worldpath,tree,plum];
        this.player = new Player();

        this.camera = this.player.getCamera();
        this.camera.camera = this.player.getInnerCam();
      
        this.time = performance.now();
        this.startTime = this.time;
        
        if (!this.scene) {
            throw new Error('Scene not present in glTF');
        }
        if (!this.camera) {
            throw new Error('Camera node not present in Scene or glTF!');
        }
        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }
       
        //this.player.camera.updateMatrix()
        this.canvas.addEventListener('click', e => this.canvas.requestPointerLock());
        document.addEventListener('pointerlockchange', e => {
            if (document.pointerLockElement === this.canvas) {
                this.camera.enable();
            } else {
                this.camera.disable();
            }
        });
        this.scene.addNode(this.player.camera);
        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();


        this.physics = new Physics(this.scene);
    }

    update() {
        const t = this.time = performance.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;
        
        console.log(this.player);
        this.player.camera.update(dt);
        
        //for(x in this.assetmanager.loaders){
            
        //}
        this.physics.update(dt);
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
