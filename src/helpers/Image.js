const googleImagesApiMaxPixels = 2000;
const googleImagesApiUrlPattern = /^https?:\/\/(.+)\.(googleusercontent|ggpht)\.com\/(.+)$/;

const wixMediaPlatformMaxPixels = 5100; // Actually, width*height must be <= (5100)^2
const wixMediaPlatformUrlPattern = /^https?:\/\/(media\.wixapps\.net|.+\.wixmp\.com)\/(.+)\/images\/(.+)\/$/;
const wixMediaManagerUrlPattern = /^https?:\/\/static\.wixstatic\.com\/media\/(.+)$/;

export default {

    /**
     * @param width    Resized image width, 0 means max size.
     * @param height   Resized image height, 0 means max size.
     */
    fill({url = null, width = 0, height = 0} = {}) {

        if (!url) {
            return null;
        }

        const size = Math.max(width, height);

        if (googleImagesApiUrlPattern.test(url)) {
            return `${url}=s${(size >= 0 && size <= googleImagesApiMaxPixels) ? size : 0}`;
        }

        if (wixMediaManagerUrlPattern.test(url)) {
            return (width > 0 && height > 0 && width <= wixMediaPlatformMaxPixels && height <= wixMediaPlatformMaxPixels) ? `${url}/v1/fill/w_${width},h_${height}/file.jpg` : url;
        }

        if (wixMediaPlatformUrlPattern.test(url)) {
            return (width > 0 && height > 0 && width <= wixMediaPlatformMaxPixels && height <= wixMediaPlatformMaxPixels) ? `${url}v1/fill/w_${width},h_${height}/file.jpg` : url;
        }

        return url;
    }
};

