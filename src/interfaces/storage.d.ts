import { Root } from './login';
import { GroupCourseRoot } from './groupcourse';

export interface Storage {
    user?: {
        root: Root | undefined
    },
    groupCourse?: GroupCourseRoot | undefined 
}