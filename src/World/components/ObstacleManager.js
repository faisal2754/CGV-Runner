import { Obstacle } from './Obstacle.js'

class ObstacleManager {
    constructor(
        numObstacles,
        sizeX,
        sizeY,
        sizeZ,
        stepSize,
        safeZoneStartZ,
        safeZoneEndZ,
        pathEndZ,
        mesh1,
        mesh2,
        mesh3,
        mesh4,
        mesh5
    ) {
        this.numObstacles = 5
        this.sizeX = sizeX
        this.sizeY = sizeY
        this.sizeZ = sizeZ
        this.stepSize = stepSize
        this.safeZoneStartZ = safeZoneStartZ
        this.safeZoneEndZ = safeZoneEndZ
        this.pathEndZ = pathEndZ
        this.pathWidth = 10
        this.minX = -5

        this.obstacles = []
        this.obstacles.push(new Obstacle(sizeX, sizeY, sizeZ, mesh1))
        this.obstacles.push(new Obstacle(sizeX, sizeY, sizeZ, mesh2))
        this.obstacles.push(new Obstacle(sizeX, sizeY, sizeZ, mesh3))
        this.obstacles.push(new Obstacle(sizeX, sizeY, sizeZ, mesh4))
        this.obstacles.push(new Obstacle(sizeX, sizeY, sizeZ, mesh5))

        // for (let i = 0; i < this.numObstacles; i++) {
        //     this.obstacles.push(new Obstacle(sizeX, sizeY, sizeZ, mesh))
        // }

        let safeZoneLength = Math.abs(safeZoneStartZ - safeZoneEndZ)
        this.safeZoneLength = safeZoneLength
        for (let i = 0; i < this.numObstacles; i++) {
            let xPos = this.minX + Math.random() * this.pathWidth * 0.9
            let yPos = 3.5
            let zPos = safeZoneStartZ - Math.random() * safeZoneLength

            while (this.isOverlapping(xPos, zPos)) {
                xPos = this.minX + Math.random() * this.pathWidth * 0.9
                zPos = this.safeZoneStartZ - Math.random() * this.safeZoneLength
            }

            this.obstacles[i].setPosition(xPos, yPos, zPos)
        }
    }

    setWidth(width) {
        this.minX = -0.5 * width
        this.pathWidth = width
    }

    tick() {
        for (let i = 0; i < this.numObstacles; i++) {
            if (this.obstacles[i].mesh.position.z > this.pathEndZ) {
                let xPos = this.minX + 2 + Math.random() * (this.pathWidth - 2)
                let yPos = 3.5
                let zPos = this.safeZoneEndZ - Math.random() * 5

                while (this.isOverlapping(xPos, zPos)) {
                    xPos = this.minX + 2 + Math.random() * (this.pathWidth - 2)
                    zPos = this.safeZoneStartZ - Math.random() * 5
                }

                this.obstacles[i].setPosition(xPos, yPos, zPos)
            } else {
                this.obstacles[i].mesh.position.z += 0.5
                this.obstacles[i].pointLight.position.z += 0.5
            }
        }
    }

    isOverlapping(x, z) {
        for (let i = 0; i < this.numObstacles; i++) {
            if (
                this.obstacles[i].mesh.position.x - 3 * this.sizeX < x &&
                this.obstacles[i].mesh.position.x + 3 * this.sizeX > x &&
                this.obstacles[i].mesh.position.z - 3 * this.sizeZ < z &&
                this.obstacles[i].mesh.position.z + 3 * this.sizeZ > z
            ) {
                return true
            }
        }
        return false
    }
}

export { ObstacleManager }
