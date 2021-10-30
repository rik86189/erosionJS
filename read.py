import json
import os
import numpy as np
from matplotlib import pyplot as plt
from PIL import Image

f= open("heightmap2.json","r")

data = json.loads(f.read())
numpyarray = np.asarray(data)




im = Image.fromarray(numpyarray)
im = im.convert("L")
im.save("erroded.png")
