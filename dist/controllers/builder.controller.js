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
const assemble_1 = __importDefault(require("./../assemble"));
const ftp_1 = __importDefault(require("./../utils/ftp"));
const models_1 = require("../models");
var fs = require('fs');
const SeoHelper_1 = __importDefault(require("../helpers/SeoHelper"));
class BuilderController {
    constructor() {
        this.fileToUpload = [];
        this.initAssemble();
        this.clientFtp = new ftp_1.default(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
        this.seoHelper = new SeoHelper_1.default();
    }
    initAssemble() {
        return __awaiter(this, void 0, void 0, function* () {
            this.assemble = new assemble_1.default({
                templatesPath: process.env.TEMPLATES_PATH,
                partialsPath: `${process.env.TEMPLATES_PATH}/partials/`,
                defaultLayout: `${process.env.TEMPLATES_PATH}/layout/default.hbs`,
                defaultFolder: `${process.env.SITE_PATH}`
            });
        });
    }
    buildSitemapXml() {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = (yield models_1.Project.find().populate('images')).map((item) => item ? item.toObject() : null);
            const pages = (yield models_1.Page.find()).map((item) => item ? item.toObject() : null);
            const resources = projects.concat(pages);
            const data = {
                resources: resources.filter((resource) => resource.template != 'index' && resource.template != '404'),
                baseUrl: process.env.SITE_URL,
                slug: 'sitemap'
            };
            yield this.assemble.renderSimple('sitemap', data, "xml");
            yield this.clientFtp.upload(`${process.env.SITE_PATH}sitemap.xml`, `${process.env.FTP_FOLDER}sitemap.xml`, 755);
        });
    }
    addResources(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (page.hasOwnProperty('resources') && page.resources.length > 0) {
                let resources = {};
                for (const resource of page.resources) {
                    if (resource.type == 'projects') {
                        console.log("project");
                        resources.projects = (yield models_1.Project.find(resource.filter)
                            .sort('order')
                            .populate({ path: 'images', options: { sort: { 'ord': 1 } } }))
                            .map((item) => item ? item.toObject() : null);
                        console.log("resources.projects", resources.projects);
                    }
                }
                page.resources = resources;
            }
            return page;
        });
    }
    buildStaticPages() {
        return __awaiter(this, void 0, void 0, function* () {
            const pages = (yield models_1.Page.find()).map((item) => item ? item.toObject() : null);
            const pags = [];
            for (let page of pages) {
                page = yield this.addResources(page);
                page.pageImage = `${process.env.SITE_URL}/images/logo.png`;
                pags.push(page);
            }
            return pags;
        });
    }
    uploadStaticPages(pages, unpublished) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let page of pages) {
                if (!unpublished || !page.published) {
                    yield this.assemble.render(page.template, page);
                    this.fileToUpload.push(page.slug);
                    yield models_1.Page.updateOne({ _id: page._id }, { published: true });
                }
            }
        });
    }
    buildProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            let projects = yield models_1.Project.find().sort('-order').populate({ path: 'images', options: { sort: { 'ord': 1 } } });
            let projs = [];
            for (let project of projects) {
                let proj = project.toObject();
                proj = yield this.addResources(proj);
                projs.push(proj);
            }
            return projs;
        });
    }
    uploadProjects(projects, unpublished) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const project of projects) {
                if (!unpublished || !project.published) {
                    yield this.assemble.render("portfolio", project);
                    this.fileToUpload.push(project.slug);
                    yield models_1.Project.updateOne({ _id: project._id }, { published: true });
                }
            }
        });
    }
    upload() {
        return __awaiter(this, void 0, void 0, function* () {
            let filesUploaded = [];
            for (const file of this.fileToUpload) {
                yield this.clientFtp.upload(`${process.env.SITE_PATH}${file}.html`, `${process.env.FTP_FOLDER}${file}.html`, 755);
                filesUploaded.push(`${file}`);
            }
            this.fileToUpload = [];
            return { filesUploaded };
        });
    }
    clearFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            let filesToRemove = yield fs.readdirSync(`${process.env.SITE_PATH}`).filter((file) => {
                return file.match(/.html/ig);
            });
            for (const file of filesToRemove) {
                yield fs.unlinkSync(`${process.env.SITE_PATH}${file}`);
            }
        });
    }
    renderBySlug(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const allPages = [yield this.buildStaticPages()].reduce((acc, curr) => {
                return acc.concat(curr);
            });
            for (let page of allPages) {
                page = yield this.addResources(page);
            }
            name = name.replace(".html", "");
            const page = allPages.filter((resource) => resource.slug == name);
            const result = yield this.assemble.renderPage(page[0]);
            return result;
        });
    }
    build(unpublished) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.uploadStaticPages(yield this.buildStaticPages(), unpublished);
            yield this.uploadProjects(yield this.buildProjects(), unpublished);
        });
    }
    publish(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let unpublished = false;
            if (req.query.hasOwnProperty('unpublished')) {
                unpublished = true;
            }
            yield this.build(unpublished);
            let result = yield this.upload();
            if (process.env.ENV == 'prod') {
                yield this.clearFolder();
            }
            yield this.buildSitemapXml();
            yield this.seoHelper.uploadHtaccess();
            yield this.seoHelper.downloadHtaccess();
            res.status(200).json(result);
        });
    }
}
exports.default = BuilderController;
//# sourceMappingURL=builder.controller.js.map