import { expect } from 'chai';
import { XMLHttpRequest } from 'xhr2';
import {testkit} from '../../src/index';

const {CommonProtocolDriver} = testkit;

global.XMLHttpRequest = XMLHttpRequest;

describe('CommonProtocolDriver', () => {
    it('is exported', () => {
        expect(CommonProtocolDriver).to.be.ok;

        const instance = new CommonProtocolDriver({port:1000, http:{createServer: () => {}}});
        expect(instance).to.be.ok;
    });
});
