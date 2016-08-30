function convert(inputStr) {
    var lines = inputStr.split('\n');
    for (var i = 0, len = lines.length; i < len; i++) {
        lines[i] = convertLine(lines[i]);
    }
    return '<code>\n' + lines.join('\n<br>') + '\n</code>';
}

function convertLine(line) {
    line = converSpecial(line);
    line = convertIndent(line);
    line = highlight(line);

    return line;
}

var ampReg = /\&/g;
var ltReg = /</g;
var gtReg = />/g;

function converSpecial(line) {
    line = line.replace(ampReg, '&amp;');
    line = line.replace(ltReg, '&lt;');
    line = line.replace(gtReg, '&gt;');
    return line;
}

var whiteSpaceReg = /^\s+\S/;
function convertIndent(line) {
    line = line.replace(whiteSpaceReg, function(matchStr, index, wholeStr) {
        var result = '';
        var charCode;
        for (var j = 0; j < matchStr.length; j++) {
            charCode = matchStr.charCodeAt(j);
            if (charCode == 32)
                result += '&nbsp;';
            else if (charCode == 9)
                result += '&nbsp;&nbsp;&nbsp;&nbsp;';
            else
                result += matchStr.charAt(j)
        }
        return result;
    });
    return line;
}

var stringReg = /((?:\'[^\']*\')|(?:\"[^\"]*\"))/g;
var fnNameReg = /\b(\w+)\b([ ]*\()/g;
var keywordControlReg = /\b((?:for)|(?:while)|(?:do)|(?:if)|(?:else)|(?:return)|(?:break)|(?:try)|(?:catch)|(?:finally)|(?:switch)|(?:case)|(?:default))\b/g;
var keywordOopReg = /\b((?:public)|(?:private)|(?:protected)|(?:package)|(?:interface)|(?:protocol)|(?:class)|(?:implements)|(?:extends)|(?:override)|(?:this))\b/g;
var keywordOtherReg = /\b((?:new)|(?:var)|(?:let)|(?:function)|(?:func)|(?:enum)|(?:struct)|(?:void)|(?:static)|(?:final)|(?:const))\b/g;
var annotationReg = /(\/\/(?:.+)*)/;

function highlight(line) {
    line = line.replace(stringReg, '<codestring>$1</codestring>');
    line = line.replace(fnNameReg, '<codefnname>$1</codefnname>$2');

    line = line.replace(keywordControlReg, '<codekeyword>$1</codekeyword>');
    line = line.replace(keywordOopReg, '<codekeyword>$1</codekeyword>');
    line = line.replace(keywordOtherReg, '<codekeyword>$1</codekeyword>');

    line = line.replace(annotationReg, '<codeannotation>$1</codeannotation>');

    return line;
}
