export function filterParser(queryFilter: string){
    const parts = queryFilter.split("+").map(part => part.trim());
    return parts;
}