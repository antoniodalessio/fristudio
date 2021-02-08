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
const routes = require('express').Router();
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const page_controller_1 = __importDefault(require("../controllers/page.controller"));
const story_controller_1 = __importDefault(require("../controllers/story.controller"));
const builder_controller_1 = __importDefault(require("../controllers/builder.controller"));
const image_controller_1 = __importDefault(require("../controllers/image.controller"));
const service_controller_1 = __importDefault(require("../controllers/service.controller"));
function initApiRoutes() {
    let userCTRL = new user_controller_1.default();
    let pageCTRL = new page_controller_1.default();
    let builderCTRL = new builder_controller_1.default();
    let imageCTRL = new image_controller_1.default();
    let storyCTRL = new story_controller_1.default();
    let serviceCTRL = new service_controller_1.default();
    routes.use((req, res, next) => verifyToken(req, res, next));
    routes.get('/user', (req, res) => __awaiter(this, void 0, void 0, function* () { yield userCTRL.getAll(req, res); }));
    routes.get('/user/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield userCTRL.get(req, res); }));
    routes.post('/user', (req, res) => __awaiter(this, void 0, void 0, function* () { yield userCTRL.create(req, res); }));
    routes.put('/user/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield userCTRL.update(req, res); }));
    routes.delete('/user/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield userCTRL.delete(req, res); }));
    routes.get('/page', (req, res) => __awaiter(this, void 0, void 0, function* () { yield pageCTRL.getAll(req, res); }));
    routes.get('/page/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield pageCTRL.get(req, res); }));
    routes.post('/page', (req, res) => __awaiter(this, void 0, void 0, function* () { yield pageCTRL.create(req, res); }));
    routes.put('/page/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield pageCTRL.update(req, res); }));
    routes.delete('/page/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield pageCTRL.delete(req, res); }));
    routes.get('/story', (req, res) => __awaiter(this, void 0, void 0, function* () { yield storyCTRL.getAll(req, res); }));
    routes.get('/story/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield storyCTRL.get(req, res); }));
    routes.post('/story', (req, res) => __awaiter(this, void 0, void 0, function* () { yield storyCTRL.create(req, res); }));
    routes.put('/story/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield storyCTRL.update(req, res); }));
    routes.delete('/story/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield storyCTRL.delete(req, res); }));
    routes.get('/service', (req, res) => __awaiter(this, void 0, void 0, function* () { yield serviceCTRL.getAll(req, res); }));
    routes.get('/service/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield serviceCTRL.get(req, res); }));
    routes.post('/service', (req, res) => __awaiter(this, void 0, void 0, function* () { yield serviceCTRL.create(req, res); }));
    routes.put('/service/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield serviceCTRL.update(req, res); }));
    routes.delete('/service/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield serviceCTRL.delete(req, res); }));
    routes.get('/image', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.getAll(req, res); }));
    routes.get('/image/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.get(req, res); }));
    routes.post('/image', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.create(req, res); }));
    routes.put('/image/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.update(req, res); }));
    routes.delete('/image/:id', (req, res) => __awaiter(this, void 0, void 0, function* () { yield imageCTRL.delete(req, res); }));
    routes.get('/publish', (req, res) => __awaiter(this, void 0, void 0, function* () { yield builderCTRL.publish(req, res); }));
}
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }
    else {
        // Forbidden
        res.sendStatus(403);
    }
}
exports.default = () => {
    initApiRoutes();
    return routes;
};
//# sourceMappingURL=api.js.map