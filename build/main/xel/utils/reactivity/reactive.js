"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xRef = exports.xReactive = void 0;
const xReactive = (obj, onChange, rest) => {
    return new Proxy(obj, Object.assign({ get(target, p, receiver) {
            return target[p];
        },
        set(target, p, newValue, receiver) {
            const old = target[p];
            const changed = JSON.stringify(old) !== JSON.stringify(newValue);
            target[p] = newValue;
            if (changed && onChange) {
                const f = async () => {
                    await onChange(target, old, newValue);
                };
                f().catch(e => console.error(e));
            }
            return true;
        } }, (rest || {})));
};
exports.xReactive = xReactive;
const xRef = (initial, fun) => (0, exports.xReactive)({ value: initial }, (target) => {
    if (fun) {
        fun(target.value);
    }
});
exports.xRef = xRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMveGVsL3V0aWxzL3JlYWN0aXZpdHkvcmVhY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT08sTUFBTSxTQUFTLEdBQUcsQ0FDdkIsR0FBTSxFQUNOLFFBQWdDLEVBQ2hDLElBQStCLEVBQ3JCLEVBQUU7SUFJWixPQUFPLElBQUksS0FBSyxDQUFLLEdBQVMsa0JBQzVCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLFFBQVE7WUFDckIsT0FBTyxNQUFNLENBQUMsQ0FBYSxDQUFlLENBQUM7UUFDN0MsQ0FBQztRQUNELEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxRQUFRO1lBQy9CLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFZLENBQWUsQ0FBQztZQUMvQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLENBQWEsQ0FBQyxHQUFJLFFBQXVCLENBQUM7WUFFakQsSUFBSSxPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxHQUFHLEtBQUssSUFBSSxFQUFFO29CQUNuQixNQUFNLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUN4QyxDQUFDLENBQUE7Z0JBQ0QsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLENBQUM7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsSUFDRSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsRUFDZixDQUFDO0FBQ0wsQ0FBQyxDQUFBO0FBM0JZLFFBQUEsU0FBUyxhQTJCckI7QUFHTSxNQUFNLElBQUksR0FBRyxDQUFVLE9BQVUsRUFBRSxHQUEwQixFQUFXLEVBQUUsQ0FBQyxJQUFBLGlCQUFTLEVBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtJQUN6SCxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFKVSxRQUFBLElBQUksUUFJZCJ9