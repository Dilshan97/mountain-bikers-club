/*!
 * Eukolía - Async Loader
 * https://github.com/cedeber/eukolia
 */
const urlList = new Set();
let loadJSPromise = Promise.resolve();
let loadCSSPromise = Promise.resolve();
export function loadJS(src, crossOrigin = false, isModule = false, integrity = "") {
    if (urlList.has(src)) {
        return loadJSPromise;
    }
    loadJSPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.addEventListener("load", event => resolve(event));
        script.addEventListener("error", event => reject(event));
        script.async = true;
        if (typeof crossOrigin === "string") {
            script.setAttribute("crossorigin", crossOrigin);
        }
        if (isModule) {
            script.setAttribute("type", "module");
        }
        script.setAttribute("integrity", integrity);
        script.setAttribute("src", src);
        if (document.head) {
            document.head.appendChild(script);
            urlList.add(src);
        }
    });
    return loadJSPromise;
}
export function loadCSS(src, crossOrigin = false, integrity = "", media = "screen") {
    if (urlList.has(src)) {
        return loadCSSPromise;
    }
    loadCSSPromise = new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.addEventListener("load", event => resolve(event));
        link.addEventListener("error", event => reject(event));
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("media", media);
        if (typeof crossOrigin === "string") {
            link.setAttribute("crossorigin", crossOrigin);
        }
        link.setAttribute("integrity", integrity);
        link.setAttribute("href", src);
        if (document.head) {
            document.head.appendChild(link);
            urlList.add(src);
        }
    });
    return loadCSSPromise;
}
