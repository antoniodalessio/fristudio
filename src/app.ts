const express = require('express')
var cors = require('cors');

import loginController from './controllers/login.controller'

import apiRoutes from './routes/api'
import publicRoutes from './routes/public'
//import siteRoutes from './routes/site'
import { User } from './models'

import { Types } from 'mongoose';
import { toHash } from './utils/utils'

import SeoHelper from './helpers/SeoHelper';
import WatcherService from './services/watcher.service';

var Jimp = require('jimp');

const mongoose = require('mongoose');

var fs = require('fs');

class App {
  
  private _expressApp: any

  constructor() {
    this.init()
  }

  async init() {
    console.log("app init")
    this.createFolders()
    this.setupExpress()
    this.initMongoose()
    this.setupFirstAdminUser()

    if (process.env.ENV == 'PROD') {
      const seoHelper:SeoHelper = new SeoHelper()
      seoHelper.downloadHtaccess()
    }

    if (process.env.ENV == 'DEV') {
      new WatcherService()
    }

  }

  createFolders() {
    if (!fs.existsSync(`${process.env.SITE_PATH}`)){
      fs.mkdirSync(`${process.env.SITE_PATH}`);
    }
    if (!fs.existsSync(`${process.env.SITE_IMAGE_PATH}`)){
      fs.mkdirSync(`${process.env.SITE_IMAGE_PATH}`);
    }
  }

  setupExpress() {
    this._expressApp = express();
    this._expressApp.use(cors({
      "origin": '*',
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "exposedHeaders": ['Content-Range', 'X-Content-Range', '10'],
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    }));
    this._expressApp.use(express.static('site'))
    this._expressApp.use(express.json({limit: '50mb'}));
    this._expressApp.use(express.urlencoded({limit: '50mb'}));
    this._expressApp.setMaxListeners(0);

    this._expressApp.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT!}`);
    });

    let loginCTRL = new loginController()

    this._expressApp.post('/authenticate', async (req: any, res: any) => { await loginCTRL.login(req, res)} )
    this._expressApp.post('/checkAuth', async (req: any, res: any) => { await loginCTRL.checkAuth(req, res)} )
    this._expressApp.post('/logout', async (req: any, res: any) => { await loginCTRL.logout(req, res)} )

    this._expressApp.use('/api/', apiRoutes());
    this._expressApp.use('/public/', publicRoutes());

    this._expressApp.use('/', express.static('./site'))
    
  }

  async initMongoose() {
    let connection = await mongoose.connect(`${process.env.DB_HOST}${process.env.DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  async setupFirstAdminUser() {
    const data = await User.find({username: 'admin'})
    if (data.length === 0) {
      let user = new User({
        _id: new Types.ObjectId(),
        username: process.env.ADMIN_USER,
        password: process.env.ADMIN_PWD,
        hash: toHash(process.env.ADMIN_USER, process.env.ADMIN_PWD)
      })

      const result = await user.save()
      console.log(result)
    }
    
  }


  async import() {
    //connection.connect()
    // const projects = await Project.find({slug: 'inkcisivi'}).populate('images')
    // console.log(projects)

    // let image:any = {}
    // image._id = new Types.ObjectId()
    // image.uri = 'images/03f7f54bc12811d70fb9daaf73caf277.jpg'
    // image.type = 2
    // let imageInstance = new Image(image)
    // const img = await imageInstance.save()
    // projects[0].images.push(img)
    // await projects[0].save()

    // for(const project of projects ) {
    //   project.images = [];
    //   await project.save();
    //   const query = "SELECT * from pages join page_contents join page_sections where page_contents.page_id = pages.id and pages.id=page_sections.page_id and pages.type_id=2 and pages.id=21"
    //   console.log(query)
    //   await connection.query(query, async function(error:any, results:any, fields:any) {
        
    //     console.log(results)
    //     let images = []
    //     for (const imageRes of results) {
    //       console.log(query, results.length)
    //       let image:any = {}
    //       image._id = new Types.ObjectId()
    //       image.uri = imageRes.img
    //       image.type = imageRes.type_id
    //       let imageInstance = new Image(image)
    //       const img = await imageInstance.save()
    //       images.push(img)
    //       project.images = images
    //       await project.save()
    //     }
    //   })
    // }



    // connection.query('SELECT * from pages join page_contents where page_contents.page_id = pages.id and pages.type_id=2', async function (error:any, results:any, fields:any) {
    //   if (error) throw error;

    //   let res = results.map((elem:any) => {
    //     return {
    //       name: elem.name,
    //       title: elem.title,
    //       subtitle: elem.subtitle,
    //       slug: elem.slug,
    //       ord: elem.ord,
    //       meta: {
    //         title: elem.meta_title,
    //         description: elem.meta_description,
    //         keywords: elem.meta_keywords
    //       },
    //       body: elem.content
    //     }
    //   })


    //   console.log(res.length)


    //   for(const item of res ) {
    //     const elem = await Project.find({slug: item.slug})
    //     if (elem.length == 0) {
    //       console.log("elem", elem)
    //       item._id = new Types.ObjectId()
    //       const newProject = new Project(item)
    //       const result = await newProject.save()
    //       console.log(result)
    //     }

        

    //   }

    //   //console.log(res)
    //   // results.foreach((item:any) => {
    //   //   console.log(results)
    //   // })
    // });
     
    // connection.end();


  }
    
}


export default App;

