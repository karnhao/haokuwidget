import { Root } from './interfaces/login';
import { GroupCourseRoot } from './interfaces/groupcourse';
import { Storage } from './interfaces/storage'
import { Settings } from './interfaces/settings';

interface TemporaryData {
    stdImage: Image | null;
}

const temp: TemporaryData = {
    stdImage: null
}

const storage: Storage = {}

const saveFileName: string = "haokuwidget_data.json";
const saveImageName: string = "haokuwidget_stdimage.jpg";
const saveSettingName: string = "haokuwidget_setting.json"
const fm: FileManager = FileManager.local();
const saveFilePath: string = fm.joinPath(fm.libraryDirectory(), saveFileName);
const saveImagePath: string = fm.joinPath(fm.libraryDirectory(), saveImageName);
const saveSettingPath: string = fm.joinPath(fm.libraryDirectory(), saveSettingName);

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

// async function tokenAuthorizationLoadCourseData(token: string, cademicYear: string, semester: string, stdId: string): Promise<{ [key: string]: any }> {
//     let req = new Request(`https://myapi.ku.th/std-profile/getGroupCourse?cademicYear=${cademicYear}&semester=${semester}&stdId=${stdId}`);
//     req.method = "OPTIONS";
//     req.headers = {
//         "Accept": "*/*",
//         "Accept-Encoding": "gzip, deflate, br",
//         "Accept-Language": "en-US,en;q=0.9,th;0.8",
//         "Access-Control-Request-Headers": "app-key, x-access-token",
//         "Access-Control-Request-Method": "GET",
//         "Origin": "https://my.ku.th",
//         "Referer": "https://my.ku.th",
//         "x-access-token": token
//     };
//     await req.load();
//     return req.response;

//     // :authority: myapi.ku.th
//     // :method: OPTIONS
//     // :path: /std-profile/getGroupCourse?academicYear=2565&semester=1&stdId=224677
//     // :scheme: https
//     // accept: */*
//     // accept-encoding: gzip, deflate, br
//     // accept-language: th-TH,th;q=0.9
//     // access-control-request-headers: app-key,x-access-token
//     // access-control-request-method: GET
//     // origin: https://my.ku.th
//     // referer: https://my.ku.th/
//     // sec-fetch-dest: empty
//     // sec-fetch-mode: cors
//     // sec-fetch-site: same-site
//     // user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36
// }

/**
 * @param token x-access-token
 * @param cademicYear ปีการศึกษา
 * @param semester เทอม เช่น 1
 * @param stdId Student ID
 */
