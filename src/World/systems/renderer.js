function createRenderer(aa) {
    console.log(aa)
    const renderer = new THREE.WebGLRenderer({ antialias: aa })
    renderer.physicallyCorrectLights = true
    return renderer
}

export { createRenderer }
