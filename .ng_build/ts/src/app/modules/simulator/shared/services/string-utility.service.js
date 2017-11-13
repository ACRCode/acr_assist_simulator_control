import { Injectable } from '@angular/core';
export class StringUtilityService {
    /**
     * @param {?} str
     * @return {?}
     */
    isEmpty(str) {
        return str === '';
    }
    /**
     * @param {?} text
     * @return {?}
     */
    cleanText(text) {
        return text.replace(/ /g, '');
    }
}
StringUtilityService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
StringUtilityService.ctorParameters = () => [];
function StringUtilityService_tsickle_Closure_declarations() {
    /** @type {?} */
    StringUtilityService.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    StringUtilityService.ctorParameters;
}
//# sourceMappingURL=string-utility.service.js.map