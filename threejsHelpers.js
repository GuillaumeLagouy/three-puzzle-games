import * as THREE from 'three';

const createLine = (pointA, pointB) => {
    const lineGeo = new THREE.BufferGeometry().setFromPoints([pointA, pointB]);
    const lineMat = new THREE.LineBasicMaterial({color: 0xffffff});

    return new THREE.Line(lineGeo, lineMat);
}

function drawPoint(x, y, z, color = 0x0000FF) {
    const vertices = [x, y, z];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices, 3)
    );
    const material = new THREE.PointsMaterial({ size: 0.4, color });

    const point = new THREE.Points(geometry, material);

    return point;
}

export {createLine, drawPoint};