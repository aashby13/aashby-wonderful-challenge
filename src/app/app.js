import { gsap, ScrollTrigger, SplitText } from "gsap/all";

export default class App {

  constructor() { 
    gsap.registerPlugin(ScrollTrigger, SplitText);
    this.slideshow = document.querySelector('slideshow-el');
    this.init();
  }

  async init() {
    const x = await fetch('/assets/json/slideshow.json');
    const data = await x.json();
    this.slideshow.data = data;
    this.slideshow.autoPlay = true;
    this.animFloaters();
    this.animLogos();
    this.animHeadline();
  }

  animFloaters() {
    const floaters = document.querySelectorAll('.floater');
    const fontSize = parseFloat(window.getComputedStyle(document.body, null).getPropertyValue('font-size').replace('px', ''));
    floaters.forEach(f => {
      gsap.to(f, {
        scrollTrigger: {
          trigger: f,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        },
        yPercent: f.clientHeight < fontSize ? -500 : -125,
        rotation: f.classList.contains('orbit') ? -90 : 0,
        transformOrigin: 'center',
        duration: 4,
        ease: 'none'
      })
    });
  }

  animLogos() {
    gsap.from('.logo', {
      opacity: 0,
      y: 100,
      duration: 0.6,
      stagger: 0.2,
      ease: 'sine.out',
      scrollTrigger: {
          trigger: '.logos-container',
          start: 'top center+=10%',
          toggleActions: 'play none none none'
        }
    })
  }

  animHeadline() {
    const split = new SplitText(document.querySelector('.headline p'), {type: 'words,chars'});
    gsap.from(split.words, {
      opacity: 0,
      xPercent: 50,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: {
          trigger: '.headline',
          start: 'top center+=20%',
          toggleActions: 'play none none none'
        }
    })
  }

}





