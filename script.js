const canvas = document.querySelector(".canvas");
const toolsBtn = document.querySelectorAll(".tool");
const widthSet=document.querySelector(".width")

let currentTool = null;
let drawing = false;
let StartX, StartY;
let box;

let dragTarget = null;
let resizeTarget=null;
let offsetX = 0;
let offsetY = 0;
let numBox = 1;
let angle=0
let offsetXR=0
let offsetYR=0

// 1️⃣ Toolbar button click logic
toolsBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    // remove active from all buttons
    toolsBtn.forEach((b) => b.classList.remove("active"));
    // add active to clicked button
    btn.classList.add("active");

    // set the current tool based on ID
    if (btn.id === "rectangle") currentTool = "rectangle";
    else if (btn.id === "text") currentTool = "text";
    else if (btn.id === "hand") currentTool = "hand";
    else if (btn.id === "rotating-ac") currentTool = "rotating-ac";
    else if (btn.id === "rotating-c") currentTool = "rotating-c";
    else if (btn.id === "mouse") currentTool = "mouse";



    else currentTool = null; //  mouse, etc
  });
});

// 2️⃣ Canvas mouse events
canvas.addEventListener("mousedown", (e) => {
  if (!currentTool) return;

  const rect = canvas.getBoundingClientRect();
  console.log(rect);

  console.log(e.clientX, rect.left);
  StartX = e.clientX - rect.left;
  StartY = e.clientY - rect.top;

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (currentTool === "rectangle") {
    drawing = true;

    box = document.createElement("div");
    box.id = numBox++;
    box.classList.add("border");
    box.style.left = StartX + "px";
    box.style.top = StartY + "px";
    box.style.width = "0px";
    box.style.height = "0px";

    canvas.appendChild(box);
    // let box.getBoundingClientRect()
  } else if (currentTool === "text") {
    const textBox = document.createElement("div");
    textBox.id = numBox++;
    textBox.classList.add("text");
    textBox.contentEditable = true;
    textBox.style.left = StartX + "px";
    textBox.style.top = StartY + "px";
    // textBox.innerText =
    canvas.appendChild(textBox);
    textBox.focus(); // auto focus so you can start typing
  } else if (currentTool === "hand") {
    if (
      e.target.classList.contains("border") ||
      e.target.classList.contains("text")
    ) {
      dragTarget = e.target;
      // console.log(dragTarget,x)
      offsetX = x - parseInt(dragTarget.style.left);
      // console.log(offsetX)
      offsetY = y - parseInt(dragTarget.style.top);
    }

  
  }else if(currentTool==="rotating-ac"){
     if (
      e.target.classList.contains("border") ||
      e.target.classList.contains("text")
    ) {
      dragTarget = e.target;
      dragTarget.style.transform = `rotate(${angle-=4}deg)`
      if(angle==='360deg'){
        angle=0
      }
    
    }
  }else if(currentTool==='rotating-c'){
      if (
      e.target.classList.contains("border") ||
      e.target.classList.contains("text")
    ) {
      dragTarget = e.target;
      dragTarget.style.transform = `rotate(${angle+=4}deg)`
      if(angle==='360deg'){
        angle=0
      }
    
    }
  }else if(currentTool==="mouse"){
    if(e.target.classList.contains("border")){
        resizeTarget=e.target
          offsetXR = x - parseInt(resizeTarget.style.left);
      // console.log(offsetX)
      offsetYR = y - parseInt(resizeTarget.style.top);
    }
  }
});


canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (drawing && currentTool === "rectangle") {
    // console.log(StartX)
    // console.log(x)

    box.style.width = Math.abs(x - StartX) + "px";
    box.style.height = Math.abs(y - StartY) + "px";
    box.style.left = Math.min(x, StartX) + "px";
    box.style.top = Math.min(y, StartY) + "px";
  }

  if (dragTarget && currentTool === "hand") {
    dragTarget.style.left = x - offsetX + "px";
    //  dragTarget.style.left=e.clientX-offsetX+'px'
    // console.log( dragTarget.style.left,1)
    dragTarget.style.top = y - offsetY + "px";
// Calculate proposed position
    let newX = x - offsetX;
    let newY = y - offsetY;

    const containerRect = canvas.getBoundingClientRect();
    
    // Horizontal Constraints (Left/Right)
    if (newX < 0) newX = 0; 
    if (newX + dragTarget.offsetWidth > containerRect.width) {
        newX = containerRect.width - dragTarget.offsetWidth;
    }

    // Vertical Constraints (Top/Bottom)
    // 1. Top: Prevent the item from going above the container
    if (newY < 0) {
        newY = 0;
    }

    // 2. Bottom: Prevent the item from going below the container
    // We check if the top position + the item's height exceeds the container's height
    if (newY + dragTarget.offsetHeight > containerRect.height) {
        newY = containerRect.height - dragTarget.offsetHeight;
    }

    // Apply the final validated positions
    dragTarget.style.left = newX + "px";
    dragTarget.style.top = newY + "px";
  }


});

// canvas.addEventListener('mouseleave',(e)=>{

//    let c=canvas.getBoundingClientRect()
//    console.log(c)
// //    console.log(dragTarget)
// //    let d=dragTarget.getBoundingClientRect()
//    console.log(d)
// })

canvas.addEventListener("mouseup", (e) => {
  
  drawing = false;
  dragTarget = null;

});
