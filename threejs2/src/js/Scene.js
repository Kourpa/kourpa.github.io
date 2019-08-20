import * as THREE from '/lib/three.module.js';
import { TrackballControls } from "./lib/controls/TrackballControls.js";
import { OrbitControls } from "./lib/controls/OrbitControls.js";
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
            near: .1,
            far: 10000, 
            fov: 60
        };

        this.camera = null;
        this.cameraTarget = this.cameraDefaults.posCameraTarget;

        this.mouse = new THREE.Vector2();
        this.controls = null;
        this.raycaster = new THREE.Raycaster();

        this.initGL();
        this.initializeControls();
        this.resizeDisplayGL();
        this.animate();

        let helper = new THREE.GridHelper(1200, 60, 0xFF4444, 0x404040);
        this.scene.add(helper);
        

        var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
        var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color:  0xff00ff } ) );
        object.position.x = 0;
        object.position.y = 100;
        object.position.z = 100;
        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;
        object.scale.x = Math.random() + 0.5;
        object.scale.y = Math.random() + 0.5;
        object.scale.z = Math.random() + 0.5;
        this.camera.add(object)
        object.position.set(0, 0, -100);

        this.scene.add(this.camera);
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
        this.resetCamera();

        this.initializeLighting(this.scene);
        this.loader = new Loader(this.scene);

        const self = this;
        this.canvas.addEventListener('click', function(event){
            const parentTop = self.canvas.offsetTop;
            const parentLeft = self.canvas.offsetLeft;
            const parentWidth = self.canvas.offsetWidth;
            const parentHeight = self.canvas.offsetHeight;

            self.mouse.x = ((event.clientX - parentLeft) / parentWidth) * 2 - 1;
            self.mouse.y = -((event.clientY - parentTop) / parentHeight) * 2 + 1;

            const intersectObject = self.raycast();
            self.click(intersectObject);
        });

        window.addEventListener('resize', function(){
            self.resizeDisplayGL();
        }, false);
    };

    initializeControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 100;
        this.controls.maxDistance = 500;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

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
        //this.controls.handleResize();
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
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        if(intersects.length > 0){
            return intersects[0].object;
        }

        return null;
    }

    render(){
        if(!this.renderer.autoClear){
            this.renderer.clear();
        }

        this.update();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    animate(){
        const self = this;

        requestAnimationFrame(function(){
            self.animate();
        });
        self.render();
    };
}