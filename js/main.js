const gameX = 10;
const gameY = 20;

const nextX= 5;
const nextY = 4;
const nextYStart = 5;

const cubeSize = 25;
const cubeBorderSize = 2;
const spacing = 1;

const border =2;
const trackSize = 4;

const backgroundOpacity = .2;
const backgroundColor = '#a2b6ab';

const gameWidth = spacing + gameX*cubeSize + gameX*spacing;
const fullWidth = border*3 + gameX*cubeSize + gameX*spacing + nextX*cubeSize + nextX*spacing + spacing*2;
const fullHeight = border*2 + gameY*cubeSize + gameY*spacing + spacing;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

canvas.width = fullWidth;
canvas.height = fullHeight;

let tp = 0;

class View{
    constructor() {
        this.render = this.render.bind(this);
    }
}

View.prototype.renderGameBox= function(){
    for(let i = 0; i < gameX; i++) {
        for(let j = 0; j < gameY; j++) {
            this.renderCub(i, j, backgroundOpacity);
        }
    }
}
View.prototype.renderNextBox = function(life) {
    let curentLife = 0;
    for(let i = 0; i < nextX; i++) {
        for(let j = 0; j < nextY; j++) {
            if(j == nextY -1 ){
                if(curentLife < life){
                    this.renderCub(i, j, 1, false);
                    curentLife++;
                }
                else{
                    this.renderCub(i, j, backgroundOpacity, false);
                }
            }
            else{
                this.renderCub(i, j, backgroundOpacity, false);
            }
        }
    }
}
View.prototype.renderBorder = function() {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(fullWidth, 0);
    ctx.lineTo(fullWidth, fullHeight);
    ctx.lineTo(0, fullHeight);
    ctx.lineTo(0, border);
    ctx.lineTo(border, border);
    ctx.lineTo(border, fullHeight - border);

    ctx.lineTo(border + gameWidth, fullHeight - border);
    ctx.lineTo(border + gameWidth, border);
    ctx.lineTo(border + gameWidth + border, border);
    ctx.lineTo(border + gameWidth + border, fullHeight - border);

    ctx.lineTo(fullWidth - border, fullHeight - border);
    ctx.lineTo(fullWidth - border, border);
    ctx.lineTo(0, border);
    ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.fill();
}
View.prototype.renderCub = function(x, y, opacity = 1 , game = true) {
    let left = border + spacing;
    let top = border + spacing;

    if(!game) {
        left += gameX*cubeSize + gameX*spacing + border + spacing;
        top += nextYStart*cubeSize + nextYStart*spacing;
    }

    if(x > 0) {
        left += x*cubeSize + x*spacing;
    }
    if(y > 0) {
        top += y*cubeSize + y*spacing;
    }

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(left, top, cubeSize, cubeSize);

    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left + cubeSize, top);
    ctx.lineTo(left + cubeSize, top + cubeSize);
    ctx.lineTo(left, top + cubeSize);
    ctx.lineTo(left, top + cubeBorderSize);
    ctx.lineTo(left + cubeBorderSize, top + cubeBorderSize);
    ctx.lineTo(left + cubeBorderSize, top + cubeSize - cubeBorderSize);
    ctx.lineTo(left + cubeSize - cubeBorderSize, top + cubeSize - cubeBorderSize);
    ctx.lineTo(left + cubeSize - cubeBorderSize, top + cubeBorderSize);
    ctx.lineTo(left, top + cubeBorderSize);
    ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0," + opacity + ")";
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(left + cubeBorderSize*2, top + cubeBorderSize*2);
    ctx.lineTo(left + cubeSize - cubeBorderSize*2, top + cubeBorderSize*2);
    ctx.lineTo(left + cubeSize - cubeBorderSize*2, top + cubeSize - cubeBorderSize*2);
    ctx.lineTo(left + cubeBorderSize*2, top + cubeSize - cubeBorderSize*2);
    ctx.closePath();
    ctx.fillStyle = "rgba(0,0,0," + opacity + ")";
    ctx.fill();
}
View.prototype.renderTrack = function(pos = 0) {
    //trackSize
    const renderOne = (x) => {
        for(let y = 0; y < gameY; y++) {
            this.renderCub(x, y, (y +tp) % trackSize === 0 ? backgroundOpacity : 1);
        }
    };
    renderOne(0);
    renderOne(gameX - 1);
}
View.prototype.renderObjectMatrix = function(x, y, matrix, game = true) {
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            const variant = matrix[i][j];
            variant === 1 && this.renderCub(x + j, y + i);
        }
    }
}
View.prototype.points = function(score,goal,speed){
    ctx.fillStyle = "#000";
    ctx.font = "20px Verdana";

    ctx.fillText("Score",fullWidth - ((cubeSize *3) + cubeSize/2) , cubeSize);
    ctx.fillText(score,fullWidth - ( score ==0? (cubeSize *3) - cubeSize/2 : (cubeSize *3)) , cubeSize *2);

    ctx.fillText("Hi-Score",fullWidth - ((cubeSize *4) -10 + cubeSize/2) , cubeSize *4);
    if( score > model.getHiScore()){
        ctx.fillText(score,fullWidth - ( score ==0? (cubeSize *3) - cubeSize/2 : (cubeSize *3)) , cubeSize *5);
        model.setHiScore(score)
    }
    else{
        ctx.fillText(model.getHiScore(),fullWidth - ( score ==0? (cubeSize *3) - cubeSize/2 : (cubeSize *3)) , cubeSize *5);
    }

    ctx.fillText("Speed",(fullWidth - cubeSize *3) - cubeSize /2 , fullHeight /2 + cubeSize);
    ctx.fillText(speed,(fullWidth - cubeSize *3) + cubeSize/2 , fullHeight /2 + cubeSize *2);

    ctx.fillText("Goal",(fullWidth - cubeSize *3) - cubeSize /3 , fullHeight - cubeSize*4 );
    ctx.fillText(`${goal}/100`,(fullWidth - cubeSize *4) + cubeSize/2 , fullHeight  - cubeSize *3);

    let img = document.getElementById("img");

    ctx.drawImage(img, fullHeight - (gameWidth - 10),fullHeight  - cubeSize *2);

}
View.prototype.render = function() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, fullWidth, fullHeight);
    this.renderBorder();
    this.renderGameBox();
    this.renderNextBox(model.getlife());
    this.renderTrack(tp++);
    let carData = model.render();
    this.renderObjectMatrix(carData.x,carData.y,carData.car);
    model.RenderBarier();
    let pointsCounter = model.getPoints();
    this.points( pointsCounter.score,pointsCounter.goal,pointsCounter.speed);
    let barier = model.setbarier();
    for(let i =0; i<barier.items.length;i++){
        let item = barier.items[i];
        this.renderObjectMatrix( item.x,  item.y, barier.view);
    }
}
View.prototype.crash = function(){
    for(let i = 0; i < gameX; i++) {
        for(let j = 0; j < gameY; j++) {
            this.renderCub(i, j, 1);
        }
    }
}
let view = new View();




