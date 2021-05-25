const keyboard = {}
//essentials
let scene, camera, renderer
//lights
let ambLight, directionalLight
//world objects
let player, obstacle, floor, floorWireframe, group, newFloor
//miscellaneous
let skyboxGeometry, skybox, controls

//floor
let deltaFloorX,
    deltaFloorY,
    deltaFloorZ,
    numUpdates,
    updateFloorX,
    updateFloorY,
    updateFloorZ

let newFloors = []
let updateFloorsX = []
let updateFloorsY = []
let updateFloorsZ = []
let newFloorsLowerX = []
let newFloorsLowerY = []
let newFloorsLowerZ = []
let newFloorsUpperX = []
let newFloorsUpperY = []
let newFloorsUpperZ = []

function init() {
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
                side: THREE.DoubleSide,
            }), //front side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('skybox/corona_bk.png'),
                side: THREE.DoubleSide,
            }), //back side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('skybox/corona_up.png'),
                side: THREE.DoubleSide,
            }), //up side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('skybox/corona_dn.png'),
                side: THREE.DoubleSide,
            }), //down side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('skybox/corona_rt.png'),
                side: THREE.DoubleSide,
            }), //right side
            new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load('skybox/corona_lf.png'),
                side: THREE.DoubleSide,
            }), //left side
        ]
        skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials)
    })()

    //obstacle
    const initObstacle = (function () {
        const obstacleGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75)
        const obstacleMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff00,
        })
        obstacle = new Physijs.BoxMesh(obstacleGeometry, obstacleMaterial)
        obstacle.name = 'Obstacle'
        obstacle.translateZ(-15)
        obstacle.translateY(0.5)
    })()

    //creating floor
    const initFloor = (function () {
        const floorGeometry = new THREE.BoxGeometry(3, 0.25, 100)
        const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xffdd00 })
        floor = new Physijs.BoxMesh(floorGeometry, floorMaterial, 0)
        floor.name = 'Floor'
        floor.translateZ(-50)
        // floorWireframe = new THREE.BoxHelper(floor, 0xff0000)
        //const wire = new THREE.WireframeHelper(floor, 0x000000)
    })()

    // const createFloor = (function (x, y, z) {
    //     const floorGeometry = new THREE.BoxGeometry(3, 0.25, 5)
    //     const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff })
    //     newFloor = new Physijs.BoxMesh(floorGeometry, floorMaterial, 0)
    //     newFloor.name = 'Floor'

    //     newFloor.translateY(50)
    //     newFloor.translateX(50)
    //     newFloor.translateZ(-50)

    //     endPosX = 0
    //     endPosY = 0
    //     endPosZ = -10

    //     deltaFloorX = endPosX - newFloor.position.x
    //     deltaFloorY = endPosX - newFloor.position.y
    //     deltaFloorZ = endPosY - newFloor.position.z

    //     numUpdates = 10

    //     updateFloorX = deltaFloorX / numUpdates
    //     updateFloorY = deltaFloorY / numUpdates
    //     updateFloorZ = deltaFloorZ / numUpdates

    //     finalXLower = endPosX - 0.5 * Math.abs(updateFloorX)
    //     finalYLower = endPosY - 0.5 * Math.abs(updateFloorY)
    //     finalZLower = endPosZ - 0.5 * Math.abs(updateFloorZ)

    //     finalXUpper = endPosX + 0.5 * Math.abs(updateFloorX)
    //     finalYUpper = endPosY + 0.5 * Math.abs(updateFloorY)
    //     finalZUpper = endPosZ + 0.5 * Math.abs(updateFloorZ)
    // })()

    function createFloor(startX, startY, startZ, endX, endY, endZ, nUpdates) {
        const floorGeometry = new THREE.BoxGeometry(3, 0.25, 10)
        const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xff00ff })
        let tempFloor = new Physijs.BoxMesh(floorGeometry, floorMaterial, 0)
        tempFloor.name = 'floor'

        tempFloor.translateY(startX)
        tempFloor.translateX(startY)
        tempFloor.translateZ(startZ)

        deltaFloorX = endX - tempFloor.position.x
        deltaFloorY = endX - tempFloor.position.y
        deltaFloorZ = endY - tempFloor.position.z

        updateFloorX = deltaFloorX / nUpdates
        updateFloorY = deltaFloorY / nUpdates
        updateFloorZ = deltaFloorZ / nUpdates

        finalXLower = endX - 0.5 * Math.abs(updateFloorX)
        finalYLower = endY - 0.5 * Math.abs(updateFloorY)
        finalZLower = endZ - 0.5 * Math.abs(updateFloorZ)

        finalXUpper = endX + 0.5 * Math.abs(updateFloorX)
        finalYUpper = endY + 0.5 * Math.abs(updateFloorY)
        finalZUpper = endZ + 0.5 * Math.abs(updateFloorZ)

        newFloors.push(tempFloor)

        newFloorsLowerX.push(finalXLower)
        newFloorsLowerY.push(finalYLower)
        newFloorsLowerZ.push(finalZLower)

        newFloorsUpperX.push(finalXUpper)
        newFloorsUpperY.push(finalYUpper)
        newFloorsUpperZ.push(finalZUpper)

        updateFloorsX.push(updateFloorX)
        updateFloorsY.push(updateFloorY)
        updateFloorsZ.push(updateFloorZ)
        scene.add(tempFloor)
    }

    //create player
    const initPlayer = (function () {
        const playerGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75)
        const playerMaterial = new THREE.MeshStandardMaterial({
            color: 0xff0000,
        })
        player = new Physijs.BoxMesh(playerGeometry, playerMaterial)
        player.name = 'Player'
        player.translateZ(-5)
        player.translateY(0.5)
        player.addEventListener('collision', function (object) {
            if (object.name === 'Obstacle') {
                console.log('Game Over bruh.')
            }
        })
    })()

    //ambient light
    const initAmbientLight = (function () {
        ambLight = new THREE.AmbientLight(0x404040) // soft white light
    })()

    //create directional light
    const initDirectionalLight = (function () {
        directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(-1, 2, 0)
    })()

    const testNewFloor = (function () {
        let startX, startY, startZ, endX, endY, endZ, signX, signY, signZ

        for (var i = 0; i < 10; i++) {
            signX = Math.random() < 0.5 ? -1 : 1
            signY = Math.random() < 0.5 ? -1 : 1
            signZ = Math.random() < 0.5 ? -1 : 1

            startX = signX * (100 + Math.floor(Math.random() * 100))
            startY = signY * (100 + Math.floor(Math.random() * 100))
            startZ = signZ * (100 + Math.floor(Math.random() * 100))

            endX = -3
            endY = 2 * i
            endZ = -10 * i

            createFloor(startX, startY, startZ, endX, endY, endZ, 100 + i * 50)
        }
    })()

    /**  light helper
    const spheresize = 0.2
    const pointLightHelper = new THREE.PointLightHelper(light, spheresize)
    scene.add(pointLightHelper) */

    const initSceneChildren = (function () {
        scene.add(player)
        scene.add(obstacle)
        scene.add(skybox)
        scene.add(ambLight)
        scene.add(directionalLight)
        scene.add(floor)
        scene.add(newFloors)
        //scene.add(newFloor)
        // scene.add(floorWireframe)
    })()

    camera.lookAt(player.position)
    animate()
}

