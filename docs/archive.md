# Independent archive

The specification and citable chapters carry the earliest confirmed successful capture of their canonical URL. This corroborates the URL's history; it does not establish first publication or certify the contents of a later revision.

The post-deploy script resolves CDX and submits up to six stale or missing pages when `IA_ACCESS_KEY` and `IA_SECRET_KEY` repository secrets exist. Without both, the workflow reports resolve-only mode. Secrets come from the account owner's Internet Archive S3 credentials; no values belong in this repository.

`--url` can narrow the citable allowlist but cannot bypass it. Only live HTTP 200 pages are submitted. Calls have timeouts, a run has a time budget, and successful Save Page Now jobs are not treated as first captures until CDX confirms them. A known first-capture date can move earlier, never later. The archive commit does not trigger another deploy; newly found dates appear on the next normal deployment.

Validation: the normal test suite includes the archive boundary cases. No archive submission is made by the tests.
