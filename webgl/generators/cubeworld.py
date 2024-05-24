# geneate a .obj file of a field of cubes!

import sys
import os
import random


#    PREPARE YOURSELF... FOR CUBE
#       v6----- v5
#      /|      /|
#     v1------v0|
#     | |     | |
#     | |v7---|-|v4
#     |/      |/
#     v2------v3


# delete old cubesfiles
try:
    os.remove("../resources/cubes.obj")
    os.remove("../resources/cubes.mtl")
    print("deleted prior cubes")
except FileNotFoundError:
    pass

with open("../resources/cubes.obj", "a") as f:
    f.write("mtllib cubes.mtl\n")

# flat plane of cubes

size = 0.5
y = 0
vertices = []
numCubes = 20 # cubes in 2 directions (squared)

for x in range(numCubes):
    for z in range(numCubes):

        # flip coords to extend the cubes ahead of us, not backwards
        z *= -1 

        # each cube needs a name for it's material / color
        name = "cube-{}-{}".format(str(x), str(y))

        # coordinates start at the bottom edge of each cube and extend by the size

        xl = x
        xh = x + size
        yl = y
        yh = y + size + random.random()
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

        # write all the vertices in a huge list
        with open("../resources/cubes.obj", "a") as f:
            f.write("o " + name + " \n")

            for v in vert:
                f.write("v {} {} {}\n".format(v[0], v[1], v[2]))


for x in range(numCubes):
    for y in range(numCubes):
        name = "cube-{}-{}".format(str(x), str(y))

        # face data must be offset to correctly hit each set of 8
        d = (numCubes * x + y) * 8
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

        # each cube gets a random color assigned to it's name
        r = round(random.random(), 2)
        g = round(random.random(), 2)
        b = round(random.random(), 2)

        with open("../resources/cubes.mtl", "a") as f:
            f.write("newmtl {}\n".format(name))
            f.write("Kd {} {} {}\n".format(r, g, b))
