import { Root } from './interfaces/login';
import { GroupCourseRoot } from './interfaces/groupcourse';
import { Storage } from './interfaces/storage'

interface TemporaryData {
    stdImage: Image | null;
}

const temp: TemporaryData = {
    stdImage: null
}

const storage: Storage = {
    user: undefined,
    groupCourse: undefined
}

const saveFileName: string = "haokuwidget_data.json";
const saveImageName: string = "haokuwidget_stdimage.jpg";
const fm: FileManager = FileManager.local();
const saveFilePath: string = fm.joinPath(fm.libraryDirectory(), saveFileName);
const saveImagePath: string = fm.joinPath(fm.libraryDirectory(), saveImageName);

async function login(body: { username: string, password: string }): Promise<Root> {
    let req = new Request("https://myapi.ku.th/auth/login");
    req.method = "POST";
    req.headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "App-key": "txCR5732xYYWDGdd49M3R19o1OVwdRFc",
        "Accept-Language": "en-US,en;q=0.9,th;0.8",
        "Origin": "https://my.ku.th",
        "Referer": "https://my.ku.th",
        "Content-Type": "application/json",
        "Content-Length": JSON.stringify(body).length.toString()
    };
    req.body = JSON.stringify(body);
    return await req.loadJSON();
}

async function getStdImage(token: string): Promise<Image> {
    let req = new Request("https://myapi.ku.th/std-profile/stdimages");
    req.headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "App-key": "txCR5732xYYWDGdd49M3R19o1OVwdRFc",
        "x-access-token": token
    };
    return req.loadImage();
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
    };
    return await req.loadJSON();
}

async function tokenAuthorizationLoadCourseData(token: string, cademicYear: string, semester: string, stdId: string): Promise<{ [key: string]: any }> {
    let req = new Request(`https://myapi.ku.th/std-profile/getGroupCourse?cademicYear=${cademicYear}&semester=${semester}&stdId=${stdId}`);
    req.method = "OPTIONS";
    req.headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,th;0.8",
        "Access-Control-Request-Headers": "app-key, x-access-token",
        "Access-Control-Request-Method": "GET",
        "Origin": "https://my.ku.th",
        "Referer": "https://my.ku.th",
        "x-access-token": token
    };
    await req.load();
    return req.response;

    // :authority: myapi.ku.th
    // :method: OPTIONS
    // :path: /std-profile/getGroupCourse?academicYear=2565&semester=1&stdId=224677
    // :scheme: https
    // accept: */*
    // accept-encoding: gzip, deflate, br
    // accept-language: th-TH,th;q=0.9
    // access-control-request-headers: app-key,x-access-token
    // access-control-request-method: GET
    // origin: https://my.ku.th
    // referer: https://my.ku.th/
    // sec-fetch-dest: empty
    // sec-fetch-mode: cors
    // sec-fetch-site: same-site
    // user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36
}

/**
 * @param token x-access-token
 * @param cademicYear ปีการศึกษา
 * @param semester เทอม เช่น 1
 * @param stdId Student ID
 */
