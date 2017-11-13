export declare class Parser {
    private stringParser;
    parseToJson(xmlData: string): JSON;
    IsJsonString(str: string): boolean;
    CleanUp(xmlstr: string): string;
    CleanUpTextTemplate(source: string): string;
    CleanUpReportText(source: string, match1: string, match2?: string): string;
    CleanUpTemplatePartials(source: string): any;
    MorphReportText(str2: string): string;
    GetSubstring(xmlstr: string, startString: string, endString: string): string;
    occurrences(string: any, subString: any, allowOverlapping: any): any;
}
