
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
            // Nulls move to the end
            if (_a == null && _b == null)   result = 0;
            else if (_a == null)            result = 1;
            else if (_b == null)            result = -1;
            else
                // Now just compare values
                result = _a < _b ? -1 : (_a > _b ? 1 : 0);
        }
        return result;
    }
}

export function sum (a, b) {
    return a + b;
}
