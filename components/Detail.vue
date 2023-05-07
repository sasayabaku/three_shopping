<script lang="ts">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
    props: [
        'model_url'
    ],
    methods: {
        cancel() {
            this.$emit('cancel');
            clear();
        }
    },
    mounted() {
        panorama();

        object_view();

        animate();

        this.$nextTick(() => {
            console.log("AAA");
        })
    },
    unmounted() {
        console.log('unmounte');
        console.log(renderer);
    }
}

let camera:THREE.PerspectiveCamera, scene:THREE.Scene, renderer:THREE.WebGLRenderer;
let container:any, controls:OrbitControls;
let mesh:any;

let isUserInteracting:boolean = false;

let displayWidth:number, displayHeight:number; 

let onPointerDownX = 0, onPointerDownY = 0,
    onPointerDownLon = 0, onPointerDownLat = 0,
    lon = 0, lat = 0;

let onPreviewTouchStart:any, onPreviewTouchMove:any, onPreviewWheel:any;

const panorama = () => {
    container = document.getElementById('productCanvas');

    displayWidth = container.getBoundingClientRect().width;
    displayHeight = container.getBoundingClientRect().height;

    camera = new THREE.PerspectiveCamera(
        60, displayWidth / displayHeight, 1, 8000
    );
    camera.position.set(5, 20, 30);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    scene = new THREE.Scene();

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2.5, 1.5);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xFFFFFF, 3, 40, 1);
    pointLight.position.set(20, 20, 0);
    scene.add(pointLight);

    // const lightHelper = new THREE.PointLightHelper(pointLight);
    // scene.add(lightHelper);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.9);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 1.2);
    // scene.add(hemiLight);

    controls = new OrbitControls(camera, container);
    controls.enableDamping = true;
    controls.dampingFactor = 0.2
    controls.maxDistance = 20;
    controls.minDistance = 10;
    controls.enablePan = false;

    renderer = new THREE.WebGLRenderer( { alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( displayWidth, displayHeight );
    renderer.setClearColor(0x000000, 0);  // 透明化
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.tomeMapping = THREE.ACESFilmicToneMapping;
    container.appendChild( renderer.domElement );

}

const object_view = () => {

    console.log('Object View')

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);


    const mesh_scale = 4;
    const modelfile = "/models/cup.gltf"
    loader.load(modelfile, (gltf:any) => {
        mesh = gltf.scene;
        mesh.position.set(0, 0, 0);
        
        mesh.scale.set(mesh_scale, mesh_scale, mesh_scale);
        mesh.traverse((object:any) => {
            if(object.isMesh) {
                object.material.transparent = true;
                object.receiveShadow = true;
                object.castShadow = true;
            }
        })

        scene.add(mesh);
    })

    const axis = new THREE.AxesHelper(2000);
    axis.position.set(0, 0, 0);
    // scene.add(axis);
}

const animate = () => {
    requestAnimationFrame(animate);

    controls.update();

    update();
}

const update = () => {

    if(mesh !== void 0){
        mesh.rotation.y = -lon;
        mesh.rotation.x = lat
    }

    renderer.render(scene, camera);
}

const clear = () => {
    document.removeEventListener('touchstart', onPreviewTouchStart, false);
    document.removeEventListener('touchmove', onPreviewTouchMove, false);
    document.removeEventListener('wheel', onPreviewWheel, false);

    var clone = container.cloneNode(false);
    container.parentNode.replaceChild(clone, container);
}

</script>

<template>
        <div class="detail">
            <div class="mycenter">
                <div class="object3d-viewer mycenter">
                    <div id="productCanvas"></div>
                </div>
                <div class="mycenter description">
                    <ul class="title">
                        <li class="name">Starbacks Coffie</li>
                        <li class="price">¥450</li>
                    </ul>

                    <div class="details">Lorem ipsum dolor sit amet, 
                        consectetur adipiscing elit, sed do eiusmod tempor 
                        incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation 
                        ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                        Duis aute irure dolor in reprehenderit in voluptate velit esse 
                        cillum dolore eu fugiat nulla pariatur.</div>
                </div>
            </div>

            <div class="close">
                <button id="close_button" @click="cancel">×</button>
            </div>
        </div>
    <!-- </Transition> -->
</template>

<style scoped lang="css">

li {
  list-style: none;  
}

.mycenter {
    margin: 0 auto;
    align-items: center;
    text-align: center;
}
.detail {
    position: absolute;
    display: block;
    height:100vh;
    width:100vw;
    background: #0000009c;
}
.object3d-viewer {
    height: 15rem;
    width: 90%;
    margin-top: 3.5rem;

    background: #00000000;
    border-radius: 1.5rem;

    overflow: hidden;

}

.description {
    margin-top: 1rem;
    padding: 0 1.5rem;
    height: 10rem;
    overflow: scroll;
    color: white;
}

.title {
    display: flex;
    font-size: 1.2rem;
    padding-left: 0.5rem;
}

.title li {
    margin-right: 1.5rem;
}

.description .details {
    padding: 0 0.5rem;
}

.close {
    position: absolute;
    bottom: 5rem;
    display: flex;
    width: 100%;
    justify-content: center;
}

#close_button {
    background: #00000000;
    border:2px solid #ffffff;
    color: #ffffff;
    font-size: 1.3rem;
    width: 2.5rem;
    text-align: center;
    padding: 0.3rem 0rem;
    border-radius: 0.25rem;
}

.modal-enter,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.5s;
}

.modal-leave-active {
    transition: opacity 0.6s ease 0.4s;
}

.modal-enter,
.modal-leave-to {
    opacity: 1;
}

#productCanvas {
    width: 100%;
    height: 100%;
}

</style>