# mnist-cnn-demo

A demo of a Convolution Neural Network trained on MNIST data. The CNN is exposed as an HTTP endpoint using Flask. The application is deployed as a Docker container on an EC2.

[Try the demo here.](http://ec2-13-56-233-174.us-west-1.compute.amazonaws.com/)

## Project Structure
* [static/main.js](https://github.com/arman-ashrafian/mnist-cnn-demo/blob/master/static/main.js)
  - This file creates the canvas, implements drawing functionality, and sends base64 encoded image of the canvas to the server.
* [cnn.py](https://github.com/arman-ashrafian/mnist-cnn-demo/blob/master/cnn.py) 
  - This file creates the CNN Pytorch model.
* [server.py](https://github.com/arman-ashrafian/mnist-cnn-demo/blob/master/server.js)
  - This file is the entire Flask server which handles '/' and '/classify' routes.

## Screenshot
![screenshot](screenshot.png)
