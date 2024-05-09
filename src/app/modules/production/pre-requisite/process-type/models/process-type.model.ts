export class ProcessTypeRequest {
    ProcessTypeId: number;
    SortOrder: number = 0;
    MainProcessTypeId: number;
    ProcessTypeName: string;
    MainProcessTypeName: string;
    constructor() {
        this.ProcessTypeId = 0;
        this.MainProcessTypeId = 0;
        this.ProcessTypeName = "";
        this.MainProcessTypeName = "";
    }
}