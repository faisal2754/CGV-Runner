import * as um from './test.js'

const keyboard = {}
//essentials
let scene, camera, renderer, loader, mixer
//lights
let ambLight, directionalLight
//world objects
let player, obstacle, floor, floorWireframe, group, newFloor, astronaut
//miscellaneous
let skyboxGeometry, skybox, controls

//floor
let movingFloors = []
let updates = []
let lowerThresholds = []
let upperThresholds = []
let startingPositions = []
let endPositions = []
let floorStatus = []
let speed = 200
let counter = 0

let checkpointOneX = 0
let checkpointOneY = 0
let checkpointOneZ = -75

let checkpointTwoX = 0
let checkpointTwoY = 0
let checkpointTwoZ = 10

//obstacles
let obstacles = []

function init() {
    console.log(um.bruh())
    // const btnStart = document.getElementById('btnStart')
    // btnStart.style.display = 'none'

    //Setup Physijs
    const initPhysijs = (function () {
        Physijs.scripts.worker = './modules/physijs_worker.js'
        Physijs.scripts.ammo = './ammo.js'
    })()

    //Scene: What's there
    const initScene = (function () {
        scene = new Physijs.Scene()
        scene.setGravity(new THREE.Vector3(0, -5, 0))
    })()

    //Camera: Our eyes
    const initCamera = (function () {
        const fov = 75
        const aspectRatio = window.innerWidth / window.innerHeight
        const near = 0.1
        const far = 1000
        camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far)
        camera.position.set(-1, 3, 2.5)
    })()

    //Renderer: Renders scene and objects
    const initRenderer = (function () {
        renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(renderer.domElement)
    })()

    //controls
    const initOrbit = (function () {
        controls = new THREE.OrbitControls(camera, renderer.domElement)
        controls.enabled = true
    })()

    //skybox
    const initSkybox = (function () {
        skyboxGeometry = new THREE.BoxGeometry(500, 500, 500)
        const skyboxMaterials = [
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('skybox/corona_ft.png'),
                side: THREE.DoubleSide
            }), //front side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('skybox/corona_bk.png'),
                side: THREE.DoubleSide
            }), //back side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('skybox/corona_up.png'),
                side: THREE.DoubleSide
            }), //up side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('skybox/corona_dn.png'),
                side: THREE.DoubleSide
            }), //down side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('skybox/corona_rt.png'),
                side: THREE.DoubleSide
            }), //right side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('skybox/corona_lf.png'),
                side: THREE.DoubleSide
            }) //left side
        ]
        skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials)
    })()

    //obstacle
    const initObstacle = (function () {
        const obstacleGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75)
        const obstacleMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00
        })
        obstacle = new Physijs.BoxMesh(obstacleGeometry, obstacleMaterial)
        obstacle.name = 'Obstacle'
        obstacle.translateZ(-90)
        obstacle.translateX(0)
        obstacle.translateY(10)

        setTimeout(function () {
            scene.add(obstacle)
        }, 6000)
    })()

    //creating floor
    const initFloor = (function () {
        const floorGeometry = new THREE.BoxGeometry(3, 0.25, 7)
        const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xffdd00 })
        floor = new Physijs.BoxMesh(floorGeometry, floorMaterial, 0)
        floor.name = 'MainFloor'
        floor.translateZ(-2)
        floor.translateX(-3)

        // floorWireframe = new THREE.BoxHelper(floor, 0xff0000)
        //const wire = new THREE.WireframeHelper(floor, 0x000000)
    })()

    //create player
    const initPlayer = (function () {
        const playerGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75)
        const playerMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000
        })
        player = new Physijs.BoxMesh(playerGeometry, playerMaterial)
        player.name = 'Player'
        player.translateY(1)
        player.translateX(-3)
        player.addEventListener('collision', function (object) {
            if (object.name === 'Obstacle') {
                console.log('Game Over bruh.')
            }
        })
    })()

    //astronaut
    loader = new THREE.GLTFLoader()
    loader.load('/models/astronaut/scene.gltf', function (gltf) {
        scene.add(gltf.scene)
        astronaut = gltf.scene.children[0]
        mixer = new THREE.AnimationMixer(gltf.scene)
        mixer.clipAction(gltf.animations[0]).play()
        astronaut.name = 'Astronaut'
        astronaut.addEventListener('collision', function (object) {
            if (object.name === 'Obstacle') {
                console.log('Game Over bruh.')
            }
        })
    })

    //ambient light
    const initAmbientLight = (function () {
        ambLight = new THREE.AmbientLight(0x404040) // soft white light
    })()

    //create directional light
    const initDirectionalLight = (function () {
        directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(-1, 2, 0)
    })()

    /**  light helper
    const spheresize = 0.2
    const pointLightHelper = new THREE.PointLightHelper(light, spheresize)
    scene.add(pointLightHelper) */

    const initSceneChildren = (function () {
        scene.add(player)
        // scene.add(obstacle)
        scene.add(skybox)
        scene.add(ambLight)
        scene.add(directionalLight)
        scene.add(floor)
        //scene.add(newFloors)
        //scene.add(newFloor)
        // scene.add(floorWireframe)
    })()

    camera.lookAt(player.position)
    animate()
}