async function loadCourseData(token: string, cademicYear: string, semester: string, stdId: string): Promise<GroupCourseRoot> {
    let res = await tokenAuthorizationLoadCourseData(token, cademicYear, semester, stdId);
    console.log(JSON.stringify(res, null, 2));
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

async function inputUsernamePassword(): Promise<{ username: string, password: string } | void> {
    let a = new Alert();
    a.addTextField("username");
    a.addSecureTextField("password");
    a.addAction("Summit");
    a.addCancelAction("Cancel");
    a.title = "Login";
    a.message = "กรุณาใส่ username และ password";
    let res = await a.present()
    if (res == 0) return {
        username: a.textFieldValue(0),
        password: a.textFieldValue(1)
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
        a.addAction(`Download Data${isSaveFileExist() ? " (replace)" : ""}`);
        if (isSaveFileExist()) a.addDestructiveAction("Delete Save Data");
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

async function getAllDownloadData() {
    console.log("Waiting for input...");
    let input = await inputUsernamePassword();
    if (input == null) throw "Invalid input";
    console.log("Logging to https://myapi.ku.th...");
    let r = await login({ username: input.username, password: input.password });
    console.log(r.code == "success" ? "Login successful" : "Login failed");
    if (r.code != "success") throw r.code;
    let stdImage: Image | null = null;

    console.log("Request schedule from https://myapi.ku.th ...");
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
    let res = await loadCourseData(
        r.accesstoken,
        schedule.results[0].academicYr.toString(),
        schedule.results[0].semester.toString(),
        r.user.student.stdId
    );
    if (res == null || res.code != "success") throw "Failed to download subject data from server. : " + res.code;
    console.log("Successfully downloaded subject data from the server.");
    console.log("Downloading Student Image...")
    try {
        stdImage = await getStdImage(r.accesstoken);
        console.log("Successfully downloaded student's image.");
    } catch (error) {
        console.log("(Failed to download image): " + error);
    }
    return { groupCourse: res, user: r, studentImage: stdImage };
}

function isSaveFileExist(): boolean {
    return fm.fileExists(saveFilePath);
}

function saveData(data: Storage): void {
    fm.writeString(saveFilePath, JSON.stringify(data));
}

function getSaveData(): Storage | null {
    return isSaveFileExist() ? JSON.parse(fm.readString(saveFilePath)) : null;
}

function deleteSaveData(): void {
    fm.remove(saveFilePath);
}

function isSaveStdImageExist(): boolean {
    return fm.fileExists(saveImagePath);
}

function saveStdImage(data: Image): void {
    fm.writeImage(saveImagePath, data);
}

function getSaveStdImage(): Image | null {
    return isSaveStdImageExist() ? fm.readImage(saveImagePath) : null;
}

function deleteStdImage(): void {
    fm.remove(saveImagePath);
}


async function alertError(title: string, message: string): Promise<void> {
    let alertError = new Alert();
    alertError.title = title;
    alertError.message = message;
    alertError.addAction("Exit");
    await alertError.present();
}

async function alertMessage(title: string, message: string): Promise<void> {
    if (config.runsInWidget) return;
    let alert = new Alert();
    alert.title = title;
    alert.message = message;
    alert.addAction("OK");
    await alert.present();
}

const widgetBuilder = {
    nodata(): ListWidget {
        let widget = new ListWidget();
        widget.addText("No data");
        let t = widget.addText("Click here to login and download data.");
        t.url = URLScheme.forRunningScript();
        return widget;
    },
    async debug(): Promise<ListWidget> {
        let widget = new ListWidget();
        let text = widget.addText(JSON.stringify(storage));
        text.font = Font.systemFont(1);
        return widget;
    },
    extraLarge: {
        build(): ListWidget {
            let widget = new ListWidget();
            let stack = widget.addStack();
            stack.size = new Size(710, 345);
            this.headers.build(stack);
            return widget;
        },
        headers: {
            build(stack: WidgetStack): void {
                stack.layoutHorizontally();
                stack.backgroundColor = new Color("#FFFFFF", 0.2);
                stack.borderWidth = 1;
                let h1 = stack.addStack();
                let h2 = stack.addStack();

                h1.size = new Size(stack.size.width * 2 / 5, stack.size.height);
                h2.size = new Size(stack.size.width * 3 / 5, stack.size.height);

                this.profile.build(h1);
                this.infomation.build(h2);
            },
            profile: {
                build(stack: WidgetStack): void {
                    stack.layoutHorizontally();
                },
                picture(stack: WidgetStack): void {
                    let stack2 = stack.addStack();
                    stack2.size = new Size(stack.size.width - 10, stack.size.height - 10);
                    if (temp.stdImage != null) stack2.backgroundImage = temp.stdImage;
                },
                info(stack: WidgetStack): void {

                }
            },
            infomation: {
                build(stack: WidgetStack): void {

                }
            }
        }
    }
}

if (config.runsInApp) {
    switch (await menus.rootMenus()) {
        case 0:
            let res = await menus.actionMenus();
            switch (res) {
                case 0:
                    // download data
                    try {
                        let data = await getAllDownloadData();
                        storage.groupCourse = data.groupCourse;
                        storage.user = { root: data.user };
                        saveData(storage);
                        if (data.studentImage != null) saveStdImage(data.studentImage);
                    } catch (error) {
                        await alertError("Error", "Failed to download subject data\n" + error);
                    }
                    break;
                case 1:
                    // delete data
                    deleteSaveData();
                    deleteStdImage();
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
} else if (config.runsInWidget) {
    if (isSaveFileExist()) {
        let saveData = getSaveData();
        let saveImageData = getSaveStdImage();
        temp.stdImage = saveImageData;
        if (saveData) {
            storage.groupCourse = saveData.groupCourse;
            storage.user = saveData.user;
        }
        Script.setWidget(widgetBuilder.extraLarge.build());
    } else Script.setWidget(widgetBuilder.nodata());
}
alertMessage("Done", "Progress completed without errors.");
Script.complete();