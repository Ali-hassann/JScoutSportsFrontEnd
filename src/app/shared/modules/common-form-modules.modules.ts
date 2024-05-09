import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DropdownModule } from "primeng/dropdown";
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { TooltipModule } from "primeng/tooltip";
@NgModule({
    declarations: [
        
    ],
    imports: [
        ReactiveFormsModule
        , FormsModule
        , ButtonModule
        , InputTextModule
        , ConfirmDialogModule
        , ToastModule
        , TooltipModule
        , DynamicDialogModule
        , DropdownModule
    ],
    exports: [
        ReactiveFormsModule
        , FormsModule
        , ButtonModule
        , InputTextModule
        , ConfirmDialogModule
        , ToastModule
        , TooltipModule
        , DynamicDialogModule
        , DropdownModule
    ],
    providers: [
        ConfirmationService,
        MessageService
    ]
})
export class CommonFormModules { }
