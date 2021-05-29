import { Path } from './Path.js'

class PathManager {
    constructor(
        checkpointOneX,
        checkpointOneY,
        checkpointOneZ,
        checkpointTwoX,
        checkpointTwoY,
        checkpointTwoZ,
        numPaths,
        numPathsBtnCheckpoints,
        minDisplacement,
        variationRadius,
        pathSizeX,
        pathSizeY
    ) {
        this.checkpointOneX = checkpointOneX
        this.checkpointOneY = checkpointOneY
        this.checkpointOneZ = checkpointOneZ
        this.checkpointTwoX = checkpointTwoX
        this.checkpointTwoY = checkpointTwoY
        this.checkpointTwoZ = checkpointTwoZ
        this.numPaths = numPaths
        this.numPathsBtnCheckpoints = numPathsBtnCheckpoints
        this.minDisplacement = minDisplacement
        this.variationRadius = variationRadius
        this.pathSizeX = pathSizeX
        this.pathSizeY = pathSizeY
        this.paths = []
        this.stepCounter = 0
        this.activeStrategy = 0

        this.stateOneUpdateSize = 0.1

        this.mainSectionLength = Math.abs(checkpointOneZ - checkpointTwoZ)

        this.pathSizeZ = this.mainSectionLength / this.numPathsBtnCheckpoints

        this.numUpdatesTillStateChange = this.pathSizeZ / this.stateOneUpdateSize

        let workingDelay = (numPaths - numPathsBtnCheckpoints + 2) * this.numUpdatesTillStateChange
        for (let i = 0; i <= numPaths; i++) {
            let pointOnSphere = this.getRandomPointOnSphere()
            let stateZeroPositionX = pointOnSphere[0]
            let stateZeroPositionY = pointOnSphere[1]
            let stateZeroPositionZ = pointOnSphere[2]

            let path = new Path(
                stateZeroPositionX,
                stateZeroPositionY,
                stateZeroPositionZ,
                checkpointOneX,
                checkpointOneY,
                checkpointOneZ,
                checkpointTwoX,
                checkpointTwoY,
                checkpointTwoZ,
                1,
                1,
                this.pathSizeZ,
                this.numUpdatesTillStateChange,
                this.stateOneUpdateSize
            )
            path.setState(0)
            path.toStateZeroPosition()
            path.setWorkingDelay(workingDelay)
            this.paths.push(path)
        }

        for (let i = 0; i <= numPathsBtnCheckpoints - 1; i++) {
            let positionX = checkpointOneX
            let positionY = checkpointOneY
            let positionZ = checkpointOneZ + (i + 1) * this.pathSizeZ

            this.paths[i].setPosition(positionX, positionY, positionZ)
            this.paths[i].setState(1)
        }

        let counter = 0
        for (let i = numPathsBtnCheckpoints; i <= numPaths; i++) {
            let delay = this.numUpdatesTillStateChange * counter

            this.paths[i].setStartDelay(delay)
            this.paths[i].setState(-1)
            counter += 1
        }
    }

    getRandomPointOnSphere() {
        let u = Math.random()
        let v = Math.random()

        let theta = 2 * Math.PI * u
        let phi = Math.acos(1 * v - 1)

        let radius = this.minDisplacement + Math.random() * this.variationRadius

        let x = this.checkpointOneX + radius * Math.sin(phi) * Math.cos(theta)
        let y = this.checkpointOneY + radius * Math.sin(phi) * Math.sin(theta)
        let z = this.checkpointOneZ + radius * Math.cos(phi)
        return [x, y, z]
    }

    useSphereStrategy() {
        this.paths.forEach((path) => {
            let pointOnSphere = this.getRandomPointOnSphere()
            let stateZeroPositionX = pointOnSphere[0]
            let stateZeroPositionY = pointOnSphere[1]
            let stateZeroPositionZ = pointOnSphere[2]

            path.requestStateZeroPosition(stateZeroPositionX, stateZeroPositionY, stateZeroPositionZ)
        })
    }

