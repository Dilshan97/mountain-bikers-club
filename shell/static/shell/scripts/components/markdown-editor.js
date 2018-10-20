import dom from '../library/tagged-dom.js';

export default class MarkdownEditor extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.textarea = null;
    }

    async connectedCallback() {
        const partial = dom`
            ${styles}
            <div class="buttons">
                ${this.renderButton('h2', '## ')}
                ${this.renderButton('h3', '### ')}
                ${this.renderButton('<strong>B</strong>', '**', '**')}
                ${this.renderButton('<em>I</em>', '_', '_')}
            </div>
            <slot></slot>
        `;
        const slot = partial.fragment.querySelector('slot');

        await partial.render(this.shadow);

        if (slot == null) {
            throw new ReferenceError('HTMLSlotElement not found');
        }

        for (const node of slot.assignedNodes()) {
            if (node instanceof HTMLTextAreaElement) {
                this.textarea = node;
            }
        }

        if (this.textarea == null) {
            throw new ReferenceError('HTMLTextAreaElement not found');
        }
    }

    renderButton(label, textBefore = '', textAfter = '') {
        const button = dom`<button class="tiny-button">${label}</button>`;
        const buttonElement = button.fragment.querySelector('button');

        if (buttonElement) {
            buttonElement.addEventListener('click', () => {
                if (this.textarea) {
                    const content = this.textarea.value;
                    const start = this.textarea.selectionStart;
                    const end = this.textarea.selectionEnd;
                    const length = textBefore.length;

                    let outputs = [
                        content.slice(0, start),
                        textBefore,
                        content.slice(start, end),
                        textAfter,
                        content.slice(end),
                    ];

                    this.textarea.value = outputs.join('');
                    this.textarea.selectionStart = start + length;
                    this.textarea.selectionEnd = end + length;
                    this.textarea.focus();
                }
            });
        }

        return button;
    }
}

const styles = dom`
<style>
    .buttons {
        margin-top: 10px;
        margin-bottom: -5px;
    }
    
    .tiny-button {
        display: inline-block;
        background: var(--base06);
        border: solid 1px var(--base07);
        border-radius: 1px;
        min-width: 44px;
        text-align: center;
        cursor: pointer;
        font-family: 'PragmataPro', monospace;
        font-size: 90%;
        line-height: 30px;
        padding-top: 3px;
    }
    
    .tiny-button:hover {
        background: var(--base07);
    }
</style>
`;
