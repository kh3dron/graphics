# geneate a .obj file of a cube

import sys
import os
import random

def cube(size):
    # generate the 8 vertices of the cube
    r = 1
    g = 0
    b = 0
    vertices = [
        (size, size, size, r, g, b),
        (size, size, -size, r, g, b),
        (size, -size, size, r, g, b),
        (size, -size, -size, r, g, b),
        (-size, size, size, r, g, b),
        (-size, size, -size, r, g, b),
        (-size, -size, size, r, g, b),
        (-size, -size, -size, r, g, b)
    ]

    # generate the 6 faces of the cube
    faces = [
        (0, 1, 3, 2),
        (0, 4, 5, 1),
        (0, 2, 6, 4),
        (7, 6, 2, 3),
        (7, 3, 1, 5),
        (7, 5, 4, 6)
    ]

    # remove the file if it already exists
    try:
        os.remove("resources/cube.obj")
        print("deleted prior cube")
    except FileNotFoundError:
        pass


    with open("../resources/cube.obj", "w") as f:

        f.write("# cube.obj\n")
        f.write("o cube\n")

        for v in vertices:
            f.write("v {} {} {} {} {} {} \n".format(v[0], v[1], v[2], v[3], v[4], v[5]))

        # write the faces to the .obj file
        for face in faces:
            f.write("f {} {} {} {}\n".format(face[0] + 1, face[1] + 1, face[2] + 1, face[3] + 1))

cube(1.0)