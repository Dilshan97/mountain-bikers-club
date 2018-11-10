import dom from "../library/tagged-dom.js";
import anime from "../vendor/anime.js";

export default class PrivateButton extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.loading = false;
    }

    connectedCallback() {
        this.url = this.dataset.url || "";
        this.activeText = this.dataset.active;
        this.inactiveText = this.dataset.inactive;
        this.initialStatus = JSON.parse(this.dataset.initialStatus || "null");

        const partial = dom`
            ${styles}
            <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
                <g fill="currentColor">
                    <path d="M25,25.5c0,0.276 -0.224,0.5 -0.5,0.5l-10,0c-0.276,0 -0.5,-0.224 -0.5,-0.5l0,-8c0,-0.276 0.224,-0.5 0.5,-0.5l10,0c0.276,0 0.5,0.224 0.5,0.5l0,8Zm-0.5,-9.5l-10,0c-0.827,0 -1.5,0.673 -1.5,1.5l0,8c0,0.827 0.673,1.5 1.5,1.5l10,0c0.827,0 1.5,-0.673 1.5,-1.5l0,-8c0,-0.827 -0.673,-1.5 -1.5,-1.5"></path>
                    <path class="lock" d="M19.5,10c-2.481,0 -4.5,2.019 -4.5,4.5l0,2.5l1,0l0,-2.5c0,-1.93 1.57,-3.5 3.5,-3.5c1.93,0 3.5,1.57 3.5,3.5l0,1.5c0,0.276 0.224,0.5 0.5,0.5c0.276,0 0.5,-0.224 0.5,-0.5l0,-1.5c0,-2.481 -2.019,-4.5 -4.5,-4.5"></path>
                </g>
            </svg>
            <span :proxy="text">${dom``}</span>
        `;

        const svg = partial.fragment.querySelector(".lock");
        let clickTimeout = 0;

        partial.render(this.shadow)
            .then(proxy => {
                this.render(proxy, svg, this.initialStatus);
                this.addEventListener("click", () => {
                    if (this.loading) {
                        return;
                    }

                    this.loading = true;
                    clearTimeout(clickTimeout);
                    this.classList.add("is-active");
                    clickTimeout = setTimeout(() => {
                        this.classList.remove('is-active')
                    }, 250);

                    fetch(this.url, {
                        method: "PUT",
                        credentials: "include"
                    })
                        .then(response => response.json())
                        .then(data => this.render(proxy, svg, data.status));
                }, { passive: true });
            });
    }

    render(proxy, svg, status) {
        if (typeof status === "boolean") {
            const timeline = anime.timeline();

            if (status) {
                // private
                timeline.add({
                    targets: svg,
                    transform: 'translate(0 -1) rotate(0 15 17)',
                    duration: 550,
                }).add({
                    targets: svg,
                    transform: 'translate(0 0) rotate(0 15 17)',
                    duration: 250,
                });

                setTimeout(() => {
                    this.classList.add('is-private');
                    proxy.text = this.activeText;
                }, 550);
            } else {
                // public
                timeline.add({
                    targets: svg,
                    transform: 'translate(0 -1) rotate(0 15 17)',
                    duration: 250,
                }).add({
                    targets: svg,
                    transform: 'translate(0 -1) rotate(-25 15 17)',
                    duration: 550,
                });

                setTimeout(() => {
                    this.classList.remove('is-private');
                    proxy.text = this.inactiveText;
                }, 350);
            }
        }

        setTimeout(() => this.loading = false, 800);
    }
}

const styles = dom`
<style>
    :host {
        display: inline-flex;
        align-items: center;
        /*border: 1px solid;*/
        border-radius: 3px;
        margin: 0 5px;
        line-height: 20px;
        cursor: pointer;
        padding: 0 10px 0 0;
        position: relative;
    }

    :host::after {
        content: "";
        display: block;
        position: absolute;
        z-index: -1;
        background: currentColor;
        border-radius: 3px;
        opacity: 0;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        will-change: opacity;
        transition: opacity 150ms;
    }

    :host(:hover)::after {
        opacity: 0.13;
    }

    :host(.is-active)::after {
        opacity: 0.3;
    }

    :host(:not(.is-private)) {
        border-color: var(--green);
        color: var(--green);
    }
    
    :host(.is-private) {
        border-color: var(--violet);
        color: var(--violet);
    }
</style>
`;
