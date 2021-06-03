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
            world.start()
            musicOn = false
            if (musicOn == true) {
                var audio = document.getElementById('fz')
                audio.play()
            }
        }, 2000)
    }

    //xmlHttp.open('GET', 'https://cgv-middleman.herokuapp.com/', false)
    //xmlHttp.send(null)
    //console.log(xmlHttp.responseText)

    const jsonData = await fetch('https://cgv-middleman.herokuapp.com/', {
        method: 'GET',
        headers: {}
    })

    console.log(await jsonData.json())

    // fetch('https://cgv-middleman.herokuapp.com/', {
    //     method: 'GET',
    //     headers: {}
    // })
    //     .then((response) => {
    //         console.log(response.json())
    //     })
    //     .catch((err) => {
    //         console.error(err)
    //     })
}

main().catch((err) => {
    console.error(err)
})

// mode: 'cors',
//         headers: {
//             'Access-Control-Allow-Origin': '*',
//             'Access-Control-Allow-Credentials': 'true',
//             'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
//             'Access-Control-Allow-Headers':
//                 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
//         }
