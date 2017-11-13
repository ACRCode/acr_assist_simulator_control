import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssistSimulatorComponent } from './assist-simulator/assist-simulator.component';
import { ComputedElementComponent } from './computed-element/computed-element.component';
import { HintDiagramComponent } from './hint-diagram/hint-diagram.component';
import { ImageMapComponent } from './image-map/image-map.component';
import { DataElementComponent } from './data-element/data-element.component';
import { ExpresssionBlockComponent } from './expresssion-block/expresssion-block.component';
import { FormsModule } from '@angular/forms';
import { ValueBlockComponent } from './value-block/value-block.component';
import { ExpressionResultComponent } from './expression-result/expression-result.component';
import { ReportTextComponent } from './report-text/report-text.component';
import { GlobalsService } from './shared/services/globals.service';
import { StringUtilityService } from './shared/services/string-utility.service';
import { SettingsService } from './shared/services/settings.service';
const /** @type {?} */ components = [AssistSimulatorComponent, ComputedElementComponent, HintDiagramComponent,
    ImageMapComponent, DataElementComponent, ExpresssionBlockComponent,
    ValueBlockComponent, ExpressionResultComponent, ReportTextComponent];
export class SimulatorModule {
}
SimulatorModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    FormsModule
                ],
                declarations: components,
                exports: components,
                providers: [StringUtilityService, GlobalsService, SettingsService]
            },] },
];
/**
 * @nocollapse
 */
SimulatorModule.ctorParameters = () => [];
function SimulatorModule_tsickle_Closure_declarations() {
    /** @type {?} */
    SimulatorModule.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    SimulatorModule.ctorParameters;
}
//# sourceMappingURL=simulator.module.js.map