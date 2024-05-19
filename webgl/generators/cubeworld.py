# geneate a .obj file of a cube

import sys
import os
import random
import random


#    PREPARE YOURSELF... FOR CUBE
#       v6----- v5
#      /|      /|
#     v1------v0|
#     | |     | |
#     | |v7---|-|v4
#     |/      |/
#     v2------v3


try:
    os.remove("../resources/cubes.obj")
    os.remove("../resources/cubes.mtl")
    print("deleted prior cube")
except FileNotFoundError:
    pass

with open("../resources/cubes.obj", "a") as f:
    f.write("mtllib cubes.mtl\n")

size = 0.5
y = 0
vertices = []

for x in range(10):
    for z in range(10):

        z *= -1
        name = "cube-{}-{}".format(str(x), str(y))

        xl = x
        xh = x + size
        yl = y
        yh = y + size
        zl = z
        zh = z + size

        vert = [
            (xh, yh, zh),
            (xl, yh, zh),
            (xl, yl, zh),
            (xh, yl, zh),
            (xh, yl, zl),
            (xh, yh, zl),
            (xl, yh, zl),
            (xl, yl, zl),
        ]

        with open("../resources/cubes.obj", "a") as f:
            f.write("o " + name + " \n")

            for v in vert:
                f.write("v {} {} {}\n".format(v[0], v[1], v[2]))

for x in range(10):
    for y in range(10):
        name = "cube-{}-{}".format(str(x), str(y))
        d = (10 * x + y) * 8
        faces = [
            (d + 0, d + 1, d + 2, d + 3),  # front
            (d + 5, d + 0, d + 3, d + 4),  # right
            (d + 6, d + 5, d + 4, d + 7),  # back
            (d + 1, d + 2, d + 7, d + 6),  # left
            (d + 6, d + 5, d + 0, d + 1),  # top
            (d + 3, d + 4, d + 7, d + 2),  # bottom
        ]

        with open("../resources/cubes.obj", "a") as f:
            f.write("usemtl {}\n".format(name))
            for face in faces:
                f.write(
                    "f {} {} {} {}\n".format(
                        face[0] + 1, face[1] + 1, face[2] + 1, face[3] + 1
                    )
                )

        r = round(random.random(), 2)
        g = round(random.random(), 2)
        b = round(random.random(), 2)
        
        with open("../resources/cubes.mtl", "a") as f:
            f.write("newmtl {}\n".format(name))
            f.write("Kd {} {} {}\n".format(r, g, b))
