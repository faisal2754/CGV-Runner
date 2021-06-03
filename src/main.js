import { World } from './World/World.js'

async function main() {
    const container = document.querySelector('#scene-container')

    const world = new World(container)
    await world.init()
    world.init_managers()

    world.start()

    setTimeout(function () {
        world.stop()
    }, 1000)

    document.getElementById('pauseBtn').onclick = function pause() {
        var musicOn = document.getElementById('musiccb').checked
        var audio = document.getElementById('fz')
        audio.pause()
        if (musicOn == true) {
            var audio2 = document.getElementById('buttonSound')
            audio2.play()
        }
        world.stop()
        document.getElementById('pauseMenu').style.display = 'block'
    }

    document.getElementById('pauseMenu').onclick = function resume() {
        var musicOn = document.getElementById('musiccb').checked
        if (musicOn == true) {
            var audio = document.getElementById('buttonSound')
            audio.play()
            var audio2 = document.getElementById('fz')
            audio2.play()
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
            world.start()
        }, 2000)
    }

    // document.getElementById('restart').onclick = function restart() {
    //     document.getElementById('gameOverMenu').style.display = 'none'
    //     var canvas = document.getElementsByTagName('canvas')
    //     console.log(canvas)
    //     canvas.remove()
    //     main()
    // }
}

main().catch((err) => {
    console.error(err)
})
