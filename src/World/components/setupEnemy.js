function setupEnemy(data) {
    const model = data.scene.children[0]
    // const clip = data.animations[0]

    // const mixer = new THREE.AnimationMixer(model)
    // const action = mixer.clipAction(clip)
    // action.play()

    // model.tick = (delta) => mixer.update(delta)

    return model
}

export { setupEnemy }
