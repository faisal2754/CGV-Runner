import { setupPlayer } from './setupPlayer.js'

async function createPlayer() {
    const loader = new THREE.GLTFLoader()

    const playerData = await loader.loadAsync('models/astronaut-glb/astro.glb')

    const player = setupPlayer(playerData)

    console.log(playerData)

    player.rotation.y = Math.PI
    player.position.set(0, 5, 75)

    return { player }
}

export { createPlayer }
