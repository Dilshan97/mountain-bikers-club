import dom from "../library/tagged-dom.js";
import anime from "../vendor/anime.js";

export default class PrivateButton extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.url = this.dataset.url;
        this.initialStatus = JSON.parse(this.dataset.initialStatus || "null");
        this.initialCount = JSON.parse(this.dataset.initialCount || "0");
        this.loading = false;
    }

    connectedCallback() {
        const partial = dom`
            ${styles}
            <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
                <g fill="currentColor">
                    <path class="heart" d="M18.499,27c-0.084,0 -0.167,-0.021 -0.243,-0.063c-0.094,-0.052 -2.326,-1.301 -4.592,-3.347c-1.341,-1.21 -2.411,-2.448 -3.183,-3.68c-0.984,-1.571 -1.482,-3.139 -1.482,-4.66c0,-2.895 2.355,-5.25 5.25,-5.25c0.98,0 2.021,0.367 2.931,1.034c0.532,0.39 0.985,0.86 1.319,1.359c0.334,-0.499 0.787,-0.969 1.319,-1.359c0.91,-0.667 1.951,-1.034 2.931,-1.034c2.895,0 5.25,2.355 5.25,5.25c0,1.521 -0.499,3.089 -1.482,4.66c-0.771,1.232 -1.842,2.47 -3.182,3.68c-2.266,2.046 -4.498,3.295 -4.592,3.347c-0.076,0.042 -0.159,0.063 -0.243,0.063l-0.001,0Z"></path>
                    <path d="M18.499,27c-0.084,0 -0.167,-0.021 -0.243,-0.063c-0.094,-0.052 -2.326,-1.301 -4.592,-3.347c-1.341,-1.21 -2.411,-2.448 -3.183,-3.68c-0.984,-1.571 -1.482,-3.139 -1.482,-4.66c0,-2.895 2.355,-5.25 5.25,-5.25c0.98,0 2.021,0.367 2.931,1.034c0.532,0.39 0.985,0.86 1.319,1.359c0.334,-0.499 0.787,-0.969 1.319,-1.359c0.91,-0.667 1.951,-1.034 2.931,-1.034c2.895,0 5.25,2.355 5.25,5.25c0,1.521 -0.499,3.089 -1.482,4.66c-0.771,1.232 -1.842,2.47 -3.182,3.68c-2.266,2.046 -4.498,3.295 -4.592,3.347c-0.076,0.042 -0.159,0.063 -0.243,0.063l-0.001,0Zm-4.25,-16c-2.343,0 -4.25,1.907 -4.25,4.25c0,3.04 2.35,5.802 4.321,7.585c1.76,1.592 3.544,2.708 4.179,3.087c0.635,-0.379 2.419,-1.495 4.179,-3.087c1.971,-1.782 4.321,-4.545 4.321,-7.585c0,-2.343 -1.907,-4.25 -4.25,-4.25c-1.703,0 -3.357,1.401 -3.776,2.658c-0.068,0.204 -0.259,0.342 -0.474,0.342c-0.215,0 -0.406,-0.138 -0.474,-0.342c-0.419,-1.257 -2.073,-2.658 -3.776,-2.658Z"></path>
                    <g class="lights"> 
                        <path d="M19,1.503c0,-0.278 -0.225,-0.503 -0.503,-0.503c-0.278,0 -0.503,0.225 -0.503,0.503l0,3.994c0,0.278 0.225,0.503 0.503,0.503c0.278,0 0.503,-0.225 0.503,-0.503l0,-3.994Z"></path>
                        <path d="M25.566,5.256c-0.139,0.24 -0.056,0.548 0.184,0.687c0.24,0.138 0.548,0.056 0.687,-0.184l1.497,-2.593c0.139,-0.241 0.056,-0.549 -0.184,-0.687c-0.24,-0.139 -0.548,-0.057 -0.687,0.184l-1.497,2.593Z"></path>
                        <path d="M31.241,10.563c-0.24,0.139 -0.322,0.447 -0.184,0.687c0.139,0.24 0.447,0.323 0.687,0.184l2.593,-1.497c0.241,-0.139 0.323,-0.447 0.184,-0.687c-0.138,-0.24 -0.446,-0.323 -0.687,-0.184l-2.593,1.497Z"></path>
                        <path d="M32.503,17.997c-0.278,0 -0.503,0.225 -0.503,0.503c0,0.278 0.225,0.503 0.503,0.503l3.994,0c0.278,0 0.503,-0.225 0.503,-0.503c0,-0.278 -0.225,-0.503 -0.503,-0.503l-3.994,0Z"></path>
                        <path d="M30.877,25.068c-0.24,-0.138 -0.548,-0.056 -0.687,0.185c-0.139,0.24 -0.056,0.548 0.184,0.687l2.593,1.497c0.24,0.138 0.548,0.056 0.687,-0.184c0.139,-0.241 0.056,-0.549 -0.184,-0.687l-2.593,-1.498Z"></path>
                        <path d="M25.934,30.377c-0.138,-0.24 -0.446,-0.323 -0.687,-0.184c-0.24,0.139 -0.322,0.446 -0.184,0.687l1.497,2.593c0.139,0.24 0.447,0.323 0.687,0.184c0.241,-0.139 0.323,-0.447 0.185,-0.687l-1.498,-2.593Z"></path>
                        <path d="M19,31.503c0,-0.278 -0.225,-0.503 -0.503,-0.503c-0.278,0 -0.503,0.225 -0.503,0.503l0,3.994c0,0.278 0.225,0.503 0.503,0.503c0.278,0 0.503,-0.225 0.503,-0.503l0,-3.994Z"></path>
                        <path d="M9.066,33.834c-0.139,0.241 -0.056,0.549 0.184,0.687c0.24,0.139 0.548,0.057 0.687,-0.184l1.497,-2.593c0.139,-0.24 0.056,-0.548 -0.184,-0.687c-0.24,-0.138 -0.548,-0.056 -0.687,0.184l-1.497,2.593Z"></path>
                        <path d="M2.663,27.063c-0.241,0.139 -0.323,0.447 -0.184,0.687c0.138,0.24 0.446,0.323 0.687,0.184l2.593,-1.497c0.24,-0.139 0.322,-0.447 0.184,-0.687c-0.139,-0.24 -0.447,-0.323 -0.687,-0.184l-2.593,1.497Z"></path>
                        <path d="M0.503,17.997c-0.278,0 -0.503,0.225 -0.503,0.503c0,0.278 0.225,0.503 0.503,0.503l3.994,0c0.278,0 0.503,-0.225 0.503,-0.503c0,-0.278 -0.225,-0.503 -0.503,-0.503l-3.994,0Z"></path>
                        <path d="M4.03,9.568c-0.24,-0.138 -0.548,-0.056 -0.687,0.185c-0.139,0.24 -0.056,0.548 0.184,0.687l2.593,1.497c0.241,0.138 0.548,0.056 0.687,-0.184c0.139,-0.241 0.056,-0.549 -0.184,-0.687l-2.593,-1.498Z"></path>
                        <path d="M10.434,3.53c-0.138,-0.24 -0.446,-0.323 -0.687,-0.184c-0.24,0.139 -0.322,0.447 -0.184,0.687l1.497,2.593c0.139,0.24 0.447,0.323 0.687,0.184c0.241,-0.139 0.323,-0.447 0.185,-0.687l-1.498,-2.593Z"></path>
                    </g>
                </g>
            </svg>
            <span :proxy="text">${dom``}</span>
        `;

        const svgHeart = partial.fragment.querySelector(".heart");
        const svgLights = partial.fragment.querySelectorAll(".lights path");
        let clickTimeout = 0;

        partial.render(this.shadow)
            .then(proxy => {
                this.render(proxy, svgHeart, svgLights, this.initialStatus, this.initialCount);
                this.addEventListener("click", () => {
                    if (this.loading) {
                        return;
                    }

                    this.loading = true;
                    clearTimeout(clickTimeout);
                    this.classList.add("is-active");
                    clickTimeout = setTimeout(() => {
                        this.classList.remove("is-active");
                    }, 250);

                    fetch(this.url, {
                        method: "PUT",
                        credentials: "include"
                    })
                        .then(response => response.json())
                        .then(data => this.render(proxy, svgHeart, svgLights, data.status, data.count));
                }, { passive: true });
            });
    }

    render(proxy, svgHeart, svgLights, status, count) {
        if (typeof status === "boolean" && typeof count === "number") {
            const timeline = anime.timeline();

            if (status) {
                // favorite
                timeline.add({
                    targets: svgHeart,
                    transform: [scaleMatrix(0, 0, 18, 19), scaleMatrix(1, 1, 18, 19)],
                    opacity: 1,
                    duration: 350,
                }).add({
                    targets: svgLights,
                    transform: function() {
                        const scale = anime.random(900, 1000) / 1000;
                        return [
                            scaleMatrix(0, 0, 18, 19),
                            scaleMatrix(
                                scale,
                                scale,
                                18,
                                19,
                            ),
                        ];
                    },
                    opacity: [{
                        value: 1,
                        duration: 550
                    }, {
                        value: 0,
                        duration: 100
                    }],
                    duration: 650,
                });

                setTimeout(() => {
                    this.classList.add("is-favorite");
                    proxy.text = count;
                }, 350);
            } else {
                // not favorite
                timeline.add({
                    targets: [svgHeart, svgLights],
                    transform: [scaleMatrix(1, 1, 18, 19), scaleMatrix(0, 0, 18, 19)],
                    opacity: 0,
                    duration: 550,
                });

                setTimeout(() => {
                    this.classList.remove("is-favorite");
                    proxy.text = count;
                }, 150);
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
        border-radius: 3px;
        z-index: -1;
        background: currentColor;
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

    :host(:not(.is-favorite)) {
        border-color: var(--blue);
        color: var(--blue);
    }
    
    :host(.is-favorite) {
        border-color: var(--red);
        color: var(--red);
    }
</style>
`;

function scaleMatrix(sx, sy, cx, cy) {
    return `matrix(${sx}, 0, 0, ${sy}, ${cx - sx * cx}, ${cy - sy * cy})`;
}
