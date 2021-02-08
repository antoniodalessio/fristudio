import { model } from 'mongoose';

import { user, IUser } from './user'
import { page, IPage } from './page'
import { project, IProject } from './project'
import { image, IImage } from './image'

let User = model<IUser>('User', user)
let Page = model<IPage>('Page', page)
let Image = model<IImage>('Image', image)
let Project = model<IProject>('Project', project)

export {
    Page,
    Image,
    User,
    IUser,
    Project,
    IProject
}