function make2DArray(cols, rows) {
    let arr = new Array(cols)

    for(let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows)
    }

    return arr
}

class Terrain {
    constructor(scale, w, h) {
        this.scale = scale // cell size
        this.w = w // cell width
        this.h = h // cell height

        // number of rows and cols
        this.cols = floor(w/scale)
        this.rows = floor(h/scale)

        // use an array to store all the height values
        this.z = make2DArray(this.cols, this.rows)

        // perlin noise arg
        this.zOff = 0
    }

    // Calculate the height vals based off a neural network
    calculate() {
        let xOff = 0
        for(let i = 0; i < this.cols; i++) {
            let yOff = 0
            for(let j = 0; j < this.rows; j++) {
                this.z[i][j] = map(noise(xOff, yOff, this.zOff), 0, 1, -120, 120)
                yOff += 0.1
            }
            xOff += 0.1
        }
        this.zOff += 0.01
    }

    // Render terrain as a grid of quads
    render() {
        // Every cell is an individual quad
        for(let x = 0; x < this.z.length - 1; x++) {
            beginShape(QUAD_STRIP)
            for(let y = 0; y < this.z[x].length; y++) {
                stroke(0)
                let currentElevation = this.z[x][y]
                let currentShade = map(currentElevation, -120, 120, 0, 255)
                fill(currentShade, 255)
                let xCoordinate = x * this.scale - this.w/2
                let yCoordinate = y * this.scale - this.h/2
                vertex(xCoordinate, yCoordinate, this.z[x][y])
                vertex(xCoordinate + this.scale, yCoordinate, this.z[x + 1][y])
            }
            endShape()
        }
    }
}