function round(number, decimals) {
    return +(Math.round(number + "e+" + decimals) + "e-" + decimals);
}


// http://stackoverflow.com/questions/1295584/most-efficient-way-to-create-a-zero-filled-javascript-array
// (arr = []).length = x
// arr.fill(0);
// (arr = []).length = len; arr.fill(0);