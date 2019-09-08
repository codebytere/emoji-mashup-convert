# emoji-mashup-convert

This cli tool converts media from tweets into emojis which can then be uploaded to the Slack workspace of your choice.

## Usage

```sh
$ emoji-mashup-convert https://twitter.com/EmojiMashupBot/status/1168871809049157632

# On success, outputs:
# ✓ Converted image output to: /Users/codebytere/Desktop/1170366675788750849.png
```

By default, the converted photo will go to `/path/to/Desktop` but if you'd like it to go elsewhere, you can set `process.env.OUT_DEST` to specify a custom destination.
