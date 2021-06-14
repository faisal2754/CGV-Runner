const clock = new THREE.Clock()

class Loop {
    constructor(camera, minimap, scene, renderer) {
        this.camera = camera
        this.minimap = minimap
        this.scene = scene
        this.renderer = renderer
        this.updatables = []
    }

    customRender() {
        var WW = window.innerWidth
        var HH = window.innerHeight
        this.renderer.setScissorTest(true)
        this.renderer.setViewport(0, 0, WW, HH)
        this.camera.aspect = WW / HH
        this.camera.updateProjectionMatrix()
        this.renderer.setScissor(0, 0, WW, HH)
        this.renderer.clear()
        this.renderer.render(this.scene, this.camera)
        this.renderer.setViewport(WW / 2, HH / 2, WW / 3, HH / 3)
        this.renderer.setScissor(WW / 2, HH / 2, WW / 3, HH / 3)
        // no need to set aspect (since it is still ONE)
        this.renderer.clear() // important!
        this.renderer.render(this.scene, this.minimap) // topview
        console.log(this.minimap)
        this.renderer.setScissorTest(false)
    }

    //start updates
    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick()
            this.customRender()
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
