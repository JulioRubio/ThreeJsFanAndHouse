//
//Proyecto Graficas Computacionales
//
//Julio Alexis Rubio Gonzalez A00819054 
//Rodrigo Valencia Maciel A00818256
//
//


import {GLTFLoader} from './GLTFLoader.js'

var scene, camera, renderer, mesh;
var fan, door;

var fanLoaded = false;
var doorLoaded = false;


var keyboard = {};
let player = {height:1.8, speed:0.2};
var loader = new GLTFLoader();

function init(){
    scene = new THREE.Scene();
    scene.background = new THREE.Color("skyblue");
    camera = new THREE.PerspectiveCamera(90,window.innerWidth / window.innerHeight,0.1,1000);

    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        new THREE.MeshBasicMaterial({color: 0xffff99, wireframe:false})
    );

    camera.position.set(9,player.height,-24);
    camera.lookAt(new THREE.Vector3(0,player.height,0));

    renderer = new THREE.WebGLRenderer({ precision: 'mediump' });
    renderer.setSize(1280,720);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);

    var lightHouse = new THREE.PointLight(0xc4c4c4,1.5);
    lightHouse.position.set(-0.8,17,0);
    lightHouse.castShadow = true;
    lightHouse.shadowMapVisible = true;
    scene.add(lightHouse);
    console.log(lightHouse);
    
    var sunLight = new THREE.PointLight(0xc4c4c4,1.5);
    sunLight.position.set(-0.8,50,0);
    sunLight.castShadow = true;
    sunLight.shadowMapVisible = true;
    scene.add(sunLight);

    var ambientLight = new THREE.AmbientLight(0xc4c4c4,0.2);
    scene.add(ambientLight);

    loader.load('models/house.gltf', function(gltf){
        var model = gltf.scene;
        model.traverse((o) => {
        if (o.isMesh){
            //console.log(o);
            o.material.roughness = 1;
            //console.log(o.name);
            o.receiveShadow = true;
            
            if(o.name === "Cube.001_2" || o.name === "Cube.001_1" ){
                o.castShadow = true;
                o.receiveShadow = false;
                o.AmbientLight = true;
            }
        } 
        });
        scene.add(model)
    }, undefined, function ( error ) {
        //console.error( error );
    });


    loader.load('models/fan.gltf', function(gltf){
        fan = gltf.scene;
        fan.traverse((o) => {
        if (o.isMesh){
            //console.log(o);
            //console.log(o.name);
            o.castShadow = true;

        } 
        });
        scene.add(fan)
        fan.position.y = 13;
        fan.position.x = -1;
        fanLoaded = true;
    }, undefined, function ( error ) {
        console.error( error );
    });
    loader.load('models/ground.gltf', function(gltf){
        var model = gltf.scene;
        model.traverse((o) => {
        if (o.isMesh){
            o.material.roughness = 1;
            o.receiveShadow = true;
        } 
        });
        scene.add(model)
        gltf.scene.position.y = -3.1;
    }, undefined, function ( error ) {
        console.error( error );
    });
    
    loader.load('models/door1.gltf', function(gltf) {
        door = gltf.scene;
        door.traverse((a) => {
            if (a.isMesh) {
                a.material.roughness = 1;
                a.receiveShadow = true;
                a.castShadow = true;
            }
        });
        // Door position, to entrance
        door.position.x = 11.15;
        door.position.y = -1.5;
        door.position.z = -23.5;
        scene.add(door);
        doorLoaded = true;
    }, undefined, function(error){
        console.log(error);
    });

    animate();
}


function animate(){
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.01;
    mesh.rotation.x += 0.02;
    renderer.render(scene,camera);

    if(fanLoaded)
        fan.rotation.y += 0.01;
    //WASD
    if(keyboard[87]){
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }

    if(keyboard[83]){
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }

    if(keyboard[65]){
        camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
    }
    
    if(keyboard[68]){
        camera.position.x += Math.sin(camera.rotation.y- Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
    }

    if(keyboard[37]){
        camera.rotation.y -= Math.PI * 0.01;
    }

    if(keyboard[39]){
        camera.rotation.y += Math.PI * 0.01;
    }
    if(keyboard[69] && doorLoaded) { // Open door E
        door.rotation.y += 0.05;
    }
    if(keyboard[81] && doorLoaded) { // Open door Q
        door.rotation.y -= 0.05;
    }
}

function keyDown(event){
    
    keyboard[event.keyCode] = true;
}

function keyUp(event){
    keyboard[event.keyCode] = false;
    console.log("x " + camera.position.x + " z " + camera.position.z);
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;