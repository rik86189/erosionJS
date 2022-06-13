let locationLog = [];
let distribution = []
let TrackCarryCapacity = [];
let trackGlobalCarried = [];
let trackItterations = [];
let trackSpeed = [];
let trackDisposite = [];
class Particle {

    constructor(size, x, y) {
        this.size = size;
        this.x = x;
        this.y = y;
        this.carryCapacity = 1;
        this.MaxCarryCapacity = 40;
        this.amnountCarried = 0;
        this.speed = 1;
        this.nextLowestValue = 0;
        this.isDead = false;
        this.stuckCounter = 0;
        this.water = 30;
        this.maxWater = 30;
        this.speed = 0.00001;
        this.removedSoil = 1
        this.out = 0;
    }

    show() {

        fill(this.speed * 100, this.speed * 100, this.speed * 100)

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

            if (this.speed == 0) {

                this.dispostionOnNeighbours(this.amnountCarried)
                this.isDead = true;

            }

            this.carryCapacity = (this.speed/ Math.sqrt(6 / 5 * 9.81 * 255))* (this.water/this.maxWater) * this.MaxCarryCapacity

         

            //execute the erosion
            this.ErodeAndDisposite(dirretion, heightdiffrence)

            this.x += dirretion[0] * 1
            this.y += dirretion[1] * 1


            //remove water

            if (this.water <= 1) {
                this.dispostionOnNeighbours(this.amnountCarried)
                this.isDead = true;
            } else {
                this.water -= 1;

            }

        } catch (error) {

        }

    }

    ErodeAndDisposite(dirretion) {

        let heightdiffrence = heightmap[Math.round(this.x)][Math.round(this.y)] - heightmap[dirretion[2]][dirretion[3]]


        let SoilRemoved = Math.min(heightdiffrence * 0.2, heightdiffrence)

        this.erodeFromNeigbouts(SoilRemoved)
       //heightmap[Math.round(this.x)][Math.round(this.y)] -= SoilRemoved;

        this.amnountCarried += SoilRemoved;

        if (dirretion[0] == 0 & dirretion[1] == 0) {


            this.stuckCounter += 1;

            //this.dispostionOnNeighbours(this.amnountCarried)



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
            0.0625, 0.125, 0.0625,
            0.125, 0.25, 0.125,
            0.0625, 0.125, 0.0625,
        ];

      let counterX = 0;

        for (let y = Math.round(this.y) - radius; y <= yb; y++) {



            for (let x = Math.round(this.x) - radius; x <= xb; x++) {

                let soilToRemove = input * ErodeWeight[counterX]

                if (x > width || y > height || y < 0 || x < 0) {

                    continue;

                } else if (soilToRemove > 0 && soilToRemove != null && soilToRemove != NaN) {


                    if (heightmap[x][y] - soilToRemove >= 0) {
                        heightmap[x][y] -= soilToRemove;

                        counterX += 1;

                    }else{

                    }

                }

            }

        }
    }


    dispostionOnNeighbours(input) {
        let radius = 1;


        let xb = Math.round(this.x) + radius;
        let yb = Math.round(this.y) + radius;


        let lowestPoint = 100000 //set to high number to ensure first loop will overwrite
        let lowestX = 0;
        let lowestY = 0;
        let ErodeWeight = [
            0.0625, 0.125, 0.0625,
            0.125, 0.25, 0.125,
            0.0625, 0.125, 0.0625,
        ];



        let counterX = 0;


        for (let y = Math.round(this.y) - radius; y <= yb; y++) {



            for (let x = Math.round(this.x) - radius; x <= xb; x++) {

                let soilToRemove = input * ErodeWeight[counterX]
                if (x > width || y > height || y < 0 || x < 0) {

                    continue;

                } else if (soilToRemove > 0 && soilToRemove != null && soilToRemove != NaN) {

                    heightmap[x][y] += soilToRemove;

                    counterX += 1;

                }

            }



        }
    }



    disposit() {


        let diffrence = Math.abs(this.carryCapacity - this.amnountCarried)

        this.amnountCarried -= diffrence

  
        //heightmap[Math.round(this.x)][Math.round(this.y)] += diffrence
        if (diffrence != null && diffrence != NaN) {
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

    logger(time) {


        for (let i = 0; i < this.particleArray.length; i++) {

            locationLog.push([time, this.particleArray[i]])

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
    globalCarried() {

        let container = 0;

        for (let i = 0; i < this.particleArray.length; i++) {

            try {
                container += this.particleArray[i].amnountCarried;
            } catch (error) {

            }


        }

        return container / this.particleArray.length

    }
    globalDisposisted() {

        let container = 0;

        for (let i = 0; i < this.particleArray.length; i++) {

            try {
                container += this.particleArray[i].out;
            } catch (error) {

            }


        }

        return container / this.particleArray.length

    }

}


let CanvasWidth = 512;
let CanvasHeight = 512;




let heightmap = importHeightmap();/* Array(CanvasWidth).fill().map(() => Array(CanvasHeight).fill(0));//*/
let colormap = Array(CanvasWidth).fill().map(() => Array(CanvasHeight).fill(0));
let colormapsecondair = Array(CanvasWidth).fill().map(() => Array(CanvasHeight).fill(0));

let ShowParticle = false;

let frequency = 0.0024;
let particleSystem = new ParticleSystem(100000)

let data1 = [];
let timer = 0;
let c = 0


const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['0-20', '21-40', '41-60', '61-80', '81-100', '101-120', "121-140", "141-160", "161-180", "181-200", "201-220", "221-240", "241-260","null"],
        datasets: [{
            label: '# of Votes',
            data: distribution,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        animation: false,
    }
});


let labels = [0]
const margin =30

const data = {
  labels: labels,
  datasets: [{

    
    borderColor: 'rgb(0, 0, 255)',//blue amount carried right now
    data:trackGlobalCarried,
  },{

//red- carry capacity
    borderColor: 'rgb(255, 0, 0)',
    data: TrackCarryCapacity,
  },{

    
    borderColor: 'rgb(0, 255, 0)',//blue amount carried right now
    data:trackItterations,
  },{

    
    borderColor: 'rgb(255, 255, 0)',//blue amount carried right now
    data:trackDisposite,
  }]
};


const chartColor = "#DCA20E"


const config = {
  type: 'line',
  data: data,
  options: {
    plugins: {
      legend: {
        display: false,
 
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true
              },
              mode: 'xy',
        },
          

      }
    },
    elements:{
        point:{
            radius:0

        },

    },
      animation: false,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: chartColor,
          borderWidth: 3

        },
        ticks: {

          color: chartColor,

        }
      },
      y: {
        grid: {
          drawBorder: false,
          color: chartColor,
        },
        ticks: {

          color: chartColor,

        }
      }
    }
  }
};

