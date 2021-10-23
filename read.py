import json
import os
import numpy as np
from matplotlib import pyplot as plt


f= open("heightmap2.json","r")



data = json.loads(f.read())
numpyarray = np.asarray(data)

plt.imshow(numpyarray,interpolation='nearest',cmap="binary")
plt.show()