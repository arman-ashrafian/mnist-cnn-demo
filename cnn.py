# PyTorch and neural network imports
import torch
import torch.nn as nn
import torch.optim as optim
import torch.utils.data as utils
import torch.nn.functional as F
import numpy as n

class CNN(nn.Module):
    
    def __init__(self):
        super(CNN, self).__init__()
        
        # convolutional layers
        self.conv1 = nn.Conv2d(1, 6, kernel_size=5)
        self.conv2 = nn.Conv2d(6, 12, kernel_size=5)
        
        # linear layers
        self.fc1 = nn.Linear(12*4*4, 120)
        self.fc2 = nn.Linear(120, 60)
        self.fc3 = nn.Linear(60, 10)
        
        # dropout layer
        self.drop = nn.Dropout(0.2)
    
    def forward(self, x):
        
        # Convolution 1
        out = self.conv1(x)                               # conv
        out = F.relu(out)                                 # relu
        out = F.max_pool2d(out, kernel_size=2, stride=2)  # pool (compress in half)
        
        # Convolution 2
        out = self.conv2(out)                             # conv
        out = F.relu(out)                                 # relu
        out = F.max_pool2d(out, kernel_size=2, stride=2)  # pool (compress in half)
            
        # Dropout
        out = self.drop(out)
        
        # Fully Connected 1
        out = out.view(-1, 12*4*4)
        out = self.fc1(out)
        out = F.relu(out)
        
        # Fully Connected 2
        out = self.fc2(out)
        out = F.relu(out)
        
        # Fully Connected 3
        out = self.fc3(out)
        
        return out

def predict(net, img):
    net.eval()
    out = net(img)
    print(out)
    pred = torch.argmax(out.data, 1)
    return pred.item()
