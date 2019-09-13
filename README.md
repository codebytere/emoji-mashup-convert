# emoji-mashup-convert

This cli tool converts media from tweets into emojis and then optionally uploads them to the Slack workspace of your choice.

## Usage

```sh
$ emoji-mashup-convert
? Enter tweet url: # https://twitter.com/EmojiMashupBot/status/1172404610159411200
? Upload emoji to Slack workspace? # Yes
? Enter name of new emoji: # sad-expressionless
? Enter Slack user token # xoxs-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# On success, outputs:
✓ See new image at: /Users/codebytere/Desktop/1172616005740388354.png
✓ New emoji successfully uploaded to Electron HQ.
```

By default, the converted photo will go to `/path/to/Desktop` but if you'd like it to go elsewhere, you can set `process.env.OUT_DEST` to specify a custom destination.

You can set `process.env.SLACK_TOKEN` to avoid pasting in your token multiple times. You would still type `Yes` for "Upload emoji to Slack workspace?", but if it detects this env var it won't ask you for a token.