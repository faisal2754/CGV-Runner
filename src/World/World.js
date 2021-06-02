import { createCamera } from './components/camera.js'
import { createCube } from './components/cube.js'
import { createDirectionalLight, createAmbientLight } from './components/lights.js'
import { createScene } from './components/scene.js'
import { createSkybox } from './components/skybox.js'
import { loadAssets } from './components/assetLoader.js'
import { createLaser } from './components/laser.js'

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

        loop = new Loop(camera, scene, renderer)

        const controls = createControls(camera, renderer.domElement)
        loop.updatables.push(controls)

        const laser = createLaser()
        this.laser = laser
        laser.position.set(-5, 10, 75)
        laser.scale.set(2, 2, 2)
        // laser.rotation.z = Math.PI / 4
        scene.add(laser)

        // controls.target.copy(laser.position)

        //const cube = createCube()
        const obstacles = []
        const directionalLight = createDirectionalLight()
        const ambientLight = createAmbientLight()
        const skybox = createSkybox()

        const obstacleManager = new ObstacleManager(10, 1, 1, 1, 1, 50, -100, 100)
        this.obstacleManager = obstacleManager

        obstacleManager.obstacles.forEach((obstacle) => {
            scene.add(obstacle.mesh)
            scene.add(obstacle.pointLight)
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
        const { player, enemy } = await loadAssets()
        this.player = player

        player.rotation.y = Math.PI
        player.position.set(0, 2.5, 83)

        enemy.scale.set(0.25, 0.25, 0.25)
        enemy.rotation.z = -Math.PI / 4
        enemy.position.set(0, 10, 75)

        loop.updatables.push(player)
        // loop.updatables.push(enemy)

        scene.add(player)
    }

    tick(delta) {
        this.obstacleManager.setWidth(this.pathManager.obstacleSpawnRegionMinWidth)

        this.laser.lookAt(this.player.position)
        this.laser.rotateY(Math.PI / 2)
        // const playerPos = new THREE.Vector3(Math.sin(this.player.position.x), 0, Math.cos(this.player.position.z))
        // console.log(playerPos)
        // this.laser.position.add(playerPos * delta)
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
