class Obstacle {
    constructor(startX, startY, startZ, sizeX, sizeY, sizeZ) {
        this.startX = startX
        this.startY = startY
        this.startZ = startZ
        this.sizeX = sizeX
        this.sizeY = sizeY
        this.sizeZ = sizeZ

        const obstacleGeometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ)
        const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 'blue' })
        this.pointLight = new THREE.PointLight('blue', 50, 100, 2)
        this.mesh = new Physijs.BoxMesh(obstacleGeometry, obstacleMaterial)

        this.onPath = false
        this.toStart()
    }

    setPosition(x, y, z) {
        this.mesh.position.x = x
        this.mesh.position.y = y
        this.mesh.position.z = z

        this.pointLight.position.x = x
        this.pointLight.position.y = y
        this.pointLight.position.z = z
    }

    toStart() {
        this.mesh.position.x = this.startX
        this.mesh.position.y = this.startY
        this.mesh.position.z = this.startZ

        this.pointLight.position.x = this.startX
        this.pointLight.position.y = this.startY
        this.pointLight.position.z = this.startZ
    }
}

export { Obstacle }
