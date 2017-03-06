#!/usr/bin/env node

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Dafrok <o.o@mug.dog>
*/

const cli = require('cli')
const clc = require('cli-color')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const moment = require('moment')
const pad  = require('pad')
const fs = require('fs')
const path = require('path')

const args = require('./args')
const packages = require('./packages')

~(async () => {
  cli.info('Fetching packages info...')
  let progress = 0
  await Promise.all(packages.map(pack => 
    fetch(`https://www.npmjs.com/package/${pack.name}`)
      .then(res => res.text())
      .then(text => {
        const $ = cheerio.load(text)
        pack.datetime = $('[data-date]').attr('data-date')
        cli.progress(++progress / packages.length)
        return Promise.resolve(pack)
      })))
    .then(result => {
      cli.ok('Done.')
      result.sort((a, b) => {
        switch (args.sort.toLowerCase()) {
          case 'asc': return Date.parse(a.datetime) > Date.parse(b.datetime)
          case 'desc': return Date.parse(a.datetime) < Date.parse(b.datetime)
          default: return 0
        }
      })

      result.unshift({name: 'Name', datetime: 'Update Datetime', dependency: 'Type'})
      const padLength = {}
      result.forEach(item => {
        for (let key in item) {
          padLength[key] = Math.max(padLength[key] || 0, item[key].length)
        }
      })

      for (let i = 0; i < result.length; i++) {
        const item = result[i]
        if (i === 0) {
          console.log(`${clc.blue(pad(item.name, padLength.name))}\t${clc.blue(pad(item.datetime, padLength.datetime))}\t${clc.blue(pad(item.dependency, padLength.dependency))}`)
        } else {
          console.log(`${pad(item.name, padLength.name)}\t${pad(i === 0 ? item.datetime : moment(item.datetime).format('MM-DD-YYYY hh:mm:ss'), padLength.datetime)}\t${pad(item.dependency, padLength.dependency)}`)
        }
      }
    })
})()