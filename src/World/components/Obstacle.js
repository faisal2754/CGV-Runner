class Obstacle {
    constructor(sizeX, sizeY, sizeZ, mesh) {
        this.sizeX = sizeX
        this.sizeY = sizeY
        this.sizeZ = sizeZ
        this.mesh = mesh

        this.mesh.scale.set(0.01, 0.01, 0.01)

        this.box_container = new Physijs.BoxMesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 1 })
        )

        this.box_container.add(this.mesh)
        this.mesh = this.box_container
        this.mesh.name = 'obstacle'

        this.pointLight = new THREE.PointLight('white', 50, 100, 2)
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
