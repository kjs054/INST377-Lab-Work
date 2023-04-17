/* eslint-disable max-len */
/*
  Welcome to Javascript!

  This file contains parts of a simple script to make your carousel work.
  Please feel free to edit away - the main version of this with all the notes is safely stored elsewhere
*/

let slidePosition = 0;
const slides = document.getElementsByClassName('carousel_item');
const slidesArray = Array.from(slides);
const totalSlides = slides.length;

console.log("test")

document.
    getElementById('next')
    .addEventListener("click", function() {
      console.log("check")
        moveToNextSlide();
    });

document.
    getElementById('prev')
    .addEventListener("click", function() {
        moveToPrevSlide();
});

function updateSlidePosition() {

  slidesArray.forEach((slide) => {  
    slide.classList.remove('visible');
    slide.classList.add('hidden');
  });

  console.log(slidePosition);
  slides[slidePosition].classList.add("visible")
}

function moveToNextSlide() {

  if(slidePosition === totalSlides - 1) {
    slidePosition = 0;
  } else {
    slidePosition += 1;
  }

  updateSlidePosition(); // this is how you call a function within a function
}
function moveToPrevSlide() {

  if (slidePosition == 0) {
    slidePosition = totalSlides - 1
  } else {
    slidePosition = slidePosition - 1
  }

  updateSlidePosition();
}

/*
  These two functions have been assigned via "addEventListener"
  to the elements accessed by the "querySelector" set to the class name on each
*/

// Paying close attention to the above queryselector, write one that fires
// when you want a "prev" slide