# geneate a .obj file of a cube

import sys
import os

def cube(size):
    # generate the 8 vertices of the cube
    vertices = [
        (size, size, size),
        (size, size, -size),
        (size, -size, size),
        (size, -size, -size),
        (-size, size, size),
        (-size, size, -size),
        (-size, -size, size),
        (-size, -size, -size)
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
            f.write("v {} {} {}\n".format(v[0], v[1], v[2]))

        # write the faces to the .obj file
        for face in faces:
            f.write("f {} {} {} {}\n".format(face[0] + 1, face[1] + 1, face[2] + 1, face[3] + 1))

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python cube.py <size>")
        sys.exit(1)

    size = float(sys.argv[1])
    cube(size)
    print("cube.obj generated with size {}".format(size))