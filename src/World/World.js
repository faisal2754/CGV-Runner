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

let camera, renderer, scene, loop, score, isDead
var keyboard = {}

class World {
    constructor(container) {
        Physijs.scripts.worker = './modules/physijs_worker.js'
        Physijs.scripts.ammo = './ammo.js'

        camera = createCamera()
        scene = createScene()
        renderer = createRenderer()
        container.append(renderer.domElement)

        score = 0
        isDead = false

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

        const obstacles = []
        const directionalLight = createDirectionalLight()
        const ambientLight = createAmbientLight()
        const skybox = createSkybox()

        loop.updatables.push(skybox)

        scene.add(skybox)
        scene.add(ambientLight)
        scene.add(directionalLight)

        // //under construction
        // const r = 'assets/skybox/corona_'
        // const urls = [r + 'lf.png', r + 'rt.png', r + 'up.png', r + 'dn.png', r + 'ft.png', r + 'bk.png']

        // const textureCube = new THREE.CubeTextureLoader().load(urls)
        // scene.background = textureCube
        // textureCube.mapping = THREE.CubeRefractionMapping
        // //////////////////////////////////////////////

        const resizer = new Resizer(container, camera, renderer)
        console.log('starting')
    }

    async init() {
        const { player, enemy, obstacle } = await loadAssets()
        this.player = player
        this.enemy = enemy
        this.obstacle = obstacle
        this.player.hasJumped = false

        this.enemy.scale.set(0.25, 0.25, 0.25)
        this.enemy.rotation.z = -Math.PI / 4
        this.enemy.position.set(0, 10, 75)

        loop.updatables.push(this.player)
        // loop.updatables.push(enemy)

        //scene.add(this.player.mesh)

        //let hitBox

        // const playerGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75)
        // const playerMaterial = new THREE.MeshStandardMaterial({
        //     color: 0xff0000
        // })
        // this.player = new Physijs.BoxMesh(playerGeometry, playerMaterial)
        // this.player.name = 'Player'
        // this.player.translateY(5)
        // this.player.translateZ(83)
        // this.player.addEventListener('collision', function (object) {
        //     console.log('Game Over bruh.')
        // })

        var physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({}))
        physMaterial.visible = false
        let box_container = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 1, 1), physMaterial)
        box_container.setCcdMotionThreshold(1)

        // Set the radius of the embedded sphere such that it is smaller than the object
        box_container.setCcdSweptSphereRadius(0.5)

        this.player.position.set(0, -0.5, 0)
        box_container.add(this.player)
        this.player = box_container
        this.player.rotation.y = Math.PI
        this.player.position.set(0, 5, 83)

        scene.add(this.player)

        this.player.addEventListener('collision', function (object) {
            if (object.name === 'obstacle') {
                console.log('Game Over bruh.')
                var audio = document.getElementById('fz')
                audio.pause()
                audio.currentTime = 0
                loop.stop()
                document.getElementById('gameOverMenu').style.display = 'block'
                document.getElementById('finalScore').innerText = 'Final Score: ' + score
                isDead = true
                document.getElementById('overlays').style.display = 'none'
            }
            if (object.name === 'floor') {
                this.hasJumped = false
            }
        })
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
        this.player.rotation.y = Math.PI
        this.player.rotation.x = 0
        this.player.rotation.z = 0
        this.player.position.z = 83

        if (this.player.position.y < -1) {
            this.stop()
            var audio = document.getElementById('fz')
            audio.pause()
            audio.currentTime = 0
            document.getElementById('gameOverMenu').style.display = 'block'
            document.getElementById('finalScore').innerText = ' Final Score: ' + score
            isDead = true
            document.getElementById('overlays').style.display = 'none'
        }
        //this.obstacleManager.setWidth(this.pathManager.obstacleSpawnRegionMinWidth)
        // this.laser.lookAt(this.player.position)
        // this.laser.rotateY(Math.PI / 2)
        // const playerPos = new THREE.Vector3(Math.sin(this.player.position.x), 0, Math.cos(this.player.position.z))
        // console.log(playerPos)
        // this.laser.position.add(playerPos * delta)

        if (isDead == false) {
            score += 1
        }

        document.getElementById('scoreDisplay').innerText = 'Score: ' + score
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
            //this.player.position.y += 10 * 0.1

            if (this.player.hasJumped == false) {
                this.player.setLinearVelocity(new THREE.Vector3(0, 40, 0))
                let player = this.player

                setTimeout(function () {
                    player.setLinearVelocity(new THREE.Vector3(0, 0, 0))
                }, 100)

                this.player.hasJumped = true
            }
        }
        if (keyboard[65]) {
            // A key
            this.player.setLinearVelocity(new THREE.Vector3(-20, 0, 0))
            let player = this.player

            setTimeout(function () {
                player.setLinearVelocity(new THREE.Vector3(0, 0, 0))
            }, 100)
        }
        if (keyboard[68]) {
            // D key
            this.player.setLinearVelocity(new THREE.Vector3(20, 0, 0))
            let player = this.player

            setTimeout(function () {
                player.setLinearVelocity(new THREE.Vector3(0, 0, 0))
            }, 100)
        }
        if (keyboard[32]) {
            // Space key
            if (this.player.hasJumped == false) {
                this.player.setLinearVelocity(new THREE.Vector3(0, 40, 0))
                let player = this.player

                setTimeout(function () {
                    player.setLinearVelocity(new THREE.Vector3(0, 0, 0))
                }, 100)

                this.player.hasJumped = true
            }
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
        //this.player.__dirtyPosition = true
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
