(function() {
  class App {
    constructor() { 
        this.init(); 
    }

    async init() {
      const x = await fetch('/assets/json/slideshow.json');
      const data = await x.json();
      document.querySelector('slideshow-el').data = data;
    }
  }
  const app = new App();
})();



