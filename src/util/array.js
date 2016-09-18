
export function sorter(...fns) {
    let fnsLen = fns.length;

    // Provide default idiot sort
    if(fnsLen == 0){
        fns = [x => x];
        fnsLen = 1;
    }

    return (a, b) => {
        let index = 0;
        let result = 0;
        while (result == 0 && index < fnsLen){
            const fn = fns[index++];
            const _a = fn(a);
            const _b = fn(b);
            result = _a < _b ? -1 : (_a > _b ? 1 : 0);
        }
        return result;
    }
}