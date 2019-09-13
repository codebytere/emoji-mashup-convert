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

After logging into `https://<your_workspace>.slack.com/customize/emoji`, you should then see:

<img width="811" alt="Screen Shot 2019-09-13 at 7 33 04 PM" src="https://user-images.githubusercontent.com/2036040/64900211-a597c380-d65d-11e9-8ff7-c1c340816927.png">

By default, the converted photo will go to `/path/to/Desktop` but if you'd like it to go elsewhere, you can set `process.env.OUT_DEST` to specify a custom destination.

You can set `process.env.SLACK_TOKEN` to avoid pasting in your token multiple times. You would still type `Yes` for "Upload emoji to Slack workspace?", but if it detects this env var it won't ask you for a token.