export const xReactive = (obj, onChange, rest) => {
    return new Proxy(obj, {
        get(target, p, receiver) {
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
        },
        ...(rest || {})
    });
};
export const xRef = (initial, fun) => xReactive({ value: initial }, (target) => {
    if (fun) {
        fun(target.value);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMveGVsL3V0aWxzL3JlYWN0aXZpdHkvcmVhY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsTUFBTSxDQUFDLE1BQU0sU0FBUyxHQUFHLENBQ3ZCLEdBQU0sRUFDTixRQUFnQyxFQUNoQyxJQUErQixFQUNyQixFQUFFO0lBSVosT0FBTyxJQUFJLEtBQUssQ0FBSyxHQUFTLEVBQUU7UUFDOUIsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsUUFBUTtZQUNyQixPQUFPLE1BQU0sQ0FBQyxDQUFhLENBQWUsQ0FBQztRQUM3QyxDQUFDO1FBQ0QsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVE7WUFDL0IsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLENBQVksQ0FBZSxDQUFDO1lBQy9DLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNqRSxNQUFNLENBQUMsQ0FBYSxDQUFDLEdBQUksUUFBdUIsQ0FBQztZQUVqRCxJQUFJLE9BQU8sSUFBSSxRQUFRLEVBQUUsQ0FBQztnQkFDeEIsTUFBTSxDQUFDLEdBQUcsS0FBSyxJQUFJLEVBQUU7b0JBQ25CLE1BQU0sUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ3hDLENBQUMsQ0FBQTtnQkFDRCxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkMsQ0FBQztZQUNELE9BQU8sSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUNELEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDO0tBQ2hCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQTtBQUdELE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFVLE9BQVUsRUFBRSxHQUEwQixFQUFXLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtJQUN6SCxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUMifQ==