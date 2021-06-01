import { setupEnemy } from './setupEnemy.js'

async function createEnemy() {
    const loader = new THREE.GLTFLoader()

    const enemyData = await loader.loadAsync('models/astronaut-glb/astro.glb')

    const enemy = setupEnemy(enemyData)

    console.log(enemy)

    enemy.rotation.y = Math.PI
    enemy.position.set(0, 5, 75)

    return { enemy }

    // cube.position.set(0, 5, 75)
    // cube.rotation.set(-0.5, -0.1, 0.8)
}

export { createEnemy }
