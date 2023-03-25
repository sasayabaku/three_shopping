<template>
    <div>
        <div id="container">
            <div id="myCanvas"></div>
        </div>
    </div>
</template>
<script>
export default {
    mounted() {
        // init();
        panorama();
    }
}

var camera, scene, renderer;
var container, mesh;
var isUserInteracting = false;
var isUserInteracting = false,
onMouseDownMouseX = 0, onMouseDownMouseY = 0,
lon = 0, lat = 0, 
phi = 0, theta = 0;

function init() {
    console.log("Initializing....");

    // var container, mesh;

    container = document.getElementById('myCanvas');

    camera = new THREE.PerspectiveCamera(
        100, window.innerWidth / window.innerHeight, 1, 1100
    );
    camera.target = new THREE.Vector3(0, 0, 0);

    scene = new THREE.Scene();

    var geometry = new THREE.PlaneGeometry(1000, 1000);
    const floortexture = new THREE.TextureLoader().load(
        "https://res.cloudinary.com/dj2iap5kj/image/upload/v1646154382/Balmain/PB_PATTERN_30MM-HEIGHT.png"
    );

    const material = new THREE.MeshPhongMaterial({
        map: floortexture,
        color: 0xffffff
    });

    mesh = new THREE.Mesh(geometry, material);

    scene.add( mesh );

    const loader = new THREE.GLTFLoader();
    loader.setCrossOrigin('anonymous');
    loader.setDRACOLoader(new THREE.DRACOLoader());
    loader.load(
        "room.glb",
        function (gltf) {
            // console.log(gltf);
            mesh = gltf.scene;
            mesh.scale.set(0.05, 0.05, 0.05);
            mesh.position.set(15, 0, 0);
            mesh.rotation.set(0, Math.PI, 0);

            scene.add(mesh);
        }
    )

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    // ライティング
    const light = new THREE.DirectionalLight("#fff", 2);
    const ambient = new THREE.AmbientLight("#85b2cd");
    light.position.set(20, 70, 100).normalize();
    scene.add(light);
    scene.add(ambient);

    animate();
}

function panorama() {
    console.log('panorama');

    container = document.getElementById('myCanvas');

    camera = new THREE.PerspectiveCamera(
        100, window.innerWidth / window.innerHeight, 1, 1100
    );
    
    camera.target = new THREE.Vector3( 0, 0, 0 );

    scene = new THREE.Scene();

    var geometry = new THREE.SphereGeometry( 500, 500, 500 );
    geometry.scale( -1, 1, 1 );

    var material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('backgrounds/Panorama1.png')
    });

    mesh = new THREE.Mesh( geometry, material );

    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    animate();

}

function animate() {
    requestAnimationFrame(animate);
    update();
}

function update() {
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(camera.target);
    renderer.render(scene, camera);
}
</script>

<style>
    html {
        overscroll-behavior: none;
    }

    body {
        padding: 0;
        margin: 0;
        width: 100%;
        height: 100%;
        overscroll-behavior: none;
    }
</style>