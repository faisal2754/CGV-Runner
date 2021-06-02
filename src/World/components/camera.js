function createCamera() {
    const camera = new THREE.PerspectiveCamera(
        75, // fov = Field Of View
        1, // aspect ratio (dummy value)
        0.1, // near clipping plane
        1500 // far clipping plane
    )

    camera.position.set(0, 6, 90)

    return camera
}

export { createCamera }
