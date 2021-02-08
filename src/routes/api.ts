const routes = require('express').Router();
import userController from '../controllers/user.controller'
import pageController from '../controllers/page.controller'
import builderController from '../controllers/builder.controller'
import imageController from '../controllers/image.controller'
import projectController from '../controllers/project.controller'

function initApiRoutes() {

  let userCTRL = new userController()
  let pageCTRL = new pageController()
  let builderCTRL = new builderController()
  let imageCTRL = new imageController()
  let projectCTRL = new projectController()
  

  routes.use((req: any, res: any, next: any) => verifyToken(req, res, next))

  routes.get('/user', async (req: any, res: any) => { await userCTRL.getAll(req, res)} )
  routes.get('/user/:id', async (req: any, res: any) => { await userCTRL.get(req, res)} )
  routes.post('/user', async (req: any, res: any) => { await userCTRL.create(req, res)} )
  routes.put('/user/:id', async (req: any, res: any) => { await userCTRL.update(req, res)} )
  routes.delete('/user/:id', async (req: any, res: any) => { await userCTRL.delete(req, res)} )

  routes.get('/page', async (req: any, res: any) => { await pageCTRL.getAll(req, res)} )
  routes.get('/page/:id', async (req: any, res: any) => { await pageCTRL.get(req, res)} )
  routes.post('/page', async (req: any, res: any) => { await pageCTRL.create(req, res)} )
  routes.put('/page/:id', async (req: any, res: any) => { await pageCTRL.update(req, res)} )
  routes.delete('/page/:id', async (req: any, res: any) => { await pageCTRL.delete(req, res)} )

  const projectRoute = 'project'
  routes.get(`/${projectRoute}`, async (req: any, res: any) => { await projectCTRL.getAll(req, res)} )
  routes.get(`/${projectRoute}/:id`, async (req: any, res: any) => { await projectCTRL.get(req, res)} )
  routes.post(`/${projectRoute}`, async (req: any, res: any) => { await projectCTRL.create(req, res)} )
  routes.put(`/${projectRoute}/:id`, async (req: any, res: any) => { await projectCTRL.update(req, res)} )
  routes.delete(`/${projectRoute}/:id`, async (req: any, res: any) => { await projectCTRL.delete(req, res)} )

  routes.get('/image', async (req: any, res: any) => { await imageCTRL.getAll(req, res)} )
  routes.get('/image/:id', async (req: any, res: any) => { await imageCTRL.get(req, res)} )
  routes.post('/image', async (req: any, res: any) => { await imageCTRL.create(req, res)} )
  routes.put('/image/:id', async (req: any, res: any) => { await imageCTRL.update(req, res)} )
  routes.delete('/image/:id', async (req: any, res: any) => { await imageCTRL.delete(req, res)} )

  
  routes.get('/publish', async (req: any, res: any) => { await builderCTRL.publish(req, res)} )
  
}

function createDefaultRoutes(route: String, controller: any) {
  routes.get(`/${route}`, async (req: any, res: any) => { await controller.getAll(req, res)} )
  routes.get(`/${route}/:id`, async (req: any, res: any) => { await controller.get(req, res)} )
  routes.post(`/${route}`, async (req: any, res: any) => { await controller.create(req, res)} )
  routes.put(`/${route}/:id`, async (req: any, res: any) => { await controller.update(req, res)} )
  routes.delete(`/${route}/:id`, async (req: any, res: any) => { await controller.delete(req, res)} )
}

function verifyToken(req: any, res: any, next: any) {
  const bearerHeader = req.headers['authorization'];

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

export default () => {
  initApiRoutes();
  return routes
};