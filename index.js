#! /usr/bin/env node

const download = require('image-downloader')
const magick = require('imagemagick')
const inquirer = require('inquirer')
const { WebClient } = require('@slack/client')
const { exec } = require('shelljs')
const fs = require('fs-extra')
const homedir = require('os').homedir()
const fetch = require('node-fetch')
const FormData = require('form-data');

let workspace

require('colors')
const pass = '✓'.bold.green
const fail = '✗'.bold.red

// Let users pass in partially-formed tweet urls; we only care about the tweet ID
const pattern = /twitter\.com\/EmojiMashupBot\/status\/(?<id>[a-zA-Z0-9_]+)/gi

inquirer.prompt([
  {
    type: 'input',
    name: 'urlArg',
    message: 'Enter tweet url:',
    validate: (input) => {
      if (!input.match(pattern)) return `${fail} ${input} not a valid tweet.`
      return true
    }
  },
  {
    type: 'confirm',
    name: 'upload',
    message: 'Upload emoji to Slack workspace?',
  },
  {
    type: 'password',
    name: 'slackToken',
    when: (response) => response.upload && !process.env.SLACK_TOKEN,
    message: 'Enter Slack user token:',
  },
]).then(async answers => {
  // Pull tweet ID from named regex capture group
  const {groups: {id}} = pattern.exec(answers.urlArg);

  // Validate Slack user token
  const token = process.env.SLACK_TOKEN || answers.slackToken
  const valid = await validateToken(token)
  if (!valid) throw new Error(`${fail} Invalid token: ${token}.`)

  // Fetch and parse the image from twitter, ensuring the URL is composed in the format we need
  const tweetURL = `https://twitter.com/EmojiMashupBot/status/${id}`
  const execString = `curl -s ${tweetURL} | grep 'property="og:image"' | cut -d'"' -f4`
  const stdout = exec(execString, { silent: true })

  const url = stdout.substring(0, stdout.indexOf(':large'))
  const dest = process.env.OUT_DEST || `${homedir}/Desktop`

  // Download the image to a specified destination
  download.image({ url, dest }).then(async ({ filename }) => {
    // Convert the image into a Slack-worthy emoji
    await convertImage(filename, id, dest)

    // Upload emoji to chosen Slack workspace
    const outPath = `${dest}/${id}.png`
    if (answers.upload) {
      const form = new FormData()
      form.append('token', token)
      form.append('mode', 'data')
      form.append('name', 'bell-delete-me')
      form.append('image', fs.createReadStream(outPath))

      // We need to post to the raw endpoint (not public so not in WebClient)
      const raw = await fetch(`${workspace.url}api/emoji.add`, {
        method: 'POST',
        headers: form.getHeaders(),
        body: form
      })

      const response = await raw.json()
      if (!response.ok) {
        console.log(`${fail} Upload to Slack workspace ${workspace.team} failed.`)
      } else {
        console.log(`${pass} New emoji successfully uploaded to ${workspace.team}.`)
      }
    }
  })
})

/***** HELPERS *****/

// Ensure token is a va;id user token for a Slack workspace
const validateToken = async (token) => {
  const slack = new WebClient()
  workspace = await slack.auth.test({ token })
  return workspace.ok
}

// Scrape the white background away from the image
const convertImage = (path, id, dest) => {
  const options = [path, '-fuzz', '10%', '-trim', '-transparent', 'White', `${dest}/${id}.png`]

  return new Promise((resolve, reject) => {
    magick.convert(options, async err => {
      if (err) reject(err)

      // Remove original file
      await fs.remove(path)

      console.log(`${pass} See new image at: ${dest}/${id}.png`)
      resolve()
    })
  })
}