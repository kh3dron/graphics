import os
import random
import math

# Cleanup old files
try:
    os.remove("../resources/tree.obj")
    os.remove("../resources/tree.mtl")
    print("Deleted prior tree files")
except FileNotFoundError:
    pass

# Create .obj file and link .mtl
with open("../resources/tree.obj", "a") as f:
    f.write("mtllib tree.mtl\n")

# Tree dimensions
trunk_height = 1.5
trunk_radius = 0.1
crown_radius = 0.5
crown_offset = trunk_height

# Trunk vertices (cylinder)
trunk_segments = 10  # Number of segments for the trunk cylinder
angle_step = 360 / trunk_segments

# Write vertices for trunk
with open("../resources/tree.obj", "a") as f:
    f.write("o Tree_Trunk\n")
    for i in range(trunk_segments):
        angle = angle_step * i
        rad = angle * (3.14159 / 180)  # Convert to radians
        x = trunk_radius * math.cos(rad)
        z = trunk_radius * math.sin(rad)
        f.write(f"v {x} 0 {z}\n")
        f.write(f"v {x} {trunk_height} {z}\n")

    # Connect vertices to form faces
    for i in range(trunk_segments):
        next_i = (i + 1) % trunk_segments
        f.write(f"f {i*2+1} {i*2+2} {next_i*2+2} {next_i*2+1}\n")

# Write MTL for trunk
with open("../resources/tree.mtl", "a") as f:
    f.write("newmtl TrunkMaterial\n")
    f.write("Kd 0.36 0.25 0.20\n")  # Brown color

# Apply trunk material
with open("../resources/tree.obj", "a") as f:
    f.write("usemtl TrunkMaterial\n")

# Crown vertices (sphere)
crown_segments = 10  # Latitude segments
crown_rings = 10     # Longitude rings
for i in range(crown_rings + 1):
    phi = 3.14159 * i / crown_rings
    for j in range(crown_segments + 1):
        theta = 2 * 3.14159 * j / crown_segments
        x = crown_radius * math.sin(phi) * math.cos(theta)
        y = crown_radius * math.cos(phi) + crown_offset
        z = crown_radius * math.sin(phi) * math.sin(theta)
        with open("../resources/tree.obj", "a") as f:
            f.write(f"v {x} {y} {z}\n")

# Connect vertices to form faces for the crown
with open("../resources/tree.obj", "a") as f:
    f.write("o Tree_Crown\n")
    for i in range(crown_rings):
        for j in range(crown_segments):
            cur = i * (crown_segments + 1) + j
            next = cur + crown_segments + 1
            f.write(f"f {cur+1} {cur+2} {next+2} {next+1}\n")

# Write MTL for crown
with open("../resources/tree.mtl", "a") as f:
    f.write("newmtl LeafMaterial\n")
    f.write("Kd 0.0 0.5 0.0\n")  # Green color

# Apply crown material
with open("../resources/tree.obj", "a") as f:
    f.write("usemtl LeafMaterial\n")
