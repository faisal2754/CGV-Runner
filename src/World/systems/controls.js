function createControls(camera, canvas) {
    const controls = new THREE.OrbitControls(camera, canvas)

    return controls
}

export { createControls }
