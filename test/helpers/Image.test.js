'use strict';

import {expect} from 'chai';
import Image from '../../src/helpers/Image';

describe('Image', () => {

    describe('fill', () => {
        const googleImagesApiUrl1 = 'https://lh4.ggpht.com/XXX';
        const googleImagesApiUrl2 = 'https://lh3.googleusercontent.com/XXX';
        const wixMediaPlatformUrl1 = "https://media.wixapps.net/ggl-XXX/images/YYY/";
        const wixMediaPlatformUrl1b = "https://media.wixapps.net/ggl-XXX/images/YYY";
        const wixMediaPlatformUrl2 = "https://XXX.wixmp.com/YYY/images/ZZZ/";
        const wixMediaManagerUrl = 'https://static.wixstatic.com/media/YYY.jpg';
        const unrecognizedUrl = 'https://www.example.org/XXX';
        const newWixMediaPlatformUrl1 = 'https://images-wixmp-190fec74f1fdb50de9162c9d.wixmp.com/ggl-XXX/images/YYY';

        it('returns null when no URL is given', () => {
            expect(Image.fill()).to.be.null;
            expect(Image.fill({})).to.be.null;
            expect(Image.fill({width:100, height:100})).to.be.null;
        });

        it ('returns new URL', () => {
            expect(Image.fill({url: wixMediaPlatformUrl1})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl1b})).to.equal(newWixMediaPlatformUrl1);
        });

        it('resizes Google Images API URLs when given a supported size', () => {
            expect(Image.fill({url: googleImagesApiUrl1, width:150, height:150})).to.equal(`${googleImagesApiUrl1}=s150`);
            expect(Image.fill({url: googleImagesApiUrl1, width:10, height:150})).to.equal(`${googleImagesApiUrl1}=s150`);
            expect(Image.fill({url: googleImagesApiUrl1, width:150, height:10})).to.equal(`${googleImagesApiUrl1}=s150`);
            expect(Image.fill({url: googleImagesApiUrl2, width:150, height:150})).to.equal(`${googleImagesApiUrl2}=s150`);
            expect(Image.fill({url: googleImagesApiUrl2, width:10, height:150})).to.equal(`${googleImagesApiUrl2}=s150`);
            expect(Image.fill({url: googleImagesApiUrl2, width:150, height:10})).to.equal(`${googleImagesApiUrl2}=s150`);

            expect(Image.fill({url: googleImagesApiUrl1, width:2000, height:100})).to.equal(`${googleImagesApiUrl1}=s2000`);
            expect(Image.fill({url: googleImagesApiUrl1, width:100, height:2000})).to.equal(`${googleImagesApiUrl1}=s2000`);
            expect(Image.fill({url: googleImagesApiUrl1, width:2000, height:2000})).to.equal(`${googleImagesApiUrl1}=s2000`);
            expect(Image.fill({url: googleImagesApiUrl2, width:2000, height:2000})).to.equal(`${googleImagesApiUrl2}=s2000`);
        });

        it('resizes Google Images API URLs to their maximum size when given unsupported size', () => {
            expect(Image.fill({url: googleImagesApiUrl1, width:-1, height:-1})).to.equal(`${googleImagesApiUrl1}=s0`);
            expect(Image.fill({url: googleImagesApiUrl2, width:-1, height:-1})).to.equal(`${googleImagesApiUrl2}=s0`);

            expect(Image.fill({url: googleImagesApiUrl1, width:0, height:0})).to.equal(`${googleImagesApiUrl1}=s0`);
            expect(Image.fill({url: googleImagesApiUrl2, width:0, height:0})).to.equal(`${googleImagesApiUrl2}=s0`);

            expect(Image.fill({url: googleImagesApiUrl1, width:2001, height:2001})).to.equal(`${googleImagesApiUrl1}=s0`);
            expect(Image.fill({url: googleImagesApiUrl2, width:2001, height:2001})).to.equal(`${googleImagesApiUrl2}=s0`);
        });

        it('resizes Google Images API URLs to their maximum size when given no size', () => {
            expect(Image.fill({url: googleImagesApiUrl1})).to.equal(`${googleImagesApiUrl1}=s0`);
            expect(Image.fill({url: googleImagesApiUrl2})).to.equal(`${googleImagesApiUrl2}=s0`);
        });

        it('resizes Wix Media Platform URLs when given a supported size', () => {
            expect(Image.fill({url: wixMediaPlatformUrl1, width:150, height:250})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl2, width:150, height:250})).to.equal(wixMediaPlatformUrl2);

            expect(Image.fill({url: wixMediaPlatformUrl1, width:5100, height:100})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl2, width:5100, height:100})).to.equal(wixMediaPlatformUrl2);

            expect(Image.fill({url: wixMediaPlatformUrl1, width:100, height:5100})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl2, width:100, height:5100})).to.equal(wixMediaPlatformUrl2);

            expect(Image.fill({url: wixMediaPlatformUrl2, width:100, height:5100, webpEnabled:true})).to.equal(wixMediaPlatformUrl2);
        });

        it('resizes Wix Media Platform URLs to their maximum size when given unsupported size', () => {
            expect(Image.fill({url: wixMediaPlatformUrl1, width:-1, height:-1})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl2, width:-1, height:-1})).to.equal(wixMediaPlatformUrl2);

            expect(Image.fill({url: wixMediaPlatformUrl1, width:-1, height:100})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl2, width:-1, height:100})).to.equal(wixMediaPlatformUrl2);

            expect(Image.fill({url: wixMediaPlatformUrl1, width:100, height:-1})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl2, width:100, height:-1})).to.equal(wixMediaPlatformUrl2);

            expect(Image.fill({url: wixMediaPlatformUrl1, width:0, height:0})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl2, width:0, height:0})).to.equal(wixMediaPlatformUrl2);

            expect(Image.fill({url: wixMediaPlatformUrl1, width:0, height:100})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl2, width:0, height:100})).to.equal(wixMediaPlatformUrl2);

            expect(Image.fill({url: wixMediaPlatformUrl1, width:100, height:0})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl2, width:100, height:0})).to.equal(wixMediaPlatformUrl2);

            expect(Image.fill({url: wixMediaPlatformUrl1, width:5101, height:5101})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl2, width:5101, height:5101})).to.equal(wixMediaPlatformUrl2);

            expect(Image.fill({url: wixMediaPlatformUrl1, width:5101, height:101})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl2, width:5101, height:101})).to.equal(wixMediaPlatformUrl2);

            expect(Image.fill({url: wixMediaPlatformUrl1, width:101, height:5101})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl2, width:101, height:5101})).to.equal(wixMediaPlatformUrl2);
        });

        it('resizes Wix Media PlatformURLs to their maximum size when given no size', () => {
            expect(Image.fill({url: wixMediaPlatformUrl1})).to.equal(newWixMediaPlatformUrl1);
            expect(Image.fill({url: wixMediaPlatformUrl2})).to.equal(wixMediaPlatformUrl2);
        });

        it('resizes Wix Media Manager URLs when given a supported size', () => {
            expect(Image.fill({url: wixMediaManagerUrl, width:150, height:150})).to.equal(`${wixMediaManagerUrl}/v1/fill/w_150,h_150/file.jpg`);
            expect(Image.fill({url: wixMediaManagerUrl, width:100, height:150})).to.equal(`${wixMediaManagerUrl}/v1/fill/w_100,h_150/file.jpg`);
            expect(Image.fill({url: wixMediaManagerUrl, width:150, height:100})).to.equal(`${wixMediaManagerUrl}/v1/fill/w_150,h_100/file.jpg`);
            expect(Image.fill({url: wixMediaManagerUrl, width:5100, height:5100})).to.equal(`${wixMediaManagerUrl}/v1/fill/w_5100,h_5100/file.jpg`);
            expect(Image.fill({url: wixMediaManagerUrl, width:5100, height:5100, webpEnabled: true})).to.equal(`${wixMediaManagerUrl}/v1/fill/w_5100,h_5100/file.webp`);
        });

        it('resizes Wix Media Manager URLs to their maximum size when given unsupported size', () => {
            expect(Image.fill({url: wixMediaManagerUrl, width:-1, height:-1})).to.equal(wixMediaManagerUrl);
            expect(Image.fill({url: wixMediaManagerUrl, width:0, height:0})).to.equal(wixMediaManagerUrl);
            expect(Image.fill({url: wixMediaManagerUrl, width:5101, height:5101})).to.equal(wixMediaManagerUrl);
        });

        it('resizes Wix Media Manager URLs to their maximum size when given no size', () => {
            expect(Image.fill({url: wixMediaManagerUrl})).to.equal(wixMediaManagerUrl);
        });

        it('leaves unrecognized URLs as-is', () => {
            expect(Image.fill({url: unrecognizedUrl})).to.equal(unrecognizedUrl);
            expect(Image.fill({url: unrecognizedUrl, width: 20, height: 20})).to.equal(unrecognizedUrl);
        });

        describe('Applies unsharp mask', () => {
            it('does not do anything if sizes are invalid', () => {
                expect(Image.fill({url: wixMediaManagerUrl, usm: { amount: '1.20', radius: '1.00', threshold: '0.01' }})).to.equal(wixMediaManagerUrl);
            });

            it('does not apply unsharp mask for partial usm object', () => {
                expect(Image.fill({url: wixMediaManagerUrl, width:150, height:150, usm: { amount: null, radius: 1.00, threshold: 0.01 }}))
                    .to.equal(`${wixMediaManagerUrl}/v1/fill/w_150,h_150/file.jpg`);

                expect(Image.fill({url: wixMediaManagerUrl, width:150, height:150, usm: { amount: 1.20, radius: null, threshold: 0.01 }}))
                    .to.equal(`${wixMediaManagerUrl}/v1/fill/w_150,h_150/file.jpg`);

                expect(Image.fill({url: wixMediaManagerUrl, width:150, height:150, usm: { amount: 1.20, radius: 1.00, threshold: null }}))
                    .to.equal(`${wixMediaManagerUrl}/v1/fill/w_150,h_150/file.jpg`);

                expect(Image.fill({url: wixMediaManagerUrl, width:150, height:150}))
                    .to.equal(`${wixMediaManagerUrl}/v1/fill/w_150,h_150/file.jpg`);
            });

            it('does not apply mask on string values', () => {
                expect(Image.fill({url: wixMediaManagerUrl, width:150, height:150, usm: { amount: '1.20', radius: '1.00', threshold: '0.01' }}))
                    .to.equal(`${wixMediaManagerUrl}/v1/fill/w_150,h_150/file.jpg`);
            });

            it('applies mask on numeric values', () => {
                expect(Image.fill({url: wixMediaManagerUrl, width:150, height:150, usm: { amount: 1.20, radius: 1.00, threshold: 0.01 }}))
                    .to.equal(`${wixMediaManagerUrl}/v1/fill/w_150,h_150,usm_1.20_1.00_0.01/file.jpg`);

                expect(Image.fill({url: wixMediaManagerUrl, width:150, height:150, usm: { amount: 1.23, radius: 1.1, threshold: 0.2 }}))
                    .to.equal(`${wixMediaManagerUrl}/v1/fill/w_150,h_150,usm_1.23_1.10_0.20/file.jpg`);
            });

            it('applies mask on round values', () => {
                expect(Image.fill({url: wixMediaManagerUrl, width:150, height:150, usm: { amount: 1, radius: 1, threshold: 0 }}))
                    .to.equal(`${wixMediaManagerUrl}/v1/fill/w_150,h_150,usm_1.00_1.00_0.00/file.jpg`);
            });

            it('applies mask with default values', () => {
                expect(Image.fillSharp({url: wixMediaManagerUrl, width:150, height:150}))
                    .to.equal(`${wixMediaManagerUrl}/v1/fill/w_150,h_150,usm_1.20_1.00_0.01/file.jpg`);
            });
        });

    });
});

