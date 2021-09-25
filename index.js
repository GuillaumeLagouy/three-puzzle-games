import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import InteractionController from './InteractionController';
import { gsap } from 'gsap';
import Picture from './Picture';
import { drawPoint } from './threejsHelpers';

import tableImg from './table.png'
import faceBlueImg from './faces/face-blue.png';
import faceGreenImg from './faces/face-green.png';
import faceOrangeImg from './faces/face-orange.png';
import facePurpleImg from './faces/face-purple.png';
import faceRedImg from './faces/face-red.png';
import faceYellowImg from './faces/face-yellow.png';
import faceBottom from './faces/face_bottom.png';

import bigbenPicture from './pictures/bigben.png';
import petraPicture from './pictures/petra.png';
import rialtoPicture from './pictures/rialto.png';
import goldenGatePicture from './pictures/goldenGate.png';

import roofModel from './roof.glb';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight( 0x404040, 1 ); // soft white light
scene.add( light );
const pointLight1 = new THREE.PointLight( 0xffffff, 1., 10 );
pointLight1.position.set(0, 0, 5);
scene.add(drawPoint(0.4, 1.4, 4))
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight( 0xffffff, 1.2, 2, 5 );
pointLight2.position.set(1.3, 1.3, 0);
//scene.add(drawPoint(pointLight2.position.x, pointLight2.position.y, pointLight2.position.z));
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight( 0xffffff, 0.1);
pointLight3.position.set(0, 0.7, 0.1);
//scene.add(drawPoint(pointLight3.position.x, pointLight3.position.y, pointLight3.position.z));
scene.add(pointLight3);

const houseGroup = new THREE.Group();
houseGroup.name = 'house';
const houseSize = 1.2;

const gltfLoader = new GLTFLoader();
gltfLoader.load(roofModel, glb => {
    const model = glb.scene.children[2];
    model.scale.set(0.6, 0.6, 0.6);
    model.position.y = 1.2;
    model.name = 'roof';
    houseGroup.add(model);
})

const wallGeo = new THREE.PlaneGeometry(1.2, 1.2);
const faceTextureFiles = [
    {id: 'blue', filename: faceBlueImg},
    {id: 'green', filename: faceGreenImg},
    {id: 'orange', filename: faceOrangeImg},
    {id: 'purple', filename: facePurpleImg},
    {id: 'red', filename: faceRedImg},
    {id: 'yellow', filename: faceYellowImg}
]
const facesTexture = {};
faceTextureFiles.forEach(file => {
    facesTexture[file.id] = new THREE.TextureLoader().load(file.filename);
})

//===================================================

const wallFrontMat = new THREE.MeshStandardMaterial({map: facesTexture.red, side: THREE.DoubleSide});
const wallFront = new THREE.Mesh(wallGeo, wallFrontMat);
wallFront.position.y = houseSize/2;
wallFront.name = 'face-red';

const wallFrontPivot = new THREE.Group();
wallFrontPivot.position.y = -houseSize/2;
wallFrontPivot.position.z = houseSize/2;
wallFrontPivot.add(wallFront);
houseGroup.add(wallFrontPivot);

//===================================================

const wallBackMat = new THREE.MeshStandardMaterial({map: facesTexture.blue, side: THREE.DoubleSide});
const wallBack = new THREE.Mesh(wallGeo, wallBackMat);
wallBack.position.y = houseSize/2;
wallBack.name = 'face-blue';

const wallBackPivot = new THREE.Group();
wallBackPivot.position.y = -houseSize/2;
wallBackPivot.position.z = -houseSize/2;
wallBackPivot.rotation.y = 180 * Math.PI / 180;
wallBackPivot.add(wallBack);
houseGroup.add(wallBackPivot);

//===================================================

const wallLeftMat = new THREE.MeshStandardMaterial({map: facesTexture.green, side: THREE.DoubleSide});
const wallLeft = new THREE.Mesh(wallGeo, wallLeftMat);
wallLeft.position.y = houseSize/2;
wallLeft.name = 'face-green';
wallLeft.rotation.y = 90 * Math.PI / 180;

