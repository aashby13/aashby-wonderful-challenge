class Slideshow extends HTMLElement {

  data = null;
  nav = null;
  tagline = null;
  contentWrap = null
  prevIndex = null;
  currentData = null;
  _currentIndex = 0;

  get currentIndex() {
    return this._currentIndex;
  }
  set currentIndex(n) {
    this.prevIndex = this._currentIndex;
    this._currentIndex = n;
    if (this._currentIndex !== this.prevIndex) {
      this.nav.setAttribute('data-current', this._currentIndex);
      this.contentWrap.classList.remove('fade');
      //
      if (this._currentIndex%2) {
        this.contentWrap.classList.add('switch');
      } else {
        this.contentWrap.classList.remove('switch');
      }
      //
      if (this.prevIndex%2 === this._currentIndex%2) {
        window.requestAnimationFrame(() => this.contentWrap.classList.add('fade'));
      }
      //
      setTimeout(() => {
        this.changeContent();
      }, 500);
    }
  }

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
    this.contentWrap = this.children.namedItem('content-wrap');
    this.changeContent();
    //
    this.addEventListener('slideshownav', (e) => this.navCallback(e));
    this.classList.add('show');
    //
    this.autoPlay();
  }

  navCallback(e) {
    this.currentIndex = this.data.slides.findIndex(s => s.id === e.detail.id);
  }

  changeContent() {
    this.currentData = this.data.slides[this.currentIndex];
    this.contentWrap.children[0].children[0].innerHTML = this.currentData.title;
    this.contentWrap.children[0].children[1].innerHTML = this.currentData.text;
  }

  autoPlay() {
    setTimeout(() => {
      if (this._currentIndex === this.data.slides.length -1) this.currentIndex = 0;
      else this.currentIndex++;
      this.autoPlay();
    }, 6000);
  }
}

customElements.define('slideshow-el', Slideshow);