const keyboard = {}

//Scene: What's there
const scene = new THREE.Scene()

//Camera: Our eyes
const fov = 75
const aspectRatio = window.innerWidth / window.innerHeight
const near = 0.1
const far = 1000
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far)

//Renderer: Renders scene and objects
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

//random
// const cube = new THREE.BoxGeometry()
// const object = new THREE.Mesh(cube, new THREE.MeshBasicMaterial(0xff0000))
// const box = new THREE.BoxHelper(object, 0xffff00)
// object.translateX(3)
// box.setFromObject(object)
// scene.add(object)
// scene.add(box)
//

//creating floor
const floorGeometry = new THREE.BoxGeometry()
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xffdd00 })
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
const floorWireframe = new THREE.BoxHelper(floor, 0xff0000)
floor.translateZ(1.5)
floor.scale.set(3, 0.25, 1)
//const height = floor.geometry.vertices[4].y - cube.geometry.vertices[0].y
//console.log(floor.geometry.vertices)
//const wire = new THREE.WireframeHelper(floor, 0x000000)

//create player
const playerGeometry = new THREE.BoxGeometry(0.75, 0.75, 0.75)
const playerMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 })
const player = new THREE.Mesh(playerGeometry, playerMaterial)
player.translateY(0.5)

//ambient light
const ambLight = new THREE.AmbientLight(0x404040) // soft white light
scene.add(ambLight)

//create point light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
//directionalLight.castShadow = true
//light.position.set(0, 2, 0)

//light helper
// const spheresize = 0.2
// const pointLightHelper = new THREE.PointLightHelper(light, spheresize)

//scene.add(wire)
scene.add(player)
//scene.add(pointLightHelper)
scene.add(directionalLight)
scene.add(floor)
scene.add(floorWireframe)

camera.position.set(0, 2, 5)

const animate = function () {
    requestAnimationFrame(animate)

    floor.scale.add(new THREE.Vector3(0, 0, 0.01))
    floor.translateZ(-0.005)
    floorWireframe.setFromObject(floor)
    //console.log(floor.floorGeometry.parameters.width)
    //floor.translateZ()
    // player.rotation.x += 0.01
    // player.rotation.y += 0.01

    //floor.floorMaterial =
    playerMovement()
    cameraMovement()
    renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()
})

// this.tl = new TimelineMax().delay(0.3)
// this.tl.to(this.floor.scale, 1, { x: 2, ease: Expo.easeOut })

animate()

function playerMovement() {
    // Keyboard movement inputs
    if (keyboard[87]) {
        // W key
        player.translateZ(-0.05)
        // player.position.x -= Math.sin(player.rotation.y) * player.speed
        // player.position.z -= -Math.cos(player.rotation.y) * player.speed
    }
    if (keyboard[83]) {
        // S key
        player.translateZ(0.05)
    }
    if (keyboard[65]) {
        // A key
        player.translateX(-0.05)
    }
    if (keyboard[68]) {
        // D key
        player.translateX(0.05)
    }
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