function absoluteDistance(x1, x2) {
    return Math.abs(x1 - x2)
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}

function createMovingFloor(startX, startY, startZ, endX, endY, endZ, sizeX, sizeY, sizeZ, delay) {
    const color = getRandomColor()
    const floorGeometry = new THREE.BoxGeometry(sizeX, sizeY, sizeZ)
    const floorMaterial = new THREE.MeshLambertMaterial({ color: color })
    let tempFloor = new Physijs.BoxMesh(floorGeometry, floorMaterial, 0)
    tempFloor.name = 'floor'

    tempFloor.position.x = startX
    tempFloor.position.y = startY
    tempFloor.position.z = startZ

    const updateX = calculateUpdate(startX, endX, speed - delay)
    const updateY = calculateUpdate(startY, endY, speed - delay)
    const updateZ = calculateUpdate(startZ, endZ, speed - delay)

    const lowerThreshX = endX - 0.01 //Math.abs(updateX) * 0.001
    const lowerThreshY = endY - 0.01 //Math.abs(updateY) * 0.001
    const lowerThreshZ = endZ - 0.01 //Math.abs(updateZ) * 0.001

    const upperThreshX = endX + 0.01 //Math.abs(updateX) * 0.001
    const upperThreshY = endY + 0.01 //Math.abs(updateY) * 0.001
    const upperThreshZ = endZ + 0.01 //Math.abs(updateZ) * 0.001

    movingFloors.push(tempFloor)
    updates.push([updateX, updateY, updateZ])
    startingPositions.push([startX, startY, startZ])
    endPositions.push([endX, endY, endZ])
    lowerThresholds.push([lowerThreshX, lowerThreshY, lowerThreshZ])
    upperThresholds.push([upperThreshX, upperThreshY, upperThreshZ])
    floorStatus.push(0)
    scene.add(tempFloor)
}

function calculateUpdate(a, b, n) {
    const delta = b - a
    return delta / n
}

function getRandomPointOnSphere(minRad) {
    let u = Math.random()
    let v = Math.random()
    let theta = 2 * Math.PI * u
    let phi = Math.acos(1 * v - 1)
    let radius = minRad + Math.random() * 100
    let x = checkpointOneX + radius * Math.sin(phi) * Math.cos(theta)
    let y = checkpointOneY + radius * Math.sin(phi) * Math.sin(theta)
    let z = checkpointOneZ + radius * Math.cos(phi)
    return [x, y, z]
}

