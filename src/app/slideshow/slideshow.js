export default class Slideshow extends HTMLElement {

  constructor() {
    super();

    this.autoPlay = false;
    this.delay = 10000;
    this.timer = null;
    this.nav = null;
    this.tagline = null;
    this.contentWrap = null
    this.prevIndex = null;
    this.urrentData = null;
    this._data = null;
    this._currentIndex = 0;
  }

  get data() {
      return this._data;
    }
  set data(dta) {
    this._data = dta;
    this.onData();
  }

  get currentIndex() {
      return this._currentIndex;
    }
  set currentIndex(n) {
    this.prevIndex = this._currentIndex;
    this._currentIndex = n;
    this.animate();
  }

  connectedCallback() {
    /* this.loadData(); */
  }

  static get observedAttributes() {
    return ['auto-play', 'delay'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, newValue, typeof newValue);
    if (name === 'delay' && newValue) this.delay = parseInt(newValue);
    //
    if (name === 'auto-play') {
      if (newValue === 'true') this.autoPlay = true; 
      else this.autoPlay = false;
      if (this._data && this.autoPlay) this.onAutoPlay();
    }
  }

  onData() {
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
    if (this.autoPlay) this.onAutoPlay();
  }

  navCallback(e) {
    this.currentIndex = this.data.slides.findIndex(s => s.id === e.detail.id);
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    } 
    if (this.autoPlay) this.onAutoPlay();
  }

  changeContent() {
    this.currentData = this.data.slides[this.currentIndex];
    this.contentWrap.children[0].children[0].innerHTML = this.currentData.title;
    this.contentWrap.children[0].children[1].innerHTML = this.currentData.text;
  }

  animate() {
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
      }, 700);
    }
  }

  onAutoPlay() {
    this.timer = setTimeout(() => {
      if (this._currentIndex === this.data.slides.length -1) this.currentIndex = 0;
      else this.currentIndex++;
      this.onAutoPlay();
    }, this.delay);
  }
}

customElements.define('slideshow-el', Slideshow);