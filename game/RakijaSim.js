import { Application } from '../../common/engine/Application.js';
import { vec3 } from '../../lib/gl-matrix-module.js';
import { AssetManager } from './Unused/AssetManager.js';
import { CamNode } from './CamNode.js';
import { shaders } from './shaders.js';
import { GLTFLoader } from './GLTFLoader.js';
import { PerspectiveCamera } from './PerspectiveCamera.js';
import { Physics } from './Physics.js';
import { Renderer } from './Renderer.js';
import { Player } from './ObjectClasses/Classes.js';
import { Light } from './Light.js';
import { AudioClass } from './AudioClass.js';
class App extends Application {

    async start() {


        let gtfo = new GLTFLoader()
        let ploader = new GLTFLoader()
        await gtfo.load('../../common/models/map/world.gltf')
        await ploader.load('../../common/models/Player/player.gltf')
        this.scene = await gtfo.loadScene(0);

        this.player = await ploader.loadNode(0)
        this.scene.addNode(this.player)
        
        this.scene

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
       
        this.canvas.addEventListener('click', e => this.canvas.requestPointerLock());
        document.addEventListener('pointerlockchange', e => {
            if (document.pointerLockElement === this.canvas) {
                document.getElementById("backbutton").style.visibility = "hidden"
                this.camera.enable();
            } else {
                this.camera.disable();
                document.getElementById("backbutton").style.visibility = "visible"
            }
        });

        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();

        this.physics = new Physics(this.scene);
        
    }

    update() {
        const t = this.time = performance.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;
        
     
        this.player.camera.update(dt);

        this.player.update()
      
        this.player.translation = this.player.camera.translation;
  
        this.physics.update(dt);
  
       
        
        
    }

    render() {
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
            this.renderer.render(this.scene, this.camera);
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