async function loadCourseData(token: string, cademicYear: string, semester: string, stdId: string): Promise<GroupCourseRoot> {
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
    let res = await a.present();
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
        root.message = "Choose Action that you want to do!";
        return await root.present();
    },

    /**
     * แสดงเมนูเลือกการกระทำ ประกอบไปด้วย Download Subject Data, Delete Subject Data and cancel.
     * @returns -1 is cancelled, 0 is Download Subject Data and 1 is Delete Subject Data.
     */
    actionMenus: async (): Promise<number> => {
        let a = new Alert();
        a.addAction(`Download Data${fileManager.isSaveFileExist() ? " (replace)" : ""}`);
        if (fileManager.isSaveFileExist()) a.addDestructiveAction("Delete Save Data");
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
    if (res == null || res.code != "success" || res.results) throw "Failed to download subject data from server. : " + res.code;
    console.log(JSON.stringify(res, null, 2));
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

const fileManager = {
    isSaveFileExist(): boolean {
        return fm.fileExists(saveFilePath);
    },
    saveData(data: Storage): void {
        fm.writeString(saveFilePath, JSON.stringify(data));
    },
    getSaveData(): Storage | null {
        return this.isSaveFileExist() ? JSON.parse(fm.readString(saveFilePath)) : null;
    },
    deleteSaveData(): void {
        fm.remove(saveFilePath);
    },
    isSaveStdImageExist(): boolean {
        return fm.fileExists(saveImagePath);
    },
    saveStdImage(data: Image): void {
        fm.writeImage(saveImagePath, data);
    },
    getSaveStdImage(): Image | null {
        return this.isSaveStdImageExist() ? fm.readImage(saveImagePath) : null;
    },
    deleteStdImage(): void {
        fm.remove(saveImagePath);
    },
    isSaveSettingExist(): boolean {
        return fm.fileExists(saveSettingPath);
    },
    saveSetting(data: Settings): void {
        fm.writeString(saveSettingPath, JSON.stringify(data));
    },
    getSaveSetting(): Settings | null {
        return this.isSaveSettingExist() ? JSON.parse(fm.readString(saveSettingPath)) : null;
    },
    deleteSettingFile(): void {
        fm.remove(saveSettingPath);
    }
}

async function alert(title: string, message: string, actions: { text: string, option: "normal" | "destructive" }[] = [{ text: "OK", option: "normal" }]): Promise<number | void> {
    if (config.runsInWidget) return;
    let alert = new Alert();
    alert.title = title;
    alert.message = message;
    for (let i of actions) {
        if (i.option == "normal") alert.addAction(i.text);
        else alert.addDestructiveAction(i.text);
    }
    await alert.present();
}

async function alertError(title: string, message: string): Promise<void> {
    await alert(title, message, [{ text: "Exit", option: "normal" }]);
}

async function alertMessage(title: string, message: string): Promise<void> {
    await alert(title, message, [{ text: "OK", option: "normal" }]);
}

const widgetBuilder = {
    genRanHex(size: number): string { return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('') },
    genRanColor(alpha?: number): Color { return new Color(`#${this.genRanHex(6)}`, alpha) },
    addLine(
        stack: WidgetStack,
        type: "horizontally" | "vertically",
        options: {
            color?: Color,
            lengthPercentage?: number
        } = {}
    ) {
        let color = options?.color ?? Device.isUsingDarkAppearance() ? new Color("#FFFFFF", 1) : new Color("#000000", 1);
        let lengthPercentage = options?.lengthPercentage ?? 100;
        let line = stack.addStack();
        line.backgroundColor = color;
        this.setStackSize(stack, line, 100, 100,
            type == "vertically" ? { width: 1 * lengthPercentage / 100 } : { height: 1 * lengthPercentage / 100 });
    },
    sizeCal(origin: Size, percentageWidth: number, percentageHeight: number): Size {
        return new Size(origin.width * percentageWidth / 100, origin.height * percentageHeight / 100);
    },
    setStackSize(
        superStack: WidgetStack,
        stack: WidgetStack,
        percentageWidth: number,
        percentageHeight: number,
        options: {
            width?: number;
            height?: number;
        } = {}
    ): void {
        stack.size = this.sizeCal(
            superStack.size,
            options.width ? options.width * 100 / superStack.size.width : percentageWidth,
            options.height ? options.height * 100 / superStack.size.height : percentageHeight
        );
    },
    notSupported(): ListWidget {
        let widget = new ListWidget();
        widget.addText("Script not support this widget size yet : " + config.widgetFamily);
        return widget;
    },
    noData(): ListWidget {
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

            let linearGradient = new LinearGradient();
            linearGradient.colors = [new Color("#11FF55"), new Color("#1111AA")];
            linearGradient.locations = [0, 1];
            widget.backgroundGradient = linearGradient;

            let stack = widget.addStack();
            stack.cornerRadius = 12;
            stack.layoutVertically();
            stack.size = new Size(700, 330);

            let header = stack.addStack();
            widgetBuilder.addLine(stack, "horizontally");
            let body = stack.addStack();
            let footer = stack.addStack();
            footer.backgroundColor = new Color("#ABCDEF", 1);

            widgetBuilder.setStackSize(stack, header, 100, 30);
            widgetBuilder.setStackSize(stack, body, 100, 68);
            widgetBuilder.setStackSize(stack, footer, 100, 2);

            this.headers.build(header);
            return widget;
        },
        headers: {
            build(stack: WidgetStack): void {
                stack.layoutHorizontally();
                stack.backgroundColor = new Color("#FFFFFF", 0.2);
                let h1 = stack.addStack();
                widgetBuilder.addLine(stack, "vertically");
                let h2 = stack.addStack();

                widgetBuilder.setStackSize(stack, h1, 50, 100);
                widgetBuilder.setStackSize(stack, h2, 50, 100);

                this.profile.build(h1);
                this.infomation.build(h2);
            },
            profile: {
                build(stack: WidgetStack): void {
                    stack.layoutHorizontally();
                    let picture = stack.addStack();
                    widgetBuilder.addLine(stack, "vertically");
                    let info = stack.addStack();

                    widgetBuilder.setStackSize(stack, picture, 35, 100);
                    widgetBuilder.setStackSize(stack, info, 65, 100);

                    this.picture(picture);
                    this.info(info);

                },
                picture(stack: WidgetStack): void {
                    stack.layoutHorizontally();

                    stack.addSpacer();
                    let stack2 = stack.addStack();
                    stack.addSpacer();

                    widgetBuilder.setStackSize(stack, stack2, 85, 100);
                    if (temp.stdImage != null) stack2.backgroundImage = temp.stdImage;
                },
                info(stack: WidgetStack): void {
                    stack.layoutVertically();
                    let name = stack.addStack();
                    widgetBuilder.addLine(stack, "horizontally");
                    let faculty = stack.addStack();
                    let department = stack.addStack();

                    widgetBuilder.setStackSize(stack, name, 100, 40);
                    widgetBuilder.setStackSize(stack, faculty, 100, 30);
                    widgetBuilder.setStackSize(stack, department, 100, 30);

                    name.backgroundColor = widgetBuilder.genRanColor(1);
                    faculty.backgroundColor = widgetBuilder.genRanColor(1);
                    department.backgroundColor = widgetBuilder.genRanColor(1);
                }
            },
            infomation: {
                build(stack: WidgetStack): void {
                    stack.layoutVertically();
                    let top = stack.addStack();
                    widgetBuilder.addLine(stack, "horizontally");
                    let body = stack.addStack();
                    widgetBuilder.addLine(stack, "horizontally");
                    let foot = stack.addStack();

                    widgetBuilder.setStackSize(stack, top, 100, 20);
                    widgetBuilder.setStackSize(stack, body, 100, 60);
                    widgetBuilder.setStackSize(stack, foot, 100, 20);

                    top.backgroundColor = widgetBuilder.genRanColor(1);
                    body.backgroundColor = widgetBuilder.genRanColor(1);
                    foot.backgroundColor = widgetBuilder.genRanColor(1);
                },
                top: {
                    build(stack: WidgetStack): void {
                        stack.addText("Top");
                    }
                },
                body: {
                    build(stack: WidgetStack): void {
                        stack.addText("Body");
                    }
                },
                foot: {
                    build(stack: WidgetStack): void {
                        stack.addText("Foot");
                    }
                }
            }
        }
    }
}

if (!fileManager.isSaveSettingExist()) {
    fileManager.saveSetting({
        showStdImage: true,
        showStdInfo: true
    });
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
                        fileManager.saveData(storage);
                        if (data.studentImage != null) fileManager.saveStdImage(data.studentImage);
                    } catch (error) {
                        await alertError("Error", "Failed to download subject data\n" + error);
                    }
                    break;
                case 1:
                    // delete data
                    fileManager.deleteSaveData();
                    fileManager.deleteStdImage();
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
    if (fileManager.isSaveFileExist()) {
        if (config.widgetFamily == "extraLarge") {
            let saveData = fileManager.getSaveData();
            let saveImageData = fileManager.getSaveStdImage();
            temp.stdImage = saveImageData;
            if (saveData) {
                storage.groupCourse = saveData.groupCourse;
                storage.user = saveData.user;
                storage.setting = saveData.setting;
            }
            Script.setWidget(widgetBuilder.extraLarge.build());
        } else Script.setWidget(widgetBuilder.notSupported());
    } else Script.setWidget(widgetBuilder.noData());
}
alertMessage("Done", "Progress completed without errors.");
Script.complete();