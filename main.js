class Particle {

    constructor(size, x, y) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.speed = 1.5;

    }

    show() {



        circle(this.x, this.y, this.size)

    }
    move() {



        try {
            let dirrection = this.findLowestNeighbour()



            switch (dirrection) {
                case 0:

                    //random
                    this.x += random(-1, 1);
                    this.y += random(-1, 1);

                    break;
                case 1:
                    //left

                    this.x += -this.speed;
                    this.y += 0;

                    break;
                case 2:
                    //right
                    this.x += this.speed
                    this.y += 0;

                    break;
                case 3:
                    //up
                    this.x += 0;
                    this.y += this.speed;

                    break;
                case 4:
                    //dpwn
                    this.x += 0;
                    this.y += -this.speed;
                    break;
                case 5:
                    //up left
                    this.x += this.speed;
                    this.y += -this.speed;

                    break;
                case 6:
                    //up  right 
                    this.x += this.speed;
                    this.y += this.speed;

                    break;
                case 7:
                    //down left
                    this.x += -this.speed;
                    this.y += -this.speed;
                    break;
                case 8:
                    // down right 
                    this.x += this.speed;
                    this.y += -this.speed;

                    break;
            }



        } catch (error) {


            console.log("failed on:" + Math.round(this.x));
            console.log("failed on:" + Math.round(this.y));
        }

    }

    findLowestNeighbour() {


        let lowestPoint = Math.min(heightmap[Math.round(this.x)][Math.round(this.y)], heightmap[Math.round(this.x) - 1][Math.round(this.y)], heightmap[Math.round(this.x) + 1][Math.round(this.y)], heightmap[Math.round(this.x)][Math.round(this.y) + 1],
            heightmap[Math.round(this.x)][Math.round(this.y) + 1], heightmap[Math.round(this.x)][Math.round(this.y) - 1], heightmap[Math.round(this.x) - 1][Math.round(this.y) + 1], heightmap[Math.round(this.x) + 1][Math.round(this.y) + 1],
            heightmap[Math.round(this.x) - 1][Math.round(this.y) - 1], heightmap[Math.round(this.x) + 1][Math.round(this.y) - 1]);




        let dirrection = 0;



        //center
        if (heightmap[Math.round(this.x)][Math.round(this.y)] == lowestPoint) {

            dirrection = 0;

        } else if (heightmap[Math.round(this.x) - 1][Math.round(this.y)] == lowestPoint) {
            //left
            dirrection = 1;

        } else if (heightmap[Math.round(this.x) + 1][Math.round(this.y)] == lowestPoint) {
            //right
            dirrection = 2;

        } else if (heightmap[Math.round(this.x)][Math.round(this.y) + 1] == lowestPoint) {
            //up
            dirrection = 3;
        } else if (heightmap[Math.round(this.x)][Math.round(this.y) - 1] == lowestPoint) {
            //down
            dirrection = 4;
        } else if (heightmap[Math.round(this.x) - 1][Math.round(this.y) + 1] == lowestPoint) {
            //up left
            dirrection = 5;

        } else if (heightmap[Math.round(this.x) + 1][Math.round(this.y) + 1] == lowestPoint) {
            //up right
            dirrection = 6;

        } else if (heightmap[Math.round(this.x) - 1][Math.round(this.y) - 1] == lowestPoint) {
            //down left
            dirrection = 7;


        } else if (heightmap[Math.round(this.x) + 1][Math.round(this.y) - 1] == lowestPoint) {
            //down right
            dirrection = 8;

        }


        return dirrection;

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
            let particle = new Particle(5, randomX, randomY)

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

}


let CanvasWidth = 512;
let CanvasHeight = 512;

let heightmap = Array(CanvasWidth).fill().map(() => Array(CanvasHeight).fill(0));
let itterations = 1000000;
let frequency = 0.04;
let particleSystem = new ParticleSystem(100)

let frequencySlider;
let data1 = [];



function setup() {

    createCanvas(CanvasWidth, CanvasHeight);

    background(1);

    generateHeightMap(heightmap);
        console.log(JSON.stringify(heightmap));

    // fill(204, 101, 192,);
     particleSystem.CreateParticle()
     particleSystem.moveParticles()





    particleSystem.show()
    //  CreateParticle()
}

function draw() {


    updateViewArray(heightmap)




    particleSystem.moveParticles()
    // console.log( particleSystem.findAvarageGlobalHeight());
     particleSystem.show()




}

function updateViewArray(array) {

    loadPixels();

    let i = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {


            pixels[i + 0] = (255-array[y][x])*0.5
            pixels[i + 1] = (255-array[y][x])*0.5
            pixels[i + 2] = (255-array[y][x])*0.5

            i += 4;
        }
    }



    updatePixels();

}

function generateHeightMap(array) {

    noiseSeed(1000)
    noiseDetail(1, 0.51)

    for (let y = 0; y < array.length; y++) {
        for (let x = 0; x < array[0].length; x++) {
            let height = noise(x * frequency, y * frequency)
            array[x][y] = height*255;

        }

    }

}

