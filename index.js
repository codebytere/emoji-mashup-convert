#! /usr/bin/env node

const TwitterClient = require('twit')
const download = require('image-downloader')
const magick = require('imagemagick')
const fs = require('fs-extra')
const homedir = require('os').homedir()

require('dotenv').config()

const auth =  {
  consumer_key: process.env.API_KEY,
  consumer_secret: process.env.API_KEY_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
}

if (!Object.values(auth).every(k => k !== '')) {
  throw new Error ('Missing environment variables.')
}

const t = new TwitterClient(auth)

const pattern = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/(?<username>[a-zA-Z0-9_]+)\/status\/(?<id>[a-zA-Z0-9_]+)/gi

const args = process.argv.slice(2)

let tweet
if (!args[0].match(pattern)) {
  throw new Error(`${args[0]} is not a valid tweet.`)
} else {
  tweet = args[0]
}

const {groups: {username, id}} = pattern.exec(tweet);

t.get('statuses/show/:id', { id }, async (err, data, response) => {
  const url = data.entities.media[0].media_url_https
  const dest = process.env.OUT_DEST || `${homedir}/Desktop`

  // Download the image to a specified destination
  const { filename } = await download.image({ url, dest })

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