    useLineStrategy() {
        let delta

        for (let i = 0; i <= this.numPaths; i++) {
            if (i < this.numPathsBtnCheckpoints) {
                delta = this.numPathsBtnCheckpoints - (i % this.numPathsBtnCheckpoints)
            } else {
                delta = i + 1
            }

            let stateZeroPositionX = this.checkpointOneX - this.numPaths / 2 + delta
            let stateZeroPositionY = this.checkpointOneY
            let stateZeroPositionZ = this.checkpointOneZ - 10
            this.paths[i].requestStateZeroPosition(stateZeroPositionX, stateZeroPositionY, stateZeroPositionZ)
        }
    }

    useSpiralStrategy() {
        let delta
        let zStep
        let angleDelta = (2 * Math.PI) / this.numPaths

        for (let i = 0; i <= this.numPaths; i++) {
            if (i < this.numPathsBtnCheckpoints) {
                delta = this.numPathsBtnCheckpoints - (i % this.numPathsBtnCheckpoints)
            } else {
                delta = i + 1
            }

            zStep = Math.abs(this.checkpointOneZ - this.checkpointTwoZ) / this.numPaths

            let stateZeroPositionX = this.checkpointOneX + 10 * Math.sin(delta * angleDelta)
            let stateZeroPositionY = this.checkpointOneY + 10 * Math.cos(delta * angleDelta)
            let stateZeroPositionZ = this.checkpointOneZ + delta * zStep
            this.paths[i].requestStateZeroPosition(stateZeroPositionX, stateZeroPositionY, stateZeroPositionZ)
        }
    }

    useCircleStrategy() {
        let delta
        let angleDelta = (2 * Math.PI) / this.numPaths

        for (let i = 0; i <= this.numPaths; i++) {
            if (i < this.numPathsBtnCheckpoints) {
                delta = this.numPathsBtnCheckpoints - (i % this.numPathsBtnCheckpoints)
            } else {
                delta = i + 1
            }

            let stateZeroPositionX = this.checkpointOneX + 30 * Math.cos(delta * angleDelta)
            let stateZeroPositionY = this.checkpointOneY + 30 * Math.sin(delta * angleDelta)
            let stateZeroPositionZ = this.checkpointOneZ - 10
            this.paths[i].requestStateZeroPosition(stateZeroPositionX, stateZeroPositionY, stateZeroPositionZ)
        }
    }

    useCrossStrategy() {
        let delta
        let half = Math.floor(this.numPaths / 2)
        let stateZeroPositionX
        let stateZeroPositionY
        let stateZeroPositionZ

        for (let i = 0; i <= this.numPaths; i++) {
            if (i < this.numPathsBtnCheckpoints) {
                delta = this.numPathsBtnCheckpoints - (i % this.numPathsBtnCheckpoints)
            } else {
                delta = i + 1
            }

            if (delta < half) {
                stateZeroPositionX = this.checkpointOneX + half / 2 - delta
                stateZeroPositionY = this.checkpointOneY + half / 2 - delta
                stateZeroPositionZ = this.checkpointOneZ - delta
            } else {
                stateZeroPositionX = this.checkpointOneX - half * 1.5 + delta
                stateZeroPositionY = this.checkpointOneY + half * 1.5 - delta
                stateZeroPositionZ = this.checkpointOneZ - delta
            }
            this.paths[i].requestStateZeroPosition(stateZeroPositionX, stateZeroPositionY, stateZeroPositionZ)
        }
    }

    tick() {
        this.paths.forEach((path) => {
            path.tick()
        })

        let fractionOfPathsProcessed = this.stepCounter / (this.numUpdatesTillStateChange + 1) / this.numPaths
        let numPassesTillStragegyChange = 1
        let numCompletedPasses = Math.floor(fractionOfPathsProcessed)

        if (numCompletedPasses == numPassesTillStragegyChange) {
            let strategyNum = Math.floor(Math.random() * 4)

            console.log(strategyNum)

            switch (strategyNum) {
                case 0:
                    this.useSphereStrategy()
                    break
                case 1:
                    this.useLineStrategy()
                    break
                case 2:
                    this.useSpiralStrategy()
                    break
                case 3:
                    this.useCircleStrategy()
                    break
                case 4:
                    this.useCrossStrategy()
                    break
                default:
                    this.useSphereStrategy()
                    break
            }
            this.stepCounter = 0
        }

        this.stepCounter += 1
    }
}

export { PathManager }
