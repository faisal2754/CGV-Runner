function createScene() {
    //create scene
    const scene = new Physijs.Scene()
    scene.setGravity(new THREE.Vector3(0, -30, 0))
    scene.background = new THREE.Color('purple')

    scene.tick = () => scene.simulate()

    return scene
}

export { createScene }
