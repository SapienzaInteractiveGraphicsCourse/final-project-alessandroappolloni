import * as THREE from 'https://cdn.skypack.dev/three@0.134.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/libs/tween.module.min';
//import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';


const textureLoader = new THREE.TextureLoader();
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});
const camera = new THREE.PerspectiveCamera( 60, 2, 0.1, 1000 );
const scene = new THREE.Scene();
const clock = new THREE.Clock();

const numPokeball = 4;
const numTree = 8;

let ground1;
let ground2;
let groundGrass;
let cloud1;
let cloud2;
let cloud3;
let cloud4;
let cloud5;
let cloud6;
let groundPath = [-0.2, 0, 0.2];
let groundPathZ = [-1.3, -1.9, -2.6]
let groundPathZArticuno = [-1.7, -2.3];
let groundPathXArticuno = [-0.2, 0, 0.2]
let groundPathZBlastoise = [-1.5, -2.4];
let groundPathXBlastoise = [-0.2, 0, 0.2]
let pokeballs = [];
let treesL1 = [];
let treesL2 = [];
let treesL3 = [];
let treesL4 = [];
let treesL5 = [];
let treesR1 = [];
let treesR2 = [];
let treesR3 = [];
let treesR4 = [];
let treesR5 = [];

const modelLoader = new GLTFLoader();

let models2 = [] 	//obstacle 
let models3 = []	//obstacle

let model1;
let spine;
let hip;
let tail;
let leftUpperArm;
let rightUpperArm;
let leftLowerArm;
let rightLowerArm;
let leftUpperLeg;
let leftLowerLeg;
let rightUpperLeg;
let rightLowerLeg;

let points = 0;
let health = 0;

let running = true;


class Ground {
	constructor(){
	
	const width = 5;  
	const height = 2;  
	const geometry = new THREE.PlaneGeometry(width, height);
	const material = new THREE.MeshPhongMaterial({
		map: textureLoader.load('textures/grass_1.jpg'),

	});
	material.map.wrapS = THREE.RepeatWrapping;
	material.map.wrapT = THREE.RepeatWrapping;
	material.map.repeat.set(8, 2);
	material.flatShading = true;
	const planeMesh = new THREE.Mesh(geometry, material);
	planeMesh.scale.set(1.0,1.0,1.0)
	return planeMesh;

	}
}

/*class GroundGrass {
	constructor(){
	const width = 10;  
	const height = 2;  
	const geometry = new THREE.PlaneGeometry(width, height);
	const material = new THREE.MeshPhongMaterial({
		
		map: textureLoader.load('textures/grass_1.jpg')
	});
	material.map.wrapS = THREE.RepeatWrapping;
	material.map.wrapT = THREE.RepeatWrapping;
	material.map.repeat.set(15, 5);
	material.flatShading = true;
	const planeMesh = new THREE.Mesh(geometry, material);
	planeMesh.scale.set(1.0,1.0,1.0)
	return planeMesh;
	}
}*/

class Pokeball {
	constructor(){

		const radius = 1;  
		const widthSegments = 12;  
		const heightSegments = 8;  
		const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
		const material = new THREE.MeshPhongMaterial({
			map: textureLoader.load('textures/pokeball_1.jpg')
		});
		material.flatShading = true;
		const mesh = new THREE.Mesh(geometry, material);
		mesh.scale.set(0.02,0.02,0.02)
		return mesh;

	}
}

class Cloud {
	constructor(){
		const radius = 1;  // ui: radius
		const detail = 2;  // ui: detail
		const geometry = new THREE.OctahedronGeometry(radius, detail);
		const material = new THREE.MeshPhongMaterial({
			//color: 'lightgrey',
			map: textureLoader.load('textures/white2.webp')
		});
		material.flatShading = true;
		const mesh = new THREE.Mesh(geometry, material);
		mesh.scale.set(0.1,0.1,0.1)
		
		
		const meshLeft = new THREE.Mesh(geometry, material);
		meshLeft.scale.set(0.7,0.7,0.7)
		meshLeft.position.x =-1 
		mesh.add(meshLeft);

		const meshRight = new THREE.Mesh(geometry, material);
		meshRight.scale.set(0.7,0.7,0.7)
		meshRight.position.x = 1 
		mesh.add(meshRight);
		
		return mesh;
	}
}

