import * as THREE from 'https://cdn.skypack.dev/three@0.134.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/controls/OrbitControls.js';
import { TWEEN } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/libs/tween.module.min';


const modelLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});
const camera = new THREE.PerspectiveCamera( 60, 2, 0.1, 1000 );
const scene = new THREE.Scene();
const clock = new THREE.Clock();

//Sounds
let audio = document.getElementById("sounds").checked;
const audioLoader = new THREE.AudioLoader();
const listener = new THREE.AudioListener();
const soundMainTheme = new THREE.Audio( listener );
const soundPokeball = new THREE.Audio( listener ); 

const mainMenu = document.getElementById("main-menu");
const gameOverMenu = document.getElementById("game-over-menu");
const gameOverScore = document.getElementById("game-over-score");


setTimeout(() => {
	document.getElementById("start-button").style.display = 'block';
}, 1600)

const NUM_POKEBALL = 6;
const NUM_TREE = 4;
const NUM_ARTICUNO = 2;
const NUM_BLASTOISE = 2;
const RANDOMNESS_ARTICUINO = 4;
const RANDOMNESS_BLASTOISE = 4;
const RANDOMNDESS_POKEBALL = 9;

let SPEED_DIFFICULTY;
let GAME_FLAG = false;
let score = 0;

let ground1;
let ground2;
let cloud1;
let cloud2;
let cloud3;
let cloud4;

let groundPath = [-0.2, 0, 0.2];
let groundPathZ = [-1.3, -1.9, -2.6]
let groundPathZArticuno = [-1.7, -2.2];
let groundPathZBlastoise = [-1.5, -2.4];

let pokeballs = [];
let treesL1 = [];
let treesL3 = [];
let treesR1 = [];
let treesR3 = [];

let models2 = [] 	//obstacles
let models3 = []	//obstacles

let model1;
let spine;
let hip;
let tail;
let leftHair;
let rightHair;
let leftUpperArm;
let rightUpperArm;
let leftLowerArm;
let rightLowerArm;
let leftUpperLeg;
let leftLowerLeg;
let rightUpperLeg;
let rightLowerLeg;


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
				flatShading: true,
				map: textureLoader.load('textures/trunk1.jpg')
		});
		const trunkMesh = new THREE.Mesh(geometry, material);
		trunkMesh.scale.set(0.1,0.1,0.1)
		group.add(trunkMesh);

		//Bottom cone
		const radius1 = 0.6;  
		const height1 = 0.3;  
		const radialSegments1 = 8;  
		const geometryCone = new THREE.ConeGeometry(radius1, height1, radialSegments1);
		const materialCone = new THREE.MeshPhongMaterial({
			flatShading: true,
			map: textureLoader.load('textures/green1.jpg'),
			normalMap: textureLoader.load('textures/NormalMap_green.png')
		});
		material.normalScale.set(1, 1)
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

		//group.scale.set(1.2,3,1.2)
		group.scale.set(5,8,5)

		return group;

	}
}

function blaziken(){
	modelLoader.load( 'models/blaziken/scene.gltf', function ( gltf ) {
		model1 = gltf.scene
		model1.scale.set(0.03,0.03,0.03);
		model1.position.x = 0;
		model1.position.y = 0;
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
		leftHair = model1.getObjectByName("LHair1_058");
		rightHair = model1.getObjectByName("RHair1_062"); 
		
		animationBlaziken();

	}, undefined, function ( error ) {
		console.error( error );
	} );
}

function blastoise(){
	for(let i=0; i<NUM_BLASTOISE; i++){
		modelLoader.load( 'models/blastoise/scene.gltf', function ( gltf ) {
			models2[i] = gltf.scene
			models2[i].scale.set(0.065,0.065,0.065);
			models2[i].position.x = groundPath[Math.floor(Math.random() * groundPath.length)];
			models2[i].position.y = 0.0;
			models2[i].position.z = -1.3 - (Math.random() * RANDOMNESS_BLASTOISE); 
			scene.add(models2[i]);
			animationBlastoise(models2[i]);
	
		}, undefined, function ( error ) {
			console.error( error );
		} );
	}
}