function animate() {
    requestAnimationFrame(animate)

    //floor.position.z += 0.1
    //floor.__dirtyPosition = true

    for (var i = 0; i < newFloors.length; i++) {
        if (
            newFloors[i].position.x < newFloorsLowerX[i] ||
            newFloors[i].position.x > newFloorsUpperX[i]
        ) {
            newFloors[i].position.x += updateFloorsX[i]
        }
        if (
            newFloors[i].position.y < newFloorsLowerY[i] ||
            newFloors[i].position.y > newFloorsUpperY[i]
        ) {
            newFloors[i].position.y += updateFloorsY[i]
        }
        if (
            newFloors[i].position.z < newFloorsLowerZ[i] ||
            newFloors[i].position.z > newFloorsUpperZ[i]
        ) {
            newFloors[i].position.z += updateFloorsZ[i]
        }
        newFloors[i].__dirtyPosition = true
    }

    obstacle.position.z += 0.1
    obstacle.__dirtyPosition = true

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
    }
    if (keyboard[83]) {
        // S key
        player.position.z += 0.05
    }
    if (keyboard[65]) {
        // A key
        player.position.x -= 0.075
    }
    if (keyboard[68]) {
        // D key
        player.position.x += 0.075
    }
    if (keyboard[32]) {
        // Space key
        player.position.y += 0.1
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
