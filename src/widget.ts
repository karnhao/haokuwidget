export interface Root {
    code: string
    message: string
    accesstoken: string
    renewtoken: string
    user: User
    cache: boolean
}

export interface User {
    loginName: string
    userType: string
    idCode: string
    titleTh: string
    titleEn: string
    firstNameTh: string
    firstNameEn: string
    middleNameTh: any
    middleNameEn: any
    lastNameTh: string
    lastNameEn: string
    avatar: string
    gender: string
    student: Student
    roleMenus: RoleMenu[]
}

export interface Student {
    loginName: string
    stdId: string
    stdCode: string
    titleTh: string
    titleEn: string
    firstNameTh: string
    middleNameTh: any
    lastNameTh: string
    firstNameEn: string
    middleNameEn: any
    lastNameEn: string
    copenId: string
    copenNameTh: string
    copenNameEn: string
    campusCode: string
    campusNameTh: string
    campusNameEn: string
    facultyCode: string
    facultyNameTh: string
    facultyNameEn: string
    departmentCode: string
    departmentNameTh: string
    departmentNameEn: string
    majorCode: string
    majorNameTh: string
    majorNameEn: string
    nationCode: string
    nationalityNameTh: string
    nationalityNameEn: string
    studentStatusCode: string
    studentStatusNameTh: string
    studentStatusNameEn: string
    studentTypeCode: string
    studentTypeNameTh: string
    studentTypeNameEn: string
    edulevelCode: string
    edulevelNameTh: string
    edulevelNameEn: string
    studentYear: string
    advisorId: string
    advisorNameTh: string
    advisorNameEn: string
    positionTh: string
    email: string
    mobileNo: string
}

export interface RoleMenu {
    menuId: number
    menuNameTh: string
    menuUrl?: string
    menuIcon?: string
    parentMenuId: number
    menuType: number
}


const Setting = {
    user: {
        username: undefined,
        password: undefined
    },
    isValid: function () {
        return this.user.username != null && this.user.password != null;
    }
}

class Subject {
    private startTime: number = 0;
    private width: number = 0;
    private name_th: string = "";
    private name_en: string = "";
    private id: string = "";
    private day: number | null = null;

    public getStartTime(): number {
        return this.startTime;
    }

    public setStartTime(value: number) {
        this.startTime = value;
    }

    public getEndTime(): number {
        return this.startTime + this.width;
    }

    public getWidth(): number {
        return this.width;
    }

    public setWidth(value: number) {
        this.width = value;
    }

    public getNameTH(): string {
        return this.name_th;
    }

    public setNameTH(value: string) {
        this.name_th = value;
    }

    public getNameEN(): string {
        return this.name_en;
    }

    public setNameEN(value: string) {
        this.name_en = value;
    }

    public getID(): string {
        return this.id;
    }

    public setID(value: string) {
        this.id = value;
    }

    public getDay(): number | null {
        return this.day;
    }

    public setDay(value: number | null) {
        this.day = value;
    }
}

class SubjectDay {
    private subjectList: Subject[] = [];
    private name: string | undefined;
    private name_th: string | undefined;

    constructor(name_en?: string, name_th?: string) {
        this.name = name_en;
        this.name_th = name_th ?? this.name;
    }

    public getDayNameEN(): string | undefined {
        return this.name;
    }

    public getDayNameTH(): string | undefined {
        return this.name_th;
    }

    public putSubject(subject: Subject): void {
        this.subjectList.push(subject);
    }

    public getSubject(index: number): Subject {
        return this.subjectList[index];
    }
}

class Table {
    private days = {
        _0: new SubjectDay("Sunday", "อาทิตย์"),
        _1: new SubjectDay("Monday", "จันทร์"),
        _2: new SubjectDay("Tuesday", "อังคาร"),
        _3: new SubjectDay("Wednesday", "พุธ"),
        _4: new SubjectDay("Thursday", "พฤหัสบดี"),
        _5: new SubjectDay("Friday", "ศุกร์"),
        _6: new SubjectDay("Saturday", "เสาร์"),
    }

    public static parse(data: any): Table {
        //TODO : parse data
        return new Table();
    }
}