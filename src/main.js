import { World } from './World/World.js'

async function main(restart = false) {
    const container = document.querySelector('#scene-container')

    const world = new World()

    //restart game functionality
    if (restart == true) {
        await world.init(container)
        world.init_managers()
        world.start()
        var loadingscreen = document.getElementById('loadingscreen')
        fade(loadingscreen)
    }
    var overlays = document.getElementById('overlays')
    overlays.style.display = 'block'

    //pause menu functionality
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

    document.addEventListener('keydown', function (event) {
        if (event.key == 'Escape') {
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
    })

    //resume functionality
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

    //Play game functionality
    document.getElementById('menuClose').onclick = function play() {
        var musicOn = document.getElementById('musiccb').checked
        if (musicOn == true) {
            var audio = document.getElementById('buttonWhoosh')
            audio.play()
        }

        var bg = document.getElementById('bg2')
        bg.muted = true
        bg.pause()

        var menu = document.getElementById('menuContainer')
        var overlays = document.getElementById('overlays')
        var scene = document.getElementById('scene-container')

        var loadingscreen = document.getElementById('loadingscreen')
        loadingscreen.style.display = 'block'

        setTimeout(async function () {
            var musicOn = document.getElementById('musiccb').checked
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

    //set username
    const form = document.getElementById('userForm')
    form.addEventListener('submit', function (event) {
        var username = document.getElementById('username').value
        const score = document.getElementById('finalScore').innerText.substring(13)

        if (username === '') {
            username = 'Anon'
        }

        const xhr = new XMLHttpRequest()
        xhr.withCredentials = false
        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE) {
                console.log(this.responseText)
            }
        })
        xhr.open('POST', 'https://cgv-middleman.herokuapp.com/')
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        const data = 'username=' + username + '&score=' + score
        xhr.send(data)

        document.getElementById('gameOverMenu').style.display = 'none'
        $('canvas').remove()

        var musicOn = document.getElementById('musiccb').checked
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
    })

    //restart functionality
    document.getElementById('restart').onclick = function restart() {
        document.getElementById('gameOverMenu').style.display = 'none'
        $('canvas').remove()

        var musicOn = document.getElementById('musiccb').checked
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

    //fetch leaderboard data
    const jsonData = await fetch('https://cgv-middleman.herokuapp.com/', {
        method: 'GET',
        headers: {}
    })

    const JSONscores = await jsonData.json()

    const scoreTable = document.getElementById('topScores')
    var lenTopScores = JSONscores.length

    if (lenTopScores > 10) {
        lenTopScores = 10
    }

    for (let i = 0; i < lenTopScores; i++) {
        var row = scoreTable.insertRow()
        var cell1 = row.insertCell(0)
        var cell2 = row.insertCell(1)
        cell1.innerHTML = JSONscores[i].username
        cell2.innerHTML = JSONscores[i].score
    }
}

//fade loading screen out

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
