class SlideshowNav extends HTMLElement {

  buttons = [];

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['data-ids', 'data-current'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue) {
      switch (name) {
        case 'data-ids':
          newValue.split(',').forEach(str => {
            const btn = document.createElement('BUTTON');
            const dot = document.createElement('DIV');
            const span = document.createElement('SPAN');
            btn.dataset.id = str;
            dot.className = 'dot';
            span.append(str);
            btn.append(dot, span);
            btn.addEventListener('click', (e) => this.onDotClick(e));
            this.children.namedItem('nav-dots').append(btn);
            this.buttons.push(btn);
          });
          break;

        case 'data-current':
          if (oldValue) this.buttons[oldValue].classList.remove('current');
          this.buttons[newValue].classList.add('current');
          break;
      
        default:
          break;
      }
    }
  }

  /**
   * Dispatches CustomEvent 'slideshownav', which passes the slide ID for the parent (slideshow-el) to listen to;
   * @param {PointerEvent || MouseEvent} e Event of clicking on dotWrap button
   */
  onDotClick(e) {
    const navEvent = new CustomEvent('slideshownav', {
      detail: {id: e.target.dataset.id},
      bubbles: true,
      cancelable: true,
      composed: true
    });
    this.dispatchEvent(navEvent);
  }
}

customElements.define("slideshow-nav", SlideshowNav);