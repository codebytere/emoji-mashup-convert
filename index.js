#! /usr/bin/env node

const download = require('image-downloader')
const magick = require('imagemagick')
const shell = require('shelljs')
const fs = require('fs-extra')
const homedir = require('os').homedir()

const pattern = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/(?<username>[a-zA-Z0-9_]+)\/status\/(?<id>[a-zA-Z0-9_]+)/gi

const args = process.argv.slice(2)

let tweet
if (!args[0].match(pattern)) {
  throw new Error(`${args[0]} is not a valid tweet.`)
} else {
  tweet = args[0]
}

const {groups: {username, id}} = pattern.exec(tweet);

// Fetch and parse the image from twitter
const stdout = shell.exec(`curl -s ${tweet} | grep 'property="og:image"' | cut -d'"' -f4`)

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
    console.log(`Successfully converted ${username}'s tweet with id ${id}.`)
  
    // Remove original file
    await fs.remove(path)
  })
}