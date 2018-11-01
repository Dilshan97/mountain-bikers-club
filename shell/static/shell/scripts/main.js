import Wave from './components/section-wave.js';
import SingleButton from './components/single-button.js';
import PrivateButton from './components/private-button.js';
import FavoriteButton from './components/favorite-button.js';
import Map from './components/trail-map.js';
import MarkdownEditor from './components/markdown-editor.js';

if ('customElements' in window) {
    customElements.define('section-wave', Wave);
    customElements.define('lit-button', SingleButton);
    customElements.define('private-button', PrivateButton);
    customElements.define('favorite-button', FavoriteButton);
    customElements.define('trail-map', Map);
    customElements.define('markdown-editor', MarkdownEditor);
}
