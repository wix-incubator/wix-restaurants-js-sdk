const googleImagesApiMaxPixels = 2000;
const googleImagesApiUrlPattern = /^https?:\/\/(.+)\.(googleusercontent|ggpht)\.com\/(.+)$/;

const wixMediaPlatformMaxPixels = 5100; // Actually, width*height must be <= (5100)^2
const wixMediaPlatformUrlPattern = /^https?:\/\/(media\.wixapps\.net|.+\.wixmp\.com)\/(.+)\/images\/(.+)\/$/;
const wixMediaManagerUrlPattern = /^https?:\/\/static\.wixstatic\.com\/media\/(.+)$/;

function getUsmString({ amount, radius, threshold }) {
    if (typeof amount === 'number' && typeof radius === 'number' && typeof threshold === 'number') {
        return `,usm_${amount.toFixed(2)}_${radius.toFixed(2)}_${threshold.toFixed(2)}`;
    }

    return '';
}

export default {

    /**
     * @param width    Resized image width, 0 means max size.
     * @param height   Resized image height, 0 means max size.
     */
    fill({url = null, width = 0, height = 0, usm = {}, webpEnabled = false} = {}) {

        if (!url) {
            return null;
        }

        const size = Math.max(width, height);

        const usmString = getUsmString(usm);

        if (googleImagesApiUrlPattern.test(url)) {
            return `${url}=s${(size >= 0 && size <= googleImagesApiMaxPixels) ? size : 0}`;
        }

        if (wixMediaManagerUrlPattern.test(url)) {
            const filename = webpEnabled ? 'file.webp' : 'file.jpg';
            return (width > 0 && height > 0 && width <= wixMediaPlatformMaxPixels && height <= wixMediaPlatformMaxPixels) ? `${url}/v1/fill/w_${width},h_${height}${usmString}/${filename}` : url;
        }

        if (wixMediaPlatformUrlPattern.test(url)) {
            // Media platform we always return the URL since they have weird issues, for example:
            // https://images-rest.wixmp.com/tenant_admin/images/15e7624ee3ee4eeaaaaec9e6175fcdb6~mv2/v1/fill/w_245,h_184/file.jpg
            // https://images-rest.wixmp.com/tenant_admin/images/15e7624ee3ee4eeaaaaec9e6175fcdb6~mv2/v1/fill/w_1084,h_722/file.jpg
            return url;
        }

        return url;
    },

    fillSharp({url, width, height, webpEnabled = false} = {}) {
        return this.fill({url, width, height, usm: { amount: 1.20, radius: 1.00, threshold: 0.01 }, webpEnabled});
    }
};
