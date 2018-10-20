const urlList = new Set();
/** @type Promise<*> */
let loadJSPromise = Promise.resolve();
/** @type Promise<*> */
let loadCSSPromise = Promise.resolve();

/**
 * Load JS asynchronously
 * @param {string} src
 * @param {boolean|string} [crossOrigin=false]
 * @param {string} [integrity='']
 * @returns {Promise<*>}
 */
export function loadJS(src, crossOrigin = false, integrity = '') {
    if (urlList.has(src)) {
        return loadJSPromise;
    }

    loadJSPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');

        script.addEventListener('load', event => resolve(event));
        script.addEventListener('error', event => reject(event));
        script.async = true;
        if (typeof crossOrigin === 'string') {
            script.setAttribute('crossorigin', crossOrigin);
        }
        script.setAttribute('integrity', integrity);
        script.setAttribute('src', src);

        document.head.appendChild(script);
        urlList.add(src);
    });

    return loadJSPromise;
}

/**
 * Load CSS asynchronously
 * @param {string} src
 * @param {boolean|string} [crossOrigin=false]
 * @param {string} [integrity='']
 * @param {string} [media="screen"]
 * @returns {Promise<*>}
 */
export function loadCSS(
    src,
    crossOrigin = false,
    integrity = '',
    media = 'screen',
) {
    if (urlList.has(src)) {
        return loadCSSPromise;
    }

    loadCSSPromise = new Promise((resolve, reject) => {
        const link = document.createElement('link');

        link.addEventListener('load', event => resolve(event));
        link.addEventListener('error', event => reject(event));
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('media', media);

        if (typeof crossOrigin === 'string') {
            link.setAttribute('crossorigin', crossOrigin);
        }

        link.setAttribute('integrity', integrity);
        link.setAttribute('href', src);

        document.head.appendChild(link);
        urlList.add(src);
    });

    return loadCSSPromise;
}
