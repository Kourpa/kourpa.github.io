import * as THREE from '/lib/three.module.js';
import { TrackballControls } from "./lib/controls/TrackballControls.js";
import Loader from "./Loader.js";

export default class Scene {
    constructor(options){
        if(!options.elementToBindTo){
            options.elementToBindTo = document.getElementById('canvas');

            if(!options.elementToBindTo){
                options.elementToBindTo = document.body
            }
        }

        this.objects = options.object || [];
        this.update = options.update || function(){};
        this.click = options.click || function(){};

        this.renderer = null;
        this.canvas = options.elementToBindTo;
        this.aspectRatio = 1;
        this.recalcAspectRatio();

        this.scene = null;
        this.cameraDefaults = {
            posCamera: new THREE.Vector3(0.0, 175.0, 500.0),
            posCameraTarget: new THREE.Vector3(0, 0, 0),
            near: 0.1,
            far: 10000, 
            fov: 45
        };

        this.camera = null;
        this.cameraTarget = this.cameraDefaults.posCameraTarget;

        this.mouse = new THREE.Vector2();
        this.controls = null;
        this.raycaster = new THREE.Raycaster();

        this.canvas.addEventListener('click', function(event){
            const parentTop = this.canvas.offsetTop;
            const parentLeft = this.canvas.offsetLeft;
            const parentWidth = this.canvas.offsetWidth;
            const parentHeight = this.canvas.offsetHeight;

            this.mouse.x = ((event.clientX - parentLeft) / parentWidth) * 2 - 1;
            this.mouse.y = -((event.clientY - parentTop) / parentHeight) * 2 + 1;

            const intersectObject = this.raycast();
            this.click(intersectObject);
        });

        
        this.initGL();
        this.resizeDisplayGL();
        this.animate();
    }

    initGL(){
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            autoClear: true
        });
        this.renderer.setClearColor(0x050505);
        
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(this.cameraDefaults.fov, this.aspectRatio, this.cameraDefaults.near, this.cameraDefaults.far);
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);

        this.initializeLighting(this.scene);
        this.loader = new Loader(this.scene);
    };

    initializeLighting(scene){
        let ambientLight = new THREE.AmbientLight(0x404040);
        let directionalLight1 = new THREE.DirectionalLight(0xC0C090);
        let directionalLight2 = new THREE.DirectionalLight(0xC0C090);

        directionalLight1.position.set(- 100, - 50, 100);
        directionalLight2.position.set(100, 50, - 100);

        scene.add(directionalLight1);
        scene.add(directionalLight2);
        scene.add(ambientLight);
    };

    resizeDisplayGL(){
        this.controls.handleResize();
        this.recalcAspectRatio();
        this.renderer.setSize(this.canvas.offsetWidth, this.canvas.offsetHeight, false);
        this.updateCamera();
    };

    recalcAspectRatio(){
        this.aspectRatio = (this.canvas.offsetHeight === 0) ? 1 : this.canvas.offsetWidth / this.canvas.offsetHeight;
    };

    resetCamera(){
        this.camera.position.copy(this.cameraDefaults.posCamera);
        this.cameraTarget.copy(this.cameraDefaults.posCameraTarget);
        this.updateCamera();
    };

    updateCamera(){
        this.camera.aspect = this.aspectRatio;
        this.camera.lookAt(this.cameraTarget);
        this.camera.updateProjectionMatrix();
    };

    raycast(){
        this.raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = this.raycaster.intersectObjects(scene.children, true);
        if(intersects.length > 0){
            return intersects[0].object;
        }

        return null;
    }

    render(){
        if(!this.renderer.autoClear){
            this.renderer.clear();
        }

        this.controls.update();
        this.update();
        this.renderer.render(this.scene, this.camera);
    }

    //TODO: This doesn't work! Gah!
    animate = function(){
        requestAnimationFrame(this.animate);
        render();
    };
}