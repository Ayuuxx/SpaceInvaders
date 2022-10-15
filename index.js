/*
Documentation:




*/
const scoreEle = document.querySelector('#scoreEle');
const FinalScore = document.querySelector('#FinalScore');
const canvas = document.querySelector('canvas');
const ctx= canvas.getContext('2d');
var music=document.getElementById("music")

var sfx={
    boom:new Audio("PRSFX- Selfedestruct2.wav"),
    boom2:new Audio("mixkit-glitch-arcade-explosion-1027 (mp3cut.net).wav"),
    shoot:new Audio("mixkit-short-laser-gun-shot-1670.wav"),
    beep:new Audio("mixkit-repeating-arcade-beep-1084.wav"),
    endm:new Audio("RBY Victory Trainer.mp3")
}
sfx.boom.load()
sfx.boom2.load()
sfx.shoot.load()
sfx.endm.load()
music.load()
let difficulty=0

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
console.log(canvas.width)
console.log(canvas.height)
const globalScale=canvas.width/1920

class Menu{
    constructor()
    {
        this.position={
            x:0,
            y:0
        }
        this.width=canvas.width
        this.height=canvas.height
        const image = new Image()
        image.src="./start.png"
        image.onload =() =>{
            this.img=image
            this.position={
                x: 0,
                y: 0  
            }
        }
    }
    Display()
    { 
    if(this.img)
    {
        ctx.drawImage(this.img,this.position.x,this.position.y,this.width,this.height)
    }
    }
}
class Player{
    constructor(){
        this.lives=3
        this.opacity=1
        this.opacity2=1
        this.velocity={
            x: 0,
            y: 0
        }
        const image = new Image()
        image.src="./ship.png"
        image.onload =() =>{
            const scale=0.25*globalScale
            this.image=image
            this.width = image.width*scale
            this.height = image.height*scale
            this.position={
                x: canvas.width/2-this.width/2,
                y: canvas.height -this.height-15    
            }
        }
        const imag2 = new Image()
        imag2.src="./heart.png"
        imag2.onload =() =>{
            const scale=0.08*globalScale
            this.image2=imag2
            this.width2 = imag2.width*scale
            this.height2 = imag2.height*scale
            this.position2={
                x: 50*globalScale,
                y: canvas.height-this.width2-50*globalScale
            }
        }
        this.rotation=0

        
    }
    heart()
    {
        //if position.x < (this.width2+10)*lives opacity =40
        if(this.position.x<=(this.width2+10)*this.lives)
        this.opacity2=0.4
        ctx.save()
        ctx.globalAlpha=this.opacity2
        for(let num=0;num<this.lives;num++)
        if(this.image2)
        ctx.drawImage(this.image2,this.position2.x + num*(this.width2 +10),this.position2.y,this.width2,this.height2)
        ctx.restore()
        this.opacity2=1
    }
    draw() {
        //ctx.fillStyle = 'red'
        //ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
        ctx.save()
        ctx.globalAlpha=this.opacity
        ctx.translate(player.position.x+player.width/2,player.position.y+player.height/2)
        ctx.rotate(this.rotation)
        ctx.translate(-player.position.x-player.width/2,-player.position.y-player.height/2)
        if(this.image)
        ctx.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
        ctx.restore()
    }
    update()
    {  
        if(this.image)
        {this.draw()
        this.position.x += this.velocity.x}
        if(this.image2)
        {
            this.heart()
        }
    }
    reset(gameov)
    {
        this.opacity=1
        this.position.x=canvas.width/2-this.width/2
        this.position.y =canvas.height -this.height-15  
        if(gameov===true)
        this.lives=3
    }
  
}
class Projectile{
    constructor({position,velocity})
    {
        this.position= position
        this.velocity= velocity
        this.radius=5
    }
    draw()
    {
        ctx.beginPath()
        ctx.arc(this.position.x,this.position.y,this.radius,0,Math.PI * 2)
        ctx.fillStyle = 'red'
        ctx.fill()
        ctx.closePath()
    }
    update()
    {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    } 
}
class InvaderProjectile{
    constructor({position,velocity})
    {
        this.position= position
        this.velocity= velocity
        //this.radius=5
        this.width=5
        this.height=20
    }
    draw()
    {
        ctx.fillStyle = 'white'
        ctx.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
    update()
    {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    } 
}
class Praticles{
    constructor({position,velocity,radius,colour})
    {
        this.position= position
        this.velocity= velocity
        this.radius= radius
        this.colour=colour
        this.opacity=1
    }
    draw()
    {   
        ctx.save()
        ctx.globalAlpha= this.opacity
        ctx.beginPath()
        ctx.arc(this.position.x,this.position.y,this.radius,0,Math.PI * 2)
        ctx.fillStyle = this.colour
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }
    update()
    {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.opacity-=0.013
    } 
}
class Invader{
    constructor({position}){
        this.velocity={
            x:0,
            y:0
        }
        const image = new Image()
        image.src="./invader.png"
        image.onload =() =>{
            const scale=0.2*globalScale
            this.image=image
            this.width = image.width*scale
            this.height = image.height*scale
            this.position={
                x: position.x,
                y: position.y    
            }
            console.log(this.width)
        }
    }
    draw() {
        if(this.image)
        ctx.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
    }
    update({velocity})
    {  
        if(this.image)
        {this.draw()
        this.position.x += velocity.x
        this.position.y += velocity.y
    }
    }
    shoot(InvProjs)
    {
        InvProjs.push(new InvaderProjectile({
            position:{
                x: this.position.x + this.width/2+5*globalScale,
                y: this.position.y
            },
            //projectile velocity here
            velocity:{
                x:0,
                y:3
            }
        }))
    }
}

class Grid{
    constructor(){
        this.position = {
            x:0,
            y:0
        }
        this.velocity={
            x:3.5*globalScale,
            y:0
        }
        this.invaders = []
        let limit1
        if(canvas.width<=1000)
        limit1 = Math.floor(Math.random()*4+2)
        else
        limit1 = Math.floor(Math.random()*6+4)
        const limit2 = Math.floor(Math.random()*5+2)
        
        this.width = limit1*85*globalScale

        for(let row=0; row<limit1;row++)
        {for(let column=0; column<limit2;column++)
        {
            this.invaders.push(new Invader(
                {   
                    position: {
                        x:row*90*globalScale,
                        y:column*60*globalScale
                    }
                }
            ))
        }}
        //console.log(this.invaders)
    }
    update(){
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y=0
        if((this.position.x + this.width) >= canvas.width|| (this.position.x  )<=0)
        {
            this.velocity.x = -this.velocity.x
            this.velocity.y=30
        }
    }
}
class Points
{
    constructor({position}){
        this.position=position
        this.velocity={
            x:-0.1,
            y:-0.1
        }
        this.opacity=1
    }
    write()
    {
        ctx.save()
        ctx.globalAlpha=this.opacity
        ctx.font="20px Silkscreen"
        ctx.fillStyle='white'
        ctx.textAlign="center"
        ctx.fillText("100",this.position.x,this.position.y)
        ctx.restore()
    }
    update()
    {
        this.write()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
        this.opacity-=0.01
    }
}
class Stage{
    constructor(){
        this.select=Math.ceil(Math.random()*3)
        this.width=canvas.width
        this.height=canvas.height
        const image = new Image()
        this.velocity=0.3
        this.count=2
        const image2 = new Image()
        const image3 = new Image()
        image.src="./space.png"
        image2.src="./space2.png"
        image3.src="./space3.png"
        image.onload =() =>{
            this.image=image
            this.position={
                x: 0,
                y: 0  
            }
        }
        image2.onload =() =>{
            this.image2=image2
            this.position={
                x: 0,
                y: 0  
            }
        }
        image3.onload =() =>{
            this.image3=image3
            this.position={
                x: 0,
                y: 0  
            }
        }
    }
    draw()
    {   
        //random background chosen at start
        if(this.image&&this.select===1)
        { 
            ctx.drawImage(this.image,this.position.x,this.position.y-canvas.height,this.width,this.height)  
            ctx.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
        }
        else if(this.image2&&this.select===2)
        { 
            ctx.drawImage(this.image2,this.position.x,this.position.y-canvas.height,this.width,this.height)  
            ctx.drawImage(this.image2,this.position.x,this.position.y,this.width,this.height)
        }
        else if(this.image3&&this.select===3)
        { 
            ctx.drawImage(this.image3,this.position.x,this.position.y-canvas.height,this.width,this.height)  
            ctx.drawImage(this.image3,this.position.x,this.position.y,this.width,this.height)
        }
        else
        { 
            ctx.drawImage(this.image,this.position.x,this.position.y-canvas.height,this.width,this.height)  
            ctx.drawImage(this.image,this.position.x,this.position.y,this.width,this.height)
        }
    }
    update()
    {
        if(this.image&&this.image2&&this.image3)
        {
            this.draw()
            this.position.y+=this.velocity
            if(this.position.y>=canvas.height)
                {
                    this.position.y=0
                    this.count-=1
                    if(this.count<=0)
                    {
                        this.velocity=0.3
                        if(grids.length===0)
                        setTimeout(() => {
                            grids.push(new Grid())
                        }, 100);
                    }
                }
        }
    }
    accelerate()
    {
        this.velocity=10*globalScale
        this.count=2
    }
}
const sm = new Menu()
const stage= new Stage()
const player = new Player()
const projectiles = []
const invaderprojectiles=[]
const particles = []
const grids = [new Grid()]
const points=[]

const keys={
    a:{ 
        pressed: false
    },
    d:{
        pressed: false
    },
    space:{
        pressed:false
    }
}
//player.draw();
//function to make motion
let frames=-99
//let spawntimer=Math.floor((Math.random()*1000)+500)
let score=0
let game={
    over:false,
    active:false
}
let pause=false
//console.log(spawntimer)

function scoreUp(reset)
{
    score+=100
    if(reset)
    {
    score=0
    scoreEle.innerHTML= score
    return
    }
    if(score>=10000)
    document.getElementById("scoreDisplay").style.marginLeft="35.4vw"
    else if(score>=1000)
    document.getElementById("scoreDisplay").style.marginLeft="36.15vw"
    scoreEle.innerHTML= score
    FinalScore.innerHTML= score
}
function Gameover(grids,invprs,prs)
{
    const image = new Image()
    image.src="./Game Over.png"
    image.onload =() =>{
        this.img= image
        const scale=1*globalScale
        this.width = image.width*scale
        this.height = image.height*scale
    }
    if(this.img)
    {
        ctx.drawImage(this.img,canvas.width/2-this.width/2,canvas.height/2-this.height/2,this.width,this.height)
    }
    player.reset(true)
    grids.forEach((grid,index)=>{
        setTimeout(() => {
            grids.splice(index,1)
        }, 0);
    })
    grids.push(new Grid())
    prs.forEach((projectile,index)=>{
        setTimeout(()=>{prs.splice(index,1)},0)
    })
    invprs.forEach((invprojectile,index)=>{
        setTimeout(()=>{invprs.splice(index,1)},0)
    })
    scoreUp(true)
    music.pause()
    sfx.endm.play()
}
function Displaypause(){
        const image = new Image();
        image.src = "./pause.png";
        image.onload = () => {
            this.img = image;
            const scale = 0.5*globalScale
            this.width = image.width * scale;
            this.height = image.height * scale;
        if (this.img) {
            ctx.drawImage(this.img, canvas.width / 2 - this.width / 2, canvas.height / 2 - this.height / 2, this.width, this.height);
        }
    }
}
function sectorClear()
{   
    if(stage.velocity===10*globalScale)
    {
    ctx.font="60px Silkscreen"
    const txt= "Sector Cleared!"
    ctx.fillStyle='white'
    ctx.textAlign="center"
    ctx.fillText(txt,canvas.width/2,canvas.height/2)}
    else 
    return
}
function createParticles(object,colour,number)
{
    for(let i=0;i<number;i++)
    { particles.push(new Praticles({
    position:{
        x:object.position.x + object.width/2,
        y:object.position.y+ object.height/2
    },
    velocity:{
        x:(Math.random()-0.5)*2,
        y:(Math.random()-0.5)*2
    },
    radius: Math.random()*4+1,
    colour: colour
    }))}
}
function animate()
{
    {
    requestAnimationFrame(animate)
    if(pause)
        {
            Displaypause()
            return
        }
    if(!game.active&&game.over)
    {
        Gameover(grids,invaderprojectiles,projectiles)
        document.getElementById('scoreDisplay').style.display = "flex"
        return
    }
    if(!game.active)
    {
        sm.Display()
        return
    }
    stage.update()
    player.update()
    sectorClear()
    particles.forEach((particle,index) =>{
        if(particle.opacity<=0)
        {
            setTimeout(()=>{particles.splice(index,1)},0)
        }
        else
        particle.update()
    })
    points.forEach((point,index) =>{
        if(point.opacity<=0)
        {
            setTimeout(()=>{points.splice(index,1)},0)
        }
        else
        point.update()
    })
     //inv shooting
    invaderprojectiles.forEach((invaderprojectile,index)=>{
        if(invaderprojectile.position.y + invaderprojectile.height>=canvas.height){
            setTimeout(()=>{invaderprojectiles.splice(index,1)},0)
        }
        else
        invaderprojectile.update()
        if(invaderprojectile.position.y+invaderprojectile.height>=player.position.y
            && invaderprojectile.position.x+invaderprojectile.width >= player.position.x 
            && invaderprojectile.position.x <= player.position.x+player.width)
            {
                sfx.boom2.play()
                createParticles(player,'yellow',20)
                if(player.lives>0)
                {
                    player.lives-=1
                    setTimeout(()=>{
                        invaderprojectiles.splice(index,1)
                    },0)
                    player.opacity=0
                    setTimeout(() => {
                        player.reset(false)
                    }, 1500);
                }
                else{
                setTimeout(()=>{
                    invaderprojectiles.splice(index,1)
                    player.opacity =0
                    game.over=true
                },0)
                setTimeout(()=>{
                    game.active=false
                },1000)}
            }
    })
    //shooting
    projectiles.forEach((projectile,index)=> {
        if(projectile.position.y +projectile.radius <= 0)
        {setTimeout(() => 
            {projectiles.splice(index,1)
            },0)
        }
        else
        projectile.update()
    })
    grids.forEach((grid,num) => {
        grid.update()
        //projectile spawn inv
        if(frames%Math.floor(300/globalScale)===0 && grid.invaders.length>0)
        {
            grid.invaders[Math.floor(Math.random()*grid.invaders.length)].shoot(invaderprojectiles)

        }
        grid.invaders.forEach((invader,i) =>{
            invader.update({velocity : grid.velocity})
            if(invader.position.x+invader.width>=player.position.x
                &&invader.position.x-invader.width<=player.position.x+player.width
                &&invader.position.y>=player.position.y
                &&invader.position.y+invader.height<=player.position.y+player.height)
                {
                    sfx.boom2.play()
                    createParticles(player,'yellow',20)
                    setTimeout(()=>{
                    player.opacity=0
                    game.over=true
                    },0)
                    setTimeout(() => {
                        game.active=false
                    }, 100);
                    setTimeout(()=>{grid.invaders.splice(i,1)},0)
                }
            if(invader.position.y+invader.height>=canvas.width)
            {
                setTimeout(()=>{
                    player.opacity=0
                    game.over=true
                    },0)
                    setTimeout(() => {
                        game.active=false
                    }, 1000);
            }
            projectiles.forEach((projectile,j)=>{
                if((projectile.position.y-projectile.radius<= invader.position.y+invader.height)
                &&(projectile.position.x+projectile.radius>=invader.position.x)
                &&(projectile.position.x-projectile.radius<=invader.position.x + invader.width)
                &&(projectile.position.y-projectile.radius>=invader.position.y))
                {
                        setTimeout(() =>
                        {
                        const invaderFound =grid.invaders.find(invader2 =>{
                            return invader2===invader
                        })
                        const projectileFound =projectiles.find(projectile2 =>{
                            return projectile2===projectile
                        })
                        //enemy killed
                        if(invaderFound&&projectileFound)
                        {
                            
                            createParticles(invader,'#15ff00',15)
                            points.push(new Points({
                                position:{
                                    x:invader.position.x+invader.width/2,
                                    y:invader.position.y+invader.height/2
                                }
                            }))
                            scoreUp()
                            sfx.boom.play()
                            grid.invaders.splice(i,1)
                            projectiles.splice(j,1)
                            if(grid.invaders.length>0){
                                const firstinv= grid.invaders[0]
                                const lastinv= grid.invaders[grid.invaders.length-1]
                                grid.width=lastinv.position.x-firstinv.position.x + 90*globalScale
                                grid.position.x=firstinv.position.x
                            }
                            else{
                                grids.splice(num,1)
                                stage.accelerate()
                            }
                        }
                        },0)
              }
            })
        })
    })

    if(keys.a.pressed && player.position.x>=0)
    {
        player.velocity.x=-7
        player.rotation=-0.15
    }
    else if(keys.d.pressed && (player.position.x + player.width)<=canvas.width)
    {
        player.velocity.x=7
        player.rotation=0.15
    }
    else{
        if(player.velocity.x<0)
        player.velocity.x+=1
        if(player.velocity.x>0)
        player.velocity.x-=1
        player.rotation=0
    }
    /*if(frames%spawntimer === 0){
        spawntimer=Math.floor((Math.random()*1000)+500)
        grids.push(new Grid())
        frames=0
    }*/
    frames++
}
}
animate()
music.onended= () =>{
    music.play()}
sfx.endm.onended=()=>{
    sfx.endm.play()
}
//game over/start menu
addEventListener('keypress',()=>{
    if(!game.active)
    {   
        if(game.over)
        {
            game.over=false
            document.getElementById('scoreDisplay').style.display="none"
            music.currentTime=0
            music.play()
        }
        document.getElementById('topScore').style.display="block"
        sfx.endm.pause()
        sfx.endm.currentTime=0
        music.play()
        game.active=true
    }
})
addEventListener('click',()=>{
    if(!game.active)
    {   
        if(game.over)
        {
            game.over=false
            document.getElementById('scoreDisplay').style.display="none"
            music.currentTime=0
            music.play()
        }
        document.getElementById('topScore').style.display="block"
        sfx.endm.pause()
        sfx.endm.currentTime=0
        music.play()
        game.active=true
    }
})
addEventListener('keydown',({key})=>{
    if(game.over)
    return
    switch(key)
    {
        case 'p':
        if(pause)
        pause=false
        else
        pause=true
        break
        case 'a':
        //console.log('left')
        keys.a.pressed=true
        break;
        case 'd':
        //console.log('right')
        keys.d.pressed=true
        break;
        case ' ':
        //console.log('space')
        if(!pause)
        sfx.shoot.play()
        projectiles.push(
            new Projectile({
                position:{
                    x: player.position.x +player.width/2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -5
                }
            })
        )
    }
})
addEventListener('keyup',({key})=>{
    switch(key)
    {
        case 'a':
        //console.log('left')
        keys.a.pressed=false
        break;
        case 'd':
       // console.log('right')
        keys.d.pressed=false
        break;
        case ' ':
       // console.log('space')
    }
})
if(canvas.width<=1000)
        {
        setInterval(() => {
            if((!pause&&game.active&&player.opacity===1))
            sfx.shoot.play()
            projectiles.push(
                new Projectile({
                    position:{
                        x: player.position.x +player.width/2,
                        y: player.position.y
                    },
                    velocity: {
                        x: 0,
                        y: -5
                    }
                })
            )
        }, 450);
        }
addEventListener('touchstart',handleStart)
function handleStart(e)
{
    if(game.over)
    return
    if(e.touches[0].pageX <canvas.width/2)
    {
        keys.a.pressed=false
    }
    if(e.touches[0].pageX>+canvas.width/2)
    {
        keys.d.pressed=false
    }
}
addEventListener('touchend',handleEnd)
function handleEnd(e)
{
    if(e.touches[0].pageX<canvas.width/2)
    {
        keys.a.pressed=true
    }
    if(e.touches[0].pageX>canvas.width/2)
    {
        keys.d.pressed=true
    }
}