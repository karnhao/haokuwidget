class Subject {
    private startTime: number = 0;
    private width: number = 0;
    private name_th: string = "";
    private name_en: string = "";
    private id: string = "";
    private day: number | null = null;
}

class SubjectDay {
    private subjectList: Subject[] = [];

    public putSubject(subject: Subject): void {
        this.subjectList.push(subject);
    }
}

class Table {
    private days = {
        _0: new SubjectDay(),
        _1: new SubjectDay(),
        _2: new SubjectDay(),
        _3: new SubjectDay(),
        _4: new SubjectDay(),
        _5: new SubjectDay(),
        _6: new SubjectDay(),
    }
}