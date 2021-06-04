function setupPlayer(data) {
    const model = data.scene.children[0]
    const clip = data.animations[3]

    const mixer = new THREE.AnimationMixer(model)
    const action = mixer.clipAction(clip)
    action.timeScale = 8
    action.play()

    // const allGeometries = model.children
    // const geometry = model.children[0].children[0].children[1].geometry
    // console.log(allGeometries)
    // model.mesh = new Physijs.ConvexMesh(geometry, new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }), 0)

    model.tick = (delta) => {
        mixer.update(delta)
        //console.log(model.position)
        // model.mesh = mesh
    }

    return model
}

export { setupPlayer }