const wallLeftPivot = new THREE.Group();
wallLeftPivot.position.x = -houseSize/2;
wallLeftPivot.position.y = -houseSize/2;

wallLeftPivot.add(wallLeft);
houseGroup.add(wallLeftPivot);

//===================================================

const wallRightMat = new THREE.MeshStandardMaterial({map: facesTexture.yellow, side: THREE.DoubleSide});
const wallRight = new THREE.Mesh(wallGeo, wallRightMat);
wallRight.position.y = houseSize/2;
wallRight.name = 'face-yellow';
wallRight.rotation.y = 90 * Math.PI / 180;

const wallRightPivot = new THREE.Group();
wallRightPivot.position.x = houseSize/2;
wallRightPivot.position.y = -houseSize/2;
wallRightPivot.add(wallRight);
houseGroup.add(wallRightPivot);

//===================================================

const wallTopMat = new THREE.MeshStandardMaterial({map: facesTexture.purple, side: THREE.DoubleSide});
const wallTop = new THREE.Mesh(wallGeo, wallTopMat);
wallTop.position.y = houseSize/2;
wallTop.name = 'face-purple';

const wallTopPivot = new THREE.Group();
wallTopPivot.position.y = houseSize/2;
wallTopPivot.position.z = -houseSize/2;
wallTopPivot.rotation.y = 180 * Math.PI / 180;
wallTopPivot.rotation.x = 90 * Math.PI / 180;
wallTopPivot.add(wallTop);
houseGroup.add(wallTopPivot);

//===================================================

const wallBottomMat = new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load(faceBottom), side: THREE.DoubleSide});
const wallBottom = new THREE.Mesh(wallGeo, wallBottomMat);
wallBottom.position.y = -houseSize/2;
wallBottom.rotation.x = 90 * Math.PI / 180;
wallBottom.name = 'face-bottom';
houseGroup.add(wallBottom);

//===================================================

houseGroup.position.z = 1.;
scene.add(houseGroup);

const tableGroup = new THREE.Group();

const tableGeo = new THREE.PlaneGeometry(8, 4);
const tableMat = new THREE.MeshStandardMaterial({map: new THREE.TextureLoader().load(tableImg), side: THREE.DoubleSide});
const table = new THREE.Mesh(tableGeo, tableMat);
table.name = 'table'; 
tableGroup.add(table);

const picture1 = new Picture(1, 1.2, 0.8, {x: -1., y: -0.5, z: 0.01}, 5, goldenGatePicture);
const picture2 = new Picture(2, 1.2, 0.8, {x: -0.5, y: 0.1, z: 0.015}, -3, petraPicture);
const picture3 = new Picture(3, 1.2, 0.8, {x: 0.4, y: 0.3, z: 0.01}, 2, rialtoPicture);
const picture4 = new Picture(4, 1.2, 0.8, {x: 1., y: -0.2, z: 0.015}, 87, bigbenPicture);
tableGroup.add(picture1, picture2, picture3, picture4);


tableGroup.rotation.x = -70 * Math.PI/180;
tableGroup.position.y = -2
scene.add(tableGroup);

//const controls = new OrbitControls(camera, renderer.domElement );

// TODO Pouvoir passer un tableau d'objet avec lesquels on peut intéragir
const interactionController = new InteractionController(renderer.domElement, houseGroup, camera, scene);
interactionController.initListener();

const goodCombination = ['face-red', 'face-green', 'face-purple', 'face-blue']
let currentCombination = [];

let currentHighlight = [];
const highlightGeo = new THREE.PlaneGeometry(1.2, 1.2);
const highlightMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF, opacity: 0.3, transparent: true, side: THREE.DoubleSide});
const highlight = new THREE.Mesh(highlightGeo, highlightMat);
highlight.position.y = 0.6;
highlight.position.z = 0.01;
highlight.name = 'highlight';

