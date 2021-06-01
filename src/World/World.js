import { createCamera } from './components/camera.js'
import { createCube } from './components/cube.js'
import { createDirectionalLight, createAmbientLight } from './components/lights.js'
import { createScene } from './components/scene.js'
import { createSkybox } from './components/skybox.js'
import { createEnemy } from './components/enemy.js'

import { Path } from './components/Path.js'
import { PathManager } from './components/PathManager.js'
import { ObstacleManager } from './components/ObstacleManager.js'

import { createControls } from './systems/controls.js'
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
        const controls = createControls(camera, renderer.domElement)

        loop = new Loop(camera, scene, renderer)

        //const cube = createCube()
        const obstacles = []
        const directionalLight = createDirectionalLight()
        const ambientLight = createAmbientLight()
        const skybox = createSkybox()

        const obstacleManager = new ObstacleManager(10, 1, 1, 1, 1, 50, -100, 100)
        this.obstacleManager = obstacleManager

        obstacleManager.obstacles.forEach((obstacle) => {
            scene.add(obstacle.mesh)
        })

        loop.updatables.push(obstacleManager)

        const pathManager = new PathManager(0, 0, -100, 0, 0, 100, 50, 20, 50, 50, 10, 5, -100, -80)
        this.pathManager = pathManager

        pathManager.paths.forEach((path) => {
            scene.add(path.mesh)
        })

        loop.updatables.push(pathManager)
        loop.updatables.push(this)

        scene.add(directionalLight, ambientLight, skybox)

        const resizer = new Resizer(container, camera, renderer)
        console.log('starting')
    }

    async init() {
        const { enemy } = await createEnemy()

        scene.add(enemy)
    }

    tick() {
        this.obstacleManager.setWidth(this.pathManager.obstacleSpawnRegionMinWidth)
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
