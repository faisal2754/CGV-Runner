import { World } from './World/World.js'
import { loadAssets } from './World/components/assetLoader.js'

async function main() {
    const container = document.querySelector('#scene-container')

    const { player, enemy, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5 } = await loadAssets()

    const world = new World(container, player, enemy, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5)

    world.start()
}

main().catch((err) => {
    console.error(err)
})
