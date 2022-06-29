import { Root } from './interfaces/login';
import { GroupCourseRoot } from './interfaces/groupcourse';
import { Storage } from './interfaces/storage'

interface Setting {
    backgroundImageUrl: string | undefined
}

const storage: Storage = {
    user: undefined,
    groupCourse: undefined
}

const setting: Setting = {
    backgroundImageUrl: undefined
}

async function login(body: { username: string, password: string }): Promise<Root> {
    let req = new Request("https://myapi.ku.th/auth/login");
    req.headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "App-key": "txCR5732xYYWDGdd49M3R19o1OVwdRFc",
        "Accept-Language": "en-US,en;q=0.9,th;0.8",
        "Origin": "https://my.ku.th",
        "Referer": "https://my.ku.th"
    }
    req.body = body;
    return await req.loadJSON();
}

async function getSchedule(
    token: string,
    stdStatusCode: string,
    campusCode: string,
    majorCode: string,
    userType: string,
    facultyCode: string
): Promise<{ code: string, cache: boolean, results: [{ academicYr: number, semester: number }] }> {
    let req = new Request(`https://myapi.ku.th/common/getschedule?stdStatusCode=${stdStatusCode}&campusCode=${campusCode}&majorCode=${majorCode}&userType=${userType}&facultyCode=${facultyCode}`);
    req.headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "App-key": "txCR5732xYYWDGdd49M3R19o1OVwdRFc",
        "Accept-Language": "en-US,en;q=0.9,th;0.8",
        "Origin": "https://my.ku.th",
        "Referer": "https://my.ku.th",
        "x-access-token": token
    }
    return await req.loadJSON();
}

/**
 * @param token x-access-token
 * @param cademicYear ปีการศึกษา
 * @param semester เทอม เช่น 1
 * @param stdId Student ID
 */
async function loadData(token: string, cademicYear: string, semester: string, stdId: string): Promise<GroupCourseRoot> {
    let req = new Request(`https://myapi.ku.th/std-profile/getGroupCourse?cademicYear=${cademicYear}&semester=${semester}&stdId=${stdId}`);
    req.headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "App-key": "txCR5732xYYWDGdd49M3R19o1OVwdRFc",
        "Accept-Language": "en-US,en;q=0.9,th;0.8",
        "Origin": "https://my.ku.th",
        "Referer": "https://my.ku.th",
        "x-access-token": token
    }
    return await req.loadJSON();
}

async function inputUsernamePassword(): Promise<{ username: string, password: string } | void> {
    let a = new Alert();
    a.addTextField("username");
    a.addSecureTextField("password");
    a.addAction("Summit");
    a.addCancelAction("Cancel");
    a.title = "Login";
    a.message = "กรุณาใส่ username และ password";
    let res = await a.present()
    if (res == 0) {
        return {
            username: a.textFieldValue(0),
            password: a.textFieldValue(1)
        }
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


const menus = {
    /**
     * แสดงเมนูเลือกรากฐาน ประกอบไปด้วย Actions, Settings and Cancel.
     * @returns -1 is cancelled, 0 is Actions, 1 is Settings.
     */
    rootMenus: async (): Promise<number> => {
        let root = new Alert();
        root.addAction("Actions");
        root.addAction("Settings");
        root.addCancelAction("Cancel");
        root.title = "Choose";
        root.message = "Would you could you on a car? Eat them eat them here there are!";
        return await root.present();
    },

    /**
     * แสดงเมนูเลือกการกระทำ ประกอบไปด้วย Download Subject Data, Delete Subject Data and cancel.
     * @returns -1 is cancelled, 0 is Download Subject Data and 1 is Delete Subject Data.
     */
    actionMenus: async (): Promise<number> => {
        let a = new Alert();
        a.addAction("Download Subject Data again");
        a.addDestructiveAction("Delete Subject Data");
        a.addCancelAction("Cancel");
        a.title = "Choose";
        a.message = "Choose Actions";
        return await a.present();
    },


    /**
     * แสดงเมนูการตั้งค่า ประกอบไปด้วย Background image and cancel.
     * @returns -1 is cancelled and 0 is Background image.
     */
    settingMenus: async (): Promise<number> => {
        let s = new Alert();
        s.addAction("Background image");
        s.addCancelAction("Cancel");
        s.title = "Choose";
        s.message = "Choose Actions";
        return await s.present();
    }
}

async function downloadSubjectData() {
    console.log("Waiting for input...");
    let input = await inputUsernamePassword();
    if (input == null) throw "Invalid input";
    console.log("Logging to https://myapi.ku.th...");
    let r = await login({ username: input.username, password: input.password });
    console.log(r.code == "success" ? "Login successful" : "Login failed");
    if (r.code != "success") throw r.code;
    console.log("Request schedule from https://myapi.ku.th...");
    let schedule = await getSchedule(
        r.accesstoken,
        r.user.student.studentStatusCode,
        r.user.student.campusCode,
        r.user.student.majorCode,
        r.user.userType,
        r.user.student.facultyCode
    );
    if (schedule.code != "success") throw "Failed to get schedule data code " + schedule.code;
    console.log("Downloading Subject Data...");
    let res = await loadData(
        r.accesstoken,
        schedule.results[0].academicYr.toString(),
        schedule.results[0].semester.toString(),
        r.user.student.stdId
    );
    if (res == null || res.code != "success") throw "Failed to download subject data from server. : " + res.code;
    return res;
}

async function alertError(title: string, message: string): Promise<void> {
    let alertError = new Alert();
    alertError.title = title;
    alertError.message = message;
    alertError.addAction("Exit");
    await alertError.present();
}

if (config.runsInApp) {
    switch (await menus.rootMenus()) {
        case 0:
            let res = await menus.actionMenus();
            switch (res) {
                case 0:
                    // download subject data
                    try {
                        storage.groupCourse = await downloadSubjectData();
                    } catch (error) {
                        await alertError("Error", "Failed to download subject data\n" + error);
                    }
                    break;
                case 1:
                    // delete subject data
                    break;
                default:
                    break;
            }
            break;
        case 1:
            await menus.settingMenus();
            break;
        default:
    }
}