import { Root } from './login';
import { GroupCourseRoot } from './groupcourse';

export interface Storage {
    user: {
        root: Root | undefined
    } | undefined,
    groupCourse: GroupCourseRoot | undefined
}