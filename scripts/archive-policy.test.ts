import test from 'node:test';
import assert from 'node:assert/strict';
import {selectArchiveUrls,cdxCapture,mergeFirst,validStamp} from './wayback-policy';
test('archive requests cannot bypass the allowlist with --url',()=>{
 const urls=['https://example.org/note'];assert.deepEqual(selectArchiveUrls(urls,[]),urls);
 assert.throws(()=>selectArchiveUrls(urls,['https://example.org/unlisted']));
 assert.deepEqual(selectArchiveUrls(urls,[...urls,...urls]),urls);
});
test('only valid CDX rows establish a first capture; later saves do not move it',()=>{
 assert.equal(cdxCapture({job_id:'new-save',timestamp:'20200101000000'}),null);
 assert.equal(cdxCapture([['timestamp','digest'],['bad','ABC']]),null);
 assert.equal(validStamp('20200231000000'),false);
 const found=cdxCapture([['timestamp','digest'],['20200102000000','ABC']]);assert.equal(found?.timestamp,'20200102000000');
 const held={first:'20200102000000',digest:'ABC'};
 assert.equal(mergeFirst(held,{first:'20200103000000'}),held);
 assert.equal(mergeFirst(held,{first:'20200101000000'}).first,'20200101000000');
});
