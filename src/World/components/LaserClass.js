class Laser {
    constructor(startX, startY, startZ) {
        this.startX = startX
        this.startY = startY
        this.startZ = startZ

        const geometry = new THREE.CylinderBufferGeometry(0.075, 0.075, 2.5)
        const material = new THREE.MeshBasicMaterial({ color: 'red' })
        const laser = new THREE.Mesh(geometry, material)

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

export { Laser }
