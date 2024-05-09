export class ParticularRequest {
    ParticularId: number;
    ParticularType: number;
    OutletId: number;
    ParticularName: string;
    RepresentativeName: string = "";
    MainProductName: string = "";
    ContactNo: string;
    Address: string;
    Email: string;
    ParticularTypeName: string;
    OpeningAmount: number;
    DebitAmount: number;
    CreditAmount: number;
    constructor() {
        this.ParticularId = 0;
        this.ParticularType = 0;
        this.OutletId = 0;
        this.OpeningAmount = 0;
        this.ParticularName = "";
        this.ContactNo = "";
        this.Address = "";
        this.Email = "";
        this.ParticularTypeName = "";
        this.CreditAmount = 0;
        this.DebitAmount = 0;
    }
}