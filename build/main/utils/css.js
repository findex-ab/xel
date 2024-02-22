"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cssPropsToString = void 0;
const camel_1 = require("../utils/camel");
const formatValue = (key, v) => {
    return key === 'content' ? `"${v}"` : `${v}`;
};
const cssPropsToString = (style) => {
    return Object.entries(style)
        .map(([k, v]) => `${(0, camel_1.camelToKebab)(k)}: ${formatValue(k, v)};`)
        .join('\n')
        .trimEnd();
};
exports.cssPropsToString = cssPropsToString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3NzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3hlbC91dGlscy9jc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMENBQThDO0FBSTlDLE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBVyxFQUFFLENBQXFDLEVBQVUsRUFBRTtJQUNqRixPQUFPLEdBQUcsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7QUFDL0MsQ0FBQyxDQUFBO0FBRU0sTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLEtBQW9CLEVBQVUsRUFBRTtJQUMvRCxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1NBQ3pCLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUEsb0JBQVksRUFBQyxDQUFDLENBQUMsS0FBSyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7U0FDNUQsSUFBSSxDQUFDLElBQUksQ0FBQztTQUNWLE9BQU8sRUFBRSxDQUFBO0FBQ2QsQ0FBQyxDQUFBO0FBTFksUUFBQSxnQkFBZ0Isb0JBSzVCIn0=