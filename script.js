// const { createElement } = require("react")

let main=document.querySelector('main')

let hand=document.querySelector('.hand')
let c=document.querySelector('.canvas')
let currentTool=null
hand.addEventListener('click',()=>{
    currentTool='rectangle'


})

c.addEventListener('click',(e)=>{
    if(currentTool!=='rectangle') return;
    console.log(e)

    let box=document.createElement('div')
    box.classList.add('border')
    
    box.style.top=e.x+'px'
     box.style.left=e.y+'px'

     c.appendChild(box)
     console.log('j')
})