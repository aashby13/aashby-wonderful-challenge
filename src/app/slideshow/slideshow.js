import { gsap } from 'gsap/all';

export default class Slideshow extends HTMLElement {

  constructor() {
    super();

    this._autoPlay = false;
    this.delay = 8000;
    this.timer = null;
    this.nav = null;
    this.tagline = null;
    this.contentWrap = null;
    this.titleEl = null;
    this.textEl = null;
    this.btnWrap = null;
    this.graphic = null;
    this.prevIndex = null;
    this.currentData = null;
    this._data = null;
    this._currentIndex = 0;
    this.flipAnim = null;
    this.slideContentAnim = null;
    this.slideLeftAnim = null;
  }

  get autoPlay() {
    return this._autoPlay;
  }
  set autoPlay(b) {
    this._autoPlay = b;
    if (this._data && this._autoPlay) this.onAutoPlay();
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
    window.addEventListener('blur', () => {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    });
    window.addEventListener('focus', () => {
      if (!this.timer && this._autoPlay) this.onAutoPlay();
    });
    this.nav = this.children.namedItem('ss-nav');
    this.tagline = this.children.namedItem('tagline');
    this.contentWrap = this.children.namedItem('content-wrap');
    this.graphic = this.contentWrap.children.namedItem('graphic');
    this.titleEl = this.contentWrap.children[0].children[0];
    this.textEl = this.contentWrap.children[0].children[1];
    this.btnWrap = this.contentWrap.children[0].children[2];
    this.buildAnim();
  }

  onData() {
    this.nav.setAttribute('data-ids', this.data.slides.map(s => s.id));
    this.nav.setAttribute('data-current', this.currentIndex);
    // 
    this.tagline.innerHTML = this.data.tagline;
    this.changeContent();
    //
    this.addEventListener('slideshownav', (e) => this.navCallback(e));
    /* this.classList.add('show'); */
    //
    gsap.set([this.titleEl, this.textEl, this.btnWrap], {xPercent: 108});
    gsap.set(this.graphic, {xPercent: -206});
    gsap.to(this, {opacity: 1, ease: 'sine.out', duration: 0.8, delay: 1.6});
    gsap.to('#graphic svg #big-gear', {duration: 8, rotation: 360, repeat: -1, transformOrigin: 'center', ease: 'none'});
    gsap.to('#graphic svg #small-gear', {duration: 4, rotation: -360, repeat: -1, transformOrigin: 'center', ease: 'none'});
    this.slideContentAnimLeft.play(0);
    this.graphicAnimRight.play(0);
    
  }

  navCallback(e) {
    this.currentIndex = this.data.slides.findIndex(s => s.id === e.detail.id);
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      setTimeout(() => {
        if (this.autoPlay) this.onAutoPlay();
      }, 2500);
    }
  }

  changeContent() {
    this.currentData = this.data.slides[this.currentIndex];
    this.titleEl.innerHTML = this.currentData.title;
    this.textEl.innerHTML = this.currentData.text;
  }

  buildAnim() {
    const elArr = [this.titleEl, this.textEl, this.btnWrap];
    //
    this.flipAnim = gsap.timeline({paused: true})
      .to(elArr, {
        duration: 0.35,
        rotateX: 90,
        stagger: 0.15,
        ease: 'power2.in'
      }, 0)
      .set(elArr, { rotateX: -90 })
      .call(() => this.changeContent())
      .to(elArr.reverse(), {
        duration: 0.35,
        rotateX: 0,
        stagger: 0.15,
        ease: 'power2.in'
      }, '+=0.1');
    //
    elArr.reverse();
    //
    this.slideContentAnimRight = gsap.timeline({paused: true})
      .to(elArr, {
        duration: 0.35,
        opacity: 0,
        rotateX: 90,
        xPercent: 36,
        stagger: 0.15,
        ease: 'power2.in'
      }, 0.4)
      .set(elArr, { rotateX: -90, xPercent: 76 })
      .call(() => this.changeContent())
      .to(elArr.reverse(), {
        duration: 0.35,
        opacity: 1,
        rotateX: 0,
        xPercent: 108,
        stagger: 0.15,
        ease: 'power2.in'
      }, '+=0.5');
    //
    this.slideContentAnimLeft = gsap.timeline({paused: true})
      .to(elArr, {
        duration: 0.35,
        opacity: 0,
        rotateX: 90,
        xPercent: 76,
        stagger: 0.15,
        ease: 'power2.in'
      }, 0.4)
      .set(elArr, { rotateX: -90, xPercent: 36 })
      .call(() => this.changeContent())
      .to(elArr.reverse(), {
        duration: 0.35,
        opacity: 1,
        rotateX: 0,
        xPercent: 0,
        stagger: 0.15,
        ease: 'power2.in'
      }, '+=0.5');
    //
    this.graphicAnimLeft = gsap.timeline({paused: true})
      .to(['#graphic svg #triangle', '#graphic svg #small-gear', '#graphic svg #big-gear'], {
        duration: 0.4,
        y: 30,
        opacity: 0,
        scale: 0.5,
        stagger: 0.1,
        ease: 'back.in'
      })
      .to('#graphic svg #guys', {
        duration: 0.4,
        yPercent: 105,
        ease: 'power3.in'
      }, '-=0.3')
      .to(this.graphic, {
        xPercent: -206,
        duration: 0.8,
        ease: 'back.in'
      }, '+=0.25')
      .to('#graphic svg #guys', {
        duration: 0.4,
        yPercent: 0,
        ease: 'power3.out'
      })
      .to(['#graphic svg #big-gear', '#graphic svg #small-gear', '#graphic svg #triangle'], {
        duration: 0.4,
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        ease: 'back.out'
      }, '-=0.3');
    //
    this.graphicAnimRight = gsap.timeline({paused: true})
      .to(['#graphic svg #triangle', '#graphic svg #small-gear', '#graphic svg #big-gear'], {
        duration: 0.4,
        y: 30,
        opacity: 0,
        scale: 0.5,
        stagger: 0.1,
        ease: 'back.in'
      })
      .to('#graphic svg #guys', {
        duration: 0.4,
        yPercent: 105,
        ease: 'power3.in'
      }, '-=0.3')
      .to(this.graphic, {
        xPercent: 0,
        duration: 0.8,
        ease: 'back.in'
      }, '+=0.25')
      .to('#graphic svg #guys', {
        duration: 0.4,
        yPercent: 0,
        ease: 'power3.out'
      })
      .to(['#graphic svg #big-gear', '#graphic svg #small-gear', '#graphic svg #triangle'], {
        duration: 0.4,
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.1,
        ease: 'back.out'
      }, '-=0.3');

  }

  animate() {
    if (this._currentIndex !== this.prevIndex) {
      this.nav.setAttribute('data-current', this._currentIndex);
      //
      if (this.prevIndex%2 === this._currentIndex%2) {
        // if same side
        this.flipAnim.play(0, false);
        
      } else if (this._currentIndex%2) {
        // content go right, graphic go left
        this.slideContentAnimRight.play(0);
        this.graphicAnimLeft.play(0);
      } else {
        // content go left, graphic go right
        this.slideContentAnimLeft.play(0);
        this.graphicAnimRight.play(0);
      }
    }
  }

  onAutoPlay() {
    if (this._autoPlay) {
      this.timer = setTimeout(() => {
        if (this._currentIndex === this.data.slides.length -1) this.currentIndex = 0;
        else this.currentIndex++;
        this.onAutoPlay();
      }, this.delay);
    }
  }
}

customElements.define('slideshow-el', Slideshow);