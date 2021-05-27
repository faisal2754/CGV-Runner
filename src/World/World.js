import { createCamera } from './components/camera.js'
import { createCube } from './components/cube.js'
import { createDirectionalLight, createAmbientLight } from './components/lights.js'
import { createScene } from './components/scene.js'
import { createSkybox } from './components/skybox.js'

import { createRenderer } from './systems/renderer.js'
import { Resizer } from './systems/Resizer.js'
import { Loop } from './systems/Loop.js'

/**
 *  Module-scoped variables
 *  These should not be accessible to the outside world
 */

let camera, renderer, scene, loop

class World {
    constructor(container) {
        camera = createCamera()
        scene = createScene()
        renderer = createRenderer()

        container.append(renderer.domElement)
        const controls = new THREE.OrbitControls(camera, renderer.domElement)
        controls.enabled = true

        loop = new Loop(camera, scene, renderer)

        const cube = createCube()
        const directionalLight = createDirectionalLight()
        const ambientLight = createAmbientLight()
        const skybox = createSkybox()

        loop.updatables.push(cube)

        scene.add(directionalLight, ambientLight, cube, skybox)

        const resizer = new Resizer(container, camera, renderer)
    }

    render() {
        renderer.render(scene, camera)
    }

    start() {
        loop.start()
    }

    stop() {
        loop.stop()
    }
}

export { World }
