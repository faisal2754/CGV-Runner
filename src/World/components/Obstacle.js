class Obstacle {
    constructor(sizeX, sizeY, sizeZ, mesh) {
        this.sizeX = sizeX
        this.sizeY = sizeY
        this.sizeZ = sizeZ
        this.mesh = mesh

        this.mesh.scale.set(0.012, 0.012, 0.012)

        const meshMaterial = Physijs.createMaterial(
            new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.5 }),
            0.5,
            0.1
        )
        //create mesh
        this.box_container = new Physijs.SphereMesh(new THREE.SphereGeometry(1), meshMaterial, 0)

        this.box_container.setCcdMotionThreshold(1.9)
        this.box_container.setCcdSweptSphereRadius(0.01)

        //use flat shading
        this.box_container.material.flatShading = true
        this.box_container.add(this.mesh)
        this.mesh = this.box_container
        this.mesh.name = 'obstacle'

        //add shadows
        this.mesh.receiveShadow = true

        this.pointLight = new THREE.PointLight('white', 10, 35, 1)
        this.pointLight.position.y += 100
        this.pointLight.castShadow = document.getElementById('shadowscb').checked
        this.onPath = false
    }

    //set obstacle position
    setPosition(x, y, z) {
        this.mesh.position.x = x
        this.mesh.position.y = y
        this.mesh.position.z = z

        this.pointLight.position.x = x
        this.pointLight.position.y = y + 5
        this.pointLight.position.z = z
    }
}

export { Obstacle }
