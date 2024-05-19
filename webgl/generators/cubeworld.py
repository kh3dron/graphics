# geneate a .obj file of a cube

import sys
import os
import random
import random


def cube(x, y, z, size, r, g, b):

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
        (xh, yh, zh, r, g, b),
        (xl, yh, zh, r, g, b),
        (xl, yl, zh, r, g, b),
        (xh, yl, zh, r, g, b),
        (xh, yl, zl, r, g, b),
        (xh, yh, zl, r, g, b),
        (xl, yh, zl, r, g, b),
        (xl, yl, zl, r, g, b),
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
    try:
        os.remove("resources/cube.obj")
        print("deleted prior cube")
    except FileNotFoundError:
        pass

    with open("../resources/cube.obj", "a") as f:

        f.write("# cube.obj\n")
        f.write("o cube\n")

        for v in vertices:
            f.write("v {} {} {} {} {} {} \n".format(v[0], v[1], v[2], v[3], v[4], v[5]))

        # write the faces to the .obj file
        for face in faces:
            f.write(
                "f {} {} {} {}\n".format(
                    face[0] + 1, face[1] + 1, face[2] + 1, face[3] + 1
                )
            )

for x in range(10):
    for y in range(10):
        cube(x, y, 0, .5, random.random(), random.random(), random.random())