class Tree{
	constructor(){

		const group = new THREE.Group();

		//Trunk
		const radiusTop = 0.15;  
		const radiusBottom = 0.15;  
		const height = 0.4;  
		const radialSegments = 12;  
		const geometry = new THREE.CylinderGeometry(
    		radiusTop, radiusBottom, height, radialSegments);
		const material = new THREE.MeshPhongMaterial({
				//color: '#9a4a1c',
				flatShading: true,
				map: textureLoader.load('textures/trunk1.jpg')
		});
		const trunkMesh = new THREE.Mesh(geometry, material);
		trunkMesh.scale.set(0.1,0.1,0.1)
		group.add(trunkMesh);

		//Bottom cone
		const radius1 = 0.6;  // ui: radius
		const height1 = 0.3;  // ui: height
		const radialSegments1 = 8;  // ui: radialSegments
		const geometryCone = new THREE.ConeGeometry(radius1, height1, radialSegments1);
		const materialCone = new THREE.MeshPhongMaterial({
			//color: '#286c0d',
			flatShading: true,
			map: textureLoader.load('textures/green1.jpg')
		});
		const meshBottomCone = new THREE.Mesh(geometryCone, materialCone);
		group.add(meshBottomCone);
		meshBottomCone.scale.set(0.1,0.1,0.1);
		meshBottomCone.position.y = 0.035;

		//Central cone
		const meshCentralCone = new THREE.Mesh(geometryCone, materialCone);
		group.add(meshCentralCone);
		meshCentralCone.scale.set(0.08,0.12,0.08);
		meshCentralCone.position.y = 0.05;

		//Top cone
		const meshTopCone = new THREE.Mesh(geometryCone, materialCone);
		group.add(meshTopCone);
		meshTopCone.scale.set(0.06,0.1,0.06);
		meshTopCone.position.y = 0.064;

		group.scale.set(1.2,3,1.2)

		return group;

	}
}

function blaziken(){
	modelLoader.load( '/models/blaziken/scene.gltf', function ( gltf ) {
		model1 = gltf.scene
		model1.scale.set(0.03,0.03,0.03);
		model1.position.x = 0;
		model1.position.y = -0.005;
		model1.position.z = 0.90;
		model1.rotation.x = -0.3;
		model1.rotation.y = 3.1;
		scene.add(model1);
		leftUpperArm = model1.getObjectByName("LArm_035");
		leftUpperArm.rotation.z = 5.7;
		
		rightUpperArm = model1.getObjectByName("RArm_066");
		rightUpperArm.rotation.z = -5.7;
		
		leftLowerArm = model1.getObjectByName("LForeArm_036");
		leftLowerArm.rotation.y = 0;
		
		rightLowerArm = model1.getObjectByName("RForeArm_067");
		rightLowerArm.rotation.y = -1.2; 
		
		leftUpperLeg = model1.getObjectByName("LThigh_05");
		leftLowerLeg = model1.getObjectByName("LLeg_06")
		
		rightUpperLeg = model1.getObjectByName("RThigh_018");
		rightLowerLeg = model1.getObjectByName("RLeg_019")
		
		spine = model1.getObjectByName("Spine1_015");
		hip = model1.getObjectByName("Hips_04");
		tail = model1.getObjectByName("Tail_030"); 
		
		animationBlaziken();

	}, undefined, function ( error ) {
		console.error( error );
	} );
}

function blastoise(){
	for(let i=0; i<1; i++){
		modelLoader.load( '/models/blastoise/scene.gltf', function ( gltf ) {
			models2[i] = gltf.scene
			models2[i].scale.set(0.04,0.04,0.04);
			models2[i].position.x = 0//groundPathXBlastoise[Math.floor(Math.random() * groundPath.length)];
			models2[i].position.y = 0.0;
			models2[i].position.z = 0.4//groundPathZBlastoise[Math.floor(Math.random() * groundPath.length)];
			scene.add(models2[i]);
			//console.log(dumpObject(models2[i]).join('\n'));
			animationBlastoise(models2[i]);
	
		}, undefined, function ( error ) {
			console.error( error );
		} );
	}
}

