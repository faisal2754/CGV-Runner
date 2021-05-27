const setSize = (container, camera, renderer) => {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()

    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
}

class Resizer {
    constructor(container, camera, renderer) {
        //initial size
        setSize(container, camera, renderer)

        //after resize. Not used due to frames being regenerated
        window.addEventListener('resize', () => {
            setSize(container, camera, renderer)
            this.onResize()
        })
    }

    onResize() {}
}

export { Resizer }
