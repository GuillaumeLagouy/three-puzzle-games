import * as THREE from 'three';
import { isMobile } from './helpers';
import { createLine } from './threejsHelpers';

export default class {
    constructor(canvas, object, camera, scene) {
        this.canvas = canvas;
        this.object = object;
        this.camera = camera;
        this.scene = scene;

        this.mouseDown = false;
        this.hasClick = false;
        this.mouseX = 0;
        this.mouseY = 0;
    }

    initListener() {
        // TODO Gérer les interactions au touch pour mobile.
        // piste : via un paramètre que l'on passe en fonction du device (mobile/desktop)
        
        if(isMobile()) {
            this.canvas.addEventListener("touchmove", e => {
                this.onTouchMove(e);
            }, false);
            this.canvas.addEventListener('touchstart', e => {
                this.onTouchStart(e);
            }, false);
            this.canvas.addEventListener('touchend', e => {
                this.onTouchEnd(e);
            }, false);

        } else {
            this.canvas.addEventListener('mousemove', e => {
                this.onMouseMove(e);
            }, false);
            this.canvas.addEventListener('mousedown', e => {
                this.onMouseDown(e);
            }, false);
            this.canvas.addEventListener('mouseup', e => {
                this.onMouseUp(e);
            }, false);
        }
    }

    onTouchMove(evt) {
        if (!this.mouseDown) return;

        evt.preventDefault();

        let clientX = evt.targetTouches[0].clientX;
        let clientY = evt.targetTouches[0].clientY;

        let delta = {
            x: clientX - this.mouseX,
            y: clientY - this.mouseY,
        }

        this.mouseX = clientX;
        this.mouseY = clientY;

        this.rotateObject(delta);
        
        this.hasClick = false;
    }

    onTouchStart(evt) {
        evt.preventDefault();

        let clientX = evt.targetTouches[0].clientX;
        let clientY = evt.targetTouches[0].clientY;

        this.mouseX = clientX;
        this.mouseY = clientY;

        const mouse = new THREE.Vector2();
        mouse.x = (clientX / window.innerWidth) * 2 - 1;
	    mouse.y = - (clientY / window.innerHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);

        for (let i = 0; i < intersects.length; i ++) {
            if(
                intersects[i].object.name &&
                intersects[i].object.parent.parent.name === 'house' || 
                intersects[i].object.parent.name === 'house')
            {
                this.mouseDown = true;
                this.hasClick = true;
            }
        }
    }

    onTouchEnd(evt) {
        evt.preventDefault();

        this.mouseDown = false;
        
        if(this.hasClick) {
            this.checkHouseHit();
            this.hasClick = false;
        }

        this.checkPictureHit();
    }

    onMouseMove(evt) {
        if (!this.mouseDown) return;

        evt.preventDefault();
        
        let delta = {
            x: evt.clientX - this.mouseX,
            y: evt.clientY - this.mouseY,
        }
        this.mouseX = evt.clientX;
        this.mouseY = evt.clientY;
        
        this.rotateObject(delta);

        this.hasClick = false;
    }

    onMouseDown(evt) {
        evt.preventDefault();

        this.mouseX = evt.clientX;
        this.mouseY = evt.clientY;

        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.getMouse(), this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);

        for (let i = 0; i < intersects.length; i ++) {
            if(
                intersects[i].object.name &&
                intersects[i].object.parent.parent.name === 'house' || 
                intersects[i].object.parent.name === 'house'||
                intersects[i].object.parent.parent.name === 'locker' || 
                intersects[i].object.parent.name === 'locker')
            {
                this.mouseDown = true;
                this.hasClick = true;
            }
        }
    }

    onMouseUp(evt) {
        evt.preventDefault();

        this.mouseDown = false;
        
        if(this.hasClick) {
            this.checkHouseHit();
            this.hasClick = false;
        }

        this.checkLockerWheelHit();
        this.checkLockerButtonHit();
        this.checkPictureHit();
    }

    checkHouseHit() {
        const raycaster = new THREE.Raycaster();

        const mouse = new THREE.Vector2();
        mouse.x = (this.mouseX / window.innerWidth) * 2 - 1;
        mouse.y = - (this.mouseY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);

        if(intersects.length > 0)
        {
            if(intersects[0].object.name.startsWith('face')) {
                const hitFaceEvent = new CustomEvent('hitFace', {detail: intersects[0].object});
                document.dispatchEvent(hitFaceEvent);
            } else if(intersects[0].object.name === 'roof') {
                const hitRoofEvent = new CustomEvent('hitRoof', {detail: intersects[0].object});
                document.dispatchEvent(hitRoofEvent);
            }
        }
    }

    checkPictureHit() {
        this.hasClick = false;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.getMouse(), this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        if(intersects.length > 0 && intersects[0].object.name.startsWith('picture')) {
            const hitPictureEvent = new CustomEvent('hitPicture', {detail: intersects[0].object});
            document.dispatchEvent(hitPictureEvent);
        }
    }

    checkLockerWheelHit() {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.getMouse(), this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        if(intersects.length > 0 && intersects[0].object.name.startsWith('Cylinder')) {
            const hitWheelEvent = new CustomEvent('hitWheel', {detail: intersects[0].object});
            document.dispatchEvent(hitWheelEvent);
        }
    }

    checkLockerButtonHit() {
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.getMouse(), this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        if(intersects.length > 0 && intersects[0].object.name === 'ResetBtn') {
            const hitBtnEvent = new CustomEvent('hitBtn', {detail: intersects[0].object});
            document.dispatchEvent(hitBtnEvent);
        }
    }

    getMouse() {
        const mouse = new THREE.Vector2();
        mouse.x = (this.mouseX / window.innerWidth) * 2 - 1;
        mouse.y = - (this.mouseY / window.innerHeight) * 2 + 1;

        return mouse;
    }

    rotateObject(delta) {
        this.object.rotation.y += delta.x / 100;
        this.object.rotation.x += delta.y / 100;
    }
}