

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
        if(onPath == true){
            obstacle.position.z += delta
        }
    }

    return obstacle
}

export { createObstacle }