function articuno(){
	for(let i=0; i<NUM_ARTICUNO; i++){
		modelLoader.load( 'models/articuno/scene.gltf', function ( gltf ) {
			models3[i] = gltf.scene
			models3[i].scale.set(0.02,0.02,0.02);
			models3[i].position.x = groundPath[Math.floor(Math.random() * groundPath.length)];
			models3[i].position.y = 0.03;
			models3[i].position.z = -1.3 - (Math.random() * RANDOMNESS_ARTICUINO); 
			models3[i].rotation.x = 1.0;
			
			let tail1 = models3[i].getObjectByName("Tail1_044");
			tail1.scale.set(0.3,0.5,1)
			let tail4 = models3[i].getObjectByName("Tail4_047")
			tail4.rotation.y = -0.2
			let tail8 = models3[i].getObjectByName("Tail8_051")
			tail8.rotation.y = -0.2
			let tail12 = models3[i].getObjectByName("Tail12_055")
			tail12.rotation.y = -0.2
			tail12.rotation.z = 0.7

			scene.add(models3[i]);
			animationArticuno(models3[i]);
	
		}, undefined, function ( error ) {
			console.error( error );
		} );
	}
}

function tree(){
	
	//Trees on the left
	let treeL1PositionZ = 0.9;
	for (let i = 0; i < NUM_TREE; i++) {
		let tree = new Tree();
		tree.position.x = -0.65;
		tree.position.y = 0.05;
		tree.position.z = treeL1PositionZ;
		scene.add(tree);
		treesL1.push(tree);
		treeL1PositionZ -= 0.6;
	}

	

	let treeL3PositionZ = 0.9;
	for (let i = 0; i < NUM_TREE; i++) {
		let tree = new Tree();
		tree.position.x = -1.4;
		tree.position.y = 0.05;
		tree.position.z = treeL3PositionZ;
		scene.add(tree);
		treesL3.push(tree);
		treeL3PositionZ -= 0.6;
	}

	

	//Trees on the right
	let treeR1PositionZ = 0.9;
	for (let i = 0; i < NUM_TREE; i++) {
		let tree = new Tree();
		tree.position.x = 0.65;
		tree.position.y = 0.05;
		tree.position.z = treeR1PositionZ;
		scene.add(tree);
		treesR1.push(tree);
		treeR1PositionZ -= 0.6;
	}
	

	let treeR3PositionZ = 0.9;
	for (let i = 0; i < NUM_TREE; i++) {
		let tree = new Tree();
		tree.position.x = 1.4;
		tree.position.y = 0.05;
		tree.position.z = treeR3PositionZ;
		scene.add(tree);
		treesR3.push(tree);
		treeR3PositionZ -= 0.6;
	}

	
}

function clouds(){
	cloud1 = new Cloud();
	cloud1.position.x = -0.9;
	cloud1.position.y = 0.7;
	cloud1.position.z = -0.6;
	scene.add(cloud1);

	cloud2 = new Cloud();
	cloud2.position.x = -0.3;
	cloud2.position.y = 0.6;
	cloud2.position.z = -0.8;
	scene.add(cloud2);

	cloud3 = new Cloud();
	cloud3.position.x = 0.3;
	cloud3.position.y = 0.7;
	cloud3.position.z = -0.6;
	scene.add(cloud3);

	cloud4 = new Cloud();
	cloud4.position.x = 1.4;
	cloud4.position.y = 0.7;
	cloud4.position.z = -0.6;
	scene.add(cloud4);
}

function grounds(){
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

}

function createPokeballs(){
	for(let i=0; i<NUM_POKEBALL; i++){
		let pokeball = new Pokeball();
		pokeball.position.y = 0.05;
		pokeball.position.x = groundPath[Math.floor(Math.random() * groundPath.length)]
		pokeball.position.z = -1.3 - (Math.random() * RANDOMNDESS_POKEBALL); 
		pokeballs.push(pokeball);
		scene.add(pokeball);
	}
}

//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------


window.onload = main();


