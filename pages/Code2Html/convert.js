function convert(inputStr) {
    var lines = inputStr.split('\n');
    for (var i = 0, len = lines.length; i < len; i++) {
        lines[i] = convertLine(lines[i]);
    }
    return lines.join('\n<br>');
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
        for (var j = 0; j < matchStr.length; j++) {
            if (matchStr.charCodeAt(j) == 32)
                result += '&nbsp;';
            else
                result += matchStr.charAt(j)
        }
        return result;
    });
    return line;
}

var stringReg = /((?:\'[^\']*\')|(?:\"[^\"]*\"))/g;
var fnNameReg = /\b(\w+)\b([ ]*\()/g;
var keywordReg = /\b((?:new)|(?:for)|(?:while)|(?:do)|(?:if)|(?:else)|(?:return)|(?:break)|(?:try)|(?:catch)|(?:finally)|(?:var)|(?:function)|(?:switch)|(?:case)|(?:default)|(?:public)|(?:private)|(?:protected)|(?:void)|(?:static)|(?:final)|(?:const)|(?:interface)|(?:class)|(?:implements)|(?:extends))\b/g;
function highlight(line) {
    line = line.replace(stringReg, '<span class="code-string">$1</span>');
    line = line.replace(fnNameReg, '<span class="code-fn-name">$1</span>$2');
    line = line.replace(keywordReg, '<span class="code-keyword">$1</span>');
    return line;
}
