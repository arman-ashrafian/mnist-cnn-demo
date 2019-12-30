$(function() {
  DEBUG = false;

  const CLASSIFY_URL = "/classify";

  const HEIGHT = 300;
  const WIDTH = 300;

  let canvasElem = document.getElementById("canvas");
  let predictionElem = document.getElementById("prediction");

  canvasElem.setAttribute("width", WIDTH);
  canvasElem.setAttribute("height", HEIGHT);
  canvasElem.style = "width:100%"
  context = canvasElem.getContext("2d");

  let clickX = new Array();
  let clickY = new Array();
  let clickDrag = new Array();
  let paint;

  /* --------------- mouse/click handlers -------------------*/

  function getMousePosition(e) {
    let rect = canvasElem.getBoundingClientRect()
    let mouseX = e.pageX - rect.x;
    let mouseY = e.pageY - rect.y;
    return {x: mouseX, y: mouseY};
  }


  $("#canvas").mousedown((e) => {
    let mouse = getMousePosition(e);
    paint = true;
    addClick(mouse.x, mouse.y, false);
    redraw();
  });

  $("#canvas").mousemove((e) => {
    if (paint) {
      let mouse = getMousePosition(e);
      addClick(mouse.x, mouse.y, true);
      redraw();
    }
  });

  $("#canvas").mouseup(function(e) {
    paint = false;
  });

  $("#canvas").mouseleave(function(e) {
    paint = false;
  });

  $("#clearBtn").click(clearCanvas);

  $("#classifyBtn").click(classify);

  // Set up touch events for mobile, etc.
  // Transforming touch events into mouse events
  canvasElem.addEventListener(
    "touchstart",
    function(e) {
      e.preventDefault();
      mousePos = getTouchPos(canvas, e);
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    },
    false
  );

  canvasElem.addEventListener(
    "touchend",
    function(e) {
      e.preventDefault();
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    },
    false
  );

  canvasElem.addEventListener(
    "touchmove",
    function(e) {
      e.preventDefault();
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      canvas.dispatchEvent(mouseEvent);
    },
    false
  );

  // Get the position of a touch relative to the canvas
  function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
      x: touchEvent.touches[0].clientX - rect.left,
      y: touchEvent.touches[0].clientY - rect.top
    };
  }

  /* -------------------- Draw Functions ------------------- */

  function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    let clickDetails = {
      x: x,
      y: y,
      dragging: dragging
    };
    log(DEBUG, clickDetails);
  }

  function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    // drawing variables
    context.lineJoin = "round";
    context.lineWidth = 20;
    context.fillStyle = "#000000";
    context.strokeStyle = "#FFFFFF";

    // draw white background
    context.fillRect(0, 0, context.canvas.width, context.canvas.width);

    for (var i = 0; i < clickX.length; i++) {
      context.beginPath();
      if (clickDrag[i] && i) {
        context.moveTo(clickX[i - 1], clickY[i - 1]);
      } else {
        context.moveTo(clickX[i] - 1, clickY[i]);
      }
      context.lineTo(clickX[i], clickY[i]);
      context.closePath();
      context.stroke();
    }
  }

  function clearCanvas() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    clickX.length = 0;
    clickY.length = 0;
    clickDrag.length = 0;
    predictionElem.innerText = "";
  }

  // This function handles sending a POST request to the server
  // and waits for the response. Inserts response into
  // <h1 id="prediction"> 
  async function classify() {
    // get base64 encoding of the image
    let imgData = canvasElem.toDataURL("image/png");

    let resp = await fetch(CLASSIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        imgData: imgData
      })
    });

    respJson = await resp.json();
    log(DEBUG, respJson);

    predictionElem.innerText = respJson.number;
  }

  function log(DEBUG, message) {
    if (DEBUG) console.log(message);
  }
});
