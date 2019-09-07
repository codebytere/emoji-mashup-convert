# emoji-mashup-convert

This cli tool converts media from tweets into emojis which can then be uploaded to the Slack workspace of your choice.

## Requirements

The REST endpoint being hit in the [Twitter API](https://developer.twitter.com/en/docs/tweets/post-and-engage/api-reference/get-statuses-show-id) requires authentication, so you need to ensure you've generated the following items:

1. API key (& API secret key)
2. Access token (& Access token secret)

and that they are in your env (either directly exported or in a `.env` file):

```sh
API_KEY=<your key here>
API_KEY_SECRET=<your key secret here>
ACCESS_TOKEN=<your access token here>
ACCESS_TOKEN_SECRET=<your access token secret here>
```

## Usage

```sh
$ emoji-mashup-convert https://twitter.com/EmojiMashupBot/status/1168871809049157632

# On success, outputs:
# Successfully converted EmojiMashupBot's tweet with id 1168871809049157632.
```
