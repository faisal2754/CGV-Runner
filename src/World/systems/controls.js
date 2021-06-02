function createControls(camera, canvas) {
    const controls = new THREE.OrbitControls(camera, canvas)
    controls.tick = () => controls.update()

    return controls
}

export { createControls }
