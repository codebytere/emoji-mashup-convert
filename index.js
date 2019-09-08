#! /usr/bin/env node

const download = require('image-downloader')
const magick = require('imagemagick')
const { exec } = require('shelljs')
const fs = require('fs-extra')
const homedir = require('os').homedir()

require('colors')
const pass = '✓'.green

// Let users pass in sketchy tweet urls; we only care about the tweet ID
const pattern = /twitter\.com\/EmojiMashupBot\/status\/(?<id>[a-zA-Z0-9_]+)/gi

const args = process.argv.slice(2)

let urlArg
if (!args[0].match(pattern)) {
  throw new Error(`${args[0]} is not a valid tweet.`)
} else {
  urlArg = args[0]
}

const {groups: {id}} = pattern.exec(urlArg);

// Fetch and parse the image from twitter, ensuring the URL is composed in the format we need
const tweetURL = `https://twitter.com/EmojiMashupBot/status/${id}`
const execString = `curl -s ${tweetURL} | grep 'property="og:image"' | cut -d'"' -f4`
const stdout = exec(execString, { silent: true })

const url = stdout.substring(0, stdout.indexOf(':large'))
const dest = process.env.OUT_DEST || `${homedir}/Desktop`

// Download the image to a specified destination
download.image({ url, dest }).then(({ filename }) => {
  // Convert the image into a Slack-worthy emoji
  convertImage(filename, id, dest)
})

// Scrape the white background away from the image
const convertImage = (path, id, dest) => {
  const options = [path, '-fuzz', '10%', '-trim', '-transparent', 'White', `${dest}/${id}.png`]

  magick.convert(options, async err => {
    if (err) throw err
    console.log(`${pass} Converted image output to: ${dest}/${id}.png`)
  
    // Remove original file
    await fs.remove(path)
  })
}