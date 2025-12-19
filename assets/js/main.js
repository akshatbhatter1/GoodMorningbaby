/*===== MENU SHOW =====*/ 
const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')

/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50
        sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SHOW SCROLL UP =====*/
function scrollTop(){
    const scrollTop = document.getElementById('scroll-top')
    if(this.scrollY >= 560) scrollTop.classList.add('show-scroll')
    else scrollTop.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollTop)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
});

sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text',{})
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 400})
sr.reveal('.contact__input',{delay: 200})
sr.reveal('.home__social-icon',{ interval: 100})
sr.reveal('.skills__data, .work__img',{interval: 200})

/*==================== DARK LIGHT THEME ====================*/
const themeButton = document.getElementById('theme-button')
const darkTheme = 'dark-theme'
const iconTheme = 'bx-sun'

const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

const getCurrentTheme = () =>
  document.body.classList.contains(darkTheme) ? 'dark' : 'light'
const getCurrentIcon = () =>
  themeButton.classList.contains(iconTheme) ? 'bx-moon' : 'bx-sun'

if (selectedTheme) {
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme)
  themeButton.classList[selectedIcon === 'bx-moon' ? 'add' : 'remove'](iconTheme)
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle(darkTheme)
    themeButton.classList.toggle(iconTheme)
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/* =================== WISH ================*/
const PI2 = Math.PI * 2
const random = (min, max) => Math.random() * (max - min + 1) + min | 0
const timestamp = _ => new Date().getTime()

class Birthday {
  constructor() {
    this.resize()
    this.fireworks = []
    this.counter = 0
  }

  resize() {
    this.width = canvas.width = window.innerWidth
    let center = this.width / 2 | 0
    this.spawnA = center - center / 4 | 0
    this.spawnB = center + center / 4 | 0
    this.height = canvas.height = window.innerHeight
    this.spawnC = this.height * .1
    this.spawnD = this.height * .5
  }

  onClick(evt) {
    let x = evt.clientX || evt.touches && evt.touches[0].pageX
    let y = evt.clientY || evt.touches && evt.touches[0].pageY

    let count = random(3,5)
    for(let i=0;i<count;i++){
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height, x, y,
        random(0,260), random(30,110)
      ))
    }
    this.counter = -1
  }

  update(delta) {
    ctx.globalCompositeOperation = 'hard-light'
    ctx.fillStyle = `rgba(20,20,20,${7 * delta})`
    ctx.fillRect(0, 0, this.width, this.height)

    ctx.globalCompositeOperation = 'lighter'
    this.fireworks.forEach(f => f.update(delta))

    this.counter += delta * 3
    if (this.counter >= 1) {
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        random(0,this.width),
        random(this.spawnC,this.spawnD),
        random(0,360),
        random(30,110)
      ))
      this.counter = 0
    }

    if (this.fireworks.length > 1000)
      this.fireworks = this.fireworks.filter(f => !f.dead)
  }
}

class Firework {
  constructor(x,y,tx,ty,shade,offsprings){
    this.x=x; this.y=y; this.tx=tx; this.ty=ty
    this.shade=shade; this.offsprings=offsprings
    this.history=[]; this.dead=false
  }
  update(delta){
    let dx=this.tx-this.x, dy=this.ty-this.y
    if(Math.abs(dx)>3||Math.abs(dy)>3){
      this.x+=dx*2*delta; this.y+=dy*2*delta
      this.history.push({x:this.x,y:this.y})
      if(this.history.length>20) this.history.shift()
    } else if(this.offsprings && !this.madeChilds){
      let babies=this.offsprings/2
      for(let i=0;i<babies;i++){
        birthday.fireworks.push(
          new Firework(this.x,this.y,
            this.x+this.offsprings*Math.cos(PI2*i/babies),
            this.y+this.offsprings*Math.sin(PI2*i/babies),
            this.shade,0)
        )
      }
      this.madeChilds=true
      this.history.shift()
    }
    if(!this.history.length) this.dead=true
    this.history.forEach((p,i)=>{
      ctx.fillStyle=`hsl(${this.shade},100%,${i}%)`
      ctx.beginPath(); ctx.arc(p.x,p.y,1,0,PI2); ctx.fill()
    })
  }
}

let canvas = document.getElementById('birthday')
let ctx = canvas.getContext('2d')
let birthday = new Birthday()
let fireworksActive = false
let then = timestamp()

window.onresize = () => birthday.resize()
document.onclick = e => birthday.onClick(e)
document.ontouchstart = e => birthday.onClick(e)

;(function loop(){
  requestAnimationFrame(loop)
  let now = timestamp()
  if (fireworksActive) {
    birthday.update((now-then)/1000)
  }
  then = now
})()

/* =========== Photos (UNCHANGED) ============== */
var radius = 350
var autoRotate = true
var rotateSpeed = -60
var imgWidth = 170
var imgHeight = 190

var odrag = document.getElementById('drag-container')
var ospin = document.getElementById('spin-container')
var aImg = ospin.getElementsByTagName('img')
var aVid = ospin.getElementsByTagName('video')
var aEle = [...aImg, ...aVid]

ospin.style.width = imgWidth + "px"
ospin.style.height = imgHeight + "px"

var ground = document.getElementById('ground')
ground.style.width = radius * 3 + "px"
ground.style.height = radius * 3 + "px"

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform =
      "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)"
    aEle[i].style.transition = "transform 1s"
    aEle[i].style.transitionDelay =
      delayTime || (aEle.length - i) / 4 + "s"
  }
}

function applyTranform(obj) {
  if(tY > 180) tY = 180
  if(tY < 0) tY = 0
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)"
}

function playSpin(yes) {
  ospin.style.animationPlayState = yes ? 'running' : 'paused'
}

var sX, sY, nX, nY, desX=0, desY=0, tX=0, tY=10

if (autoRotate) {
  var animationName = rotateSpeed > 0 ? 'spin' : 'spinRevert'
  ospin.style.animation =
    `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`
}

/* ===== START CAROUSEL ON SCROLL (UNCHANGED) ===== */
let missMineStarted = false
const missMineObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !missMineStarted) {
        missMineStarted = true
        init()
        missMineObserver.disconnect()
      }
    })
  },
  { threshold: 0.4 }
)
missMineObserver.observe(document.getElementById('miss-mine'))

/* ===== START FIREWORKS ON SCROLL (ONLY ADDITION) ===== */
const birthdayCanvas = document.getElementById('birthday')
const fireworkObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fireworksActive = true
        fireworkObserver.disconnect()
      }
    })
  },
  { threshold: 0.3 }
)
fireworkObserver.observe(birthdayCanvas)
