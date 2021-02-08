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
            const categories = (yield models_1.Category.find()).map((item) => item ? item.toObject() : null);
            const products = (yield models_1.Product.find().populate('images')).map((item) => item ? item.toObject() : null);
            const pages = (yield models_1.Page.find()).map((item) => item ? item.toObject() : null);
            const resources = categories.concat(products).concat(pages);
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
                    if (resource.type == 'story') {
                        resources.stories = (yield models_1.Story.find(resource.filter)
                            .sort('order')
                            .populate({ path: 'images', options: { sort: { 'ord': 1 } } }))
                            .map((item) => item ? item.toObject() : null);
                    }
                    if (resource.type == 'service') {
                        resources.services = (yield models_1.Service.find(resource.filter)
                            .sort('order'))
                            .map((item) => item ? item.toObject() : null);
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
                console.log(page);
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
    buildBreadCrumb(cat, array = []) {
        return __awaiter(this, void 0, void 0, function* () {
            array.push({
                slug: cat.slug,
                label: cat.category_name
            });
            if (!cat.parent) {
                return array;
            }
            else {
                const parentCat = (yield models_1.Category.findOne({ _id: cat.parent })).toObject();
                return yield this.buildBreadCrumb(parentCat, array);
            }
        });
    }
    buildServices() {
        return __awaiter(this, void 0, void 0, function* () {
            let services = yield models_1.Service.find().populate({ path: 'images', options: { sort: { 'ord': 1 } } });
            let servs = [];
            for (let service of services) {
                let serv = service.toObject();
                serv = yield this.addResources(serv);
                servs.push(serv);
            }
            return servs;
        });
    }
    uploadServices(services, unpublished) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const service of services) {
                if (!unpublished || !service.published) {
                    yield this.assemble.render("service", service);
                    this.fileToUpload.push(service.slug);
                    yield models_1.Product.updateOne({ _id: service._id }, { published: true });
                }
            }
        });
    }
    buildStories() {
        return __awaiter(this, void 0, void 0, function* () {
            let stories = yield models_1.Story.find().sort('-order').populate({ path: 'images', options: { sort: { 'ord': 1 } } });
            let stors = [];
            for (let story of stories) {
                let stor = story.toObject();
                stor = yield this.addResources(stor);
                stors.push(stor);
            }
            return stors;
        });
    }
    uploadStories(stories, unpublished) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const story of stories) {
                if (!unpublished || !story.published) {
                    yield this.assemble.render("story", story);
                    this.fileToUpload.push(story.slug);
                    yield models_1.Product.updateOne({ _id: story._id }, { published: true });
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
            yield this.uploadServices(yield this.buildServices(), unpublished);
            yield this.uploadStories(yield this.buildStories(), unpublished);
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