let Controller = function(){
    addEventListener("keydown",this.objcontroller);
}
Controller.prototype.objcontroller = function(e){
    sound();
    switch (e.keyCode){
        case 37:  // если нажата клавиша влево
            model.dispatch("MoveLeft");
            break;

        case 39:   // если нажата клавиша вправо
            model.dispatch("MoveRight");
            break;
    }
}






function sound(){
    let audio = document.getElementById("audio");
    audio.play();
}
function crashSound(){
    let audio = document.getElementById("crashAudio");
    audio.play();
    setTimeout(()=>{
        audio.pause();
        audio.currentTime =0;

    },2000)
}


class Model{
    car = {
        view:[
            [0,1,0],
            [1,1,1],
            [0,1,0],
            [1,0,1],
        ],
        position:{
             x:4,
             y:16,
        },
        life: 4,
    };
    barrier = {
        view:[
            [1,0,1],
            [0,1,0],
            [1,1,1],
            [0,1,0],
        ],
        items:[],
        CreateTime:1200,

    };
    score =0;
    goal = 0;
    Speed = 2;
    SpeedInterval = 120;
    scoreInterval = setInterval(view.render, this.SpeedInterval);
    HiScore = !localStorage.getItem('HiScore') ? 0 :  localStorage.getItem('HiScore');
    setbarier(){
        return this.barrier;
    }
    render(){
       return {x:this.car.position.x, y:this.car.position.y, car:this.car.view};
    };
    dispatch(action){
        if(action == "MoveLeft"){
            this.car.position.x -3 < 1 ? this.car.position.x =1 : this.car.position.x = this.car.position.x -3;
        }
        if(action == "MoveRight"){
            this.car.position.x +3  > 6 ? this.car.position.x = 6 : this.car.position.x = this.car.position.x +3;
        }
    }
    CreateBarrier(){
        this.barrier.CreateBarier= setInterval(()=>{
            let xRand = Math.floor(Math.random() * (6 - 1) + 1);
            this.barrier.items.push({x:xRand, y: -3})
        },this.barrier.CreateTime);
    }
    clearIntervalBarier(){
        clearInterval(this.barrier.CreateBarier);
    }
    createScoreInterval(){
        this.scoreInterval = setInterval(view.render, this.SpeedInterval);
    }
    RenderBarier(){

        for(let i =0; i <  this.barrier.items.length; i++){
            let item = this.barrier.items[i];
            item.y++;

            if(item.y > 20){
                this.barrier.items.splice(i,1);
                this.score+=100;
                this.goal++;
                if(this.goal % 4 == 0 ){
                    if( this.barrier.CreateTime > 500){
                        this.barrier.CreateTime =  this.barrier.CreateTime - 100;
                    }
                    this.clearIntervalBarier();
                    this.CreateBarrier();
                    clearInterval(this.scoreInterval);
                    if(this.SpeedInterval >40){
                        this.SpeedInterval =  this.SpeedInterval -10;
                        this.Speed++;
                    }
                    this.createScoreInterval();
                }
            }
            if(item.x +2 >= this.car.position.x && !(this.car.position.x +2 < item.x) && this.car.position.y >= item.y+1 && !(this.car.position.y >item.y+1 ) ){
                this.car.life--;
                clearInterval(this.scoreInterval);
                crashSound();
                view.crash();
                this.barrier.items = [];
                this.createScoreInterval();
                if(this.car.life==0){
                    clearInterval(this.scoreInterval);
                    model = new Model;
                    model.CreateBarrier();
                }
            }
        }
    }
    getlife(){
        return this.car.life;
    }
    getPoints(){
        return {
        score:this.score,
        goal:this.goal,
        speed:this.Speed
    }

    }
    getHiScore(){
        return this.HiScore;
    }
    setHiScore(score){
        this.HiScore = score;
        localStorage.setItem('HiScore', score);
    }

}

let model = new Model;
model.CreateBarrier();


let controller = new Controller();