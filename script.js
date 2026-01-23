const canvas = document.querySelector(".canvas");
const toolsBtn = document.querySelectorAll(".tool");
const widthSet = document.querySelector("#plus");
const icons = document.querySelectorAll(".set i");
let boxColor = document.querySelector("#bgcolor");
let propertiesPanel = document.querySelector(".properties-panel");
let deleteButton = document.querySelector("#delete");
let moveUpButton = document.querySelector("#moveUp");
let moveDownButton = document.querySelector("#moveDown");

// console.log(boxColor.value)
let textElement = document.querySelector("#text");

let idIcon = null;

let currentTool = null;
let drawing = false;
let StartX, StartY;
let box;

let dragTarget = null;
let resizeTarget = null;
let offsetX = 0;
let offsetY = 0;
let numBox = 1;
let angle = 0;
let offsetXR = 0;
let offsetYR = 0;
let selectedItem = null;
let plusTarget = null;
let selectedElement = null;
let textSelector = null;
// let element={
//    id: "el_1",
//     type: "rect",
//     x: ,
//     y: 80,
//     w: 150,
//     h: 100,
//     rotate: 0,
//     bg: "#3b82f6",
//     opacity: 100,
//     visible: true,
//     radius: 4
// }


icons.forEach((i) => {
  console.log(i);
  i.addEventListener("click", () => {
    if (i.id == "plusW") {
      currentTool = "plusW";
    } else if (i.id == "minusW") {
      currentTool = "minusW";
    } else if (i.id == "plusH") {
      currentTool = "plusH";
    } else if (i.id == "minusH") {
      currentTool = "minusH";
    } else if (boxColor.id == "bgcolor") {
      currentTool = "bgcolor";
    } else {
      currentTool = null;
    }
  });
});

// Toolbar button click logic
toolsBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    // remove active from all buttons
    toolsBtn.forEach((b) => b.classList.remove("active"));
    // add active to clicked button
    btn.classList.add("active");

    // set the current tool based on ID
    if (btn.id === "rectangle") currentTool = "rectangle";
    else if (btn.id === "textBox") currentTool = "textBox";
    else if (btn.id === "hand") currentTool = "hand";
    else if (btn.id === "rotating-ac") currentTool = "rotating-ac";
    else if (btn.id === "rotating-c") currentTool = "rotating-c";
    else if (btn.id === "mouse") currentTool = "mouse";
    // else if()
    else currentTool = null;
  });
});

//  Canvas mouse events
canvas.addEventListener("mousedown", (e) => {
  if (!currentTool) return;

  const rect = canvas.getBoundingClientRect();
  console.log(rect);

  console.log(e.clientX, rect.left);
  StartX = e.clientX - rect.left;
  StartY = e.clientY - rect.top;

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (
    e.target.classList.contains("border") ||
    e.target.classList.contains("text")
  ) {
    selectedElement = e.target;
  }

  if (e.target.classList.contains("text")) {
    textSelector = e.target; // track clicked div
    textElement.value = textSelector.innerText;
  }

  if (currentTool === "rectangle") {
    drawing = true;

    box = document.createElement("div");
    box.id = Date.now()
    box.classList.add("border");
    box.style.left = StartX + "px";
    box.style.top = StartY + "px";
    box.style.width = "0px";
    box.style.height = "0px";

    canvas.appendChild(box);
  } else if (currentTool === "textBox") {
    const textBox = document.createElement("div");
    textBox.contentEditable = true;
    textBox.id =Date.now()
    textBox.classList.add("text");
    textBox.contentEditable = true;
    textBox.style.left = StartX + "px";
    textBox.style.top = StartY + "px";
    // textBox.innerText =
    // textSelector = textBox;
    canvas.appendChild(textBox);
    textElement.value = "";
    textBox.focus(); // auto focus so you can start typing
  } else if (currentTool === "hand") {
    if (
      e.target.classList.contains("border") ||
      e.target.classList.contains("text")
    ) {
      dragTarget = e.target;
      dragTarget.style.borderColor = "red";

      // console.log(dragTarget,x)
      offsetX = x - parseInt(dragTarget.style.left);
      // console.log(offsetX)
      offsetY = y - parseInt(dragTarget.style.top);
    }
  } else if (currentTool === "rotating-ac") {
    if (
      e.target.classList.contains("border") ||
      e.target.classList.contains("text")
    ) {
      dragTarget = e.target;
      dragTarget.style.transform = `rotate(${(angle -= 4)}deg)`;
      if (angle === "360deg") {
        angle = 0;
      }
    }
  } else if (currentTool === "rotating-c") {
    if (
      e.target.classList.contains("border") ||
      e.target.classList.contains("text")
    ) {
      dragTarget = e.target;
      dragTarget.style.transform = `rotate(${(angle += 4)}deg)`;
      if (angle === "360deg") {
        angle = 0;
      }
    }
  } else if (currentTool === "mouse") {
    if (e.target.classList.contains("border")) {
      resizeTarget = e.target;
      offsetXR = x - parseInt(resizeTarget.style.left);
      // console.log(offsetX)
      offsetYR = y - parseInt(resizeTarget.style.top);
    }
  } else if (
    e.target.classList.contains("border") ||
    e.target.classList.contains("text")
  ) {
    plusTarget = e.target;
  }
  // console.log(selectedElement)
});

