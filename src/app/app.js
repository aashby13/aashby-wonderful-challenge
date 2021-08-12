export default class App {

  constructor() { 
    this.slideshow = document.querySelector('slideshow-el');
    this.init();
  }

  async init() {
    const x = await fetch('/assets/json/slideshow.json');
    const data = await x.json();
    this.slideshow.data = data;
    this.slideshow.autoPlay = true;
  }
}





