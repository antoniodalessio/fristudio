import FTP from './../utils/ftp'


class UploadService {

  public fileToUpload: string[] = []
  private clientFtp: any

  constructor() {
    this.clientFtp = new FTP(process.env.FTP_HOST, 21, process.env.FTP_USER, process.env.FTP_PWD, false);
  }

  async uploadAll() {
    console.log(this.fileToUpload)
    let filesUploaded = []

    for(const file of this.fileToUpload) {
      await this.clientFtp.upload(`${process.env.SITE_PATH}${file}.html`, `${process.env.FTP_FOLDER}${file}.html`, 755)
      filesUploaded.push(`${file}`)
    }

    this.fileToUpload = []

    return {filesUploaded}
  }

}

export default UploadService