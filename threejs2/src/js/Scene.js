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
            posCamera: new THREE.Vector3(0.0, 0.0, 500.0),
            posCameraTarget: new THREE.Vector3(0, 0, 0),
            near: .1,
            far: 10000, 
            fov: 60
        };

        this.camera = null;
        this.cameraTarget = this.cameraDefaults.posCameraTarget;

        this.mouse = new THREE.Vector2();
        this.controls = null;
        this.mainModel = null;
        this.raycaster = new THREE.Raycaster();

        this.initGL();
        this.resizeDisplayGL();
        this.animate();

        let helper = new THREE.GridHelper(1200, 60, 0xFF4444, 0x404040);
        helper.rotation.x = Math.PI / 2;
        this.scene.add(helper);

        this.initObjects();
    }

    initGL(){
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            autoClear: true
        });
        this.renderer.setClearColor(0x656565);
        
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

    initObjects(){
        let circleRadius = 160;
        let size = 80;
        let self = this;

        // this.loader.loadOBJ('falcon', 
        //     '/threejs2/models/obj/f16/F16C_US_LOD1_v25.obj', 
        //     '/threejs2/models/obj/f16/F16C_US_LOD1_v25.mtl',
        //     function(object){
        //         self.updateMainModel(object);
        //     });
        // let model = this.loader.loadGLFT('/threejs2/models/obj/space/space.glb', function(object){
        //     self.initializeControls(object);
        // })

        var geometry = new THREE.BoxBufferGeometry( size, size, size );
        // var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color:  0x00ff00 } ) );
        // object.position.set(0, 0, 0);
        // this.scene.add(object);
        // this.initializeControls(object);

        const positions = [];
        for(let i = 0; i < 360 && false; i+=size/2){
            var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color:  0xff00ff } ) );
            let x = circleRadius * Math.cos(Math.PI / 180 * i);
            let y = circleRadius * Math.sin(Math.PI / 180 * i);
            object.position.set(x, y, 0);
            object.lookAt(this.camera.position);
            object.rotation.z = 0;
            object.scale.set(.9, .9, .9);
            positions.push(object.position);
            this.scene.add(object);
        }


        let circumfrence = Math.PI * circleRadius;
        let numberOfSquares = Math.floor(circumfrence / (size / 2));
        for(let i =  0; i < numberOfSquares; i++){
            var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color:  0xff00ff } ) );
            let x = circleRadius * Math.cos(2 * Math.PI * i / numberOfSquares);
            let y = circleRadius * Math.sin(2 * Math.PI * i / numberOfSquares);
            object.position.set(x, y, 0);
            // object.lookAt(this.camera.position);
            // object.rotation.z = 0;
            object.scale.set(.8, .8, .8);
            positions.push(object.position);
            this.scene.add(object);
        }

        let r2 = circleRadius + (size + size / 32);
        let circumfrence2 = Math.PI * (r2);
        let numberOfSquares2 = Math.floor(circumfrence2 / (size / 2));
        for(let i =  0; i < numberOfSquares2; i++){
            var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color:  0xff00ff } ) );
            let x = r2 * Math.cos(2 * Math.PI * i / numberOfSquares2);
            let y = r2 * Math.sin(2 * Math.PI * i / numberOfSquares2);
            let z = -size/2;
            object.position.set(x, y, z);
            //object.lookAt(this.camera.position);
            //object.rotation.z = 0;
            object.scale.set(.8, .8, .8);
            positions.push(object.position);
            this.scene.add(object);
        }

    }

    initializeControls(object) {
        if(!this.controls){
            this.controls = new ObjectControls(this.camera, this.renderer.domElement, object);
        }
        else {
            this.controls.setObjectToMove(object);
        }

        this.controls.setScaleLimits(0, 100);
        this.controls.setScaleSpeed(.1);
        this.controls.enableVerticalRotation();
        this.controls.setMaxVerticalRotationAngle(Math.PI / 4, Math.PI / 4);
        this.controls.setRotationSpeed(0.075);
    }

    updateMainModel(object){
        if(this.mainModel){
            this.scene.remove(this.mainModel);
            this.animate();
        }

        this.mainModel = object;
        this.initializeControls(this.mainModel);
    }

    initializeLighting(scene){
        let ambientLight = new THREE.AmbientLight(0xa0a0a0);
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
        // this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    animate(){
        const self = this;

        requestAnimationFrame(function(){
            self.animate();
        });
        self.render();
    };

    loadModel(options){
        const self = this;
        if(!options.type){
            console.log('Please provide a type of a file')
        }
        else if(options.type === 'obj'){
            this.loader.loadOBJ(options.name, options.objPath, options.mltPath, function(object) {
                self.updateMainModel(object);
            });
        }
        else if(options.type === 'gltf'){
            this.loader.loadGLTF(options.gltfPath, function(object) {
                self.updateMainModel(object);
            });
        }
    }
}