function main(){
	
	camera.position.set(0, 0.3, 1.25)
	camera.lookAt(0,0,0)
	
	scene.background = new THREE.Color('skyblue');
	scene.fog = new THREE.Fog('skyblue', 1, 2.5);
	
	//For moving the camera. For testing
	//const controls = new OrbitControls(camera, canvas);
    //controls.target.set(0, 0, 0);
    //controls.update();

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

	
	//Background music theme 
	camera.add(listener);
	audioLoader.load('sounds/main_theme.mp3', function (buffer) {
		soundMainTheme.setBuffer(buffer);
		soundMainTheme.setLoop(true);
		soundMainTheme.setVolume(0.5);
	});

	//Pickup pokeball sound
	audioLoader.load('sounds/poke.mp3', function (buffer) {
		soundPokeball.setBuffer(buffer);
		soundPokeball.setLoop(false);
		soundPokeball.setVolume(1.5);
	});
	
	
	grounds();
	clouds();
	tree();
	createPokeballs();
	blaziken();
	blastoise();
	articuno();
	
	
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
	
	userInterface();
	collisionSystem();
	
	renderer.render(scene, camera);
	requestAnimationFrame(render);
	
	
	if(GAME_FLAG){
		movementGround(elapsedTime);
		movementPokeball(elapsedTime);
		movementTree()
		movementBlastoise();
		movementArticuno();
		TWEEN.update()
	}
}





/**
 * ********************************************************************************************************
 * ********************************************************************************************************
 * ********************************************************************************************************
 */

function movementPokeball(time) {
	for (let i = 0; i < pokeballs.length; i++) {
		pokeballs[i].rotation.y = (time * 6)
		pokeballs[i].position.z += SPEED_DIFFICULTY;
		
		if (pokeballs[i].position.z > 1.2) {
			pokeballs[i].position.z = -1.3 - (Math.random() * RANDOMNDESS_POKEBALL); 
			pokeballs[i].position.x = groundPath[Math.floor(Math.random() * groundPath.length)];
		}
	}
}

function movementGround(time){
	ground1.position.z = (time * 50 * SPEED_DIFFICULTY) % 2;
	ground2.position.z = ((time * 50 * SPEED_DIFFICULTY ) % 2) - 2;
}

function movementTree(){
	for(let i=0; i<NUM_TREE; i++){
		treesL1[i].position.z += SPEED_DIFFICULTY;
		if(treesL1[i].position.z > 1){
			treesL1[i].position.z = -1.3;
		}
	
		treesL3[i].position.z += SPEED_DIFFICULTY;
		if(treesL3[i].position.z > 1){
			treesL3[i].position.z = -1.3;
		}
		
		treesR1[i].position.z += SPEED_DIFFICULTY;
		if(treesR1[i].position.z > 1){
			treesR1[i].position.z = -1.3;
		}
		
		treesR3[i].position.z += SPEED_DIFFICULTY;
		if(treesR3[i].position.z > 1){
			treesR3[i].position.z = -1.3;
		}
		
	}
}

function movementBlastoise(){
	for (let i = 0; i < models2.length; i++) {
		if (models2[i]) {
			models2[i].position.z += SPEED_DIFFICULTY;
			if (models2[i].position.z > 1.3) {
				models2[i].position.z = -1.3 - (Math.random() * RANDOMNESS_BLASTOISE);   
				models2[i].position.x = groundPath[Math.floor(Math.random() * groundPath.length)];
			}
		}
	}
}

