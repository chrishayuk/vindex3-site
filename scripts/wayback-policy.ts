/** Archiving policy is independent of the network transport. */
export type Capture = {first:string;digest?:string};
export function validStamp(value: unknown): value is string {
 if(typeof value!=="string" || !/^\d{14}$/.test(value))return false;
 const iso=`${value.slice(0,4)}-${value.slice(4,6)}-${value.slice(6,8)}T${value.slice(8,10)}:${value.slice(10,12)}:${value.slice(12,14)}Z`;
 const time=Date.parse(iso);return Number.isFinite(time) && time<=Date.now() && new Date(time).toISOString().slice(0,19)===iso.slice(0,19);
}
export function selectArchiveUrls(allowed: readonly string[], requested: readonly string[]) {
 const chosen=requested.length?requested:allowed;
 for(const url of chosen)if(!allowed.includes(url))throw new Error(`URL is outside the public archive allowlist: ${url}`);
 return [...new Set(chosen)];
}
export function cdxCapture(rows: unknown): {timestamp:string;digest:string}|null {
 if(!Array.isArray(rows)||rows.length<2||!Array.isArray(rows[0])||!Array.isArray(rows[1]))return null;
 const stamp=rows[1][rows[0].indexOf('timestamp')], digest=rows[1][rows[0].indexOf('digest')];
 if(!validStamp(stamp))return null;
 return {timestamp:stamp,digest:typeof digest==='string'&&digest!=='-'?digest:''};
}
/** Only a confirmed earliest CDX row enters this function, never an SPN job result. */
export function mergeFirst(held: Capture|undefined, confirmed: Capture): Capture {
 if(!validStamp(confirmed.first))throw new Error('Invalid confirmed capture timestamp');
 return !held || confirmed.first<held.first ? confirmed : held;
}
