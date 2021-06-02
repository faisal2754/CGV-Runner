import { setupPlayer } from './setupPlayer.js'
import { setupEnemy } from './setupEnemy.js'
import { setupObstacle } from './setupObstacle.js'

async function loadAssets() {
    const loader = new THREE.GLTFLoader()

    const [playerData, enemyData, obstacleData1, obstacleData2, obstacleData3, obstacleData4, obstacleData5] =
        await Promise.all([
            loader.loadAsync('assets/models/astronaut-glb/astro.glb'),
            loader.loadAsync('assets/models/another_drone/scene.gltf'),
            loader.loadAsync('assets/models/forcefield/scene.gltf'),
            loader.loadAsync('assets/models/forcefield/scene.gltf'),
            loader.loadAsync('assets/models/forcefield/scene.gltf'),
            loader.loadAsync('assets/models/forcefield/scene.gltf'),
            loader.loadAsync('assets/models/forcefield/scene.gltf')
        ])

    const player = setupPlayer(playerData)
    const enemy = setupEnemy(enemyData)
    const obstacle1 = setupObstacle(obstacleData1)
    const obstacle2 = setupObstacle(obstacleData2)
    const obstacle3 = setupObstacle(obstacleData3)
    const obstacle4 = setupObstacle(obstacleData4)
    const obstacle5 = setupObstacle(obstacleData5)

    return { player, enemy, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5 }
}

export { loadAssets }
