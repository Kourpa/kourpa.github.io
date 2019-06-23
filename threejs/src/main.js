$(function () {
    let $parent;
    let container;
    let camera, scene, renderer;
    let cameraControls;
    let raycaster;
    let mouse = new THREE.Vector2(), INTERSECTED;

    //default width/height to maximum
    let width = window.innerWidth;
    let height = window.innerHeight;

    let helmet;

    init();
    animate();

    function init() {
        container = document.createElement('div');

        $parent = $("#threejs-canvas");
        if($parent.length === 0){
            $parent = $('<div style="width:100%; height: 100%"></div>');
            $('body').append($parent);
        }

        width = $parent.width();
        height = $parent.height();
        $parent.append(container);

        camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
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

        }

        var manager = new THREE.LoadingManager(loadModel);

        manager.onProgress = function (item, loaded, total) {

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


        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
        new THREE.MTLLoader()
            .setPath('./resources/textures/')
            .load('male02_dds.mtl', function (materials) {
                materials.preload();

                new THREE.OBJLoader()
                    .setMaterials(materials)
                    .setPath('./resources/models/')
                    .load('male02.obj', function (object) {

                        object.position.y = - 95;
                        scene.add(object);

                    }, onProgress, onError);

            });


        var helmetLoader = new THREE.OBJLoader(manager);
        helmetLoader.load('./resources/models/helmet123.obj', function (obj) {
            helmet = obj;
            helmet.position.y += 60;
            helmet.position.x += 2;
            helmet.rotation.x -= Math.PI / 2;
            helmet.rotation.z += Math.PI / 2;

            helmet.traverse(function (child) {

                if (child.isMesh) child.material.map = helmetTexture;

            });

            scene.add(helmet);
        }, onProgress, onError);

        //
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
        cameraControls.addEventListener('change', render)

        raycaster = new THREE.Raycaster();

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        window.addEventListener('resize', onWindowResize, false);

    }

    function onDocumentMouseMove(event) {
        const parentPosition = $(container).position();
        const parentX = parentPosition.left;
        const parentY = parentPosition.top;

        event.preventDefault();
        mouse.x = ((event.clientX - parentX) / width) * 2 - 1;
        mouse.y = -((event.clientY - parentY) / height) * 2 + 1;
    }

    function onWindowResize() {
        width = $parent.width();
        height = $parent.height();
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
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
            }

        } else {

            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = null;
        }

        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
})