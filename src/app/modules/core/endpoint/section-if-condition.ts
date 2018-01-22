export class SectionIfCondition {
    evaluate(value: any ): boolean  {
        let returnValue = false;
        if (value !== undefined || value != null) {
          returnValue = true;
        }
        return returnValue;
    }
}

