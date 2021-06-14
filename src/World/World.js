import { createCamera } from './components/camera.js'
import { createDirectionalLight, createAmbientLight, createPointLight } from './components/lights.js'
import { createScene } from './components/scene.js'
import { createSkybox } from './components/skybox.js'
import { loadAssets } from './components/assetLoader.js'

import { PathManager } from './components/PathManager.js'
import { ObstacleManager } from './components/ObstacleManager.js'

import { createControls } from './systems/controls.js'
import { createRenderer } from './systems/renderer.js'
import { Resizer } from './systems/Resizer.js'
import { Loop } from './systems/Loop.js'

import { PLYLoader } from '../../modules/PLYLoader.js'

/**
 *  Module-scoped variables
 *  These should not be accessible to the outside world
 */

let camera, renderer, scene, loop, score, isDead, skyboxSpeed, minimap
var keyboard = {}

class World {
    constructor() {}

    //Takes in canvas container
    async init(container) {
        //Initialise Physijs
        Physijs.scripts.worker = './modules/physijs_worker.js'
        Physijs.scripts.ammo = './ammo.js'

        //Initialise base scene
        minimap = new THREE.OrthographicCamera(-10, 10, 10, 10, 0.1, 100)
        minimap.position.set(0, 10, 90)
        minimap.up.set(0, 0, -1)
        minimap.lookAt(new THREE.Vector3())
        camera = createCamera()
        this.thirdPerson = true

        scene = createScene()
        const isAntialias = document.getElementById('aacb').checked
        renderer = createRenderer(isAntialias)
        container.append(renderer.domElement)

        //Global vars
        score = 0
        isDead = false

        //Game loop
        loop = new Loop(camera, scene, renderer)

        //Add scene to loop to update physics
        loop.updatables.push(scene)

        //Orbit controls (for dev)
        const controls = createControls(camera, renderer.domElement)
        loop.updatables.push(controls)
        controls.enabled = true

        //World lights
        const directionalLight = createDirectionalLight()
        scene.add(directionalLight)
        const ambientLight = createAmbientLight()
        scene.add(ambientLight)

        //Skybox
        const skybox = createSkybox()
        skyboxSpeed = THREE.MathUtils.degToRad(5)
        skybox.tick = (delta) => {
            skybox.rotation.z += skyboxSpeed * delta
            skybox.rotation.x += skyboxSpeed * delta
            skybox.rotation.y += skyboxSpeed * delta
        }
        loop.updatables.push(skybox)
        scene.add(skybox)

        loop.updatables.push(this)

        //Create environment map
        const path = 'assets/skybox/corona_'
        const urls = [
            path + 'lf.png',
            path + 'rt.png',
            path + 'up.png',
            path + 'dn.png',
            path + 'ft.png',
            path + 'bk.png'
        ]

        const textureCube = new THREE.CubeTextureLoader().load(urls)
        textureCube.mapping = THREE.CubeRefractionMapping
        const cubeMaterial1 = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            envMap: textureCube,
            refractionRatio: 1
        })

        //Loading Lucy the Levitating model
        const plyLoader = new PLYLoader()
        plyLoader.load('assets/models/Lucy100k.ply', function (geometry) {
            geometry.computeVertexNormals()
            const s = 0.005
            const modelLucy = new THREE.Mesh(geometry, cubeMaterial1)
            modelLucy.scale.x = modelLucy.scale.y = modelLucy.scale.z = s
            modelLucy.rotation.y = -Math.PI / 2
            modelLucy.position.set(-10, 5, 80)

            const light = createPointLight()
            light.position.copy(modelLucy.position)
            light.position.y += 1

            //light going around Lucy
            var x = 0
            light.tick = (delta) => {
                x += 0.025
                light.position.x += Math.sin(x) * 0.01
                light.position.z += Math.cos(x) * 0.01
            }

            loop.updatables.push(light)

            scene.add(light)

            // Point light helper
            // const sphereSize = 0.1
            // const pointLightHelper = new THREE.PointLightHelper(light, sphereSize)
            // console.log(pointLightHelper)
            // scene.add(pointLightHelper)

            scene.add(modelLucy)
        })

        //Window resizer
        const resizer = new Resizer(container, camera, renderer)

        //Loading game assets
        const { player, obstacle } = await loadAssets()

        this.player = player
        this.obstacle = obstacle
        this.player.hasJumped = false

        loop.updatables.push(this.player)

        //Creating player hitbox
        const physMaterial = new Physijs.createMaterial(new THREE.MeshBasicMaterial({ wireframe: true }))
        const box_container = new Physijs.CapsuleMesh(new THREE.CylinderBufferGeometry(0.3, 0.3, 0.6, 25), physMaterial)
        box_container.castShadow = document.getElementById('shadowscb').checked
        box_container.setCcdMotionThreshold(1)
        box_container.setCcdSweptSphereRadius(0.4)

        this.player.position.set(0, -0.5, 0)
        box_container.add(this.player)
        this.player = box_container
        this.player.rotation.y = Math.PI
        this.player.position.set(0, 3, 83)

        //Hitbox constraints
        this.player.setAngularFactor(new THREE.Vector3(0, 0, 0))
        this.player.setLinearFactor(new THREE.Vector3(1, 1, 1))

        scene.add(this.player)

        // Check player collision
        const xhr = this.xhr
        this.player.addEventListener('collision', function (object) {
            console.log(object)
            if (object.name === 'obstacle' && object.position.z > 81) {
                var audio = document.getElementById('fz')
                audio.pause()
                audio.currentTime = 0
                if (document.getElementById('musiccb').checked) {
                    var gameOverSound = document.getElementById('gameOverSound')
                    gameOverSound.play()
                }
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
        //Path management
        const pathManager = new PathManager(0, 0, -100, 0, 0, 100, 50, 20, 50, 50, 10, 5, -100, -80)

        pathManager.paths.forEach((path) => {
            path.mesh.receiveShadow = true
            scene.add(path.mesh)
        })
        loop.updatables.push(pathManager)

        //Obstacle management
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

        obstacleManager.obstacles.forEach((obstacle) => {
            scene.add(obstacle.mesh)
            scene.add(obstacle.pointLight)
        })

        loop.updatables.push(obstacleManager)
    }

    tick(delta) {
        camera.rotation.y = 0
        camera.rotation.x = 0
        camera.rotation.z = 0

        this.playerMovement(delta)
        this.player.rotation.y = Math.PI
        this.player.rotation.x = 0
        this.player.rotation.z = 0
        this.player.position.z = 83

        //Check player fall death
        if (this.player.position.y < -1) {
            this.stop()

            var audio = document.getElementById('fz')
            audio.pause()

            if (document.getElementById('musiccb').checked) {
                var gameOverSound = document.getElementById('gameOverSound')
                gameOverSound.play()
            }
            audio.currentTime = 0
            document.getElementById('gameOverMenu').style.display = 'block'
            document.getElementById('finalScore').innerText = ' Final Score: ' + score
            isDead = true
            document.getElementById('overlays').style.display = 'none'
        }

        if (isDead == false) {
            score += 1
        }

        if (score == 500) {
            skyboxSpeed *= -1.25
        }

        if (score == 750) {
            skyboxSpeed *= -2
        }

        document.getElementById('scoreDisplay').innerText = 'Score: ' + score
    }

    render() {
        var WW = window.innerWidth
        var HH = window.innerHeight

        renderer.setScissorTest(true)

        renderer.setViewport(0, 0, WW, HH)
        camera.aspect = WW / HH
        camera.updateProjectionMatrix()

        renderer.setScissor(0, 0, WW, HH)
        renderer.clear()
        renderer.render(scene, camera)

        renderer.setViewport(WW / 2, HH / 2, WW / 3, HH / 3)
        renderer.setScissor(WW / 2, HH / 2, WW / 3, HH / 3)
        // no need to set aspect (since it is still ONE)
        renderer.clear() // important!
        renderer.render(scene, minimap) // topview

        renderer.setScissorTest(false)
    }

    start() {
        loop.start()
    }

    stop() {
        loop.stop()
    }

    playerMovement() {
        // Keyboard movement inputs
        if (keyboard[86]) {
            // V key
            if (this.thirdPerson) {
                const pos = new THREE.Vector3(0, 8, 100)
                camera.position.lerp(pos, 1)
                // this.player.add(camera)
                console.log(camera)
                // const lookVector = new THREE.Vector3(0, 0, -1)
                // camera.lookAt(lookVector)
                this.thirdPerson = false
            }
        }
        if (keyboard[66]) {
            // B key
            if (!this.thirdPerson) {
                const pos = new THREE.Vector3(0, 6, 90)
                camera.position.lerp(pos, 1)
                this.thirdPerson = true
            }
        }
        if (keyboard[87]) {
            // W key
            if (this.player.hasJumped == false) {
                this.player.setLinearVelocity(new THREE.Vector3(0, 15, 0))

                const player = this.player
                setTimeout(function () {
                    player.setLinearVelocity(new THREE.Vector3(0, 0, 0))
                }, 200)

                this.player.hasJumped = true
            }
        }
        if (keyboard[65]) {
            // A key
            this.player.applyCentralForce(new THREE.Vector3(-10, 0, 0))
        }
        if (keyboard[68]) {
            // D key
            this.player.applyCentralForce(new THREE.Vector3(10, 0, 0))
        }
        if (keyboard[32]) {
            // Space key
            if (this.player.hasJumped == false) {
                this.player.setLinearVelocity(new THREE.Vector3(0, 15, 0))

                const player = this.player
                setTimeout(function () {
                    player.setLinearVelocity(new THREE.Vector3(0, 0, 0))
                }, 250)

                this.player.hasJumped = true
            }
        }
        if (keyboard[27]) {
            // Esc key
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