function animationBlastoise(model){
	if(model){

		//LeftCannon
		let leftCannon = model.getObjectByName("LFeelerB_016");
		const tweenLC1 = new TWEEN.Tween(leftCannon.rotation)
			.to({ x: 0, y: '+0', z: '+0' }, 500)


		const tweenLC2 = new TWEEN.Tween(leftCannon.rotation)
			.to({ x: -0.3, y: '+0', z: '+0' }, 500)

		tweenLC1.chain(tweenLC2);
		tweenLC2.chain(tweenLC1);
		tweenLC1.start();
		
		
		//RightCannon
		let rightCannon = model.getObjectByName("RFeelerB_054");
		const tweenRC1 = new TWEEN.Tween(rightCannon.rotation)
			.to({ x: 0, y: '+0', z: '+0' }, 500)


		const tweenRC2 = new TWEEN.Tween(rightCannon.rotation)
			.to({ x: -0.3, y: '+0', z: '+0' }, 500)

		tweenRC1.chain(tweenRC2);
		tweenRC2.chain(tweenRC1);
		tweenRC1.start();


		//LeftLeg
		let leftLeg = model.getObjectByName("LThigh_021")
		
		
		/*const tweenLL1 = new TWEEN.Tween(leftLeg.rotation)
			.to({ x: '+0', y: '+0', z: 0.1 }, 500)


		const tweenLL2 = new TWEEN.Tween(leftLeg.rotation)
			.to({ x: '+0', y: '+0', z: -0.1 }, 500)

		tweenLL1.chain(tweenLL2);
		tweenLL2.chain(tweenLL1);
		tweenLL1.start();*/

	}
}



//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------


window.onload = main();

function main(){
	
	camera.position.set(0, 0.2, 1.2)
	
	scene.background = new THREE.Color('skyblue');
	scene.fog = new THREE.Fog('skyblue', 1, 2.5);
	
	//For moving the camera. For testing
	const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

	//Point Light
	const color = 0xFFFFFF;
    const intensity = 0.7;
	const light = new THREE.PointLight(color, intensity);
	light.position.set(0, 10, 0);
	scene.add(light);

	//Ambient Light
	const ambientIntensity = 0.9;
	const ambientLight = new THREE.AmbientLight(color,ambientIntensity);
	scene.add(ambientLight);

	//Ground1
	ground1 = new Ground();
	ground1.position.y = 0;
	ground1.position.z = 0;
	ground1.rotation.x = -Math.PI * 0.5;
	scene.add(ground1);


	//Ground2
	ground2 = new Ground();
	ground2.position.y = 0;
	ground2.position.z = -2;
	ground2.rotation.x = -Math.PI * 0.5;
	scene.add(ground2);

	//GroundGrass
	/*groundGrass = new GroundGrass();
	groundGrass.position.y = -0.001;
	groundGrass.position.z = 0;
	groundGrass.rotation.x = -Math.PI * 0.5;
	scene.add(groundGrass);*/

	//Clouds
	cloud1 = new Cloud();
	cloud1.position.x = -1.4
	cloud1.position.y = 0.6;
	cloud1.position.z = -0.6;
	scene.add(cloud1);

	cloud2 = new Cloud();
	cloud2.position.x = -0.9;
	cloud2.position.y = 0.4;
	cloud2.position.z = -0.6;
	scene.add(cloud2);

	cloud3 = new Cloud();
	cloud3.position.x = -0.3;
	cloud3.position.y = 0.5;
	cloud3.position.z = -0.6;
	scene.add(cloud3);

	cloud4 = new Cloud();
	cloud4.position.x = 0.3;
	cloud4.position.y = 0.7;
	cloud4.position.z = -0.6;
	scene.add(cloud4);

	cloud5 = new Cloud();
	cloud5.position.x = 0.7;
	cloud5.position.y = 0.5;
	cloud5.position.z = -0.6;
	scene.add(cloud5);

	cloud6 = new Cloud();
	cloud6.position.x = 1.4;
	cloud6.position.y = 0.7;
	cloud6.position.z = -0.6;
	scene.add(cloud6);

	addTree();


	//Pokeballs
	for(let i=0; i<numPokeball; i++){
		let pokeball = new Pokeball();
		pokeball.position.y = 0.05;
		pokeball.position.x = groundPath[Math.floor(Math.random() * groundPath.length)]
		pokeball.position.z = groundPathZ[Math.floor(Math.random() * groundPathZ.length)];
		/*switch(i){
			case 0:
				pokeball.position.z = -1.3
			break;
			case 1:
				pokeball.position.z = -1.9
			break;
			case 2:
				pokeball.position.z = -2.6
			break;
			case 3:
				pokeball.position.z = -3.2
			break;
		}*/
		pokeballs.push(pokeball);
		scene.add(pokeball);
	}

	
	/*//Articuno
	for(let i=0; i<2; i++){
		modelLoader.load( '/models/articuno/scene.gltf', function ( gltf ) {
			modelsArticuno[i] = gltf.scene
			modelsArticuno[i].scale.set(0.02,0.02,0.02);
			modelsArticuno[i].position.x = groundPathXArticuno[Math.floor(Math.random() * groundPath.length)];
			modelsArticuno[i].position.y = 0.03;
			modelsArticuno[i].position.z = groundPathZArticuno[Math.floor(Math.random() * groundPath.length)];
			modelsArticuno[i].rotation.x = 1.0;
			scene.add(modelsArticuno[i]);
	
		}, undefined, function ( error ) {
			console.error( error );
		} );
	}*/
	
	blastoise();
	//blaziken();
	
	
	//user movement
	document.addEventListener("keydown", onKeyDown, false);

	

	render()
}


