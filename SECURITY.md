# Security policy

## Secrets

This repository must never contain API keys, bot tokens, OAuth credentials, private webhook URLs, or production identifiers.

Before every workflow export is committed:

1. Replace secrets and destination identifiers with placeholders.
2. Remove credential bindings and n8n instance metadata.
3. Remove execution and pinned data.
4. Scan the complete repository and Git history.
5. Import the sanitized workflow into a clean n8n instance and verify it remains inactive.

Run `node scripts/validate-workflow.mjs` before committing. The validator rejects
active exports, credential bindings, instance metadata, broken node connections,
and common API-key or bot-token formats.

If a secret is exposed, revoke and rotate it immediately. Removing it from the latest file is not sufficient because earlier Git commits remain accessible.

## Reporting

Do not open a public issue containing a real credential. Contact the repository owner privately and include only the affected service and file location.
