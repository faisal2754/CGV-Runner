//setup ambient light
function createAmbientLight() {
    const light = new THREE.AmbientLight(0xffffff)

    return light
}

//setup directional light
function createDirectionalLight() {
    const light = new THREE.DirectionalLight('white', 1)
    light.position.set(5, 10, 5)

    return light
}

//setup point light
function createPointLight() {
    const light = new THREE.PointLight('white', 50, 10)

    return light
}

export { createDirectionalLight, createAmbientLight, createPointLight }