propertiesPanel.addEventListener("mousedown", () => {
  if (!plusTarget) return;

  if (currentTool === "plusW") {
    const currentWidthI = plusTarget.offsetWidth;
    plusTarget.style.width = currentWidthI + 10 + "px";
  } else if (currentTool === "minusW") {
    const currentWidthD = plusTarget.offsetWidth;
    plusTarget.style.width = currentWidthD - 10 + "px";
  } else if (currentTool === "plusH") {
    const currentHeightI = plusTarget.offsetHeight;
    plusTarget.style.height = currentHeightI + 10 + "px";
  } else if (currentTool === "minusH") {
    const currentHeightD = plusTarget.offsetHeight;
    plusTarget.style.height = currentHeightD - 10 + "px";
  }
});

textElement.addEventListener("input", (e) => {
  if (!textSelector) return;

  // Ensure we are targeting the right element
  if (textSelector.classList.contains("text")) {
    // Sync the input value to the div's text
    textSelector.innerText = e.target.value;
    console.log(e.target);
  }
});

deleteButton.addEventListener("click", () => {
  if (!selectedElement) return;
  selectedElement.style.borderWidth = 2 + "px";
  selectedElement.remove();
  selectedElement = null;
});

moveUpButton.addEventListener("click", () => {
  if (!selectedElement) return;

  const currentTop = parseInt(selectedElement.style.top);

    if(currentTop-5>=0){

  selectedElement.style.top = selectedElement.offsetTop - 5 + "px";
    }
});

moveDownButton.addEventListener("click", () => {
  if (!selectedElement) return;

  const currentTop = parseInt(selectedElement.style.top);
  const boxHeight = parseInt(selectedElement.style.height);
  const info = canvas.getBoundingClientRect();


  
  if(boxHeight+currentTop+5<=info.height){

    selectedElement.style.top = selectedElement.offsetTop + 5 + "px";
  }
});

boxColor.addEventListener("input", (e) => {
  if (!selectedElement) return;
  selectedElement.style.backgroundColor = e.target.value;
});

window.addEventListener("keydown", (e) => {
  console.log(e.key);
  if (!selectedElement) return;
  const currentTop = parseInt(selectedElement.style.top);
  const currentLeft = parseInt(selectedElement.style.left);
  const boxHeight = parseInt(selectedElement.style.height);
  const boxWidth = parseInt(selectedElement.style.width);


  const info = canvas.getBoundingClientRect();

  console.log(currentLeft);

  if (e.key === "ArrowDown") {
    if ((boxHeight+currentTop+5) <= info.height) {
      selectedElement.style.top = selectedElement.offsetTop + 5 + "px";
    }
  
  } else if  (e.key === "ArrowUp") {
    if(currentTop - 5 >= 0) {
      selectedElement.style.top = selectedElement.offsetTop - 5 + "px";
    }
  } else if (e.key === "ArrowRight") {
    if  ((boxWidth+currentLeft+5) <= info.width)  {
      selectedElement.style.left = selectedElement.offsetLeft + 5 + "px";
    }
  } 
  else if (e.key === "ArrowLeft"){ 
    if (currentLeft - 5 >= 0) {
      selectedElement.style.left = selectedElement.offsetLeft - 5 + "px";
    }
  }
  if (e.key === "Delete") {
    selectedElement.remove();
    selectedElement = null;
  }
});

// script.js:230 ArrowDown
// script.js:230 ArrowRight
// script.js:230 ArrowLeft
// script.js:230 ArrowUp
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (drawing && currentTool === "rectangle") {
    box.style.width = Math.abs(x - StartX) + "px";
    box.style.height = Math.abs(y - StartY) + "px";
    box.style.left = Math.min(x, StartX) + "px";
    box.style.top = Math.min(y, StartY) + "px";
  }

  if (dragTarget && currentTool === "hand") {
    dragTarget.style.left = x - offsetX + "px";
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

canvas.addEventListener("mouseup", (e) => {
  drawing = false;
  dragTarget = null;
});