function render() {
		
	
	if (resizeRendererToDisplaySize(renderer)) {
	  const canvas = renderer.domElement;
	  camera.aspect = canvas.clientWidth / canvas.clientHeight;
	  camera.updateProjectionMatrix();
	}

	const elapsedTime = clock.getElapsedTime();
	

	animationPokeball(elapsedTime);

	//Ground movement
	ground1.position.z = (elapsedTime * 0.5) % 2;
	ground2.position.z = ((elapsedTime * 0.5) % 2) - 2;

	//Tree movement
	for(let i=0; i<numTree; i++){
		treesL1[i].position.z += 0.01;
		if(treesL1[i].position.z > 1){
			treesL1[i].position.z = -1.3;
		}
		/*treesL2[i].position.z += 0.01;
		if(treesL2[i].position.z > 1){
			treesL2[i].position.z = -1.3;
		}*/
		treesL3[i].position.z += 0.01;
		if(treesL3[i].position.z > 1){
			treesL3[i].position.z = -1.3;
		}
		/*treesL4[i].position.z += 0.01;
		if(treesL4[i].position.z > 1){
			treesL4[i].position.z = -1.3;
		}*/
		treesL5[i].position.z += 0.01;
		if(treesL5[i].position.z > 1){
			treesL5[i].position.z = -1.3;
		}
		treesR1[i].position.z += 0.01;
		if(treesR1[i].position.z > 1){
			treesR1[i].position.z = -1.3;
		}
		/*treesR2[i].position.z += 0.01;
		if(treesR2[i].position.z > 1){
			treesR2[i].position.z = -1.3;
		}*/
		treesR3[i].position.z += 0.01;
		if(treesR3[i].position.z > 1){
			treesR3[i].position.z = -1.3;
		}
		/*treesR4[i].position.z += 0.01;
		if(treesR4[i].position.z > 1){
			treesR4[i].position.z = -1.3;
		}*/
		treesR5[i].position.z += 0.01;
		if(treesR5[i].position.z > 1){
			treesR5[i].position.z = -1.3;
		}
	}
	
	/*//Articuno Movement
	for (let i = 0; i < 2; i++) {
		if (modelsArticuno[i]) {
			modelsArticuno[i].position.z += 0.01;
			if (modelsArticuno[i].position.z > 2) {
				modelsArticuno[i].position.z = -1.3;
				modelsArticuno[i].position.x = groundPathXArticuno[Math.floor(Math.random() * groundPath.length)];
			}
		}
	}

	//Blastoise movement
	for (let i = 0; i < 2; i++) {
		if (modelsBlastoise[i]) {
			modelsBlastoise[i].position.z += 0.01;
			if (modelsBlastoise[i].position.z > 2) {
				modelsBlastoise[i].position.z = -1.3;
				modelsBlastoise[i].position.x = groundPathXArticuno[Math.floor(Math.random() * groundPath.length)];
			}
		}
	}*/
	
	
	collisionSystem();
	
	for(let i=0; i<1; i++){
		if(models2[i]){
			let leftLeg = models2[i].getObjectByName("LThigh_021")
			leftLeg.position.z -= 0.1
		}
	}

	//GAME LOGIC
	//console.log(points);
	//console.log(health);
	
	renderer.render(scene, camera);
	requestAnimationFrame(render);
	TWEEN.update()

}





