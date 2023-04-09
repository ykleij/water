import * as THREE from "three";
import { EventEmitter } from "events";
import Experience from "../Experience.js";
import { GUI } from 'dat.gui'

export default class World extends EventEmitter {
    constructor() {
        super();

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.perspectiveCamera;

        this.resources.on("ready", () => {
            // Waterbox
            this.waterbox = this.resources.items.waterbox.scene;

            this.sound();
            // Add waterbox to scene
            this.scene.add(this.waterbox)


            // Initialize ambientlight
            this.ambientLight = new THREE.AmbientLight(0xffffff);

            // Add ambientlight to scene
            this.scene.add(this.ambientLight);

            this.gui();

            this.update();
        })
    }

    cameraLookAt() {
        let box = new THREE.Box3().setFromObject(this.waterbox);
        let boxCenter = new THREE.Vector3();
        box.getCenter(boxCenter);
        this.camera.lookAt(boxCenter);

        this.experience.camera.update();
    }

    gui() {
        const gui = new GUI()
        const waterboxFolder = gui.addFolder('waterbox')
        waterboxFolder.add(this.waterbox.position, 'x', -5, 5)
        waterboxFolder.add(this.waterbox.position, 'y', -5, 5)
        waterboxFolder.add(this.waterbox.position, 'z', -5, 5)
        waterboxFolder.open()

        this.experience.camera.update();
    }

    sound() {
        const listener = new THREE.AudioListener();
        this.camera.add(listener);
        // create a positional audio object and load the audio file
        const sound = new THREE.PositionalAudio(listener);
        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('/models/strike.mp3', function (buffer) {
            sound.setBuffer(buffer);
            sound.setRefDistance(5); // set the distance where audio is audible
            sound.setDistanceModel('exponential'); // set the distance model
            sound.setRolloffFactor(2); // set the rolloff factor
            sound.setVolume(0.1)
        });

        window.addEventListener("keydown", () => {
            if (event.code === 'Space') {
                if (sound.isPlaying) {
                    sound.pause(); // pause the audio
                } else {
                    sound.play(); // play the audio
                }
            }
        })

        // const reverbEffect = new THREE.ReverbEffect(audio, {
        //     decay: 3,
        //     preDelay: 0.2
        //   });

          const eqEffect = new THREE.EqEffect(sound);
          eqEffect.lowGain = 0.5;
          eqEffect.highGain = 0.5;

          sound.add(reverbEffect);
          sound.add(eqEffect);

        this.waterbox.children[0].add(sound)
    }

    animation() {
        this.waterbox.animation = this.resources.items.waterbox.animations;

        this.mixer = new THREE.AnimationMixer(this.waterbox.children[0]);

        console.log(this.waterbox.animation[0])
        this.action = this.mixer.clipAction(this.waterbox.animation[0]);

        this.action.play();

        this.waterbox.children[0].userData.css = 'waterbox';

        window.addEventListener("click", () => {
            this.action.play();
            console.log(this.waterbox.children[0].userData)
        })
    }

    update() {
        // this.waterbox.children[0].rotation.y += 0.01;
    }
}