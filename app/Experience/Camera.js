import * as THREE from "three";
import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; 


export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.canvasWidth = this.experience.canvasWidth;
        this.canvasHeight = this.experience.canvasHeight;
        this.aspect = this.sizes.aspect;

        this.params1 = {
            viewSize: this.sizes.viewSize,
            near: 1,
            far: 1000,
            left: this.sizes.width / -2,
            right: this.sizes.width / 2,
            top: this.sizes.height / 2,
            bottom: this.sizes.height / -2,
        };

        this.params2 = {
            aspect: this.sizes.aspect,
            near: 0.01,
            far: 1000,
            fov: 110,
        }

        this.setPerspectiveCamera();
        // this.setOrtographicCamera();
        this.setOrbitControls();
    }

    setOrtographicCamera() {
        this.orthographicCamera = new THREE.OrthographicCamera(
            this.params1.left,
            this.params1.right,
            this.params1.top,
            this.params1.bottom,
            this.params1.near,
            this.params1.far
        );

        this.scene.add(this.orthographicCamera);
    }

    setPerspectiveCamera() {
        this.perspectiveCamera = new THREE.PerspectiveCamera(
            this.params2.fov,
            this.params2.aspect,
            this.params2.near,
            this.params2.far
        )

        this.perspectiveCamera.position.x = -10;
        this.scene.add(this.perspectiveCamera);
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
        this.controls.enableDamping = true;
    }

    onResize() {
        this.perspectiveCamera.aspect = this.sizes.aspect;
        this.perspectiveCamera.updateProjectionMatrix();
    }

    update() {
        this.controls.enableDamping = true;
    }



}