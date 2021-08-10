class Slideshow extends HTMLElement {

  data = null;
  nav = null;
  tagline = null;
  currentIndex = 0;
  currentData = null;

  constructor() {
    super();
  }

  connectedCallback() {
    this.loadData();
  }

  static get observedAttributes() {
    return [/* array of attribute names to monitor for changes */];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
  }

  async loadData() {
    const x = await fetch('/assets/json/slideshow.json');
    this.data = await x.json();
    //
    this.nav = this.children.namedItem('ss-nav');
    this.nav.setAttribute('data-ids', this.data.slides.map(s => s.id));
    this.nav.setAttribute('data-current', this.currentIndex);
    // 
    this.tagline = this.children.namedItem('tagline');
    this.tagline.innerHTML = this.data.tagline;
    //
    this.addEventListener('slideshownav', (e) => this.navCallback(e));
    this.classList.add('show');
  }

  navCallback(e) {
    this.currentIndex = this.data.slides.findIndex(s => s.id === e.detail.id);
    this.nav.setAttribute('data-current', this.currentIndex);
  }
}

customElements.define('slideshow-el', Slideshow);