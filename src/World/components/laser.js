function createLaser() {
    const geometry = new THREE.CylinderBufferGeometry(0.075, 0.075, 2.5)
    const material = new THREE.MeshBasicMaterial({ color: 'red' })
    const laser = new THREE.Mesh(geometry, material)

    laser.tick = (delta) => {}

    return laser
}

export { createLaser }
