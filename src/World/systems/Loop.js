const clock = new THREE.Clock()

class Loop {
    constructor(camera, scene, renderer) {
        this.camera = camera
        this.scene = scene
        this.renderer = renderer
        this.updatables = []
    }

    //start updates
    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick()
            this.renderer.render(this.scene, this.camera)
        })
    }

    //stop updates
    stop() {
        this.renderer.setAnimationLoop(null)
    }

    //handle updates
    tick() {
        const delta = clock.getDelta()
        for (const object of this.updatables) {
            object.tick(delta)
        }
    }
}

export { Loop }
