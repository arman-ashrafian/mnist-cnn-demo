$(function() {
  DEBUG = false;

  const CLASSIFY_URL = "/classify";

  const HEIGHT = 500;
  const WIDTH = 500;

  let canvasElem = document.getElementById("canvas");
  let predictionElem = document.getElementById("prediction");

  canvasElem.setAttribute("width", WIDTH);
  canvasElem.setAttribute("height", HEIGHT);
  context = canvasElem.getContext("2d");

  let clickX = new Array();
  let clickY = new Array();
  let clickDrag = new Array();
  let paint;

  /* --------------- mouse/click handlers -------------------*/

  $("#canvas").mousedown(function(e) {
    let mouseX = e.pageX - this.offsetLeft;
    let mouseY = e.pageY - this.offsetTop;
    paint = true;
    addClick(mouseX, mouseY, false);
    redraw();
  });

  $("#canvas").mousemove(function(e) {
    if (paint) {
      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
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

  // Set up touch events for mobile, etc
  canvasElem.addEventListener(
    "touchstart",
    function(e) {
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
      var mouseEvent = new MouseEvent("mouseup", {});
      canvas.dispatchEvent(mouseEvent);
    },
    false
  );

  canvasElem.addEventListener(
    "touchmove",
    function(e) {
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
  }

  async function classify() {
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
    console.log(respJson);

    predictionElem.innerText = respJson.number;
  }

  function log(DEBUG, message) {
    if (DEBUG) console.log(message);
  }
});