/**
 * ********************************************************************************************************
 * ********************************************************************************************************
 * ********************************************************************************************************
 */

function animationPokeball(time) {
	for (let i = 0; i < numPokeball; i++) {
		pokeballs[i].rotation.y = (time * 6)
		pokeballs[i].position.z += 0.01;
		
		if (pokeballs[i].position.z > 1.2) {
			//pokeballs[i].position.z = groundPathZ[Math.floor(Math.random() * groundPathZ.length)];
			pokeballs[i].position.z = -1.3;
			pokeballs[i].position.x = groundPath[Math.floor(Math.random() * groundPath.length)];
		}
	}
}

function animationBlaziken(){
	//Basic idle running animation for model1
	
	if(model1){
		

		//LeftUpperLeg
		const tweenLUL1 = new TWEEN.Tween(leftUpperLeg.rotation) 
			.to({ x: '+0', y: 0.5,  z:'+0' }, 500)
			 
			
		const tweenLUL2 = new TWEEN.Tween(leftUpperLeg.rotation) 
			.to({ x: '+0', y: -1.2,  z: '+0' }, 500) 
			
		tweenLUL1.chain(tweenLUL2);
		tweenLUL2.chain(tweenLUL1);
		tweenLUL1.start();	

		//LeftLowerLeg
		const tweenLLL1 = new TWEEN.Tween(leftLowerLeg.rotation) 
			.to({ x: '+0', y: 0.9,  z:'+0' }, 500)
	
	
		const tweenLLL2 = new TWEEN.Tween(leftLowerLeg.rotation) 
			.to({ x: '+0', y: 0.5,  z: '+0' }, 500) 
	
	
		tweenLLL1.chain(tweenLLL2);
		tweenLLL2.chain(tweenLLL1);
		tweenLLL1.start();

		
		//RightUpperLeg
		const tweenRUL1 = new TWEEN.Tween(rightUpperLeg.rotation) 
			.to({ x: '+0', y: -1.2,  z:'+0' }, 500)
		
		
		const tweenRUL2 = new TWEEN.Tween(rightUpperLeg.rotation) 
			.to({ x: '+0', y: 0.5,  z: '+0' }, 500) 
		
		
		tweenRUL1.chain(tweenRUL2);
		tweenRUL2.chain(tweenRUL1);
		tweenRUL1.start();

		//RightLowerLeg
		const tweenRLL1 = new TWEEN.Tween(rightLowerLeg.rotation) 
			.to({ x: '+0', y: 0.4,  z:'+0' }, 500)
	
	
		const tweenRLL2 = new TWEEN.Tween(rightLowerLeg.rotation) 
			.to({ x: '+0', y: 0.9,  z: '+0' }, 500) 
	
	
		tweenRLL1.chain(tweenRLL2);
		tweenRLL2.chain(tweenRLL1);
		tweenRLL1.start();
		
		//RightArm
		const tweenRUA1 = new TWEEN.Tween(rightUpperArm.rotation) 
			.to({ x: '+0', y: 0.2,  z:'+0' }, 500)
			 
		
		const tweenRUA2 = new TWEEN.Tween(rightUpperArm.rotation) 
			.to({ x: '+0', y: -0.8,  z: '+0' }, 500) 
		
		tweenRUA1.chain(tweenRUA2);
		tweenRUA2.chain(tweenRUA1);
		tweenRUA1.start();
		
		//RightLowerArm
		const tweenRLE1 = new TWEEN.Tween(rightLowerArm.rotation) 
			.to({ x: '+0', y: 0,  z:'+0' }, 500)
			 
		
		const tweenRLE2 = new TWEEN.Tween(rightLowerArm.rotation) 
			.to({ x: '+0', y: -1.2,  z: '+0' }, 500) 
		
		tweenRLE1.chain(tweenRLE2);
		tweenRLE2.chain(tweenRLE1);
		tweenRLE1.start();


		//LeftArm
		const tweenLUA1 = new TWEEN.Tween(leftUpperArm.rotation) 
			.to({ x: '+0', y: -0.8,  z:'+0' }, 500)
			 
		
		const tweenLUA2 = new TWEEN.Tween(leftUpperArm.rotation) 
			.to({ x: '+0', y: 0.2,  z: '+0' }, 500) 
		
		tweenLUA1.chain(tweenLUA2);
		tweenLUA2.chain(tweenLUA1);
		tweenLUA1.start();
		
		//LeftLowerArm
		const tweenLLA1 = new TWEEN.Tween(leftLowerArm.rotation) 
		.to({ x: '+0', y: -1.2,  z:'+0' }, 500)
		 
	
		const tweenLLA2 = new TWEEN.Tween(leftLowerArm.rotation) 
		.to({ x: '+0', y: 0,  z: '+0' }, 500) 
	
		tweenLLA1.chain(tweenLLA2);
		tweenLLA2.chain(tweenLLA1);
		tweenLLA1.start();

		//Spine
		const tweenSP1 = new TWEEN.Tween(spine.rotation) 
			.to({ x: -0.2, y: '+0',  z:'+0' }, 500)
			
		
		const tweenSP2 = new TWEEN.Tween(spine.rotation) 
			.to({ x: 0.2, y: '+0',  z: '+0' }, 500) 
		
		tweenSP1.chain(tweenSP2);
		tweenSP2.chain(tweenSP1);
		tweenSP1.start();

		//Hip
		const tweenHIP1 = new TWEEN.Tween(hip.rotation) 
			.to({ x: -0.05, y: '+0',  z:'+0' }, 500)
			
		
		const tweenHIP2 = new TWEEN.Tween(hip.rotation) 
			.to({ x: 0.05, y: '+0',  z: '+0' }, 500) 
		
		tweenHIP1.chain(tweenHIP2);
		tweenHIP2.chain(tweenHIP1);
		tweenHIP1.start();

		//Tail
		const tweenTL1 = new TWEEN.Tween(tail.rotation) 
			.to({ x: 0.4, y: '+0',  z:'+0' }, 500)
			
		
		const tweenTL2 = new TWEEN.Tween(tail.rotation) 
			.to({ x: -0.4, y: '+0',  z: '+0' }, 500) 
		
		tweenTL1.chain(tweenTL2);
		tweenTL2.chain(tweenTL1);
		tweenTL1.start();
		
		
	}
}

