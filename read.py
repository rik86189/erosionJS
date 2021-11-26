import  numpy as np
import matplotlib.pyplot as plt
import cv2
import os
import  json






img_array = cv2.imread( "map test.png",cv2.IMREAD_GRAYSCALE)
   


with open("customHeightmap.json","w") as outfile:
    json.dump(img_array.tolist(),outfile)
