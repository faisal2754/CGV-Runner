function createMaterial() {
    const obstacleMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00})
    return obstacleMaterial
}

function createObstacle(initialZ) {
    const obstacleGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75)
    const obstacleMaterial = createMaterial()
    const obstacle = new Physijs.BoxMesh(obstacleGeometry, obstacleMaterial)
    
    obstacle.initialZ = initialZ
    obstacle.translateZ(initialZ)
    obstacle.onPath = false

    obstacle.tick = (delta) => {
        var randomTime = Math.floor(Math.random() * 5000);
        var randomObs = Math.floor(Math.random() * 6);

        if(obstacle.onPath == false && randomTime < 10){
            obstacle.position.z = -20;
            obstacle.onPath = true;
        }

        else if(obstacle.onPath == true && obstacle.position.z < 0){
            obstacle.position.z += delta
        }
        else if(obstacle.onPath == true && obstacle.position.z > 0){
            obstacle.onPath = false;
            obstacle.position.z = initialZ;
        }
        
    }

    return obstacle
}

export { createObstacle }