import { World } from './World/World.js'
import { loadAssets } from './World/components/assetLoader.js'

async function main() {
    const container = document.querySelector('#scene-container')

    const { player, enemy, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5 } = await loadAssets()

    const world = new World(container, player, enemy, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5)

    world.start()

    document.getElementById('pauseBtn').onclick = function pause() {
        var audio = document.getElementById('buttonSound')
        audio.play()
        world.stop()
        document.getElementById('pauseMenu').style.display = 'block'
    }

    document.getElementById('pauseMenu').onclick = function resume() {
        var audio = document.getElementById('buttonSound')
        audio.play()
        document.getElementById('pauseMenu').style.display = 'none'
        world.start()
    }

    document.getElementById('menuClose').onclick = function play() {
        var audio = document.getElementById('buttonWhoosh')
        audio.play()
        var menu = document.getElementById('menuContainer')
        var overlays = document.getElementById('overlays')
        var scene = document.getElementById('scene-container')

        setTimeout(function () {
            menu.style.display = 'none'
            overlays.style.display = 'block'
            scene.style.display = 'block'
            var audio = document.getElementById('fz')
            audio.play()
        }, 2000)
    }
}

main().catch((err) => {
    console.error(err)
})