function addTree(){
	//Trees on the left
	let treeL1PositionZ = 0.9;
	for (let i = 0; i < numTree; i++) {
		let tree = new Tree();
		tree.position.x = -0.5;
		tree.position.y = 0.05;
		tree.position.z = treeL1PositionZ;
		scene.add(tree);
		treesL1.push(tree);
		treeL1PositionZ -= 0.3;
	}

	/*let treeL2PositionZ = 0.7;
	for (let i = 0; i < numTree; i++) {
		let tree = new Tree();
		tree.position.x = -0.7;
		tree.position.y = 0.05;
		tree.position.z = treeL2PositionZ;
		scene.add(tree);
		treesL2.push(tree);
		treeL2PositionZ -= 0.3;
	}*/

	let treeL3PositionZ = 0.9;
	for (let i = 0; i < numTree; i++) {
		let tree = new Tree();
		tree.position.x = -0.9;
		tree.position.y = 0.05;
		tree.position.z = treeL3PositionZ;
		scene.add(tree);
		treesL3.push(tree);
		treeL3PositionZ -= 0.3;
	}

	/*let treeL4PositionZ = 0.7;
	for (let i = 0; i < numTree; i++) {
		let tree = new Tree();
		tree.position.x = -1.1;
		tree.position.y = 0.05;
		tree.position.z = treeL4PositionZ;
		scene.add(tree);
		treesL4.push(tree);
		treeL4PositionZ -= 0.3;
	}*/

	let treeL5PositionZ = 0.9;
	for (let i = 0; i < numTree; i++) {
		let tree = new Tree();
		tree.position.x = -1.3;
		tree.position.y = 0.05;
		tree.position.z = treeL5PositionZ;
		scene.add(tree);
		treesL5.push(tree);
		treeL5PositionZ -= 0.3;
	}

	let treeR1PositionZ = 0.9;
	for (let i = 0; i < numTree; i++) {
		let tree = new Tree();
		tree.position.x = 0.5;
		tree.position.y = 0.05;
		tree.position.z = treeR1PositionZ;
		scene.add(tree);
		treesR1.push(tree);
		treeR1PositionZ -= 0.3;
	}
	/*let treeR2PositionZ = 0.7;
	for (let i = 0; i < numTree; i++) {
		let tree = new Tree();
		tree.position.x = 0.7;
		tree.position.y = 0.05;
		tree.position.z = treeR2PositionZ;
		scene.add(tree);
		treesR2.push(tree);
		treeR2PositionZ -= 0.3;
	}*/

	let treeR3PositionZ = 0.9;
	for (let i = 0; i < numTree; i++) {
		let tree = new Tree();
		tree.position.x = 0.9;
		tree.position.y = 0.05;
		tree.position.z = treeR3PositionZ;
		scene.add(tree);
		treesR3.push(tree);
		treeR3PositionZ -= 0.3;
	}

	/*let treeR4PositionZ = 0.7;
	for (let i = 0; i < 8; i++) {
		let tree = new Tree();
		tree.position.x = 1.1;
		tree.position.y = 0.05;
		tree.position.z = treeR4PositionZ;
		scene.add(tree);
		treesR4.push(tree);
		treeR4PositionZ -= 0.3;
	}*/

	let treeR5PositionZ = 0.9;
	for (let i = 0; i < numTree; i++) {
		let tree = new Tree();
		tree.position.x = 1.3;
		tree.position.y = 0.05;
		tree.position.z = treeR5PositionZ;
		scene.add(tree);
		treesR5.push(tree);
		treeR5PositionZ -= 0.3;
	}
}

