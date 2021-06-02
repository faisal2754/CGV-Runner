import { setupPlayer } from './setupPlayer.js'
import { setupEnemy } from './setupEnemy.js'

async function loadAssets() {
    const loader = new THREE.GLTFLoader()

    const [playerData, enemyData] = await Promise.all([
        loader.loadAsync('assets/models/astronaut-glb/astro.glb'),
        loader.loadAsync('assets/models/another_drone/scene.gltf')
    ])

    const player = setupPlayer(playerData)
    const enemy = setupEnemy(enemyData)

    console.log(enemyData)

    return { player, enemy }
}

export { loadAssets }
