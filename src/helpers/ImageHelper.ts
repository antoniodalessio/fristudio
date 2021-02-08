var fs = require('fs');
var Jimp = require('jimp');
var webp = require('webp-converter');
import FTP from './../utils/ftp'
import { IMAGES_TYPES } from "../config/config"

var clientftp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);

class ImageHelper {
  
  async saveImageFile(imageBase64: any, name: string) {
    try{
      imageBase64 = imageBase64.replace(/^data:image\/jpeg;base64,/, "");
      const path = `${process.env.SITE_IMAGE_PATH}${name}.jpg`
      await fs.writeFileSync(path, imageBase64, 'base64')
      await this.createImageFormatAndUpload(name)
    }catch(e) {
      console.log(e)
    }
  }

  async createImageFormatAndUpload(name: string) {
    for (const type of IMAGES_TYPES) {
      await this.createSingleImageAndUpload(name, {width: type.width, height: type.height}, type.postfix)
    }
  }

  async createSingleImageAndUpload(name: string, size: any, suffix: string) {
    await this.createJPGAndUpload(name, size, suffix)
    //await this.createWEBPAndUpload(name, size, suffix)
  }

  async createJPGAndUpload(name: string, size: any, suffix: string) {
    const originalImage = `${process.env.SITE_IMAGE_PATH}${name}.jpg`
    const image = await Jimp.read(originalImage)
    if (size.height === 0) {
      size.height = Jimp.AUTO
    }
    await image.resize(size.width, size.height).quality(90);
    let result = await image.getBufferAsync(Jimp.MIME_JPEG);
    await fs.writeFileSync(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`, result)
    await clientftp.upload(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`, `${process.env.REMOTE_IMAGES_PATH}${name}${suffix}.jpg`, 755)
  }

  async createWEBPAndUpload(name: string, size: any, suffix: string) {
    webp.cwebp(
      `${process.env.SITE_IMAGE_PATH}${name}${suffix}.jpg`,
      `${process.env.SITE_IMAGE_PATH}${name}${suffix}.webp`,
      "-q 80",
      function(status: any,error: any){
         //if conversion successful status will be '100'
        //if conversion fails status will be '101'
        console.log(status,error);	
      });
      //await clientftp.upload(`${process.env.SITE_IMAGE_PATH}${name}${suffix}.webp`, `${process.env.REMOTE_IMAGES_PATH}${name}${suffix}.webp`, 755)
  }

  

  async ftpRename(oldName: string, newName: string) {
    for (const type of IMAGES_TYPES) {
      const oldFile = `${process.env.REMOTE_IMAGES_PATH}${oldName}${type.postfix}.jpg`
      const newFile = `${process.env.REMOTE_IMAGES_PATH}${newName}${type.postfix}.jpg`
      await clientftp.rename(oldFile, newFile)
    }
  }

  async ftpRemove(fileName: string) {
    for (const type of IMAGES_TYPES) {
      fileName = `${process.env.REMOTE_IMAGES_PATH}${fileName}${type.postfix}.jpg`
      await clientftp.remove(fileName)
    }
  }
}

export default ImageHelper