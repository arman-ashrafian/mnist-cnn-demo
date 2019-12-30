from flask import Flask, render_template, request, jsonify
from cnn import CNN, predict
import torch
import re
import numpy as np
import base64
from io import BytesIO
from PIL import Image
import sys

MODEL_STATE_FILE = 'model.pt'

app = Flask(__name__)

print(f"Loading CNN weights ... ({MODEL_STATE_FILE})")
cnn = CNN()
cnn.load_state_dict(torch.load(MODEL_STATE_FILE))

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/classify", methods=['POST'])
def classify():
    if request.method == 'POST':
        base64Data = request.get_json()['imgData']
        data = re.sub('^data:image/.+;base64,', '', base64Data)
        img = Image.open(BytesIO(base64.b64decode(data)))

        img_size = 28,28
        img = img.resize(img_size, Image.ANTIALIAS)
        img = img.convert('L')

        img_array = np.asarray(img, dtype=np.float32)
        img_array = img_array.flatten()

        # convert to pytorch tensor
        img_tensor = torch.from_numpy(img_array)
        # divide image by its maximum pixel value for numerical stability
        img_tensor = img_tensor / torch.max(img_tensor)
        # [num_channel x image width x image height]
        img_tensor = img_tensor.view(1,1,28,28)
        
        pred = predict(cnn, img_tensor)

        return '{ "number": %d}' % pred


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("python server.py <PORT> <DEBUG: true|false>")
        sys.exit(1)
    
    port = int(sys.argv[1])
    debug = (sys.argv[2] == 'true')

    app.run(host='0.0.0.0', port=port, debug=debug)

