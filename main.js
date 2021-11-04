let log = [];
class Particle {

    constructor(size, x, y) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.carryCapacity = 10;
        this.amnountCarried = 0;
        this.speed = 1.5;
        this.nextLowestValue = 0;
        this.isDead = false;
        this.stuckCounter = 0;
    }

    show() {

        circle(this.x, this.y, this.size)

    }

    move() {

     
  
        try {

            let dirretion = this.findDirrection();
            //  console.log(heightmap[Math.round(this.x)][Math.round(this.y)]- heightmap[dirretion[2]][dirretion[3]]);
        
            let SoilRemoved = (heightmap[Math.round(this.x)][Math.round(this.y)] - heightmap[dirretion[2]][dirretion[3]]) * 0.5
            heightmap[Math.round(this.x)][Math.round(this.y)] -= SoilRemoved;

            this.amnountCarried += SoilRemoved;

            if (dirretion[0] == 0 & dirretion[1] == 0) {
            
              
                this.stuckCounter += 1;

                if (this.stuckCounter > 5) {

             
                    heightmap[Math.round(this.x)][Math.round(this.y)] += this.amnountCarried *0.9
                    this.isDead = true;
               
                }

                dirretion[0] += random(-2, 2)
                dirretion[1] += random(-2, 2)

            }


            if(this.amnountCarried >=this.carryCapacity){

               
               heightmap[Math.round(this.x)][Math.round(this.y)] += this.amnountCarried *0.9
                this.isDead = true;
            }
       

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

      

        // return an array that has the vector to the lowest position, but also the cords of the lowest position for sendimental removal calculation
        return [lowestX - Math.round(this.x), lowestY - Math.round(this.y), lowestX, lowestY]

    }

    isParticleDead() {

        return this.isDead;

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
                    //    console.log(this.particleArray.length);
                    this.particleArray.splice(i, 1)

                }

                try {
                    if (this.particleArray[i].isParticleDead() == true) {

                        this.particleArray.splice(i, 1)

                    }
                } catch (error) {

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

}


let CanvasWidth = 1024;
let CanvasHeight = 1024;

let heightmap = Array(CanvasWidth).fill().map(() => Array(CanvasHeight).fill(0));
let colormap = Array(CanvasWidth).fill().map(() => Array(CanvasHeight).fill(0));

let frequency = 0.009;
let particleSystem = new ParticleSystem(3000)

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

let ShowParticle = true;

function draw() {

    timer++;

    updateViewArray(heightmap)
   

        particleSystem.moveParticles()


    //   console.log( particleSystem.findAvarageGlobalHeight())
    if (ShowParticle) {
        particleSystem.show()
    }

   if(particleSystem.particleArray.length <=0){
        particleSystem.destroyAllParticles()
        console.log("itterate");
        particleSystem.CreateParticle()

   }

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
    noiseDetail(1, 0.51)

    for (let y = 0; y < array.length; y++) {
        for (let x = 0; x < array[0].length; x++) {
            let height = noise(x * frequency, y * frequency)
            array[y][x] = height * 255;

        }

    }

}

