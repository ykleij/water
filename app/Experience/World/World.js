import * as THREE from "three";
import { EventEmitter } from "events";
import Experience from "../Experience.js";

export default class World extends EventEmitter {
    constructor() {
        super();

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

        this.resources.on("ready", () => {
            // Waterbox
            this.waterbox = this.resources.items.waterbox.scene;
            this.waterbox.animation = this.resources.items.waterbox.animations;

            this.mixer = new THREE.AnimationMixer(this.waterbox);

            // console.log(this.waterbox.animation[0])
            this.action = this.mixer.clipAction(this.waterbox.animation[0]);

            this.action.play();

            this.waterbox.children[0].userData.css = 'waterbox'
            // Add waterbox to scene
            this.scene.add(this.waterbox)

            document.addEventListener('mousedown', (e) => {
                this.onDocumentMouseMove(e);
            });

            this.waterbox.children[0].addEventListener("mouseover", () => {
                document.querySelector('.experience-canvas').style.cursor = "pointer";
                console.log("hovering smile")
            })

            this.waterbox.children[0].addEventListener("mouseout", () => {
                document.querySelector('.experience-canvas').style.cursor = "default";
                console.log("not hovering anymore smile")
            })

            window.addEventListener("click", () => {
                this.action.play();
                console.log(this.waterbox.children[0].userData)
            })
            // Initialize ambientlight
            this.ambientLight = new THREE.AmbientLight(0xffffff);

            // Add ambientlight to scene
            this.scene.add(this.ambientLight);
        })
    }
    onDocumentMouseMove(event) {

        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.experience.camera);
        var intersects = raycaster.intersectObjects(this.waterbox);

        if (intersects.length > 0) {
            $('html,body').css('cursor', 'pointer');
        } else {
            $('html,body').css('cursor', 'default');
        }

    }
    update() {
    }
}