"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = exports.User = exports.Image = exports.Page = void 0;
const mongoose_1 = require("mongoose");
const user_1 = require("./user");
const page_1 = require("./page");
const project_1 = require("./project");
const image_1 = require("./image");
let User = mongoose_1.model('User', user_1.user);
exports.User = User;
let Page = mongoose_1.model('Page', page_1.page);
exports.Page = Page;
let Image = mongoose_1.model('Image', image_1.image);
exports.Image = Image;
let Project = mongoose_1.model('Project', project_1.project);
exports.Project = Project;
//# sourceMappingURL=index.js.map