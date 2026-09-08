# Setup

## 1. Import safely

Import `workflow/welding-media-curator.template.json` into n8n. The template is inactive by design. Do not activate it until all credentials, placeholders, and destinations have been checked.

## 2. Replace placeholders

Search the imported workflow for `REPLACE_WITH_` and configure:

| Placeholder | Used for |
| --- | --- |
| `REPLACE_WITH_TELEGRAM_BOT_TOKEN` | Telegram Bot API requests |
| `REPLACE_WITH_TELEGRAM_CHAT_ID` | Private test channel first, production channel later |
| `REPLACE_WITH_YOUTUBE_API_KEY` | YouTube search and video details |
| `REPLACE_WITH_GIPHY_API_KEY` | GIPHY search |
| `REPLACE_WITH_GOOGLE_SHEET_ID` | Publication history |

For production, prefer n8n credentials or environment-backed configuration over literal secrets inside node URLs.

## 3. Connect credentials

In n8n, select credentials for:

- `OpenAI - Media Curator`: an OpenAI API credential
- `Read Published History`: a Google Sheets OAuth2 credential
- all four `Append row in sheet ...` nodes: the same Google Sheets credential

Credentials are deliberately not included in the template.

## 4. Prepare Google Sheets

Create a spreadsheet containing a sheet named `PublishedMedia` with this header row:

| title | dedup_key | published_at | source_type | telegram_preview |
| --- | --- | --- | --- | --- |

Select this document and sheet again in the read and append nodes after import. Confirm the field mapping because Google Sheets metadata is intentionally removed from the public template.

## 5. Configure Telegram

1. Create a bot through BotFather.
2. Add the bot as an administrator of a private test channel.
3. Give it permission to post messages.
4. Replace the Telegram token and chat ID placeholders.
5. Test text, photo, GIF, video, and YouTube-link paths separately.

Do not use the production channel for the first test.

## 6. Configure APIs

- Enable YouTube Data API v3 for the Google project associated with your key.
- Restrict the Google key to only the APIs and clients required by this workflow where feasible.
- Create a GIPHY API key suitable for the intended usage.
- Check API quotas before increasing search frequency or result counts.

## 7. Validate before activation

- The workflow is still inactive.
- No node contains `REPLACE_WITH_`.
- OpenAI and Google Sheets credentials are selected.
- Each Telegram media branch succeeds in the private test channel.
- Re-running the same candidate is blocked by `dedup_key`.
- A failed Telegram request does not create a successful-history row.
- Persian output is valid JSON and contains no raw URL in `telegram_text`.
- The configured timezone matches the intended schedule.

## 8. Activate

After validation, switch the destination to the production channel, execute one controlled test, and then activate the Schedule Trigger.

