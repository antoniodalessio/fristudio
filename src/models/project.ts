import { Schema } from 'mongoose';
import { IImage } from './image'
import { IBasePage, defaultPageField} from './basePage'

const project: Schema = new Schema(Object.assign(defaultPageField, {
    _id: Schema.Types.ObjectId,
    images: [
        { type: Schema.Types.ObjectId, ref: 'Image' }
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
}))

project.index({'$**': 'text'});

interface IProject extends IBasePage {
    images: IImage[];
    resources: String[];
}

export { 
    project,
    IProject
}