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

let camera,
    renderer,
    scene,
    loop,
    score,
    isDead,
    skyboxSpeed,
    minimap,
    pathManager,
    obstacleManager,
    skybox,
    material2,
    material3,
    superJump = false
var keyboard = {}

class World {
    constructor() {}

    //Takes in canvas container
    async init(container) {
        //Initialise Physijs
        Physijs.scripts.worker = './modules/physijs_worker.js'
        Physijs.scripts.ammo = './ammo.js'

        const width = window.innerWidth
        const height = window.innerHeight

        //Initialise base scene
        minimap = new THREE.OrthographicCamera(-width / 32, width / 32, height / 32, -height / 32, 0.1, 1500)
        minimap.position.set(2.5, 10, 77.5)
        minimap.up.set(0, 0, -1)
        minimap.lookAt(new THREE.Vector3(0, -450, 0))

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
        loop = new Loop(camera, minimap, scene, renderer)

        //Add scene to loop to update physics
        loop.updatables.push(scene)

        // //Orbit controls (for dev)
        // const controls = createControls(camera, renderer.domElement)
        // loop.updatables.push(controls)
        // controls.enabled = false

        //World lights
        const directionalLight = createDirectionalLight()
        scene.add(directionalLight)
        const ambientLight = createAmbientLight()
        scene.add(ambientLight)

        //Skybox
        skybox = createSkybox()
        skyboxSpeed = THREE.MathUtils.degToRad(5)
        skybox.tick = (delta) => {
            skybox.rotation.z += skyboxSpeed * delta
            skybox.rotation.x += skyboxSpeed * delta
            skybox.rotation.y += skyboxSpeed * delta
        }
        loop.updatables.push(skybox)
        scene.add(skybox)

        //push current world to updatables
        loop.updatables.push(this)

        //Create environment map
        const path = 'assets/skybox/level1/corona_'
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

        let light, modelLucy
        //Loading Lucy the Levitating model
        const plyLoader = new PLYLoader()
        plyLoader.load('assets/models/Lucy100k.ply', function (geometry) {
            geometry.computeVertexNormals()
            const s = 0.005
            modelLucy = new THREE.Mesh(geometry, cubeMaterial1)
            modelLucy.scale.x = modelLucy.scale.y = modelLucy.scale.z = s
            modelLucy.rotation.y = -Math.PI / 2
            modelLucy.position.set(-10, 5, 80.5)

            light = createPointLight()
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
            scene.add(modelLucy)
        })
        const lucyHitboxMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
        const lucyHitboxGeo = new THREE.BoxBufferGeometry(5, 10, 5)
        const lucyHitbox = new Physijs.BoxMesh(lucyHitboxGeo, lucyHitboxMat, 0)
        lucyHitbox.position.set(-9, 5, 83)
        scene.add(lucyHitbox)

        lucyHitbox.addEventListener('collision', function (object) {
            console.log(object)
            superJump = true
            light.color.setHex(0xff0000)
            lucyHitbox.removeEventListener()
        })

        const textureLoader = new THREE.TextureLoader()

        material3 = [
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('assets/skybox/level3/bkg1_right.png'),
                side: THREE.DoubleSide
            }), //front side
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('assets/skybox/level3/bkg1_left.png'),
                side: THREE.DoubleSide
            }), //back side
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('assets/skybox/level3/bkg1_top.png'),
                side: THREE.DoubleSide
            }), //up side
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('assets/skybox/level3/bkg1_bot.png'),
                side: THREE.DoubleSide
            }), //down side
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('assets/skybox/level3/bkg1_front.png'),
                side: THREE.DoubleSide
            }), //right side
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('assets/skybox/level3/bkg1_back.png'),
                side: THREE.DoubleSide
            }) //left side
        ]

        material2 = [
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('assets/skybox/level2/bkg2_right1.png'),
                side: THREE.DoubleSide
            }), //front side
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('assets/skybox/level2/bkg2_left2.png'),
                side: THREE.DoubleSide
            }), //back side
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('assets/skybox/level2/bkg2_top3.png'),
                side: THREE.DoubleSide
            }), //up side
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('assets/skybox/level2/bkg2_bottom4.png'),
                side: THREE.DoubleSide
            }), //down side
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('assets/skybox/level2/bkg2_front5.png'),
                side: THREE.DoubleSide
            }), //right side
            new THREE.MeshBasicMaterial({
                map: textureLoader.load('assets/skybox/level2/bkg2_back6.png'),
                side: THREE.DoubleSide
            }) //left side
        ]

        //Window resizer
        const resizer = new Resizer(container, camera, renderer)

        //Loading game assets
        const { player, obstacle } = await loadAssets()

        this.player = player
        this.obstacle = obstacle
        this.player.hasJumped = false

        loop.updatables.push(this.player)

        //Creating player hitbox
        const physMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
        const box_container = new Physijs.BoxMesh(new THREE.BoxBufferGeometry(0.5, 1, 0.5), physMaterial)
        box_container.castShadow = document.getElementById('shadowscb').checked

        box_container.add(this.player)
        this.player = box_container
        this.player.rotation.y = Math.PI
        this.player.position.set(0, 3, 83)

        //Hitbox constraints
        this.player.setAngularFactor(new THREE.Vector3(0, 0, 0))
        this.player.setLinearFactor(new THREE.Vector3(1, 1, 1))

        scene.add(this.player)

        // Check player collision
        this.player.addEventListener('collision', function (object) {
            console.log(object)
            if (object.name === 'obstacle' && object.position.z > 77) {
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
        pathManager = new PathManager(0, 0, -100, 0, 0, 100, 50, 20, 50, 50, 10, 5, -100, -80)

        pathManager.paths.forEach((path) => {
            path.mesh.receiveShadow = true
            scene.add(path.mesh)
        })
        loop.updatables.push(pathManager)

        //Obstacle management
        obstacleManager = new ObstacleManager(
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

        if (score == 1050) {
            document.getElementById('level-menu').style.display = 'block'
            document.getElementById('level-text').innerText = 'Level 2'

            const palette = [0x1b1717, 0x810000, 0xce1212, 0xeeebdd]

            setTimeout(function () {
                skyboxSpeed *= -1.25
                pathManager.paths.forEach((path) => {
                    const color = palette[Math.floor(Math.random() * 4)]
                    path.mesh.material.color.setHex(color)
                })
                obstacleManager.obstacles.forEach((obstacle) => {
                    obstacle.mesh.material.color.setHex(0x0000ff)
                    obstacle.pointLight.color.setHex(0x0000ff)
                    obstacle.pointLight.intensity = 50
                })
                obstacleManager.speed = 0.75
                skybox.material = material2
                document.getElementById('level-menu').style.display = 'none'
            }, 75)
        }

        if (score == 2600) {
            document.getElementById('level-menu').style.display = 'block'
            document.getElementById('level-text').innerText = 'Level 3'

            const palette = [0x04009a, 0x77acf1, 0x3edbf0, 0xf0ebcc]

            setTimeout(function () {
                skyboxSpeed *= -2
                pathManager.paths.forEach((path) => {
                    const color = palette[Math.floor(Math.random() * 4)]
                    path.mesh.material.color.setHex(color)
                    path.mesh.material.wireframe = true
                    path.mesh.material.wireframeLinewidth = 50
                })
                obstacleManager.obstacles.forEach((obstacle) => {
                    obstacle.mesh.material.color.setHex(0xff0000)
                    obstacle.pointLight.color.setHex(0xff0000)
                    obstacle.pointLight.intensity = 75
                })
                obstacleManager.speed = 1
                skybox.material = material3
                document.getElementById('level-menu').style.display = 'none'
            }, 100)
        }

        document.getElementById('scoreDisplay').innerText = 'Score: ' + score
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
                const velocity = superJump == false ? new THREE.Vector3(0, 15, 0) : new THREE.Vector3(0, 20, 0)
                this.player.setLinearVelocity(velocity)

                const player = this.player
                setTimeout(function () {
                    player.setLinearVelocity(new THREE.Vector3(0, 0, 0))
                }, 250)

                this.player.hasJumped = true
            }
        }
        if (keyboard[65]) {
            // A key
            this.player.applyCentralForce(new THREE.Vector3(-6, 0, 0))
        }
        if (keyboard[68]) {
            // D key
            this.player.applyCentralForce(new THREE.Vector3(6, 0, 0))
        }
        if (keyboard[32]) {
            // Space key
            if (this.player.hasJumped == false) {
                const velocity = superJump == false ? new THREE.Vector3(0, 15, 0) : new THREE.Vector3(0, 20, 0)
                this.player.setLinearVelocity(velocity)

                const player = this.player
                setTimeout(function () {
                    player.setLinearVelocity(new THREE.Vector3(0, 0, 0))
                }, 250)

                this.player.hasJumped = true
            }
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
