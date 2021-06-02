import { Laser } from './LaserClass.js'

class LaserManager {
    constructor(numlasers, sizeX, sizeY, sizeZ, stepSize, safeZoneStartZ, safeZoneEndZ, pathEndZ) {
        this.numlasers = numlasers
        this.stepSize = stepSize
        this.safeZoneStartZ = safeZoneStartZ
        this.safeZoneEndZ = safeZoneEndZ
        this.pathEndZ = pathEndZ
        this.pathWidth = 10
        this.minX = -5

        this.lasers = []

        for (let i = 0; i < this.numlasers; i++) {
            this.lasers.push(new laser(sizeX, sizeY, sizeZ))
        }

        let safeZoneLength = Math.abs(safeZoneStartZ - safeZoneEndZ)
        this.safeZoneLength = safeZoneLength
        for (let i = 0; i < this.numlasers; i++) {
            let xPos = this.minX + Math.random() * this.pathWidth * 0.9
            let yPos = 3.5
            let zPos = safeZoneStartZ - Math.random() * safeZoneLength

            while (this.isOverlapping(xPos, zPos)) {
                xPos = this.minX + Math.random() * this.pathWidth * 0.9
                zPos = this.safeZoneStartZ - Math.random() * this.safeZoneLength
            }

            this.lasers[i].setPosition(xPos, yPos, zPos)
        }
    }

    setWidth(width) {
        this.minX = -0.5 * width
        this.pathWidth = width
    }

    tick() {
        for (let i = 0; i < this.numlasers; i++) {
            if (this.lasers[i].mesh.position.z > this.pathEndZ) {
                let xPos = this.minX + 2 + Math.random() * (this.pathWidth - 2)
                let yPos = 3.5
                let zPos = this.safeZoneEndZ - Math.random() * 5

                while (this.isOverlapping(xPos, zPos)) {
                    xPos = this.minX + 2 + Math.random() * (this.pathWidth - 2)
                    zPos = this.safeZoneStartZ - Math.random() * 5
                }

                this.lasers[i].setPosition(xPos, yPos, zPos)
            } else {
                this.lasers[i].mesh.position.z += 0.5
                this.lasers[i].pointLight.position.z += 0.5
            }
        }
    }

    isOverlapping(x, z) {
        for (let i = 0; i < this.numlasers; i++) {
            if (
                this.lasers[i].mesh.position.x - 3 * this.sizeX < x &&
                this.lasers[i].mesh.position.x + 3 * this.sizeX > x &&
                this.lasers[i].mesh.position.z - 3 * this.sizeZ < z &&
                this.lasers[i].mesh.position.z + 3 * this.sizeZ > z
            ) {
                return true
            }
        }
        return false
    }
}

export { LaserManager }
