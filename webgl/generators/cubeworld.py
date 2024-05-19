# geneate a .obj file of a cube

import sys
import os
import random
import random


def cube(x, y, z, size, name, r, g, b):

    #    PREPARE YOURSELF... FOR CUBE
    #       v6----- v5
    #      /|      /|
    #     v1------v0|
    #     | |     | |
    #     | |v7---|-|v4
    #     |/      |/
    #     v2------v3

    xl = x
    xh = x + size
    yl = y
    yh = y + size
    zl = z
    zh = z + size

    vertices = [
        (xh, yh, zh),
        (xl, yh, zh),
        (xl, yl, zh),
        (xh, yl, zh),
        (xh, yl, zl),
        (xh, yh, zl),
        (xl, yh, zl),
        (xl, yl, zl)
    ]

    # associate the 6 faces of the cube
    faces = [
        (0, 1, 2, 3),  # front
        (5, 0, 3, 4),  # right
        (6, 5, 4, 7),  # back
        (1, 2, 7, 6),  # left
        (6, 5, 0, 1),  # top
        (3, 4, 7, 2),  # bottom
    ]

    # remove the file if it already exists


    with open("../resources/cubes.obj", "a") as f:
        f.write("mtllib cubes.mtl\n")
        f.write("o " + name + " \n")

        for v in vertices:
            f.write("v {} {} {}\n".format(v[0], v[1], v[2]))

        f.write("usemtl {}\n".format(name))

        # write the faces to the .obj file
        for face in faces:
            f.write(
                "f {} {} {} {}\n".format(
                    face[0] + 1, face[1] + 1, face[2] + 1, face[3] + 1
                )
            )

    with open("../resources/cubes.mtl", "a") as f:
        f.write("newmtl {}\n".format(name))
        f.write("Kd {} {} {}\n".format(r, g, b))

try:
    os.remove("../resources/cubes.obj")
    os.remove("../resources/cubes.mtl")
    print("deleted prior cube")
except FileNotFoundError:
    pass

# for x in range(10):
#     for y in range(10):
#         name = "cube" + str(x) + str(y)
#         color = round(random.random(), 2)
#         cube(x, y, 0, .5, color, color, color, name)


r = round(random.random(), 2)
g = round(random.random(), 2)
b = round(random.random(), 2)

cube(0, 0, 0, .5, "richard", r, g, b)