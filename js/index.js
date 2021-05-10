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

//creating cube
const geometry = new THREE.BoxGeometry()
var material = new THREE.MeshBasicMaterial({ color: 0x00ffff })
const cube = new THREE.Mesh(geometry, material)

scene.add(cube) //adding cube to scene

camera.position.z = 5

const animate = function () {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    //cube.material =

    renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()
})

// this.tl = new TimelineMax().delay(0.3)
// this.tl.to(this.cube.scale, 1, { x: 2, ease: Expo.easeOut })

animate()
