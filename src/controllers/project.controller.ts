import BaseController from './base.controller'
import { Project } from '../models'


class ProjectController extends BaseController{

  constructor() {
    super()
    this.model = Project
  }

  async getAll(req: any, res: any) {
    await super.getAll(req, res, 'images')
  }

  async get(req: any, res: any) {
    await super.get(req, res, 'images')
  }

}

export default ProjectController;