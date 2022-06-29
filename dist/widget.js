const localStorage = {
    user: {
        username: undefined,
        password: undefined,
        isValid() {
            return this.username != null && this.password != null;
        }
    }
};
const setting = {
    backgroundImageUrl: undefined
};
async function login() {
    if (!localStorage.user.isValid())
        throw "username or/and password is invalid";
    let req = new Request("https://myapi.ku.th/auth/login");
    req.headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "App-key": "txCR5732xYYWDGdd49M3R19o1OVwdRFc",
        "Accept-Language": "en-US,en;q=0.9,th;0.8",
        "Origin": "https://my.ku.th",
        "Referer": "https://my.ku.th"
    };
    req.body = localStorage.user;
    return await req.loadJSON();
}
async function getSchedule(token, stdStatusCode, campusCode, majorCode, userType, facultyCode) {
    let req = new Request(`https://myapi.ku.th/common/getschedule?stdStatusCode=${stdStatusCode}&campusCode=${campusCode}&majorCode=${majorCode}&userType=${userType}&facultyCode=${facultyCode}`);
    req.headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "App-key": "txCR5732xYYWDGdd49M3R19o1OVwdRFc",
        "Accept-Language": "en-US,en;q=0.9,th;0.8",
        "Origin": "https://my.ku.th",
        "Referer": "https://my.ku.th",
        "x-access-token": token
    };
    return await req.loadJSON();
}
/**
 * @param token x-access-token
 * @param cademicYear ปีการศึกษา
 * @param semester เทอม เช่น 1
 * @param stdId Student ID
 */
async function loadData(token, cademicYear, semester, stdId) {
    let req = new Request(`https://myapi.ku.th/std-profile/getGroupCourse?cademicYear=${cademicYear}&semester=${semester}&stdId=${stdId}`);
    req.headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "App-key": "txCR5732xYYWDGdd49M3R19o1OVwdRFc",
        "Accept-Language": "en-US,en;q=0.9,th;0.8",
        "Origin": "https://my.ku.th",
        "Referer": "https://my.ku.th",
        "x-access-token": token
    };
    return await req.loadJSON();
}
async function inputUsernamePassword() {
    let a = new Alert();
    a.addTextField("username");
    a.addSecureTextField("password");
    a.addAction("Summit");
    a.addCancelAction("Cancel");
    a.title = "Login";
    a.message = "กรุณาใส่ username และ password";
    let res = await a.present();
    if (res == 0) {
        return {
            username: a.textFieldValue(0),
            password: a.textFieldValue(1)
        };
    }
}
class Subject {
    startTime = 0;
    width = 0;
    name_th = "";
    name_en = "";
    id = "";
    day = null;
    getStartTime() {
        return this.startTime;
    }
    setStartTime(value) {
        this.startTime = value;
    }
    getEndTime() {
        return this.startTime + this.width;
    }
    getWidth() {
        return this.width;
    }
    setWidth(value) {
        this.width = value;
    }
    getNameTH() {
        return this.name_th;
    }
    setNameTH(value) {
        this.name_th = value;
    }
    getNameEN() {
        return this.name_en;
    }
    setNameEN(value) {
        this.name_en = value;
    }
    getID() {
        return this.id;
    }
    setID(value) {
        this.id = value;
    }
    getDay() {
        return this.day;
    }
    setDay(value) {
        this.day = value;
    }
}
class SubjectDay {
    subjectList = [];
    name;
    name_th;
    constructor(name_en, name_th) {
        this.name = name_en;
        this.name_th = name_th ?? this.name;
    }
    getDayNameEN() {
        return this.name;
    }
    getDayNameTH() {
        return this.name_th;
    }
    putSubject(subject) {
        this.subjectList.push(subject);
    }
    getSubject(index) {
        return this.subjectList[index];
    }
}
class Table {
    days = {
        _0: new SubjectDay("Sunday", "อาทิตย์"),
        _1: new SubjectDay("Monday", "จันทร์"),
        _2: new SubjectDay("Tuesday", "อังคาร"),
        _3: new SubjectDay("Wednesday", "พุธ"),
        _4: new SubjectDay("Thursday", "พฤหัสบดี"),
        _5: new SubjectDay("Friday", "ศุกร์"),
        _6: new SubjectDay("Saturday", "เสาร์"),
    };
    static parse(data) {
        //TODO : parse data
        return new Table();
    }
}
const menus = {
    /**
     * แสดงเมนูเลือกรากฐาน ประกอบไปด้วย Actions, Settings and Cancel.
     * @returns -1 is cancelled, 0 is Actions, 1 is Settings.
     */
    rootMenus: async () => {
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
    actionMenus: async () => {
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
    settingMenus: async () => {
        let s = new Alert();
        s.addAction("Background image");
        s.addCancelAction("Cancel");
        s.title = "Choose";
        s.message = "Choose Actions";
        return await s.present();
    }
};
async function downloadSubjectData() {
    let input = await inputUsernamePassword();
    if (input == null)
        throw "Invalid input";
    let r = await login();
    let schedule = await getSchedule(r.accesstoken, r.user.student.studentStatusCode, r.user.student.campusCode, r.user.student.majorCode, r.user.userType, r.user.student.facultyCode);
    if (schedule == null)
        throw "Invalid schedule";
    return await loadData(r.accesstoken, schedule.results[0].academicYr.toString(), schedule.results[0].semester.toString(), r.user.student.stdId);
}
if (config.runsInApp) {
    switch (await menus.rootMenus()) {
        case 0:
            let res = await menus.actionMenus();
            switch (res) {
                case 0:
                    // download subject data
                    (await downloadSubjectData());
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
export {};
