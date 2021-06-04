function createControls(camera, canvas) {
    //setup orbit controls (for development)
    const controls = new THREE.OrbitControls(camera, canvas)
    controls.tick = () => controls.update()

    return controls
}

export { createControls }
