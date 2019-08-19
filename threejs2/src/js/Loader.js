import { OBJLoader2 } from './lib/loaders/OBJLoader2.js';
import { MTLLoader } from './lib/loaders/MTLLoader.js';
import { MtlObjBridge } from './lib/loaders/obj2/bridge/MtlObjBridge.js';
import { GLTFLoader } from './lib/loaders/GLTFLoader.js';

export default class Loader {
    constructor(scene, debug) {
        if (!scene) {
            console.log('Invalid Scene. Unable to initialize loader.');
            return null;
        }
        this._scene = scene;
        this._debug = debug || false;
        this._addToScene = function(object3d) {
            this._onLoad(object3d);
            this._scene.add(object3d);
        }
        this._onLoad = function (object3d) { };
        
        this._extractPath = function(filePath) {
            return {
                path: filePath.substring(0, filePath.lastIndexOf("/")),
                fileName: filePath.substring(filePath.lastIndexOf("/"))
            };
        }
    }

    loadOBJ(modelName, objPath, texturePath, onLoad) {
        const objLoader = new OBJLoader2();
        const mtlLoader = new MTLLoader();
        texturePath = texturePath || "";
        this._onLoad = onLoad || function () { };
        const loadOBJFile = function (mtlParseResult) {
            objLoader.setModelName(modelName);
            objLoader.setLogging(this._debug, this._debug);
            if (mtlParseResult) {
                objLoader.addMaterials(MtlObjBridge.addMaterialsFromMtlLoader(mtlParseResult));
            }
            this._objLoader.load(objPath, _addToScene, null, null, null);
        };
        if (texturePath) {
            mtlLoader.load(texturePath, loadOBJFile);
        }
        else {
            loadOBJFile();
        }
    }

    loadGLFT(filePath, onLoad) {
        const path = this._extractPath(filePath);
        const gltfLoader = new GLTFLoader().setPath(path.path);
        this._onLoad = onLoad || function () { };
        gltfLoader.load(path.fileName, function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.material.envMap = envMap;
                }
            });
            this._addToScene(gltf.scene);
        });
    }
}

