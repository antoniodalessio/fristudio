import BuildController from '../controllers/builder.controller'
var watch = require('node-watch');
import fs from 'fs'

import { exec } from 'child_process'

const execShellCommand = function(cmd: any) {
    
    return new Promise((resolve, reject) => {
     exec(cmd, (error, stdout, stderr) => {
      if (error) {
       console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
     });
    });
   }


class WatcherService {


  private bowerDir = "bower_components/";

  private commonjs = [
    this.bowerDir + 'jquery/dist/jquery.js',
		process.env.ASSETS_FOLDER + 'js/common.js'
  ]

  constructor() {
    this.watchTemplate()
    this.watchScss()
    this.watchJs()
  }

  async watchTemplate() {
    this.buildTemplate()
    watch(`${process.env.ASSETS_FOLDER}templates/`, { recursive: true }, async (evt: any, name: any) => {
      this.buildTemplate()
    });
  }

  async watchScss() {
    this.compileScss()
    watch(`${process.env.ASSETS_FOLDER}scss/`, { recursive: true }, async (evt: any, name: any) => {
      this.compileScss()
    });
  }

  async watchJs() {
    this.compileJs()
    watch(`${process.env.ASSETS_FOLDER}js/`, { recursive: true }, async (evt: any, name: any) => {
      this.compileJs()
    });
  }

  async buildTemplate() {
    const buildController = new BuildController()
    buildController.publish(null, null)
  }

  async compileScss() {
    fs.readdir(`${process.env.ASSETS_FOLDER}scss/`, async (err, files) => {
      files.forEach(async file => {
        const filename = file.replace('.scss', '')
        if (!(/^_/.test(file)) && file != 'partials') {
          await execShellCommand(`sass ${process.env.ASSETS_FOLDER}scss/${filename}.scss:${process.env.SITE_PATH}css/${filename}.css`)
        }
      })
    })
  }

  async compileJs() {
    console.log("compile js")
    fs.readdir(`${process.env.ASSETS_FOLDER}js/`, async (err, files) => {
      files.forEach(async file => {
        const filename = file.replace('.js', '')
        console.log(filename)
        await execShellCommand(`uglifyjs ${this.commonjs.join(' ')} ${process.env.ASSETS_FOLDER}js/${file} -c -o ${process.env.SITE_PATH}js/${filename}.min.js`)
      })
    })
  }

}

export default WatcherService