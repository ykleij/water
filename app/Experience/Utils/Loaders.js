import * as THREE from "three";

import { EventEmitter } from "events";
import assets from "./assets.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export default class Loaders extends EventEmitter {
    constructor() {
        super();

        this.loaders = {};
        this.items = {};

        this.assets = assets;
        this.loaded = 0;
        this.queue = this.assets.length;
        
        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();

        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.dracoLoader = new DRACOLoader();
        this.loaders.dracoLoader.setDecoderPath('/draco/');
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);

        this.loaders.textureLoader = new THREE.TextureLoader();
    }

    startLoading() {
        for (const asset of this.assets) {
            if (asset.type === "glbModel") {
                this.loaders.gltfLoader.load(asset.path, (file) => {
                    this.singleAssetLoaded(asset, file);
                });
            }
        }
    }

    singleAssetLoaded(asset, file) {
        console.log(file)
        this.items[asset.name] = file;
        this.loaded++;

        if (this.loaded === this.queue) {
            this.emit("ready");
        }
    } 
}