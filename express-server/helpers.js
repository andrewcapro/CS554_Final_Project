//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
function containsSpec(str) { //Helper function to check if a given str contains any special characters; Source - https://bobbyhadz.com/blog/javascript-check-if-string-contains-special-characters#:~:text=To%20check%20if%20a%20string,special%20character%20and%20false%20otherwise.&text=Copied!
    const specialChars =  /[@#$%^&*()_+=\[\]{}\\|<>\/~]/ //Regular expressions allow storing of patterns of characters for string comparison; The [] allow for the literal to be considered as a range, and appropiate escape characters used for various symbols
    return specialChars.test(str); //Test function checks if a regular expression is contained within a given string, returning the respective boolean
}

function containsNum(str){
    const nums = /[0123456789]/ //Created using learning from containsSpec
    return nums.test(str);

}

function containsSpace(str){
    const space = /[\s]/
    return space.test(str);
}

function containsPunct(str){ 
    const punct = /[.,!?;:"\-']/
    return punct.test(str);
}

function containsAlpha(str){
    const alpha1 = /[a-z]/;
    const alpha2 = /[A-Z]/;
    return alpha1.test(str) || alpha2.test(str);
}

function containsUpper(str){
    const alpha = /[A-Z]/;
    return alpha.test(str);
}

function containsLower(str){
    const alpha = /[a-z]/;
    return alpha.test(str);
}

function ArrayEquals(a, b){ //Sourced from https://masteringjs.io/tutorials/fundamentals/compare-arrays 
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

module.exports = {
    containsSpec,
    containsNum,
    containsPunct,
    containsAlpha,
    containsSpace,
    containsUpper,
    containsLower,
    ArrayEquals
};