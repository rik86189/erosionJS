let locationLog = [];







class Particle {

    constructor(size, x, y) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.carryCapacity = 1;
        this.MaxCarryCapacity = 2;
        this.amnountCarried = 0;
        this.speed = 1;
        this.nextLowestValue = 0;
        this.isDead = false;
        this.stuckCounter = 0;
        this.water = 60;
        this.maxWater = 60;
        this.speed = 0.00001;
        this.removedSoil = 1
    }

    show() {

        fill(this.carryCapacity,this.carryCapacity,this.carryCapacity)

        noStroke()
        circle(this.x, this.y, this.size)

    }

    move() {


        try {


            let dirretion = this.findDirrection();


            // calculate height diffrence
            let heightdiffrence = heightmap[Math.round(this.x)][Math.round(this.y)] - heightmap[dirretion[2]][dirretion[3]]
            //calculate speed   

        

            this.speed = Math.sqrt(6 / 5 * 9.81 * heightdiffrence)


            if(this.speed == 0){

                
                this.dispostionOnNeighbours(this.amnountCarried)

                this.isDead = true;

            }


            this.carryCapacity = this.speed * this.water


            //execute the erosion
               this.ErodeAndDisposite(dirretion, heightdiffrence)

       

            this.x += dirretion[0] * 1
            this.y += dirretion[1] * 1


            //remove water
            
            if (this.water <= 1) {
                heightmap[Math.round(this.x)][Math.round(this.y)] += this.amnountCarried
                this.isDead = true;
            }else{
                this.water -= 1;

            }

        } catch (error) {
            


        }

    }

    ErodeAndDisposite(dirretion) {

        let heightdiffrence = heightmap[Math.round(this.x)][Math.round(this.y)] - heightmap[dirretion[2]][dirretion[3]]


        let SoilRemoved = Math.min(this.water * this.speed, heightdiffrence * 0.01)

   

         this.erodeFromNeigbouts(SoilRemoved)



  
       //heightmap[Math.round(this.x)][Math.round(this.y)] -= SoilRemoved;


     
        this.amnountCarried += SoilRemoved;


        if (dirretion[0] == 0 & dirretion[1] == 0) {


            this.stuckCounter += 1;

            this.dispostionOnNeighbours(this.amnountCarried)


            this.disposit()

            //check if particle is stuck when a threshold is reached
            if (this.stuckCounter > 10) {

                //disposite


                this.dispostionOnNeighbours(this.amnountCarried)

                this.isDead = true;

            } else {
                //otherwise pick a random dirrection
                dirretion[1] += random(-1, 1)
                dirretion[0] += random(-1, 1)
            }



        }


        if (this.amnountCarried >= this.carryCapacity) {

            this.disposit()

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

        //     let vector2D = [Math.round(this.x) - lowestX, Math.round(this.y) - lowestY]



        // return an array that has the vector to the lowest position, but also the cords of the lowest position for sendimental removal calculation
        return [lowestX - Math.round(this.x), lowestY - Math.round(this.y), lowestX, lowestY]

    }

    isParticleDead() {

        return this.isDead;

    }


    erodeFromNeigbouts(input) {
        let radius = 1;


        let xb = Math.round(this.x) + radius;
        let yb = Math.round(this.y) + radius;


        let lowestPoint = 100000 //set to high number to ensure first loop will overwrite
        let lowestX = 0;
        let lowestY = 0;
        let ErodeWeight = [
            0.0625,0.125,0.0625,
            0.0625,0.25,0.125,
            0.0625,0.125,0.0625,
        ];



        let counterX = 0;


        for (let y = Math.round(this.y) - radius; y <= yb; y++) {



            for (let x = Math.round(this.x) - radius; x <= xb; x++) {
               
                let soilToRemove = input * ErodeWeight[counterX]
                if (x > width || y > height || y < 0 || x < 0) {
               
                    continue;

                }else if(soilToRemove >0 &&soilToRemove != null &&soilToRemove != NaN){

                    heightmap[x][y] -= soilToRemove;

                    counterX +=1;
    

                }

            
                
     

        
                
            }
         

        
        }
    }


    dispostionOnNeighbours(input) {
        let radius = 1;


        let xb = Math.round(this.x) + radius;
        let yb = Math.round(this.y) + radius;

        locationLog.push(input)

        let lowestPoint = 100000 //set to high number to ensure first loop will overwrite
        let lowestX = 0;
        let lowestY = 0;
        let ErodeWeight = [
            0.0625,0.125,0.0625,
            0.0625,0.25,0.125,
            0.0625,0.125,0.0625,
        ];



        let counterX = 0;


        for (let y = Math.round(this.y) - radius; y <= yb; y++) {



            for (let x = Math.round(this.x) - radius; x <= xb; x++) {
                
                let soilToRemove = input * ErodeWeight[counterX]
                if (x > width || y > height || y < 0 || x < 0) {
                   
                    continue;

                }else if(soilToRemove >0 &&soilToRemove != null &&soilToRemove != NaN){
        
                    heightmap[x][y] += soilToRemove;
    
                    counterX +=1;
             

                }
            


                
            }
         

        
        }
    }



    disposit() {


        //check if it is above the carry capacity

        //Instead of killing the particle emediatly, disposite a % to make the simulation more continuis


        //replace maxCarryCapacity to get nice star sky
        let diffrence =   Math.abs(this.carryCapacity -this.amnountCarried) 


        
        this.amnountCarried -= diffrence
        
        
        //heightmap[Math.round(this.x)][Math.round(this.y)] += diffrence
        if(diffrence != null && diffrence != NaN){
            this.dispostionOnNeighbours(diffrence)

        }

        //this.isDead = true;

        

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
            let particle = new Particle(2, randomX, randomY)

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

                if (this.particleArray[i].x >= width - 3 || this.particleArray[i].y >= height - 3 || this.particleArray[i].x <= 3 || this.particleArray[i].y <= 3) {
                // console.log(this.particleArray.length);
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

    logger(time){

        
        for (let i = 0; i < this.particleArray.length; i++) {

            locationLog.push( [time,this.particleArray[i]])

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


    findAvarageGlobalCarryCapacity() {

        let container = 0;

        for (let i = 0; i < this.particleArray.length; i++) {

            try {
                container += this.particleArray[i].carryCapacity;
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

    globalWaterAverage() {

        let container = 0;

        for (let i = 0; i < this.particleArray.length; i++) {

            try {
                container += this.particleArray[i].water;
            } catch (error) {

            }


        }

        return container / this.particleArray.length

    }
    globalSpeed() {

        let container = 0;

        for (let i = 0; i < this.particleArray.length; i++) {

            try {
                container += this.particleArray[i].speed;
            } catch (error) {

            }


        }

        return container / this.particleArray.length

    }

}


let CanvasWidth = 512;
let CanvasHeight = 512;




let heightmap =Array(CanvasWidth).fill().map(() => Array(CanvasHeight).fill(0)); //importHeightmap();/* */
let colormap = Array(CanvasWidth).fill().map(() => Array(CanvasHeight).fill(0));
let colormapsecondair = Array(CanvasWidth).fill().map(() => Array(CanvasHeight).fill(0));

let ShowParticle = true;

let frequency = 0.003;
let particleSystem = new ParticleSystem(100000)

let data1 = [];
let timer = 0;
let c = 0





function setup() {

    c = createCanvas(CanvasWidth, CanvasHeight);

    pixelDensity(1)
    background(1);

    generateHeightMap(heightmap);




    particleSystem.CreateParticle()



    // particleSystem.show()
    //  CreateParticle()
    //  saveCanvas(c,"not eroded","png")
}

let itteration =0 

function draw() {

    timer++;

    updateViewArray(heightmap)

    if (timer == 2) {
        

    }

    particleSystem.moveParticles()
      //console.log(particleSystem.globalWaterAverage());


    //console.log(    AveraheHeight(heightmap));


   // console.log(particleSystem.globalSpeed());


    if (ShowParticle) {
        particleSystem.show()
    }

    if (particleSystem.particleArray.length <= 0) {


        itteration += 1;
        console.log(itteration);

        particleSystem.destroyAllParticles()
 
        particleSystem.CreateParticle()

    }
    if(itteration ==100){
            noLoop();



    }


}



let partileVison = false;
function updateViewArray(array) {

    loadPixels();

    let i = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {

            if (partileVison) {

                pixels[i + 0] = colormapsecondair[x][y]
                pixels[i + 1] = colormapsecondair[x][y]
                pixels[i + 2] = colormapsecondair[x][y]



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
    noiseDetail(10, 0.51)

    let exposure = 0.5;

    for (let y = 0; y < array.length; y++) {
        for (let x = 0; x < array[0].length; x++) {
            let height =    noise(x * (frequency), y * (frequency)) * 1 


            array[y][x] = Math.pow(height, 5) * 255;

        }

    }

}


function AveraheHeight(heightmap) {

    let array = heightmap;

    let counter = 0;

    for (let i = 0; i < array.length; i++) {
        for (let x = 0; x < array.length; x++) {

            counter += array[x][i]

        }

    }


    return counter / (512 * 512)


}

