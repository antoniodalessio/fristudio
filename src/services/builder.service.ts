import Assemble from './../assemble'
import FTP from './../utils/ftp'
import { Page, Project, IProject, Image } from '../models'
var fs = require('fs');
import SeoHelper from '../helpers/SeoHelper'
import UploadService from '../services/upload.service'


class BuilderService {

  private assemble: any
  private clientFtp: any
  private uploadService: any
  private seoHelper: SeoHelper

  constructor() {
    this.initAssemble()
    this.clientFtp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
    this.uploadService = new UploadService()
    this.seoHelper = new SeoHelper()
  }

  async initAssemble(){
    this.assemble = new Assemble({
      templatesPath: process.env.TEMPLATES_PATH,
      partialsPath: `${process.env.TEMPLATES_PATH}/partials/`,
      defaultLayout: `${process.env.TEMPLATES_PATH}/layout/default.hbs`,
      defaultFolder: `${process.env.SITE_PATH}`
    })
  }


  async buildSitemapXml(){

    const projects = (await Project.find().populate('images')).map((item: any) => item ? item.toObject() : null)
    const pages = (await Page.find()).map((item: any) => item ? item.toObject() : null)
    const resources = projects.concat(pages)

    const data = {
      resources: resources.filter((resource) => resource.template != 'index' && resource.template != '404'),
      baseUrl: process.env.SITE_URL,
      slug: 'sitemap'
    }

    await this.assemble.renderSimple('sitemap', data, "xml")
    await this.clientFtp.upload(`${process.env.SITE_PATH}sitemap.xml`, `${process.env.FTP_FOLDER}sitemap.xml`, 755)
  }

  async addResources(page: any) {

    if (page.hasOwnProperty('resources') && page.resources.length > 0){
      
      let resources: any = {}

      for (const resource of page.resources) {

        if (resource.type == 'projects') {
          resources.projects = (await Project.find()
                                .sort('order')
                                .populate({path: 'images', options: { sort: { 'ord': 1 } } }))
                                .map((item: any) => item ? item.toObject() : null)
        }

      }

      page.resources = resources

    }

    return page

  }

  async buildStaticPages(unpublished: any) {

    const pages = (await Page.find()).map((item: any) => item ? item.toObject() : null)
    const pags = []
    for(let page of pages) {
      page = await this.addResources(page)
      page.pageImage = `${process.env.SITE_URL}/images/logo.png`
      pags.push(page)
    }

    await this.render(pags, unpublished, Page, null)
    return pags;
  }

  async buildProjects(unpublished: any) {
    let projects = await Project.find().sort('-order').populate({path: 'images', options: { sort: { 'ord': 1 } } })
    let projs = [];
    for(let project of projects) {
      let proj = project.toObject()
      proj = await this.addResources(proj)
      projs.push(proj)
    }

    await this.render(projs, unpublished, Project, "project")

    return projs;
  }

  async render(pages: any, unpublished: any, model: any, template: any) {
    for(let page of pages) {
      if (!unpublished || !page.published) {
          console.log("render", page.title)
          await this.assemble.render(template ? template: page.template, page)
          this.uploadService.fileToUpload.push(page.slug)
          await model.updateOne({_id: page._id}, {published: true})
      }
    }
  }

  async clearFolder() {
    let filesToRemove: any = await fs.readdirSync(`${process.env.SITE_PATH}`).filter( (file: any) => {
      return file.match(/.html/ig)
    });

    for(const file of filesToRemove) {
      await fs.unlinkSync(`${process.env.SITE_PATH}${file}`)
    }
  }

  async build(unpublished: any) {
    const staticPages = await this.buildStaticPages(unpublished)
    const projects =  await this.buildProjects(unpublished)

    return {
      staticPages,
      projects
    }
  }

  async upload() {
    return await this.uploadService.uploadAll()
  }
}

export default BuilderService