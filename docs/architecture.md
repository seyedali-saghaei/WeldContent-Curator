# Architecture and design notes

## Processing stages

| Stage | Responsibility |
| --- | --- |
| Discovery | Read welding RSS feeds and dynamically query YouTube and GIPHY |
| Normalization | Convert different source responses into common media fields |
| Deduplication | Compare `dedup_key` values with the publication-history sheet |
| Ranking | Score relevance, engagement, media type, and practical intent |
| Cost control | Select no more than two candidates before OpenAI |
| Curation | Return `publish`, `overall_score`, and a Persian `telegram_text` |
| Routing | Choose Telegram video, animation, photo, link, or text delivery |
| Audit | Append successful publication data to Google Sheets |

## Curator contract

The LLM is instructed to return JSON with this structure:

```json
{
  "publish": true,
  "overall_score": 8,
  "telegram_text": "..."
}
```

The parser removes Markdown fences and raw URLs. Items below the publication threshold are skipped.

## Important implementation decisions

- The public export is inactive and contains placeholder values.
- No credential bindings or n8n instance identifiers are distributed.
- The publication record is written after a successful Telegram response.
- Candidate selection is deliberately limited before the paid LLM request.
- Dynamic search terms increase variety but make individual executions less reproducible.

## Known limitations and recommended improvements

- Add explicit retry and error-handling branches for external APIs.
- Escape or sanitize generated Telegram HTML before delivery.
- Add structured logging for malformed LLM responses and rejected candidates.
- Pin and document a tested n8n version after a fresh import test.
- Consider replacing random topic selection with a persistent rotation for reproducible coverage.
- Monitor YouTube quota usage and Telegram media-size constraints.
- Keep a human-review mode available when changing prompts or sources.

