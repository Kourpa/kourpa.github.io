$(function () {
    let mainObjectFiles;
    let mainObjectTextures;
    let container;
    let camera, scene, renderer;
    let cameraControls;
    let raycaster;
    let mouse = new THREE.Vector2(), INTERSECTED;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    let object;
    let helmet;

    init();
    animate();
    

    function init() {

        container = document.createElement('div');
        document.body.appendChild(container);

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.z = 250;

        // scene

        scene = new THREE.Scene();

        var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        scene.add(ambientLight);

        // var pointLight = new THREE.PointLight(0xffffff, 0.8);
        // camera.add(pointLight);

        let light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1).normalize();
        scene.add(light);

        scene.add(camera);

        // manager
        function loadModel() {

            object.traverse(function (child) {

                if (child.isMesh) child.material.map = texture;

            });

            object.position.y = - 95;
            scene.add(object);

        }

        var manager = new THREE.LoadingManager(loadModel);

        manager.onProgress = function (item, loaded, total) {

            console.log(item, loaded, total);

        };

        // texture
        var textureLoader = new THREE.TextureLoader(manager);

        var texture = textureLoader.load('./resources/textures/UV_Grid_Sm.jpg');
        var helmetTexture = textureLoader.load('./resources/textures/helmet.jpg');

        // model
        function onProgress(xhr) {

            if (xhr.lengthComputable) {

                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log('model ' + Math.round(percentComplete, 2) + '% downloaded');

            }

        }

        function onError() { }

        var loader = new THREE.OBJLoader(manager);

        loader.load('./resources/models/male02.obj', function (obj) {

            object = obj;

        }, onProgress, onError);

        var helmetLoader = new THREE.OBJLoader(manager);
        helmetLoader.load('./resources/models/helmet123.obj', function (obj) {
            helmet = obj;
            helmet.position.y += 60;
            helmet.position.x += 2;
            helmet.rotation.x -= Math.PI/2;
            helmet.rotation.z += Math.PI/2;

            helmet.traverse(function (child) {

                if (child.isMesh) child.material.map = helmetTexture;

            });
            
            scene.add(helmet);
        }, onProgress, onError);

        //
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
        cameraControls.addEventListener('change', render)

        raycaster = new THREE.Raycaster();

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);

    }

    function onDocumentMouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    //

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {

            if (INTERSECTED != intersects[0].object) {

                if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

                INTERSECTED = intersects[0].object;
                INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                INTERSECTED.material.emissive.setHex(0xff0000);

                console.log(INTERSECTED.name)
            }

        } else {

            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = null;
        }

        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
})