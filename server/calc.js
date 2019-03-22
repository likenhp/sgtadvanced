

function do_math(num1, num2, operator){
    var math = {
        "+": function(){
            return num1 + num2
        },
        "-": function(){
            return num1 - num2
        },
        "*": function(){
            return num1 * num2
        },
        "/": function(){
            return num1 / num2
        }
    }
    math["x"] = math["X"] = math["*"];
    var mathdone = math[operator](num1, num2);
    return mathdone;
}
var n1 = parseInt(process.argv[2]);
var op = process.argv[3];
var n2 = parseInt(process.argv[4]);

var answer = do_math(n1, n2, op);

console.log(answer);
