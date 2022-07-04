import { Settings } from './settings';
import { Root } from './login';
import { GroupCourseRoot } from './groupcourse';

export interface Storage {
    user?: {
        root?: Root
    },
    groupCourse?: GroupCourseRoot
}