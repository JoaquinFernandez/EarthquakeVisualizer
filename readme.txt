In this assingment I learnt how to use the Three library, I found it pretty interesing. 
First, we have the subtitle of the page, that will change depending what day we're showing
in the graphics. Then we have the canvas object itself, created with the library THREE,
which is for 3D graphics, with the information and the parser provided, I assigned the
data to the drawing space, but first I use a grid to show the Cylinders, as the extra
point requested, after I draw the cylinders, scaling the maximum and minimum longitude and
latitude (max latitude is 90 and min is -90, max longitude is 180 and min -180) and,
depending on the magnitude (with 5 division points) the cylinder will have a different
color. Then everything gets shown in the screen, below the canvas we have two buttons to
go to the next or the previous day and, when reaching the latest day we have information
of, it hides. I also added a window resize function, as the extra points requested, for
resizing the canvas depending on the window size. I used the namespace technique showed
in class and documented the code. As in the last assignment i got a bad grade in design,
in this one I tried that it was as clear and appealing as I could make, i.e. the 
magnitude of the earthquakes goes from a cool color to a warm color, I didn't use more 
frames in the radius or height of the cylinder because there was too much data and my
computer usually crashed. I used the Math.random() function so the first day displayed
is not always the same.