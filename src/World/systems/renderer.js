function createRenderer(aa) {
    //setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: aa })
    renderer.physicallyCorrectLights = true
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputEncoding = THREE.sRGBEncoding
    return renderer
}

export { createRenderer }
