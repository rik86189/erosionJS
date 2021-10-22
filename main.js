class Particle {

    constructor(size, x, y) {
        this.size = size;
        this.x = x;
        this.y = y;


    }

    show() {



        circle(this.x, this.y, this.size)

    }
    move() {



        try {
            let dirrection = this.findLowestNeighbour()
           
            

            switch (dirrection) {
                case 0:
                

                        this.x += 0//random(-1, 1);
                        this.y += 0//random(-1, 1);
                   
                    break;
                case 1:
             
                    this.x += -0.5;
                    this.y +=0;
               
                    break;
                case 2:
                
                    this.x += 0.5
                    this.y +=0;
                   
                    break;
                case 3:
         
                    this.x += 0;
                    this.y +=0.5;
                
                    break;
                case 4:
                 
                    this.x += 0;
                    this.y += -0.5;
                    break;
                case 5:
                    
                    this.x += 0.1;
                    this.y += -0.5;
                  
                    break;
                case 6:
          
                    this.x += 0.5;
                    this.y += 0.5;
                  
                    break;
                case 7:
                
                    this.x += -0.5;
                    this.y += -0.5;
                    break;
                case 8:
               
                    this.x += 0.5;
                    this.y += -0.5;
                  
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



            console.log(lowestPoint);
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
            let particle = new Particle(10, randomX, randomY)

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
                    console.log(this.particleArray.length);
                    this.particleArray.splice(i, 1)

                }


                if (this.particleArray[i] != null) {

                    this.particleArray[i].move()
                  
                }

            }


        }

    }

}


let CanvasWidth = 2000;
let CanvasHeight = 2000;

let heightmap = Array(CanvasWidth).fill().map(() => Array(CanvasHeight).fill(0));
let itterations = 1000000;
let frequency = 0.004;
let particleSystem = new ParticleSystem(10000)

let frequencySlider;

function setup() {

    createCanvas(CanvasWidth, CanvasHeight);

    background(0);

    generateHeightMap(heightmap);

    // fill(204, 101, 192,);
    particleSystem.CreateParticle(10000)
    particleSystem.moveParticles()





    particleSystem.show()
    //  CreateParticle()
}

function draw() {

   
 
    UpdateArray(heightmap)
     particleSystem.moveParticles()
     
    particleSystem.show()
 



}

function UpdateArray(array) {

    loadPixels();

    let i = 0;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {


            pixels[i + 0] = array[y][x];
            pixels[i + 1] = array[y][x];
            pixels[i + 2] = array[y][x];

            i += 4;
        }
    }



    updatePixels();

}

function generateHeightMap(array) {


    noiseDetail(1, 0.51)

    for (let x = 0; x < array.length; x++) {
        for (let y = 0; y < array[0].length; y++) {
            let height = noise(x * frequency, y * frequency)
            array[x][y] = height * 255;

        }

    }

}

