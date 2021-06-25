export class AllTextReport {
    isDSIModule: boolean;
    repeatedSectionName: string;
    allTextResultReport: AllTextResultReport;
    constructor() {
        this.allTextResultReport = new AllTextResultReport();
    }
}

export class AllReportTextGroup {
    repeatedSectionName: string;
    allTextResultReport: Array<AllTextResultReport>;
}

export class AllTextResultReport {
    heading: string;
    content: string;
    sectionOrder: number;
    sectionId: string;
}

export enum ReportTextPosition {
    Top,
    Right
}