function collisionSystem(){
	
	if(model1){
		
		for (let i = 0; i < pokeballs.length; i++) {
			let pokeball = pokeballs[i];
			
			let pokePos = pokeball.position.clone();
			let modelPos = model1.position.clone();
			let diffPos = modelPos.sub(pokePos);

			if(diffPos.length() < 0.1){
				pokeballs[i].position.z = -1.3;
				points++;
			}	
		}
		/*for(let i=0; i<modelsBlastoise.length; i++){
			let blastoise = modelsBlastoise[i];
			
			let blastoisePos = blastoise.position.clone();
			let modelPos1 = model1.position.clone();
			let diffPos1 = modelPos1.sub(blastoisePos);
			
			if(diffPos1.length() < 0.1){
				health--;
			}

		}*/
	}

	
	
	
}

function onKeyDown(e){
	switch(e.keyCode){
		//Left
		case 37:
			if(model1 && (model1.position.x == 0.2 || model1.position.x == 0)){
				
				const coords = model1.position
				const tween = new TWEEN.Tween(coords) 
					.to({ x: '-0.2', y: 0, z: 0.9 }, 500) 
					.easing(TWEEN.Easing.Quadratic.Out) 
					//.onUpdate(() => {console.log(model1.position)})
					.start()
					
			}
		break;
		//Up
		case 38:
			if(model1 && model1.position.y == 0 && (model1.position.x == -0.2 || model1.position.x == 0.0 || model1.position.x == 0.2)){
				//model1.position.y = 0.1;
				const coords = model1.position
				const tween = new TWEEN.Tween(coords) 
					.to({ x: '+0', y: [0.15, 0], z: '+0' }, 2000) 
					.easing(TWEEN.Easing.Quadratic.Out) 
					.start()

			}
		break;
		//Right
		case 39:
			if(model1 && (model1.position.x==-0.2 || model1.position.x == 0)){
				const coords = model1.position
				const tween = new TWEEN.Tween(coords) 
					.to({ x: '+0.2', y: 0, z: 0.9 }, 500)  
					.easing(TWEEN.Easing.Quadratic.Out) 
					.start()
			}
		break;
		//Down
		/*case 40:
			if(model1){
				model1.position.y = 0;
			}
		break;*/
	}
}

function resizeRendererToDisplaySize(renderer) {
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
	  renderer.setSize(width, height, false);
	}
	return needResize;
}




//- - - - - - - - - - - - - - - - -
// ON ERROR
// - - - - - - - - - - - - - - - - -
window.onerror = (message, source, lineno, colno, error) => {
	console.log(message);
	console.log(source);
	console.log(lineno);
	console.log(colno);
	console.log(error.toString());
};

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
	const localPrefix = isLast ? '└─' : '├─';
	lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
	const newPrefix = prefix + (isLast ? '  ' : '│ ');
	const lastNdx = obj.children.length - 1;
	obj.children.forEach((child, ndx) => {
	  const isLast = ndx === lastNdx;
	  dumpObject(child, lines, isLast, newPrefix);
	});
	return lines;
  }