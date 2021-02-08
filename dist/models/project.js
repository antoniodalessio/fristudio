"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.project = void 0;
const mongoose_1 = require("mongoose");
const basePage_1 = require("./basePage");
const project = new mongoose_1.Schema(Object.assign(basePage_1.defaultPageField, {
    _id: mongoose_1.Schema.Types.ObjectId,
    images: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Image' }
    ],
    template: { type: String, default: 'portfolio' },
    type: {
        type: String
    },
    subtitle: {
        type: String
    },
    resources: [
        { type: { type: String } }
    ]
}));
exports.project = project;
project.index({ '$**': 'text' });
//# sourceMappingURL=project.js.map