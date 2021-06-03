class Laser {
    constructor() {
        const geometry = new THREE.CylinderBufferGeometry(0.075, 0.075, 2.5)
        const material = new THREE.MeshBasicMaterial({ color: 'red' })
        const laser = new THREE.Mesh(geometry, material)
    }

    setPosition(x, y, z) {
        this.mesh.position.x = x
        this.mesh.position.y = y
        this.mesh.position.z = z
    }
}

export { Laser }
