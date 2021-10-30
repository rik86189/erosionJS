let log = [];


class Particle {

    constructor(size, x, y) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.speed = 1.5;
        this.nextLowestValue = 0;
    }

    show() {



        circle(this.x, this.y, this.size)

    }
    move() {

        //  console.log("Partile: "+heightmap[Math.round(this.y)][Math.round(this.x)]);

        try {


            let dirretion = this.findDirrection();

            // console.log(dirretion);

            //  colormap[Math.round(this.x)][Math.round(this.y)] = heightmap[Math.round(this.x)][Math.round(this.y)]

            this.x += dirretion[0] * 1
            this.y += dirretion[1] * 1





        } catch (error) {



        }

    }

    findDirrection() {

        let radius = 1;

        let xb = Math.round(this.x) + radius;
        let yb = Math.round(this.y) + radius;
        let lowestPoint = 100000 //set to high number to ensure first loop will overwrite
        let lowestX = 0;
        let lowestY = 0;



        for (let y = Math.round(this.y) - radius; y <= yb; y++) {
            for (let x = Math.round(this.x) - radius; x <= xb; x++) {
                if (x > width || y > height || y < 0 || x < 0) {
                    continue;

                }

                if (heightmap[x][y] < lowestPoint) {

                    lowestPoint = heightmap[x][y];
                    lowestX = x;
                    lowestY = y


                }


            }

        }

        let vector2D = [Math.round(this.x) - lowestX, Math.round(this.y) - lowestY]



        return [ lowestX - Math.round(this.x) , lowestY - Math.round(this.y) ]

    }

    


}

class ParticleSystem {
    constructor(amount, texture) {
        this.particleAmount = amount;
        this.particleArray = []
    }

    CreateParticle() {


        for (let i = 0; i < this.particleAmount; i++) {

            let randomX = random(0, width)
            let randomY = random(0, height)
            let particle = new Particle(1, randomX, randomY)

            this.particleArray.push(particle)

        }
    }

    show() {

        for (let i = 0; i < this.particleArray.length; i++) {


            this.particleArray[i].show()

        }

    }
    moveParticles() {

        if (this.particleArray != null) {

            for (let i = 0; i < this.particleArray.length; i++) {

                if (this.particleArray[i].x >= width - 2 || this.particleArray[i].y >= height - 2 || this.particleArray[i].x <= 2 || this.particleArray[i].y <= 2) {
                    //    console.log(this.particleArray.length);
                    this.particleArray.splice(i, 1)

                }


                if (this.particleArray[i] != null) {

                    this.particleArray[i].move()

                }

            }


        }

    }

    findAvarageGlobalHeight() {

        let container = 0;

        for (let i = 0; i < this.particleArray.length; i++) {

            try {
                container += heightmap[Math.round(this.particleArray[i].x)][Math.round(this.particleArray[i].y)];
            } catch (error) {

            }


        }

        return container / this.particleArray.length

    }

    destroyAllParticles() {

        for (let index = 0; index < this.particleArray.length; index++) {
            this.particleArray.splice(index, 1)

        }

    }
    onMouseButton(){


        let particle = new Particle(1, mouseX, mouseY)

        this.particleArray.push(particle)



    }

}


let CanvasWidth = 2048;
let CanvasHeight = 2048;

let heightmap = Array(CanvasWidth).fill().map(() => Array(CanvasHeight).fill(0));
let colormap = Array(CanvasWidth).fill().map(() => Array(CanvasHeight).fill(0));


let frequency = 0.004;
let particleSystem = new ParticleSystem((CanvasWidth*CanvasHeight)/100)


let data1 = [];

let timer = 0;

function setup() {

    createCanvas(CanvasWidth, CanvasHeight);
    pixelDensity(1)
    background(1);

    generateHeightMap(heightmap);



    // console.log(JSON.stringify(heightmap));

    // fill(204, 101, 192,);
    particleSystem.CreateParticle()





   // particleSystem.show()
    //  CreateParticle()
}

function draw() {


    timer++;




    updateViewArray(heightmap)
    if (timer <= 200) {

        particleSystem.moveParticles()


    }
    console.log( particleSystem.findAvarageGlobalHeight())
 //   particleSystem.show()
}
















let partileVison = false;
function updateViewArray(array) {

    loadPixels();

    let i = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            if (partileVison) {
                colormap[x][y]
                colormap[x][y]
                colormap[x][y]



            } else {
                pixels[i + 0] = array[x][y]
                pixels[i + 1] = array[x][y]
                pixels[i + 2] = array[x][y]

            }

            i += 4;
        }
    }



    updatePixels();

}

function generateHeightMap(array) {

    noiseSeed(1000)
    noiseDetail(2, 0.51)

    for (let y = 0; y < array.length; y++) {
        for (let x = 0; x < array[0].length; x++) {
            let height = noise(x * frequency, y * frequency)
            array[y][x] = height * 255;

        }

    }

}

