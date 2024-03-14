// A function that can phase color between a certain number of anchor points in a number of steps. 
// useful to create a gradient of colors that's longer than distance between two points.

#include <FPT.h>

#define SWIDTH 2000
#define SHEIGHT 2000
#define NUM_ANCHORS 8
#define STEPS 500
#define STEPS_PER_SEGMENT (STEPS / (NUM_ANCHORS - 1))

// Function to calculate the color at the given step along the gradient
void calculateColor(double step, double anchors[][3], int numAnchors, double colors[]) {
    int segment = (int)(step * (numAnchors - 1)); // Determine which segment of the gradient we're in
    double segmentStep = (step * (numAnchors - 1)) - segment; // Calculate step within the segment

    // Perform linear interpolation between anchor points
    for (int i = 0; i < 3; i++) {
        colors[i] = anchors[segment][i] * (1 - segmentStep) + anchors[segment + 1][i] * segmentStep;
    }
}

int main() {
    G_init_graphics(SWIDTH, SHEIGHT);
    G_rgb(0, 0, 0);
    G_fill_rectangle(0, 0, SWIDTH, SHEIGHT);

    double anchors[NUM_ANCHORS][3] = {
        {0, 0, 0},
        {0, 0, 1},
        {0, 1, 0},
        {0, 1, 1},
        {1, 0, 0},
        {1, 0, 1},
        {1, 1, 0},
        {1, 1, 1}
    };
    double colors[3];

    // Calculate colors at different steps and draw rectangles with those colors
    for (int i = 0; i < STEPS; i++) {
        double step = (double)i / (STEPS - 1);
        calculateColor(step, anchors, NUM_ANCHORS, colors);
        G_rgb(colors[0], colors[1], colors[2]);
        G_fill_rectangle(0, i * (SHEIGHT / STEPS), SWIDTH, SHEIGHT / STEPS);
    }

    int q = G_wait_key();
    return 0;
}
