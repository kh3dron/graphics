#include <FPT.h>

int SWIDTH = 2000;
int SHEIGHT = 2000;

// Function to convert screen coordinates to world coordinates
void map(int screen[2], double x1, double x2, double y1, double y2, double world[2]) {
    world[0] = x1 + (x2 - x1) * (screen[0] / (double)SWIDTH);
    world[1] = y1 + (y2 - y1) * (screen[1] / (double)SHEIGHT);
}

// Function to calculate the escape time for a point in the Mandelbrot set, up to 100 iterations
int mandel(double x, double y) {
    double a = 0, b = 0;
    int i = 0;
    while (i < 100) {
        double a1 = a * a - b * b + x;
        double b1 = 2 * a * b + y;
        a = a1;
        b = b1;
        if (a * a + b * b > 4) {
            return i; // Return the number of iterations
        }
        i++;
    }
    return i;
}

int main() {

    int p[2]; 
    int numpoints,q, x0,y0,x1,y1 ;
    double world[2];

    G_init_graphics(SWIDTH, SHEIGHT);
    G_rgb(0, 0, 0); // Black
    G_fill_rectangle(0, 0, SWIDTH, SHEIGHT);

    double lowleft[2] = {-2, -2};
    double upright[2] = {2, 2};
    double side = 4;

    for (int depth = 0; depth < 30; depth++) {

        // Draw the Mandelbrot set with colored points
        for (int i = 0; i < SWIDTH; i++) {
            for (int j = 0; j < SHEIGHT; j++) {
                int p[2] = {i, j};
                map(p, lowleft[0], upright[0], lowleft[1], upright[1], world);
                int iterations = mandel(world[0], world[1]);
                double gray = (double)iterations / 100; // Normalize to [0, 1]
                G_rgb(gray, gray, gray); // Set grayscale color
                G_point(i, j);
            }
        }


    // click an area and zoom in by 4x

    G_rgb(1, 0, 0) ;  // red
    Gi_wait_click(p) ;
    x0 = p[0] ; y0 = p[1] ;
    G_rectangle (x0-500, y0-500, 1000,1000) ;// mark the clicked point
    G_wait_key();

    // reshape the window to the clicked point
    map(p, lowleft[0], upright[0], lowleft[1], upright[1], world);
    side /= 2;

    lowleft[0] = world[0] - side / 2;
    lowleft[1] = world[1] - side / 2;
    upright[0] = world[0] + side / 2;
    upright[1] = world[1] + side / 2;

    }


    for (int i = 0; i < 10; i++) {
        int q = G_wait_key(); // Pause to look...any key to continue
    }
    G_close(); // Terminate graphics
    return 0;
}
