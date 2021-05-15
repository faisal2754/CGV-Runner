Physijs.scripts.worker = './modules/physijs_worker.js'
Physijs.scripts.ammo = './ammo.js'

const keyboard = {}
let scene, camera, renderer, player, obstacle, floor, floorWireframe, skyboxGeometry, skybox, controls

function init() {
    //Scene: What's there
    scene = new Physijs.Scene()
    scene.setGravity(new THREE.Vector3(0, -5, 0))

    //Camera: Our eyes
    const fov = 75
    const aspectRatio = window.innerWidth / window.innerHeight
    const near = 0.1
    const far = 1000
    camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far)

    //Renderer: Renders scene and objects
    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    //controls
    controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.enabled = true
    controls.minDistance = 0

    //skybox
    skyboxGeometry = new THREE.BoxGeometry(250, 250, 250)
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

    //creating floor
    const floorGeometry = new THREE.BoxGeometry()
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xffdd00 })
    floor = new Physijs.BoxMesh(floorGeometry, floorMaterial, 0)
    floorWireframe = new THREE.BoxHelper(floor, 0xff0000)
    floor.translateZ(-47)
    floor.scale.set(3, 0.25, 100)
    //const wire = new THREE.WireframeHelper(floor, 0x000000)

    //create player
    const playerGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75)
    const playerMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 })
    player = new Physijs.BoxMesh(playerGeometry, playerMaterial)
    player.translateZ(1)
    player.translateY(0.5)

    //obstacle
    const obstacleGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75)
    const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 })
    obstacle = new Physijs.BoxMesh(obstacleGeometry, obstacleMaterial, 0)
    obstacle.translateZ(-7)
    obstacle.translateY(0.5)
    // const player1 = new THREE.Mesh(playerGeometry, playerMaterial)
    // player1.worldToLocal()

    //ambient light
    const ambLight = new THREE.AmbientLight(0x404040) // soft white light

    //create directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(-1, 2, 0)

    //light helper
    // const spheresize = 0.2
    // const pointLightHelper = new THREE.PointLightHelper(light, spheresize)

    scene.add(player)
    scene.add(obstacle)
    scene.add(skybox)
    //scene.add(pointLightHelper)
    scene.add(ambLight)
    scene.add(directionalLight)
    scene.add(floor)
    scene.add(floorWireframe)

    camera.position.set(0, 2, 5)

    animate()
}

const animate = function () {
    requestAnimationFrame(animate)

    // floor.scale.add(new THREE.Vector3(0, 0, 0.01))
    floor.translateZ(-0.01)
    floor.__dirtyPosition = true
    floorWireframe.setFromObject(floor)

    //console.log(floor.floorGeometry.parameters.width)

    playerMovement()
    cameraMovement()

    player.position.z -= 0.01
    camera.position.z -= 0.01

    //player.lookAt(new THREE.Vector3(0, 0, player.position.z))

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
        player.position.x -= 0.05
    }
    if (keyboard[68]) {
        // D key
        player.position.x += 0.05
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
