import UploadService from '../services/upload.service';
import BuilderService from '../services/builder.service'

class BuildController {

  buildService:any
  uploadService: any;

  constructor() {
    this.buildService = new BuilderService()
    this.uploadService = new UploadService()
  }
  
  
  async publish(req: any, res: any) {

    let unpublished = false
    if (req && req.query.hasOwnProperty('unpublished')) {
      unpublished = true
    }

    await this.buildService.build(unpublished)
    let result = null;
    if (res && req) {
      result = await this.buildService.upload()
    }
    
    if (process.env.ENV == 'prod') {
      await this.buildService.clearFolder()
      await this.buildService.buildSitemapXml()
      //await this.seoHelper.uploadHtaccess()
      //await this.seoHelper.downloadHtaccess()
    }    

    if (res) {
      res.status(200).json(result);
    }
  }

}

export default BuildController