import Wave from './components/section-wave.js';
import Button from './components/single-button.js';
import Map from './components/trail-map.js';
import MarkdownEditor from './components/markdown-editor.js';

if ('customElements' in window) {
    customElements.define('section-wave', Wave);
    customElements.define('lit-button', Button);
    customElements.define('trail-map', Map);
    customElements.define('markdown-editor', MarkdownEditor);
}
