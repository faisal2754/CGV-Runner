class Path {
    constructor(
        stateZeroX,
        stateZeroY,
        stateZeroZ,
        stateOneX,
        stateOneY,
        stateOneZ,
        stateTwoX,
        stateTwoY,
        stateTwoZ,
        sizeX,
        sizeY,
        sizeZ,
        numUpdates,
        stateOneUpdateSize
    ) {
        this.stateZeroX = stateZeroX
        this.stateZeroY = stateZeroY
        this.stateZeroZ = stateZeroZ
        this.stateOneX = stateOneX
        this.stateOneY = stateOneY
        this.stateOneZ = stateOneZ
        this.stateTwoX = stateTwoX
        this.stateTwoY = stateTwoY
        this.stateTwoZ = stateTwoZ
        this.sizeX = sizeX
        this.sizeY = sizeY
        this.sizeZ = sizeZ
        this.numUpdates = numUpdates
        this.stateOneUpdateSize = stateOneUpdateSize
        this.startDelayCounter = 0
        this.inverseTransformX = 1
        this.inverseTransformY = 1

        const r = Math.random()
        const g = Math.random()
        const b = Math.random()
        const color = new THREE.Color(r, g, b)

        const floorGeometry = new THREE.BoxGeometry(this.sizeX, this.sizeY, this.sizeZ)
        const floorMaterial = new THREE.MeshPhongMaterial({
            color: color,
            opacity: 0.65,
            transparent: true
        })
        this.mesh = new Physijs.BoxMesh(floorGeometry, floorMaterial, 0)
        this.mesh.position.x = this.stateZeroX
        this.mesh.position.y = this.stateZeroY
        this.mesh.position.z = this.stateZeroZ
    }

    setStartDelay(startDelay) {
        this.startDelay = startDelay
    }

    setWorkingDelay(workingDelay) {
        this.workingDelay = workingDelay
    }

    setState(state) {
        this.state = state
    }

    setPosition(x, y, z) {
        this.mesh.position.x = x
        this.mesh.position.y = y
        this.mesh.position.z = z
    }

    requestStateZeroPosition(x, y, z) {
        this.requestingPositionChange = true
        this.requestedStateZeroX = x
        this.requestedStateZeroY = y
        this.requestedStateZeroZ = z
    }

    requestScaleX(scaleX, inverseTransformX) {
        this.requestedScaleXChange = true
        this.requestedScaleX = scaleX
    }

    requestScaleY(scaleY) {
        this.requestedScaleYChange = true
        this.requestedScaleY = scaleY
    }

    undoScalingX() {
        this.mesh.scale.x = this.inverseTransformX
    }

    undoScalingY() {
        this.mesh.scale.y = this.inverseTransformY
    }

    toStateZeroPosition() {
        this.mesh.position.x = this.stateZeroX
        this.mesh.position.y = this.stateZeroY
        this.mesh.position.z = this.stateZeroZ
    }

    toStateOnePosition() {
        this.mesh.position.x = this.stateOneX
        this.mesh.position.y = this.stateOneY
        this.mesh.position.z = this.stateOneZ
    }

    tick() {
        switch (this.state) {
            case -1:
                this.stateNegOneUpdate()
                break
            case 0:
                this.stateZeroUpdate()
                break
            case 1:
                this.stateOneUpdate()
                break
            case 2:
                this.stateTwoUpdate()
                break
            default:
                console.log('Big sad.')
                break
        }
    }

    stateNegOneUpdate() {
        if (this.startDelayCounter == this.startDelay) {
            this.setState(0)
        } else {
            this.startDelayCounter += 1
        }
    }

    stateZeroUpdate() {
        let stateRequiredUpdate = false

        if (this.mesh.position.x < this.stateOneX - 0.01 || this.mesh.position.x > this.stateOneX + 0.01) {
            this.stateZeroUpdateX()
            stateRequiredUpdate = true
        }

        if (this.mesh.position.y < this.stateOneY - 0.01 || this.mesh.position.y > this.stateOneY + 0.01) {
            this.stateZeroUpdateY()
            stateRequiredUpdate = true
        }

        if (this.mesh.position.z < this.stateOneZ - 0.01 || this.mesh.position.z > this.stateOneZ + 0.01) {
            this.stateZeroUpdateZ()
            stateRequiredUpdate = true
        }

        if (!stateRequiredUpdate) {
            this.setState(1)
            this.tick()
        }
        this.mesh.__dirtyPosition = true
    }

    stateZeroUpdateX() {
        let deltaX = (this.stateOneX - this.stateZeroX) / this.numUpdates
        this.mesh.position.x += deltaX
    }

    stateZeroUpdateY() {
        let deltaY = (this.stateOneY - this.stateZeroY) / this.numUpdates
        this.mesh.position.y += deltaY
    }

    stateZeroUpdateZ() {
        let deltaZ = (this.stateOneZ - this.stateZeroZ) / this.numUpdates
        this.mesh.position.z += deltaZ
    }

    stateOneUpdate() {
        let stateRequiredUpdate = false

        if (this.mesh.position.z < this.stateTwoZ - 0.01 || this.mesh.position.z > this.stateZ + 0.01) {
            this.stateOneUpdateZ()
            stateRequiredUpdate = true
        }

        if (!stateRequiredUpdate) {
            if (this.requestingPositionChange) {
                this.stateZeroX = this.requestedStateZeroX
                this.stateZeroY = this.requestedStateZeroY
                this.stateZeroZ = this.requestedStateZeroZ
                this.requestingPositionChange = false
            }

            if (this.requestedScaleXChange) {
                this.undoScalingX()
                this.mesh.scale.x = this.requestedScaleX
                this.inverseTransformX = 1 / this.requestScaleX
                this.requestedScaleXChange = false
            }

            if (this.requestedScaleYChange) {
                this.undoScalingY()
                this.mesh.scale.y = this.requestedScaleY

                this.stateOneY = -2.5 * this.requestedScaleY
                this.stateTwoY = -2.5 * this.requestedScaleY

                this.inverseTransformY = 1 / this.requestedScaleY
                this.requestedScaleYChange = false
            }

            this.toStateZeroPosition()
            this.workingDelayCounter = 0
            this.setState(2)
        }
        this.mesh.__dirtyPosition = true
    }

    stateOneUpdateZ() {
        this.mesh.position.z += this.stateOneUpdateSize
        this.mesh.__dirtyPosition = true
    }

    stateTwoUpdate() {
        if (this.workingDelayCounter == this.workingDelay) {
            this.setState(0)
        } else {
            this.workingDelayCounter += 1
        }
    }
}

export { Path }