function movementArticuno(){
	for (let i = 0; i < models3.length; i++) {
		if (models3[i]) {
			models3[i].position.z += SPEED_DIFFICULTY;
			if (models3[i].position.z > 1.3) {
				models3[i].position.z = -1.3 - (Math.random() * RANDOMNESS_ARTICUINO);   
				models3[i].position.x = groundPath[Math.floor(Math.random() * groundPath.length)];
			}
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

function animationBlastoise(model){
	if(model){

		//LeftCannon
		let leftCannon = model.getObjectByName("LFeelerB_016");
		const tweenLC1 = new TWEEN.Tween(leftCannon.rotation)
			.to({ x: -0.3, y: '+0', z: '+0' }, 500)


		const tweenLC2 = new TWEEN.Tween(leftCannon.rotation)
			.to({ x: -0, y: '+0', z: '+0' }, 500)

		tweenLC1.chain(tweenLC2);
		tweenLC2.chain(tweenLC1);
		tweenLC1.start();
		
		
		//RightCannon
		let rightCannon = model.getObjectByName("RFeelerB_054");
		const tweenRC1 = new TWEEN.Tween(rightCannon.rotation)
			.to({ x: 0.3, y: '+0', z: '+0' }, 500)


		const tweenRC2 = new TWEEN.Tween(rightCannon.rotation)
			.to({ x: 0, y: '+0', z: '+0' }, 500)

		tweenRC1.chain(tweenRC2);
		tweenRC2.chain(tweenRC1);
		tweenRC1.start();


		//Jaw
		let jaw = model.getObjectByName("Jaw_036")
		const tweenJ1 = new TWEEN.Tween(jaw.rotation)
			.to({ x: '0', y: -2, z: '+0' }, 500)


		const tweenJ2 = new TWEEN.Tween(jaw.rotation)
			.to({ x: '+0', y: -1.1, z: '+0' }, 500)

		tweenJ1.chain(tweenJ2);
		tweenJ2.chain(tweenJ1);
		tweenJ1.start();

		//LeftArm
		let leftArm = model.getObjectByName("LArm_01");
		const tweenLA1 = new TWEEN.Tween(leftArm.rotation)
		.to({ x: 0.3, y: '+0', z: '+0' }, 500)


		const tweenLA2 = new TWEEN.Tween(leftArm.rotation)
		.to({ x: -0.3, y: '+0', z: '+0' }, 500)

		tweenLA1.chain(tweenLA2);
		tweenLA2.chain(tweenLA1);
		tweenLA1.start();

		//RightArm
		let rightArm = model.getObjectByName("RArm_042");
		const tweenRA1 = new TWEEN.Tween(rightArm.rotation)
		.to({ x: -0.3, y: '+0', z: '+0' }, 500)


		const tweenRA2 = new TWEEN.Tween(rightArm.rotation)
		.to({ x: 0.3, y: '+0', z: '+0' }, 500)

		tweenRA1.chain(tweenRA2);
		tweenRA2.chain(tweenRA1);
		tweenRA1.start();
	}
}

function animationArticuno(model){
	if(model){

		//Idle up and down
		let origin = model.getObjectByName("ArticunoFBX")
		const tweenM1 = new TWEEN.Tween(origin.position) 
			.to({ x: '+0', y: 1,  z: '+0' }, 500)
			 
			
		const tweenM2 = new TWEEN.Tween(origin.position) 
			.to({ x: '+0', y: 0.03,  z: '+0' }, 500) 
			
		tweenM1.chain(tweenM2);
		tweenM2.chain(tweenM1);
		tweenM1.start();

		//LeftFoot
		let leftFoot = model.getObjectByName("LFoot_07");
		const tweenLF1 = new TWEEN.Tween(leftFoot.rotation) 
			.to({ x: '+0', y: -0.8,  z: '+0' }, 500)
			 
			
		const tweenLF2 = new TWEEN.Tween(leftFoot.rotation) 
			.to({ x: '+0', y: -1.2,  z: '+0' }, 500) 
			
		tweenLF1.chain(tweenLF2);
		tweenLF2.chain(tweenLF1);
		tweenLF1.start();
		
		
		//RightFoot
		let rightFoot = model.getObjectByName("RFoot_026");
		const tweenRF1 = new TWEEN.Tween(rightFoot.rotation) 
			.to({ x: '+0', y: -0.8,  z: '+0' }, 500)
			 
			
		const tweenRF2 = new TWEEN.Tween(rightFoot.rotation) 
			.to({ x: '+0', y: -1.2,  z: '+0' }, 500) 
			
		tweenRF1.chain(tweenRF2);
		tweenRF2.chain(tweenRF1);
		tweenRF1.start();

		let tail8 = model.getObjectByName("Tail1_044");
		const tweenTL1 = new TWEEN.Tween(tail8.rotation) 
			.to({ x: '+0', y: -0.4,  z: '+0' }, 500)
			 
			
		const tweenTL2 = new TWEEN.Tween(tail8.rotation) 
			.to({ x: '+0', y: 0.4,  z: '+0' }, 500) 
			
		tweenTL1.chain(tweenTL2);
		tweenTL2.chain(tweenTL1);
		tweenTL1.start();
		
		//LeftWing
		let leftUpArm = model.getObjectByName("LArm_066")
		const tweenLUA1 = new TWEEN.Tween(leftUpArm.rotation) 
			.to({ x: '+0', y: '+0',  z: -0.5 }, 500)
			 
			
		const tweenLUA2 = new TWEEN.Tween(leftUpArm.rotation) 
			.to({ x: '+0', y: '+0',  z: 0.5 }, 500) 
			
		tweenLUA1.chain(tweenLUA2);
		tweenLUA2.chain(tweenLUA1);
		tweenLUA1.start();


		let leftLowArm = model.getObjectByName("LForeArm2_068")
		const tweenLLA1 = new TWEEN.Tween(leftLowArm.rotation) 
			.to({ x: '+0', y: '+0',  z: -0.5 }, 500)
			 
			
		const tweenLLA2 = new TWEEN.Tween(leftLowArm.rotation) 
			.to({ x: '+0', y: '+0',  z: 0.5}, 500) 
			
		tweenLLA1.chain(tweenLLA2);
		tweenLLA2.chain(tweenLLA1);
		tweenLLA1.start();

		//RightWing
		let rightUpArm = model.getObjectByName("RArm_082")
		const tweenRUA1 = new TWEEN.Tween(rightUpArm.rotation) 
			.to({ x: '+0', y: '+0',  z: 0.5 }, 500)
			 
			
		const tweenRUA2 = new TWEEN.Tween(rightUpArm.rotation) 
			.to({ x: '+0', y: '+0',  z: -0.5 }, 500) 
			
		tweenRUA1.chain(tweenRUA2);
		tweenRUA2.chain(tweenRUA1);
		tweenRUA1.start();

		let rightLowArm = model.getObjectByName("RForeArm2_084")
		const tweenRLA1 = new TWEEN.Tween(rightLowArm.rotation) 
			.to({ x: '+0', y: '+0',  z: 0.5 }, 500)
			 
			
		const tweenRLA2 = new TWEEN.Tween(rightLowArm.rotation) 
			.to({ x: '+0', y: '+0',  z: -0.5}, 500) 
			
		tweenRLA1.chain(tweenRLA2);
		tweenRLA2.chain(tweenRLA1);
		tweenRLA1.start();
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
				pokeballs[i].position.x = groundPath[Math.floor(Math.random() * groundPath.length)];
				pokeballs[i].position.z = -1.3 - (Math.random() * RANDOMNDESS_POKEBALL);
				if(audio){
					if(soundPokeball.isPlaying == false){
						soundPokeball.play();
					}
					else{
						soundPokeball.stop();
						soundPokeball.play();
					}
				}
				score++;
			}	
		}
		
		for (let i = 0; i < models2.length; i++) {
			if (models2[i]) {

				let blastoise = models2[i];
				let blastoisePos = blastoise.position.clone();
				let model1Pos = model1.position.clone();
				let diffPos1 = model1Pos.sub(blastoisePos);
				if (diffPos1.length() < 0.2) {
					gameOver();
				}
			}
		}

		for (let i = 0; i < models3.length; i++) {
			if (models3[i]) {

				let articuno = models3[i];
				let articunoPos = articuno.position.clone();
				let modelPos_ = model1.position.clone();
				let diffPos_ = modelPos_.sub(articunoPos);

				if (diffPos_.length() < 0.1) {
					gameOver();
				}
			}
		}
	}
}

function gameOver(){
	GAME_FLAG = false;
	
	gameOverScore.innerText = "Score: " + score;
			
	gameOverMenu.style.display = 'grid';
	if(audio){
		soundMainTheme.stop();
	}
}

function restartGame(){
	if(model1){
		model1.position.x = 0
	}
	
	score = 0;

	for(let i=0; i<pokeballs.length; i++){
		pokeballs[i].position.x = groundPath[Math.floor(Math.random() * groundPath.length)]
		pokeballs[i].position.z = groundPathZ[Math.floor(Math.random() * groundPathZ.length)];
	}

	for(let i=0; i<models2.length; i++){
		if(models2[i]){
		models2[i].position.x = groundPath[Math.floor(Math.random() * groundPath.length)];
		models2[i].position.z = groundPathZBlastoise[Math.floor(Math.random() * groundPathZBlastoise.length)];
		}
	}

	for(let i=0; i<models3.length; i++){
		if(models3[i]){
			models3[i].position.x = groundPath[Math.floor(Math.random() * groundPath.length)];
			models3[i].position.z = groundPathZArticuno[Math.floor(Math.random() * groundPathZArticuno.length)];
		}
	}
}



function onKeyDown(e){
	switch(e.keyCode){
		//Left
		case 37:
			if(model1 && model1.position.y == 0 && (model1.position.x == 0.2 || model1.position.x == 0) ){
				
				const coords = model1.position
				const tween = new TWEEN.Tween(coords) 
					.to({ x: '-0.2', y: '+0', z: '+0' }, 300) 
					.easing(TWEEN.Easing.Quadratic.Out) 
					.start()
					
			}
		break;
		//Up
		case 38:
			if(model1 && model1.position.y == 0 && (model1.position.x == -0.2 || model1.position.x == 0.0 || model1.position.x == 0.2)){
				
				const coords = model1.position
				const tweenUP = new TWEEN.Tween(coords)
				.to({ x: '+0', y: 0.17, z: '+0' }, 13334*SPEED_DIFFICULTY) //200
					.easing(TWEEN.Easing.Quadratic.Out) 
					.onComplete(() => {
						const coords1 = model1.position
						const tweenDWN = new TWEEN.Tween(coords1)
							.to({ x: '+0', y: 0, z: '+0' }, 30000*SPEED_DIFFICULTY) //1000
							.easing(TWEEN.Easing.Quadratic.Out)
							.delay(100) 
							.start()
					})
					
				tweenUP.start();

				//Hair up-down
				const tweenLH1 = new TWEEN.Tween(leftHair.rotation) 
					.to({ x: '+0', y: '+0', z: '+0.7' }, 300) 
					.easing(TWEEN.Easing.Quadratic.Out) 
				
				const tweenLH2 = new TWEEN.Tween(leftHair.rotation) 
				.to({ x: '+0', y: '+0', z: '-0.7' }, 300) 
				.easing(TWEEN.Easing.Quadratic.Out)
				
				tweenLH1.chain(tweenLH2);
				tweenLH1.start();

				const tweenRH1 = new TWEEN.Tween(rightHair.rotation) 
					.to({ x: '+0', y: '+0', z: '+0.7' }, 300) 
					.easing(TWEEN.Easing.Quadratic.Out) 
				
				const tweenRH2 = new TWEEN.Tween(rightHair.rotation) 
				.to({ x: '+0', y: '+0', z: '-0.7' }, 300) 
				.easing(TWEEN.Easing.Quadratic.Out)
				
				tweenRH1.chain(tweenRH2);
				tweenRH1.start();


				

			}
		break;
		//Right
		case 39:
			if(model1 && model1.position.y == 0 && (model1.position.x==-0.2 || model1.position.x == 0)){
				
				const coords = model1.position
				const tween = new TWEEN.Tween(coords) 
					.to({ x: '+0.2', y: '+0', z: '+0' }, 300)  
					.easing(TWEEN.Easing.Quadratic.Out) 
					.start()
			}
		break;

	}
}

function userInterface(){
	document.getElementById("score").innerText = 'Score: ' + score;
	
	document.getElementById("start-button").onclick = () =>{
		setTimeout(() => {
		
		//Set audio from options
		audio = document.getElementById("sounds").checked;
		
		//Set difficulty from options
		let difficulties= document.getElementsByName('difficulty');
		for(let i=0; i<difficulties.length; i++){
			if(difficulties[i].checked){
				SPEED_DIFFICULTY = Number(difficulties[i].value);
			}
		}
		

		if(audio){
			soundMainTheme.play();
		}
		GAME_FLAG = true;
		mainMenu.style.display = 'none';
		
		}, 100)
	};
	
	/*document.getElementById("try-again-button").onclick = () =>{
		restartGame();
		GAME_RUNNING = true;
		
		
		if(audio){
			soundMainTheme.play();
		}
		
		gameOverMenu.style.display = 'none';
	};*/
	
	document.getElementById("main-menu-button").onclick = () =>{
		window.location.reload();
	};

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

