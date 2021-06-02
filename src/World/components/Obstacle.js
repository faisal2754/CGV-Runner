class Obstacle {
    constructor(sizeX, sizeY, sizeZ, mesh) {
        this.sizeX = sizeX
        this.sizeY = sizeY
        this.sizeZ = sizeZ
        this.mesh = mesh

        this.mesh.scale.set(0.01, 0.01, 0.01)
        console.log(this.mesh)

        // const obstacleGeometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ)
        // const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 'blue' })
        this.pointLight = new THREE.PointLight('white', 50, 100, 2)
        //this.mesh = new Physijs.BoxMesh(obstacleGeometry, obstacleMaterial)

        this.onPath = false
    }

    setPosition(x, y, z) {
        this.mesh.position.x = x
        this.mesh.position.y = y
        this.mesh.position.z = z

        this.pointLight.position.x = x
        this.pointLight.position.y = y
        this.pointLight.position.z = z
    }

}

export { Obstacle }
