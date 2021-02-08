"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
var cors = require('cors');
const login_controller_1 = __importDefault(require("./controllers/login.controller"));
const api_1 = __importDefault(require("./routes/api"));
const public_1 = __importDefault(require("./routes/public"));
//import siteRoutes from './routes/site'
const models_1 = require("./models");
const mongoose_1 = require("mongoose");
const utils_1 = require("./utils/utils");
const SeoHelper_1 = __importDefault(require("./helpers/SeoHelper"));
var fs = require('fs-extra');
var Jimp = require('jimp');
const mongoose = require('mongoose');
var fs = require('fs');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'fristudio_backup'
});
class App {
    constructor() {
        this.init();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("app init");
            this.createFolders();
            this.setupExpress();
            this.initMongoose();
            this.setupFirstAdminUser();
            if (process.env.ENV == 'PROD') {
                const seoHelper = new SeoHelper_1.default();
                seoHelper.downloadHtaccess();
            }
            console.log(process.cwd());
            let images = yield fs.readdirSync('site/images/');
            // for (const image of images) {
            //   try{
            //     const name = image.replace('.jpg', '')
            //     const img = await Jimp.read(`site/images/${image}`)
            //     await img.resize(640, Jimp.AUTO).quality(90);
            //     let result = await img.getBufferAsync(Jimp.MIME_JPEG);
            //     await fs.writeFileSync(`site/images/${name}_thumb.jpg`, result)
            //     console.log(result)
            //   }catch(e) {
            //     console.log(e)
            //   }
            // }
            this.import();
        });
    }
    createFolders() {
        if (!fs.existsSync(`${process.env.SITE_PATH}`)) {
            fs.mkdirSync(`${process.env.SITE_PATH}`);
        }
        if (!fs.existsSync(`${process.env.SITE_IMAGE_PATH}`)) {
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
        this._expressApp.use(express.static('site'));
        this._expressApp.use(express.json({ limit: '50mb' }));
        this._expressApp.use(express.urlencoded({ limit: '50mb' }));
        this._expressApp.setMaxListeners(0);
        this._expressApp.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
        let loginCTRL = new login_controller_1.default();
        this._expressApp.post('/authenticate', (req, res) => __awaiter(this, void 0, void 0, function* () { yield loginCTRL.login(req, res); }));
        this._expressApp.post('/checkAuth', (req, res) => __awaiter(this, void 0, void 0, function* () { yield loginCTRL.checkAuth(req, res); }));
        this._expressApp.post('/logout', (req, res) => __awaiter(this, void 0, void 0, function* () { yield loginCTRL.logout(req, res); }));
        this._expressApp.use('/api/', api_1.default());
        this._expressApp.use('/public/', public_1.default());
        //this._expressApp.use('/', siteRoutes())
    }
    initMongoose() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield mongoose.connect(`${process.env.DB_HOST}${process.env.DB_NAME}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        });
    }
    setupFirstAdminUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield models_1.User.find({ username: 'admin' });
            if (data.length === 0) {
                let user = new models_1.User({
                    _id: new mongoose_1.Types.ObjectId(),
                    username: process.env.ADMIN_USER,
                    password: process.env.ADMIN_PWD,
                    hash: utils_1.toHash(process.env.ADMIN_USER, process.env.ADMIN_PWD)
                });
                const result = yield user.save();
                console.log(result);
            }
        });
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
            //connection.connect();
            const images = yield models_1.Image.find();
            for (const image of images) {
                image.uri = image.uri.replace('.jpg', '');
                image.save();
            }
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
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map