const isGoodCombination = () => {
    let currentGuess = true;
    
    if(goodCombination.length !== currentCombination.length) return false;
    goodCombination.forEach((face, index) => {
        if(face !== currentCombination[index]) currentGuess = false;
    })
    return currentGuess;
}

const playOpeningAnimation = () => {
    const faceToRemove = scene.getObjectByName('face-purple');
    faceToRemove.parent.remove(faceToRemove);

    const roof = scene.getObjectByName('roof');

    const tl = gsap.timeline({repeat: 0});
    
    tl.to(roof.position, {
        y: '+=1',
        duration: 0.6,
    },0)
    tl.to(roof.rotation, {
        y: `+=${90 * Math.PI/180}`,
        duration: 0.6 
    },0)

    tl.to(wallLeftPivot.rotation, {
        z: 60 * Math.PI/180,
        duration: 0.6 
    },0);
    tl.to(wallRightPivot.rotation, {
        z: `-=${60 * Math.PI/180}`,
        duration: 0.6 
    },0);
    tl.to(wallFrontPivot.rotation, {
        x: `+=${60 * Math.PI/180}`,
        duration: 0.6 
    },0);
    tl.to(wallBackPivot.rotation, {
        x: `-=${60 * Math.PI/180}`,
        duration: 0.6
    },0);
}

document.addEventListener('hitFace', e => {
    const roof = scene.getObjectByName('roof');
    const tl = gsap.timeline({repeat: 0});
    tl.to(roof.position, {
        y: houseSize, 
        duration: 0.6
    }, 0);

    currentCombination.push(e.detail.name);
    
    const highlightClone = highlight.clone();
    
    if(e.detail.name == 'face-green') {
        highlightClone.rotation.y = 90 * Math.PI/180;
        highlightClone.position.x = -0.01;
    } else if (e.detail.name == 'face-yellow') {
        highlightClone.rotation.y = 90 * Math.PI/180;
        highlightClone.position.x = 0.01;
    }

    if(e.detail.name != 'face-bottom') {
        e.detail.parent.add(highlightClone);
    }
    
    currentHighlight.push(e.detail.parent);

    if(isGoodCombination()){
        playOpeningAnimation();
    }

    if(currentCombination.length === goodCombination.length) {      
        currentHighlight.forEach(group => {
            const highlightToRemove = group.getObjectByName('highlight');
            group.remove(highlightToRemove);
        })
        currentCombination = [];
        currentHighlight = [];
    }
});

let canMoveRoof = true;
document.addEventListener('hitRoof', e => {
    if(!canMoveRoof) return;
    const tl = gsap.timeline({repeat: 0});
    tl.to(e.detail.position, {
        y: houseSize + 0.5, 
        duration: 0.6, 
        onStart: () => {canMoveRoof = false},
        onComplete: () => {canMoveRoof = true}
    }, 0);
    tl.to(e.detail.rotation, {
        y: `+=${90 * Math.PI/180}`, 
        duration: 0.6
    }, 0);
});
document.addEventListener('hitPicture', e => {
    const tl = gsap.timeline({repeat: 0});

    if(!e.detail.hasMove) {
        tl.to(e.detail.position, {
            x: 0,
            y: -2.25,
            z: 3.2,
            onComplete: () => {
                e.detail.hasMove = true;
            }
        }, 0),
        tl.to(e.detail.rotation, {
            x: 70 * Math.PI/180,
        }, 0);
    } else {
        tl.to(e.detail.position, {
            x: e.detail.startPosition.x,
            y: e.detail.startPosition.y,
            z: e.detail.startPosition.z,
            onComplete: () => {
                e.detail.hasMove = false;
            }
        }, 0);
        tl.to(e.detail.rotation, {
            x: 0
        }, 0)
    }
})

const animate = function () {
    requestAnimationFrame(animate);
    
    //controls.update();
    //wallLeftPivot.rotation.x += 0.01
    //wallLeftPivot.rotation.y += 0.01
    //wallLeftPivot.rotation.z += 0.01

    renderer.render(scene, camera);
};

animate();