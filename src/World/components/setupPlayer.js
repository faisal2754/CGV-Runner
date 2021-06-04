function setupPlayer(data) {
    //get model from glb
    const model = data.scene.children[0]
    const clip = data.animations[3]

    //setup animation
    const mixer = new THREE.AnimationMixer(model)
    const action = mixer.clipAction(clip)
    action.timeScale = 8
    action.play()

    model.tick = (delta) => {
        //run animation
        mixer.update(delta)
    }

    return model
}

export { setupPlayer }
