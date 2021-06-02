import { World } from './World/World.js'

async function main() {
    const container = document.querySelector('#scene-container')
<<<<<<< HEAD
    const world = new World(container)
=======

    const world = new World(container)

>>>>>>> 986dfd75e402d6c69d01b533d215f7c9274139ab
    await world.init()

    world.start()

    document.getElementById('pauseBtn').onclick = function pause() {
        var musicOn = document.getElementById('musiccb').checked
        if (musicOn == true) {
            var audio = document.getElementById('buttonSound')
            audio.play()
        }
        world.stop()
        document.getElementById('pauseMenu').style.display = 'block'
    }

    document.getElementById('pauseMenu').onclick = function resume() {
        var musicOn = document.getElementById('musiccb').checked
        if (musicOn == true) {
            var audio = document.getElementById('buttonSound')
            audio.play()
        }
        document.getElementById('pauseMenu').style.display = 'none'
        world.start()
    }

    document.getElementById('menuClose').onclick = function play() {
        var musicOn = document.getElementById('musiccb').checked
        if (musicOn == true) {
            var audio = document.getElementById('buttonWhoosh')
            audio.play()
        }
        var menu = document.getElementById('menuContainer')
        var overlays = document.getElementById('overlays')
        var scene = document.getElementById('scene-container')

        setTimeout(function () {
            var musicOn = document.getElementById('musiccb').checked
            menu.style.display = 'none'
            overlays.style.display = 'block'
            scene.style.display = 'block'
            if (musicOn == true) {
                var audio = document.getElementById('fz')
                audio.play()
            }
        }, 2000)
    }
}

main().catch((err) => {
    console.error(err)
})
