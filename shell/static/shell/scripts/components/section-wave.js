export default class Wave extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.color = this.dataset.color;
        this.height = this.dataset.height;

        this.shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    height: ${this.height || '6.667vw'};
                    border-radius: 0 0 65% 55%/0 0 100% 60%;
                    background: ${this.color};
                    transform: scale(1.3, 2.7) rotate(-0.3deg);
                    transform-origin: center bottom;
                    position: relative;
                }
            </style>
        `;

        // FIXME It should work with the shadow DOM
        this.style.backgroundColor = this.color || null;

        this.setAttribute('aria-hidden', String(true));
    }
}
