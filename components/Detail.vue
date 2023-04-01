<script lang="ts">
import * as THREE from 'three';
import { render } from 'nuxt/dist/app/compat/capi';
import { ShapeFlags } from '@vue/shared';
import { clear } from 'console';

export default {
    methods: {
        cancel() {
            this.$emit('cancel');
            clear();
        }
    },
    mounted() {
        ui_controler();
        panorama();

        animate();
    }
}

let camera:THREE.PerspectiveCamera, scene:THREE.Scene, renderer:THREE.WebGLRenderer;
let container:any;
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
        60, displayWidth / displayHeight, 10, 10000
    );
    camera.position.set(0, 0, +1000);
    
    scene = new THREE.Scene();

    const geometry_1 = new THREE.TorusGeometry(300, 100, 64, 100);
    const material = new THREE.MeshLambertMaterial({ color: 0x6699FF });
    mesh = new THREE.Mesh(geometry_1, material);

    scene.add(mesh);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(1, 1, 1);

    scene.add(directionalLight);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( displayWidth, displayHeight );
    container?.appendChild( renderer.domElement );

}

const animate = () => {
    requestAnimationFrame(animate);

    update();
}

const update = () => {

    mesh.rotation.y = -lon;
    mesh.rotation.x = lat
    renderer.render(scene, camera);
}

const ui_controler = () => {
    console.log('UI Controler');

    const scroll_speed = 0.01;

    onPreviewTouchStart = (event: TouchEvent ) => {
        isUserInteracting = true;

        onPointerDownX = event.changedTouches[0].clientX;
        onPointerDownY = event.changedTouches[0].clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;
    }

    onPreviewTouchMove = (event: TouchEvent ) => {
        if (event.touches.length > 1) {
            event.preventDefault();
        } 

        if(isUserInteracting === true) {
            lon = ( onPointerDownX - event.changedTouches[0].clientX ) * scroll_speed + onPointerDownLon;
            lat = ( event.changedTouches[0].clientY - onPointerDownY ) * scroll_speed + onPointerDownLat;
        }

    };

    onPreviewWheel = (event: WheelEvent) => {
        if (event.deltaY > 0 && camera.fov < 80) {
            camera.fov += event.deltaY * 0.05;
            camera.updateProjectionMatrix();
        } else if (event.deltaY <= 0 && camera.fov > 45) {
            camera.fov += event.deltaY * 0.05;
            camera.updateProjectionMatrix();
        }
    }

    document.addEventListener('touchstart', onPreviewTouchStart, false);
    document.addEventListener('touchmove', onPreviewTouchMove, false);
    document.addEventListener('wheel', onPreviewWheel, false);
}

const clear = () => {
    document.removeEventListener('touchstart', onPreviewTouchStart, false);
    document.removeEventListener('touchmove', onPreviewTouchMove, false);
    document.removeEventListener('wheel', onPreviewWheel, false);
}

</script>

<template>
    <!-- <Transition name="modal" apper> -->
        <div class="detail">
            <!-- <div class="mycenter">Product details</div> -->
            <div class="mycenter">
                <div class="object3d-viewer mycenter">
                    <div id="productCanvas"></div>
                </div>
            </div>

            <div class="close">
                <button id="close_button" @click="cancel">Close</button>
            </div>
        </div>
    <!-- </Transition> -->
</template>

<style scoped lang="css">

.mycenter {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}
.detail {
    position: absolute;
    display: block;
    /* justify-content: center; */
    height:100vh;
    width:100vw;
    background: #0000009c;
}
.object3d-viewer {
    height: 20rem;
    /* max-height: 20rem; */
    width: 90%;
    margin-top: 4.5rem;

    background: white;
    border-radius: 1.5rem;

    overflow: hidden;

}

.close {
    position: absolute;
    bottom: 3rem;
    display: flex;
    width: 100%;
    justify-content: center;
}

#close_button {
    background: white;
    font-size: 1.3rem;
    width: 8rem;
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