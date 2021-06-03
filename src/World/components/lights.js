function createAmbientLight() {
    const light = new THREE.AmbientLight(0xffffff)

    return light
}

function createDirectionalLight() {
    const light = new THREE.DirectionalLight('white', 8)
    light.position.set(10, 10, 10)

    return light
}

function createPointLight() {
    const light = new THREE.PointLight('white', 100, 20, 1)

    return light
}

export { createDirectionalLight, createAmbientLight, createPointLight }
