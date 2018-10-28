import dom from '../library/tagged-dom.js';

export default class PrivateButton extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.url = this.dataset.url;
        this.activeText = this.dataset.active;
        this.inactiveText = this.dataset.inactive;
    }

    connectedCallback() {
        const partial = dom`
            ${styles}
            <svg width="20" height="20" viewBox="0 0 20 20" >
                <g fill="currentColor">
                    <path d="M13,17.5c0,0.276 -0.224,0.5 -0.5,0.5l-10,0c-0.276,0 -0.5,-0.224 -0.5,-0.5l0,-8c0,-0.276 0.224,-0.5 0.5,-0.5l10,0c0.276,0 0.5,0.224 0.5,0.5l0,8Zm-0.5,-9.5l-10,0c-0.827,0 -1.5,0.673 -1.5,1.5l0,8c0,0.827 0.673,1.5 1.5,1.5l10,0c0.827,0 1.5,-0.673 1.5,-1.5l0,-8c0,-0.827 -0.673,-1.5 -1.5,-1.5"></path>
                    <path class="unlock" d="M14.5,1c-2.481,0 -4.5,2.019 -4.5,4.5l0,2.5l1,0l0,-2.5c0,-1.93 1.57,-3.5 3.5,-3.5c1.93,0 3.5,1.57 3.5,3.5l0,1c0,0.276 0.224,0.5 0.5,0.5c0.276,0 0.5,-0.224 0.5,-0.5l0,-1c0,-2.481 -2.019,-4.5 -4.5,-4.5"></path>
                    <path class="lock" d="M4,8l0,-1.5c0,-1.93 1.57,-3.5 3.5,-3.5c1.93,0 3.5,1.57 3.5,3.5l0,1.5m1,0l0,-1.5c0,-2.481 -2.019,-4.5 -4.5,-4.5c-2.481,0 -4.5,2.019 -4.5,4.5l0,1.5"></path>
                </g>
            </svg>
            <span :proxy="text">${dom``}</span>
        `;

        const svg = partial.fragment.querySelector('svg');

        partial.render(this.shadow)
            .then(proxy => {
                if (this.dataset.status) {
                    this.render(proxy, svg, JSON.parse(this.dataset.status));
                }

                this.addEventListener('click', () => {
                    fetch(this.url, {
                        method: 'PUT',
                        credentials: 'include',
                    })
                        .then(response => response.json())
                        .then(data => this.render(proxy, svg, data.status));
                });
            });
    }

    render(proxy, svg, status) {
        if (typeof status === 'boolean') {
            if (status) {
                proxy.text = this.activeText;
                svg.classList.add('is-private');
            } else {
                proxy.text = this.inactiveText;
                svg.classList.remove('is-private');
            }
        }
    }
}

const styles = dom`
<style>
    svg {
        margin-right: 3px;
    }
    
    .lock, .unlock {
        transition: 350ms;
    }
    
    svg.is-private .unlock {
        opacity: 0;
    }
    
    svg:not(.is-private) .lock {
        opacity: 0;
    }
</style>
`;
