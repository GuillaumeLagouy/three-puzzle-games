import * as THREE from 'three';

export default class {
    constructor(id, width, height, coordinates, rotationAngle, image){
        this.id             = id;
        this.width          = width;
        this.height         = height;
        this.coordinates    = coordinates;
        this.rotationAngle  = rotationAngle;
        this.image          = image;

        return this.createPicture();
    }
    createPicture(){
        const geometry = new THREE.PlaneGeometry(this.width, this.height);
        const material = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load(this.image), 
            side: THREE.DoubleSide,
            transparent: true
        });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.name = `picture-${this.id}`;
        mesh.position.set(this.coordinates.x, this.coordinates.y, this.coordinates.z);
        mesh.rotation.z = this.rotationAngle * Math.PI/180;
        mesh.hasMove = false;
        mesh.startPosition = this.coordinates;

        return mesh;
    }
}