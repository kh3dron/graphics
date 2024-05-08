// Bounce a ball around the screen

#include <FPT.h>
#include <unistd.h>

int SWIDTH = 2000;
int SHEIGHT = 2000;



int main()
{
    G_init_graphics(SWIDTH, SHEIGHT);
    G_rgb(0, 0, 0);
    G_fill_rectangle(0, 0, SWIDTH, SHEIGHT);

    int x = 100, y = 100, dx = 10, dy = 10;

    int radius = 20;

    for (int i = 0; i < 1000; i++)
    {
        G_rgb(0, 0, 0);
        G_fill_rectangle(0, 0, SWIDTH, SHEIGHT);
        G_rgb(1, 0, 0);
        G_fill_circle(x, y, radius);
        
        x += dx;
        y += dy;
        if (x < radius || x > SWIDTH - radius)
        {
            dx = -dx;
        }
        if (y < radius || y > SHEIGHT - radius)
        {
            dy = -dy;
        }
        G_wait_key();
    }

    int q = G_wait_key(); // Pause to look...any key to continue

    G_close(); // Terminate graphics
    return 0;
}