function animate() {
    requestAnimationFrame(animate)

    // make counter % 20 to have less path pieces
    if (counter < 1000 && counter % 5 == 0) {
        let startVec = getRandomPointOnSphere(100)

        createMovingFloor(
            startVec[0],
            startVec[1],
            startVec[2],
            checkpointOneX,
            checkpointOneY,
            checkpointOneZ,
            3,
            0.25,
            5,
            0
        )
    }
    counter += 1

    for (var i = 0; i < movingFloors.length; i++) {
        var f = movingFloors[i]
        var startPos = startingPositions[i]
        var endPos = endPositions[i]
        var lowerT = lowerThresholds[i]
        var upperT = upperThresholds[i]
        var deltas = updates[i]
        var status = floorStatus[i]

        if (status == 0) {
            if (f.position.x < lowerT[0] || f.position.x > upperT[0]) {
                f.position.x += deltas[0]
            }

            if (f.position.y < lowerT[1] || f.position.y > upperT[1]) {
                f.position.y += deltas[1]
            }

            if (f.position.z < lowerT[2] || f.position.z > upperT[2]) {
                f.position.z += deltas[2]
            }

            const dx = absoluteDistance(f.position.x, checkpointOneX)
            const dy = absoluteDistance(f.position.y, checkpointOneY)
            const dz = absoluteDistance(f.position.z, checkpointOneZ)

            if (dx < 0.1 && dy < 0.1 && dz < 0.1) {
                f.material.color.setHex(0xff00d4)
                floorStatus[i] = 1
            }
        } else {
            f.position.x += 0
            f.position.y += 0
            f.position.z += 0.2

            const dx = absoluteDistance(f.position.x, checkpointTwoX)
            const dy = absoluteDistance(f.position.y, checkpointTwoY)
            const dz = absoluteDistance(f.position.z, checkpointTwoZ)

            if (dx < 0.1 && dy < 0.1 && dz < 0.1) {
                f.position.x = startPos[0]
                f.position.y = startPos[1]
                f.position.z = startPos[2]
                f.material.color.setRGB(Math.random(), Math.random(), Math.random())
                floorStatus[i] = 0
            }
        }

        f.__dirtyPosition = true
    }

    //floor.position.z += 0.1
    //floor.__dirtyPosition = true

    obstacle.position.z += 0.1
    obstacle.__dirtyPosition = true

    if (obstacle.position.z > 0) {
        obstacle.position.z = -70
        obstacle.position.x = 0
        obstacle.position.y = 5
    }

    playerMovement()
    cameraMovement()

    scene.simulate()
    renderer.render(scene, camera)
}

function playerMovement() {
    // Keyboard movement inputs
    if (keyboard[87]) {
        // W key
        player.position.z -= 0.05
        astronaut.position.z -= 0.05
    }
    if (keyboard[83]) {
        // S key
        player.position.z += 0.05
        astronaut.position.z += 0.05
    }
    if (keyboard[65]) {
        // A key
        player.position.x -= 0.075
        astronaut.position.x -= 0.075
    }
    if (keyboard[68]) {
        // D key
        player.position.x += 0.075
        astronaut.position.x += 0.075
    }
    if (keyboard[32]) {
        // Space key
        player.position.y += 0.1
        astronaut.position.y += 0.1
    }
    player.__dirtyPosition = true
}

function cameraMovement() {
    // Keyboard movement inputs
    if (keyboard[40]) {
        // Up key
        camera.translateZ(0.05)
    }
    if (keyboard[38]) {
        // Down key
        camera.translateZ(-0.05)
    }
    if (keyboard[37]) {
        // Left key
        camera.translateX(-0.05)
    }
    if (keyboard[39]) {
        // Right key
        camera.translateX(0.05)
    }
    if (keyboard[16]) {
        // Shift key
        camera.translateY(0.05)
    }
    if (keyboard[17]) {
        // Ctrl key
        camera.translateY(-0.05)
    }
    //Rotation
    if (keyboard[73]) {
        // I key
        camera.rotateX(-0.025)
    }
    if (keyboard[75]) {
        // K key
        camera.rotateX(0.025)
    }
    if (keyboard[74]) {
        // J key
        camera.rotateZ(-0.025)
    }
    if (keyboard[76]) {
        // L key
        camera.rotateZ(0.025)
    }
    if (keyboard[85]) {
        // U key
        camera.rotateY(0.025)
    }
    if (keyboard[79]) {
        // O key
        camera.rotateY(-0.025)
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
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()
})

window.onload = init
