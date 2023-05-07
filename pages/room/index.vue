<script lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export default {
    mounted() {
        console.log('mount');
        panorama();
        animate();
        model_load();
    },
    data() {
        return {
            a: 'a'
        }
    }
}

let camera:THREE.PerspectiveCamera,
    scene:THREE.Scene,
    renderer:THREE.WebGLRenderer;

let container:any, controls:OrbitControls;
let mesh:any;

let displayWidth:number, displayHeight:number;


const panorama = () => {
    container = document.getElementById('vrCanvas');

    displayWidth = container.getBoundingClientRect().width;
    displayHeight = container.getBoundingClientRect().height;

    camera = new THREE.PerspectiveCamera(
        60, displayWidth / displayHeight, 1, 8000
    );

    camera.position.set(5, 10, 30);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    scene = new THREE.Scene();

    controls = new OrbitControls(camera, container);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3.5);
    directionalLight.position.set(1, 0, 1);
    scene.add(directionalLight);

    renderer = new THREE.WebGLRenderer( { alpha:true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( displayWidth, displayHeight );
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.tomeMapping = THREE.ACESFilmicToneMapping;
    container.appendChild( renderer.domElement );

}

const animate = () => {
    requestAnimationFrame(animate);

    controls.update();

    update();
}

const update = () => {
    renderer.render(scene, camera);
}

const model_load = () => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    const modelFile = '/models/cup.gltf';
    
    loader.load(modelFile, (gltf:any) => {
        mesh = gltf.scene;
        mesh.position.set(0, 0, 0);

        mesh.traverse((object:any) => {
            if(object.isMesh) {
                object.material.transparent = true;
                object.receiveShadow = true;
                object.castShadow = true;
            }
        })

        scene.add(mesh);

        const axis = new THREE.AxesHelper(2000);
        axis.position.set(0, 0, 0);
        scene.add(axis);
    })
}

</script>

<template>
    <div id="container">
        <div id="vrCanvas"></div>
    </div>
</template>

<style lang="css">
html {
    overflow: hidden;
    overscroll-behavior: none;
}

body {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 0;
    overscroll-behavior: none;
}

button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    padding: 0;
    appearance: none;
}
</style>

<style scoped>
#vrCanvas {
    position: absolute;
    width: 100%;
    height: 100%;
}
</style>