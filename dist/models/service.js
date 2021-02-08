"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.service = void 0;
const mongoose_1 = require("mongoose");
const basePage_1 = require("./basePage");
const service = new mongoose_1.Schema(Object.assign(basePage_1.defaultPageField, {
    _id: mongoose_1.Schema.Types.ObjectId,
    images: [
        { type: mongoose_1.Schema.Types.ObjectId, ref: 'Image' }
    ],
    icon: {
        type: String,
    },
    order: {
        type: Number
    },
    template: { type: String, default: 'service' },
}));
exports.service = service;
service.index({ '$**': 'text' });
//# sourceMappingURL=service.js.map