const myChart2 = new Chart(
  document.getElementById('myChart2'),

  config
);




















function setup() {

    c = createCanvas(CanvasWidth, CanvasHeight);

    pixelDensity(1)
    background(1);

   /// generateHeightMap(heightmap);




    particleSystem.CreateParticle()



    // particleSystem.show()
    //  CreateParticle()
    //  saveCanvas(c,"not eroded","png")
}

let itteration = 0

function draw() {


    timer++;


    particleSystem.moveParticles()


    //console.log(particleSystem.globalWaterAverage());
    if(timer % 25 == 0){
        console.log("hi");
        updateViewArray(heightmap)
      //  particleSystem.show()
    }


    trackGlobalCarried.push(particleSystem.globalCarried())
    TrackCarryCapacity.push(particleSystem.findAvarageGlobalCarryCapacity());  
    trackDisposite.push(particleSystem.globalDisposisted())
    histoGram(heightmap)

    myChart.update()

    labels.push(labels.length +1)
    trackItterations.push(itteration)
    myChart2.update()

    //console.log(    AveraheHeight(heightmap));

    //console.log(AveraheHeight(heightmap) );
    //console.log(particleSystem.findAvarageGlobalHeight());
    //console.log(particleSystem.globalSpeed());
    
   


    if (ShowParticle) {
 
    }

    if (particleSystem.particleArray.length <= 0) {

        itteration += 1;
        //console.log(itteration);
    

        particleSystem.destroyAllParticles()

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
    noiseDetail(16, 0.4)

    let exposure = 0.5;

    for (let y = 0; y < array.length; y++) {
        for (let x = 0; x < array[0].length; x++) {
            let height = noise(x * (frequency), y * (frequency)) * 1


            array[y][x] = Math.pow(height, 2) * 255;

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


    return counter / (heightmap.length * heightmap.length)


}

function histoGram(heightmap) {

    let array = heightmap;

    let counterCattagorie1 = 0;
    let counterCattagorie2 = 0;
    let counterCattagorie3 = 0;
    let counterCattagorie4 = 0;
    let counterCattagorie5 = 0;
    let counterCattagorie6 = 0;
    let counterCattagorie7 = 0;
    let counterCattagorie8 = 0;
    let counterCattagorie9 = 0;
    let counterCattagorie10 = 0;
    let counterCattagorie11 = 0;
    let counterCattagorie12 = 0;
    let counterCattagorie13 = 0;
    let counterCattagorie14 = 0

    for (let i = 0; i < array.length; i++) {
        for (let x = 0; x < array.length; x++) {


            if (array[x][i] > 0 && array[x][i] < 20) {

                counterCattagorie1 += 1;
                distribution[0] =  counterCattagorie1

            } else if (array[x][i] > 21 && array[x][i] < 40) {

                counterCattagorie2 += 1;
                distribution[1] = counterCattagorie2;

            } else if (array[x][i] > 41 && array[x][i] < 60) {

                counterCattagorie3 += 1;
                distribution[2] = counterCattagorie3;

            } else if (array[x][i] > 61 && array[x][i] < 80) {

                counterCattagorie4 += 1;
                distribution[3] = counterCattagorie4;

            } else if (array[x][i] > 81 && array[x][i] < 100) {

                counterCattagorie5 += 1;
                distribution[4] = counterCattagorie5;

            } else if (array[x][i] > 101 && array[x][i] < 120) {

                counterCattagorie6 += 1;
                distribution[5] = counterCattagorie6;

            } else if (array[x][i] > 121 && array[x][i] < 140) {

                counterCattagorie7 += 1;
                distribution[6] = counterCattagorie7;

            } else if (array[x][i] > 141 && array[x][i] < 160) {

                counterCattagorie8 += 1;
                distribution[7] = counterCattagorie8;

            } else if (array[x][i] > 161 && array[x][i] < 180) {

                counterCattagorie9 += 1;
                distribution[8] = counterCattagorie9;

            } else if (array[x][i] > 181 && array[x][i] < 200) {

                counterCattagorie10 += 1;
                distribution[9] = counterCattagorie10;

            } else if (array[x][i] > 201 && array[x][i] < 220) {

                counterCattagorie11 += 1;
                distribution[10] = counterCattagorie11;

            } else if (array[x][i] > 221 && array[x][i] < 240) {

                counterCattagorie12 += 1;
                distribution[11] = counterCattagorie12;

            } else if (array[x][i] > 241 ) {

                counterCattagorie13 += 1;
                distribution[12] = counterCattagorie13;
            }else if(array[x][i] < 0 ||array[x][i]== NaN  ){
                
                counterCattagorie14 +=1
                distribution[13] = counterCattagorie14

            }

        }

    }




}