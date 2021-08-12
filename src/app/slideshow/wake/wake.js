import { gsap, MorphSVGPlugin } from "gsap/all";

export default class WakeElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    gsap.registerPlugin(MorphSVGPlugin);
    MorphSVGPlugin.defaultType = 'rotational';
    //
    gsap.timeline({repeat: -1})
      /* .to('wake-el svg #L1', {
        morphSVG: 'wake-el svg #M1',
        duration: 6,
        ease: 'sine.out'
      }) */
      .to('wake-el svg #L1', {
        morphSVG: 'wake-el svg #L2',
        duration: 7,
        ease: 'sine.out'
      })
      .to('wake-el svg #L1', {
        morphSVG: 'wake-el svg #L3',
        duration: 5,
        ease: 'sine.out'
      })
      .to('wake-el svg #L1', {
        morphSVG: 'wake-el svg #L1-2',
        duration: 9,
        ease: 'sine.out'
      });
    //
    gsap.timeline({repeat: -1})
    .to('wake-el svg #M1', {
        morphSVG: 'wake-el svg #M3',
        duration: 9,
        ease: 'sine.out'
      })
      .to('wake-el svg #M1', {
        morphSVG: 'wake-el svg #M2',
        duration: 2,
        ease: 'sine.out'
      })
      .to('wake-el svg #M1', {
        morphSVG: 'wake-el svg #M3',
        duration: 6,
        ease: 'sine.out'
      })
      .to('wake-el svg #M1', {
        morphSVG: 'wake-el svg #M1-2',
        duration: 3,
        ease: 'sine.out'
      });
    //
    gsap.timeline({repeat: -1})
      .to('wake-el svg #S1', {
        morphSVG: 'wake-el svg #S2',
        duration: 7,
        ease: 'sine.out'
      })
      .to('wake-el svg #S1', {
        morphSVG: 'wake-el svg #S3',
        duration: 4,
        ease: 'sine.out'
      })
      .to('wake-el svg #S1', {
        morphSVG: 'wake-el svg #S1-2',
        duration: 6,
        ease: 'sine.out'
      });
  }

}

customElements.define('wake-el', WakeElement);