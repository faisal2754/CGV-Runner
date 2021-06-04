import { setupPlayer } from './setupPlayer.js'
import { setupObstacle } from './setupObstacle.js'

async function loadAssets() {
    const loader = new THREE.GLTFLoader()

    //using GLTF loader to load models
    const [playerData, obstacleData] = await Promise.all([
        loader.loadAsync('assets/models/astronaut-glb/astro.glb'),
        loader.loadAsync('assets/models/forcefield/scene.gltf')
    ])

    //setting up models
    const player = setupPlayer(playerData)
    const obstacle = setupObstacle(obstacleData)

    return { player, obstacle }
}

export { loadAssets }
