const Setting = {
    user: {
        username: undefined,
        password: undefined
    },
    isValid: function () {
        return this.user.username != null && this.user.password != null;
    }
};
async function login() {
    if (!Setting.isValid())
        throw "username or/and password is invalid";
    let req = new Request("https://myapi.ku.th/auth/login");
    req.headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "App-key": "txCR5732xYYWDGdd49M3R19o1OVwdRFc",
        "Accept-Language": "en-US,en;q=0.9,th;0.8",
        "Origin": "https://my.ku.th",
        "Referer": "https://my.ku.th"
    };
    req.body = Setting.user;
    return await req.loadJSON();
}
async function loadData(token) {
    let req = new Request("https://myapi.ku.th/...");
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
    if (res == 1) {
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
let res = await inputUsernamePassword();
if (res != null) {
    console.log(`username: ${res.username} \n password: ${res.password}`);
}
export {};
