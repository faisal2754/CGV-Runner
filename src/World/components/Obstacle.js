class Obstacle {
    constructor(sizeX, sizeY, sizeZ, mesh) {
        this.sizeX = sizeX
        this.sizeY = sizeY
        this.sizeZ = sizeZ
        this.mesh = mesh

        this.mesh.scale.set(0.012, 0.012, 0.012)

        this.box_container = new Physijs.BoxMesh(
            new THREE.SphereGeometry(1),
            new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.5 })
        )

        this.box_container.material.flatShading = true
        this.box_container.add(this.mesh)
        this.mesh = this.box_container
        this.mesh.name = 'obstacle'

        this.mesh.receiveShadow = true

        this.pointLight = new THREE.PointLight('white', 10, 35, 1)
        this.pointLight.position.y += 100
        this.pointLight.castShadow = document.getElementById('shadowscb').checked
        this.onPath = false
    }

    setPosition(x, y, z) {
        this.mesh.position.x = x
        this.mesh.position.y = y
        this.mesh.position.z = z

        this.pointLight.position.x = x + 1
        this.pointLight.position.y = y + 3
        this.pointLight.position.z = z
    }
}

export { Obstacle }
