<script lang="ts">
import { eventNames } from 'process';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import script from '~~/plugins/script';

export default {
    mounted() {
        ui_controler();
        panorama();
        animate();

        product();
    },
    unmounted() {
        console.log('unmounted');
    },
    data() {
        return {
            modalFlag: false,
            modelURL:  '/models/cup.gltf'
        }
    },
    methods: {
        openModal() {
            this.modalFlag = true;
            lock();
        },
        closeModal() {
            this.modalFlag = false;
            unlock();
        }
    }
}

let camera:THREE.PerspectiveCamera, scene:THREE.Scene, renderer:THREE.WebGLRenderer;
let container, mesh, geometry_1, controls:OrbitControls;

let material_1;

let isUserInteracting = false;
let lockStatus = false;

let onPointerDownX = 0, onPointerDownY = 0,
    onPointerDownLon = 0, onPointerDownLat = 0,
    lon = 0, lat = 0,
    phi = 0, theta = 0;

let displayWidth = window.innerWidth;
let displayHeight = window.innerHeight;


const products = [
    {
        'name': 'Starbacks Coffie',
        'price': 450,
        'img': '/products/cup.png'
    }
];


// 注目物体の判定用のカウンター
let counter = 0;

// 商品情報格納
let productName:any, price:any, productImg:any, displayProduct:any = null;

const panorama = () => {
    console.log('Initializing...');

    container = document.getElementById('vrCanvas');

    camera = new THREE.PerspectiveCamera(
        60, displayWidth / displayHeight, 1, 10000
    );
    camera.position.set(0, 0, 0);
    camera.target = new THREE.Vector3(0, 0, 0);

    scene = new THREE.Scene();

    geometry_1 = new THREE.SphereGeometry( 1000, 1000, 1000 );
    geometry_1.scale( -1, 1, 1 );

    material_1 = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('/backgrounds/TentLayout.png')
    });

    mesh = new THREE.Mesh( geometry_1, material_1);

    scene.add(mesh);

    controls = new OrbitControls(camera, container);
    controls.enableDamping = false;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.rotateSpeed = -0.3
    
    controls.target.x = -(camera.position.x + 0.001);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( displayWidth, displayHeight );
    container.appendChild( renderer.domElement );

}


const ui_controler = () => {
    console.log('UI Controler');

    const scroll_speed = 0.15;

    const onDocumentTouchStart = (event: TouchEvent ) => {
        isUserInteracting = true;

        onPointerDownX = event.changedTouches[0].clientX;
        onPointerDownY = event.changedTouches[0].clientY;

        onPointerDownLon = lon;
        onPointerDownLat = lat;

    }

    const onDocumentTouchMove = (event: TouchEvent ) => {
        if (event.touches.length > 1) {
            event.preventDefault();
        } 

        if(isUserInteracting === true && lockStatus === false) {
            lon = ( onPointerDownX - event.changedTouches[0].clientX ) * scroll_speed + onPointerDownLon;
            lat = ( event.changedTouches[0].clientY - onPointerDownY ) * scroll_speed + onPointerDownLat;
        }

        if (camera.rotation.y < 1.5 && camera.rotation.y > 1.04) {
            if(displayProduct === null) {
                displayProduct = products[0];
                productName.innerText = displayProduct['name'];
                price.innerText = "¥ " + String(displayProduct['price']);
                productImg.style.display = 'block';
                productImg.src = displayProduct['img'];
            }
        } else if(displayProduct !== null) {
            productName.innerText = '';
            price.innerText = '';
            productImg.style.display = 'none';
            displayProduct = null;
        }

    };

    const onDocumentWheel = (event: WheelEvent) => {
        if(lockStatus) {
            return
        }
        
        if (event.deltaY > 0 && camera.fov < 80) {
            camera.fov += event.deltaY * 0.05;
            camera.updateProjectionMatrix();
        } else if (event.deltaY <= 0 && camera.fov > 45) {
            camera.fov += event.deltaY * 0.05;
            camera.updateProjectionMatrix();
        }
    }

    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    // document.addEventListener('wheel', onDocumentWheel, false);
}

const product = () => {

    productName = document.getElementById('product_name');
    price = document.getElementById('price');
    productImg = document.getElementById('thumbnail');

    
    let displayProduct = products[0];

    const flow = () => {
        while(true){
            console.log(camera.rotation.y);
            if (camera.rotation.y < 1.5 && camera.rotation.y > 1.04) {
                productName.innerText = displayProduct['name'];
                price.innerText = "¥ " + String(displayProduct['price']);
                productImg.src = displayProduct['img'];
            }
        }
    };
    
}

const animate = () => {
    requestAnimationFrame(animate);

    controls.update();

    update();
}

const update = () => {
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

    renderer.render(scene, camera);
}

const lock = () => {
    lockStatus = true;
}

const unlock = () => {
    lockStatus = false;
}

</script>

<template>
    <div>
        <div id="container">
            <div id="vrCanvas"></div>

            <div class="thumbnail">
                <div id="product" @click="openModal">
                    <div id="product_info" class="flex-item">
                        <p><span id="product_name"></span></p>
                        <p><span id="price"></span></p>
                    </div>
                    <div class="flex-item"><img id="thumbnail" src="" alt="" width="90%"></div>
                </div>
            </div>

            <Transition name="fade" apper>
                <Detail v-if="modalFlag" :model_url="modelURL" @cancel="closeModal"/>
            </Transition>

        </div>
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
span {
    display: inline-block;
}

#vrCanvas {
    position: absolute;
}

.flex-item {
    flex: 1;
}

.thumbnail {
    position: fixed;
    /* height: 6rem; */
    padding-top: 1rem;
    z-index: 0;
}

#thumbnail {
    transform: translateY(5%);
}

#product {
    display: flex;
    justify-content: center;
    align-items: center;
}

#product_info {
    width: 50%;
    margin-left: 2rem;
    display: inline-block;
    color: white;
    font-size: 1.0rem;
    font-weight: 700;
}


/* .test {
    opacity: 0.5;
} */

</style>

<style>
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
    /* opacity: 0.5; */
}

.fade-leave-active {
    transition: opacity 0.5s;
}
</style>