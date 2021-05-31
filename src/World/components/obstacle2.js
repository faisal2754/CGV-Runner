function createMaterial() {
    const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
    return obstacleMaterial
}

function createObstacle(initialZ) {
    const obstacleGeometry = new THREE.BoxGeometry(2, 2, 2)
    const obstacleMaterial = createMaterial()
    const obstacle = new Physijs.BoxMesh(obstacleGeometry, obstacleMaterial)

    obstacle.initialZ = initialZ
    obstacle.translateZ(initialZ)
    obstacle.translateY(3.5)
    obstacle.onPath = false

    obstacle.tick = (delta) => {
        var randomTime = Math.floor(Math.random() * 5000)
        var randomObs = Math.floor(Math.random() * 6)
        var randomXPos = Math.floor(Math.random() * 3)

        if (obstacle.onPath == false && randomTime < 5) {
            obstacle.position.z = -100
            if (randomXPos == 0) {
                obstacle.position.x = -4
            } else if (randomXPos == 1) {
                obstacle.position.x = 0
            } else {
                obstacle.position.x = 4
            }
            obstacle.onPath = true
        } else if (obstacle.onPath == true && obstacle.position.z < 100) {
            obstacle.position.z += delta * 20
        } else if (obstacle.onPath == true && obstacle.position.z > 100) {
            obstacle.onPath = false
            obstacle.position.z = initialZ
            obstacle.position.x = 0
        }
    }

    return obstacle
}

export { createObstacle }
