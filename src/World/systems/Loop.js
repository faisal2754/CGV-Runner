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

        this.renderer.setViewport(WW - WW / 4 + 51, 0, WW / 4, HH / 4)
        this.renderer.setScissor(WW - WW / 4 + 51, 0, WW / 4 - 50, HH / 4)
        this.minimap.aspect = WW / HH
        this.camera.updateProjectionMatrix()
        this.renderer.clear()
        this.renderer.render(this.scene, this.minimap)
        this.renderer.setScissorTest(false)
    }

    //start updates
    start() {
        this.renderer.setAnimationLoop(() => {
            this.tick()
            // this.renderer.render(this.scene, this.camera)
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
