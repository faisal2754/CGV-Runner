class Obstacle {
    constructor(startX, startY, startZ, sizeX, sizeY, sizeZ) {
        this.startX = startX
        this.startY = startY
        this.startZ = startZ
        this.sizeX = sizeX
        this.sizeY = sizeY
        this.sizeZ = sizeZ

        const obstacleGeometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ)
        const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 })
        this.mesh = new Physijs.BoxMesh(obstacleGeometry, obstacleMaterial)

        this.onPath = false
        this.toStart()
    }

    setPosition(x, y, z) {
        this.mesh.position.x = x
        this.mesh.position.y = y
        this.mesh.position.z = z
    }

    toStart() {
        this.mesh.position.x = this.startX
        this.mesh.position.y = this.startY
        this.mesh.position.z = this.startZ
    }
}

export { Obstacle }
