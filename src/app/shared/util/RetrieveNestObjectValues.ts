export function retrieveNestObjectValues(value: any, key: string): any {
    const result = key.split('.').reduce((acc: any, curr: any) => {
        if (Array.isArray(acc)) {
            return acc.map(item => {
                if (Array.isArray(item)) {
                    return item[0][curr]
                }
                else {
                    return item[curr];
                }
            });
        }
        return acc ? acc[curr] : null;
    }, value);
    return result;
}