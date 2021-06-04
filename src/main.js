import { World } from './World/World.js'

async function main(restart = false) {
    const container = document.querySelector('#scene-container')

    const world = new World()

    if (restart == true) {
        await world.init(container)
        world.init_managers()
        world.start()
        var loadingscreen = document.getElementById('loadingscreen')
        fade(loadingscreen)
    }
    var overlays = document.getElementById('overlays')
    overlays.style.display = 'block'

    document.getElementById('pauseBtn').onclick = function pause() {
        var musicOn = document.getElementById('musiccb').checked
        var audio = document.getElementById('fz')
        audio.pause()
        world.stop()
        document.getElementById('pauseMenu').style.display = 'block'
        if (musicOn == true) {
            var audio2 = document.getElementById('buttonSound')
            audio2.play()
        }
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
        musicOn = false
        if (musicOn == true) {
            var audio = document.getElementById('buttonWhoosh')
            audio.play()
        }

        var bg = document.getElementById('bg2')
        bg.volume = 0
        bg.pause()
        bg.currentTime = 0

        var menu = document.getElementById('menuContainer')
        var overlays = document.getElementById('overlays')
        var scene = document.getElementById('scene-container')

        var loadingscreen = document.getElementById('loadingscreen')
        loadingscreen.style.display = 'block'

        setTimeout(async function () {
            var musicOn = document.getElementById('musiccb').checked
            musicOn = false
            menu.style.display = 'none'
            overlays.style.display = 'block'
            scene.style.display = 'block'

            await world.init(container)
            world.init_managers()
            world.start()
            if (musicOn == true) {
                var audio = document.getElementById('fz')
                audio.play()
            }
            fade(loadingscreen)
        }, 3000)
    }

    document.getElementById('restart').onclick = function restart() {
        document.getElementById('gameOverMenu').style.display = 'none'
        $('canvas').remove()

        var musicOn = document.getElementById('musiccb').checked
        musicOn = false
        if (musicOn == true) {
            var audio = document.getElementById('buttonSound')
            audio.play()
            var audio2 = document.getElementById('fz')
            audio2.play()
        }
        var loadingscreen = document.getElementById('loadingscreen')
        loadingscreen.style.opacity = 1
        loadingscreen.style.display = 'block'

        main(true)
    }

    const jsonData = await fetch('https://cgv-middleman.herokuapp.com/', {
        method: 'GET',
        headers: {}
    })

    const JSONscores = await jsonData.json()
    // const scores = JSON.stringify(JSONscores)
    console.log(JSONscores[0])

    const scoreTable = document.getElementById('topScores')
    var lenTopScores = JSONscores.length
    console.log(lenTopScores)
    if (lenTopScores > 10) {
        lenTopScores = 10
    }

    for (let i = 0; i < lenTopScores; i++) {
        var row = scoreTable.insertRow()
        var cell1 = row.insertCell(0)
        var cell2 = row.insertCell(1)
        cell1.innerHTML = JSONscores[i].createdAt.substring(0, 10)
        cell2.innerHTML = JSONscores[i].score
    }

    //xmlHttp.open('GET', 'https://cgv-middleman.herokuapp.com/', false)
    //xmlHttp.send(null)
    //console.log(xmlHttp.responseText)

    // const score = { score: 300 }
    // const bruh = await fetch('https://cgv-middleman.herokuapp.com/', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(score)
    // })

    // console.log(await bruh.json())
}

function fade(element) {
    var op = 1 // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer)
            element.style.display = 'none'
        }
        element.style.opacity = op
        element.style.filter = 'alpha(opacity=' + op * 100 + ')'
        op -= op * 0.05
    }, 10)
}

main().catch((err) => {
    console.error(err)
})
