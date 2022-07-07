import { Root } from './interfaces/login';
import { GroupCourseRoot } from './interfaces/groupcourse';
import { Storage } from './interfaces/storage'
import { Settings } from './interfaces/settings';

interface TemporaryData {
    stdImage?: Image,
    setting?: Settings,
    table?: Table,
    user_root?: Root,

}

const temp: TemporaryData = {}

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

/**
 * 
 * @param token x-access-token
 * @return {Promise<any>} response
 */
async function renew(token: string, body: { renewtoken: string }): Promise<any> {
    let req = new Request("https://myapi.ku.th/auth/renew");
    req.body = body
    req.headers = {
        "accept": "*/*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "th-TH,th;q=0.9",
        "app-key": "txCR5732xYYWDGdd49M3R19o1OVwdRFc",
        "content-type": "application/json",
        "content-length": JSON.stringify(body).length.toString(),
        "x-access-token": token
    };
    await req.loadJSON();
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
    private day: number | undefined;
    private teacher_name: string = "";
    private period: number = -1;
    private room: string = "";

    public static getEmptySubject(startTime: number = 0, period: number = -1): Subject {
        let subject = new Subject();
        subject.setNameEN("Empty❌");
        subject.setNameTH("ไม่มี❌");
        subject.setRoom("NULL");
        subject.setWidth(1439 - startTime);
        subject.setPeriod(period);
        subject.setStartTime(startTime);
        return subject;
    }

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

    public getDay(): number | undefined {
        return this.day;
    }

    public setDay(value?: number) {
        this.day = value;
    }

    public getTeacherName(): string {
        return this.teacher_name;
    }

    public setTeacherName(value: string) {
        this.teacher_name = value;
    }

    public getPeriod(): number {
        return this.period;
    }

    public setPeriod(value: number) {
        this.period = value;
    }

    public getRoom(): string {
        return this.room;
    }

    public setRoom(value: string) {
        this.room = value;
    }

    private getLocaleTimeStringFromMinutes(minutes: number): string {
        if (minutes == Infinity) return "???";
        let pad = (d: number) => (d < 10) ? '0' + d.toString() : d.toString();
        let hours = Math.floor(minutes / 60);
        return `${pad(hours)}:${pad(minutes % 60)}`;
    }

    public getLocaleStartTime(): string {
        return this.getLocaleTimeStringFromMinutes(this.startTime);
    }

    public getLocaleEndTime(): string {
        return this.getLocaleTimeStringFromMinutes(this.startTime + this.width);
    }

    public getLocaleTime(): string {
        return `${this.getLocaleStartTime()} - ${this.getLocaleEndTime()}`;
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

    public getSubjectList(): Subject[] {
        return this.subjectList;
    }

    public setSubjects(subjects: Subject[]): void {
        this.subjectList = subjects;
    }

    public getSubjectByTime(timeMinute: number): Subject | void {
        this.subjectList.forEach((s) => {
            if (timeMinute < s.getEndTime() && timeMinute >= s.getStartTime()) return s;
        });
    }
}

class Table {
    private days = {
        /**
         * วันอาทิตย์ พรุ่งนี้ก็จะวันจันทร์แล้ว
         */
        _0: new SubjectDay("Sunday", "อาทิตย์"),
        /**
         * วันจันทร์ ง่วง
         */
        _1: new SubjectDay("Monday", "จันทร์"),
        /**
         * วันอังคาร
         */
        _2: new SubjectDay("Tuesday", "อังคาร"),
        /**
         * วันพุธ
         */
        _3: new SubjectDay("Wednesday", "พุธ"),
        /**
         * วันพฤหัสบดี
         */
        _4: new SubjectDay("Thursday", "พฤหัสบดี"),
        /**
         * วันศุกร์ พรุ่งนี้จะได้หยุดแล้ว
         */
        _5: new SubjectDay("Friday", "ศุกร์"),
        /**
         * วันเสาร์
         */
        _6: new SubjectDay("Saturday", "เสาร์"),
    }

    public getDays(day: number): SubjectDay {
        if (day < 0 || day >= 8) throw new Error("Invalid day: " + day);
        let key = (Object.keys(this.days) as Array<keyof typeof this.days>).at(Math.floor(day));
        return key == null ? new SubjectDay("ERROR", "ERROR") : this.days[key];
    }

    public getCurrentSubject(): Subject | void {
        let date = new Date();
        return this.getDays(date.getDay()).getSubjectByTime((date.getHours() * 60) + date.getMinutes());
    }

    public static parse(data?: GroupCourseRoot): Table {
        if (data == null) return new Table();
        let table = new Table();
        data.results[0].course.map((c) => {
            let subject = new Subject();
            let day = c.day_w_c != null ? ((code: string) => {
                let day = 0;
                for (let i = 0; i < 7; i++) {
                    day++;
                    if (code[i] == '1') break;
                }
                if (day == 7) day = 0;
                return day;
            })(c.day_w_c) : undefined;

            let timeCal = (time: string) => {
                let temp = time.replace(" ", "").split(":").map(t => Number.parseInt(t));
                return (temp[0] * 60) + temp[1];
            }

            subject.setNameTH(c.subject_name_th);
            subject.setNameEN(c.subject_name_en);
            subject.setDay(day);
            subject.setRoom(c.room_name_en);
            subject.setStartTime(c.time_start);
            subject.setTeacherName(c.teacher_name_en);
            subject.setWidth(timeCal(c.time_to) - timeCal(c.time_from));
            return subject;
        }).filter((s) => s.getDay() != null).forEach((s) => {
            let subject_day = s.getDay();
            if (subject_day != null) {
                table.getDays(subject_day).putSubject(s);
                console.log("Subject loaded: "
                    + table.getDays(subject_day).getDayNameEN()
                    + " " + s.getNameEN()
                    + " " + s.getID());
            }
        });

        for (let i = 0; i < 7; i++) {
            let sl = table.getDays(i).getSubjectList();
            for (let j = 0; j < sl.length; j++) {
                sl[j].setPeriod(j);
                sl[j].setWidth
            }
        }

        return table;
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
     * @returns a number
     *  - -1 is cancelled,
     *  - 0 is toggle profile picture.
     *  - 1 is toggle profile infomation.
     */
    settingMenus: async (): Promise<number> => {
        let s = new Alert();
        s.addAction(temp.setting?.showStdImage ? "Disable Profile Picture" : "Enable Profile Picture");
        s.addAction(temp.setting?.showStdInfo ? "Disable Profile Info" : "Enable Profile Info");
        s.addCancelAction("Cancel");
        s.title = "Choose";
        s.message = "Choose setting actions";
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
    //let renew_response = await renew(r.accesstoken, { renewtoken: r.renewtoken });
    //console.log(JSON.stringify(renew_response));
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
    /**
     * This will error when save file is not exists.
     * @returns Save data.
     */
    getSaveData(): Storage {
        return JSON.parse(fm.readString(saveFilePath));
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
    getSaveStdImage(): Image | undefined {
        return this.isSaveStdImageExist() ? fm.readImage(saveImagePath) : undefined;
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
    /**
     * this will error when save file is not exists.
     * @returns Settings object
     */
    getSaveSetting(): Settings {
        return JSON.parse(fm.readString(saveSettingPath));
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
        let color = options?.color ?? Device.isUsingDarkAppearance() ? new Color("#FFFFFF", 0.5) : new Color("#000000", 1);
        let lengthPercentage = options?.lengthPercentage ?? 100;
        let line = stack.addStack();
        line.backgroundColor = color;
        this.setStackSize(stack, line, 100, 100,
            type == "vertically" ? { width: 0.5 * lengthPercentage / 100 } : { height: 0.5 * lengthPercentage / 100 });
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
        let text = widget.addText(JSON.stringify(temp));
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
                stack.cornerRadius = 12;
                stack.layoutHorizontally();
                stack.backgroundColor = new Color("#000000", 0.2);
                let h1_size = !(temp.setting?.showStdImage
                    || temp.setting?.showStdInfo) ? 0 : !temp.setting.showStdInfo ? 10 : 50;
                if (h1_size > 0) {
                    let h1 = stack.addStack();
                    widgetBuilder.addLine(stack, "vertically", { lengthPercentage: 90 });
                    widgetBuilder.setStackSize(stack, h1, h1_size, 100);
                    this.profile.build(h1);
                }
                let h2 = stack.addStack();

                widgetBuilder.setStackSize(stack, h2, 99 - h1_size, 100);
                let date = new Date();
                this.infomation.build(h2, temp.table?.getCurrentSubject() ?? Subject.getEmptySubject(date.getMinutes() + (date.getHours() * 60)));
            },
            profile: {
                build(stack: WidgetStack): void {
                    this.info(stack);
                },
                picture(stack: WidgetStack): void {
                    stack.layoutVertically();
                    let stack2 = stack.addStack();
                    stack2.addSpacer();

                    widgetBuilder.setStackSize(stack, stack2, 90, 90);
                    if (temp.stdImage != null) {
                        let image = stack2.addImage(temp.stdImage);
                        image.cornerRadius = 10;
                    }
                },
                info(stack: WidgetStack): void {
                    stack.layoutVertically();

                    if (temp.setting?.showStdInfo) {
                        let top = stack.addStack();
                        let mid = stack.addStack();
                        let bottom = stack.addStack();

                        let top2_size = temp.setting.showStdImage ? 40 : 0;

                        top.layoutHorizontally();
                        let top1 = top.addStack();

                        widgetBuilder.setStackSize(top, top1, 100 - top2_size, 100);
                        if (top2_size > 0) {
                            let top2 = top.addStack();
                            this.picture(top2);
                            widgetBuilder.setStackSize(top, top2, top2_size, 100);
                        }

                        top1.layoutVertically();

                        mid.layoutVertically();
                        bottom.layoutVertically();

                        widgetBuilder.setStackSize(stack, top1, 100, 30);
                        widgetBuilder.setStackSize(stack, mid, 100, 30);
                        widgetBuilder.setStackSize(stack, bottom, 100, 30);
                        let fullName =
                            `${temp.user_root?.user.titleTh}
 ${temp.user_root?.user.firstNameTh}
 ${temp.user_root?.user.lastNameTh}`.replace("\n", "");
                        let text_name = top1.addText(fullName);
                        text_name.lineLimit = 1;
                        text_name.font = Font.systemFont(9);

                        let mid_text_1 = mid.addText(
                            "คณะ : " + temp.user_root?.user.student.facultyNameTh
                            ?? "NULL"
                        );
                        let mid_text_2 = mid.addText(
                            "สาขา : " + temp.user_root?.user.student.departmentNameTh
                            ?? "NULL"
                        );


                        let bottom_text = bottom.addText(
                            temp.user_root?.user.student.studentStatusNameEn ?? "NULL"
                        );

                        [mid_text_1, mid_text_2, bottom_text].forEach(t => {
                            t.lineLimit = 2;
                            t.font = Font.systemFont(11);
                        });
                    } else if (temp.setting?.showStdImage) {
                        this.picture(stack);
                    }
                }
            },
            infomation: {
                build(stack: WidgetStack, subject: Subject): void {
                    stack.addSpacer(8);
                    let stackBody = stack.addStack();
                    stack.addSpacer(8);

                    stackBody.layoutVertically();
                    stackBody.addSpacer(8);
                    let top = stackBody.addStack();
                    let body = stackBody.addStack();
                    let foot = stackBody.addStack();
                    stackBody.addSpacer(8);

                    widgetBuilder.setStackSize(stackBody, top, 100, 20);
                    widgetBuilder.setStackSize(stackBody, body, 100, 60);
                    widgetBuilder.setStackSize(stackBody, foot, 100, 20);

                    this.top.build(top, subject);
                    this.body.build(body, subject);
                    this.foot.build(foot, subject);
                },
                top: {
                    build(stack: WidgetStack, subject: Subject): void {
                        let top1 = stack.addStack();
                        let top2 = stack.addStack();

                        widgetBuilder.setStackSize(stack, top1, 50, 100);
                        widgetBuilder.setStackSize(stack, top2, 50, 100);

                        let text1 = top1.addText("กำลังเรียนวิชา📚");
                        top1.addSpacer();
                        top2.addSpacer();
                        let text2 = top2.addText("เวลา : " + subject.getLocaleTime());

                        [text1, text2].forEach(text => {
                            text.lineLimit = 1;
                            text.font = Font.systemFont(12);
                            text.textColor = Color.white();
                        });
                    }
                },
                body: {
                    build(stack: WidgetStack, subject: Subject): void {
                        stack.layoutVertically();
                        let text = stack.addText(subject.getNameTH());
                        text.textColor = Color.yellow();
                    }
                },
                foot: {
                    build(stack: WidgetStack, subject: Subject): void {
                        stack.layoutVertically();
                        stack.addSpacer();
                        let stack2 = stack.addStack();
                        widgetBuilder.setStackSize(stack, stack2, 100, 100);
                        let foot1 = stack2.addStack();
                        stack2.addSpacer();
                        let foot2 = stack2.addStack();
                        stack2.addSpacer();
                        let foot3 = stack2.addStack();

                        widgetBuilder.setStackSize(stack2, foot1, 25, 100);
                        widgetBuilder.setStackSize(stack2, foot2, 50, 100);
                        widgetBuilder.setStackSize(stack2, foot3, 25, 100);
                        foot3.addSpacer();
                        let text1 = foot1.addText("คาบที่ : " + subject.getPeriod());
                        let text2 = foot2.addText("ผู้สอน : " + subject.getTeacherName());
                        let text3 = foot3.addText("ห้อง : " + subject.getRoom());
                        [text1, text2, text3].forEach((t) => {
                            t.lineLimit = 1;
                            t.textColor = Color.white();
                            t.font = Font.systemFont(12);
                        });
                    }
                }
            }
        },
        body: {
            build(stack: WidgetStack): void {
                stack.layoutHorizontally();
                stack.addText("Under development...");
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
temp.setting = fileManager.getSaveSetting();

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
            switch (await menus.settingMenus()) {
                case 0:
                    // toggle profile picture
                    temp.setting.showStdImage = !temp.setting.showStdImage;
                    fileManager.saveSetting(temp.setting);
                    break;
                case 1:
                    // toggle profile infomation
                    temp.setting.showStdInfo = !temp.setting.showStdInfo;
                    fileManager.saveSetting(temp.setting);
                    break;
                default:
                    break;
            }
            break;
        default:
    }
} else if (config.runsInWidget) {
    if (fileManager.isSaveFileExist()) {
        try {
            if (config.widgetFamily == "extraLarge") {
                let saveData = fileManager.getSaveData();
                temp.stdImage = fileManager.getSaveStdImage();
                temp.table = Table.parse(saveData.groupCourse);
                temp.user_root = saveData.user?.root;
                temp.setting = fileManager.getSaveSetting();
                Script.setWidget(widgetBuilder.extraLarge.build());
            } else Script.setWidget(widgetBuilder.notSupported());
        } catch (error) {
            throw "Save files are corrupted. Please download data again. " + error;
        }
    } else Script.setWidget(widgetBuilder.noData());
}
alertMessage("Done", "Progress completed without errors.");
Script.complete();