function setupPlayer(data) {
    const model = data.scene.children[0]
    const clip = data.animations[3]

    const mixer = new THREE.AnimationMixer(model)
    const action = mixer.clipAction(clip)
    action.timeScale = 10
    action.play()

    model.tick = (delta) => mixer.update(delta)

    return model
}

export { setupPlayer }
