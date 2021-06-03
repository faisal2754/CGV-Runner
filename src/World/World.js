import { createCamera } from './components/camera.js'
import { createCube } from './components/cube.js'
import { createDirectionalLight, createAmbientLight } from './components/lights.js'
import { createScene } from './components/scene.js'
import { createSkybox } from './components/skybox.js'
import { loadAssets } from './components/assetLoader.js'
import { createLaser } from './components/bruh.js'

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
var keyboard = {}

class World {
    constructor(container) {
        Physijs.scripts.worker = './modules/physijs_worker.js'
        Physijs.scripts.ammo = './ammo.js'

        camera = createCamera()
        scene = createScene()
        renderer = createRenderer()
        container.append(renderer.domElement)

        loop = new Loop(camera, scene, renderer)

        loop.updatables.push(scene)

        const controls = createControls(camera, renderer.domElement)
        loop.updatables.push(controls)

        const pathManager = new PathManager(0, 0, -100, 0, 0, 100, 50, 20, 50, 50, 10, 5, -100, -80)
        this.pathManager = pathManager

        this.pathManager.paths.forEach((path) => {
            scene.add(path.mesh)
        })

        loop.updatables.push(pathManager)
        loop.updatables.push(this)

        // const laser = createLaser()
        // this.laser = laser
        // laser.position.set(-5, 10, 75)
        // laser.scale.set(2, 2, 2)
        // // laser.rotation.z = Math.PI / 4
        // scene.add(laser)

        // controls.target.copy(laser.position)

        //const cube = createCube()
        const obstacles = []
        const directionalLight = createDirectionalLight()
        const ambientLight = createAmbientLight()
        const skybox = createSkybox()

        scene.add(skybox)
        scene.add(ambientLight)
        scene.add(directionalLight)

        const resizer = new Resizer(container, camera, renderer)
        console.log('starting')
    }

    async init() {
        const { player, enemy, obstacle } = await loadAssets()
        this.player = player
        this.enemy = enemy
        this.obstacle = obstacle

        this.player.rotation.y = Math.PI
        this.player.position.set(0, 2.5, 83)

        this.enemy.scale.set(0.25, 0.25, 0.25)
        this.enemy.rotation.z = -Math.PI / 4
        this.enemy.position.set(0, 10, 75)

        loop.updatables.push(this.player)
        // loop.updatables.push(enemy)

        scene.add(this.player)
        scene.add(this.player.mesh)
    }

    init_managers() {
        const obstacleManager = new ObstacleManager(
            10,
            1,
            1,
            1,
            1,
            50,
            -100,
            100,
            this.obstacle.clone(),
            this.obstacle.clone(),
            this.obstacle.clone(),
            this.obstacle.clone(),
            this.obstacle.clone()
        )
        this.obstacleManager = obstacleManager

        this.obstacleManager.obstacles.forEach((obstacle) => {
            scene.add(obstacle.mesh)
            scene.add(obstacle.pointLight)
        })

        loop.updatables.push(obstacleManager)
    }

    tick(delta) {
        this.playerMovement(delta)
        // this.obstacleManager.setWidth(this.pathManager.obstacleSpawnRegionMinWidth)
        // this.laser.lookAt(this.player.position)
        // this.laser.rotateY(Math.PI / 2)
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

    playerMovement(delta) {
        // Keyboard movement inputs
        if (keyboard[87]) {
            // W key
            this.player.position.y += 10 * delta
        }
        if (keyboard[65]) {
            // A key
            this.player.position.x -= 10 * delta
        }
        if (keyboard[68]) {
            // D key
            this.player.position.x += 10 * delta
        }
        if (keyboard[32]) {
            // Space key
            this.player.position.y += 10 * delta
        }
        if (keyboard[27]) {
            var musicOn = document.getElementById('musiccb').checked
            var audio2 = document.getElementById('fz')
            audio2.pause()
            if (musicOn == true) {
                var audio = document.getElementById('buttonSound')
                audio.play()
            }
            this.stop()
            document.getElementById('pauseMenu').style.display = 'block'
        }
    }
}

function keyDown(event) {
    keyboard[event.keyCode] = true
}

function keyUp(event) {
    keyboard[event.keyCode] = false
}

window.addEventListener('keydown', keyDown)
window.addEventListener('keyup', keyUp)

export { World }
