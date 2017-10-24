var byId = function (id) {
    return document.getElementById(id);
}

var boxWidth = 63; //grid width
var gameBox;
var mapid = 'game-box';//map element id
var arr = '1,2,3,4,5,6,7,8,9,10,11,12,13,14'.split(',');
var h = 10;  //height
var w = 14; //width
var boxsLength = h * w;
var boxArr = {};    //
var startBox = '';  //start grid
var endBox = '';    //end grid
window.onload = init;


function init() {
    byId("great-job").innerHTML = '<img src="img/great_job.jpg" alt="great job">';
    byId("start-pic").innerHTML = '<img src="img/start.jpg" alt="start pic">';
    byId('agin').style.display = 'none';
    byId('stop').style.display = 'initial';
    byId('restart').style.display = 'initial';
    byId('hint').style.display = 'initial';
    byId('shuffle').style.display = 'initial';
    byId('explain').style.display = 'initial';
    byId('great-job').style.display = 'none';
    byId('start-pic').style.display = 'none';
    boxsLength = h * w;
    boxArr = {};
    startBox = '';
    endBox = '';
    var str = '';
    gameBox = byId(mapid);
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            str += '<img class="" onclick="choose(this);" id="t' + i + '_l' + j + '" src="img/blank.gif">'
        }
    }
    gameBox.innerHTML = str;
    gameBox.style.width = w * boxWidth + 'px';
    pushBoxArr();
    toHTML();
}

function resume1() {
    byId('restart').style.display = 'initial';
    byId('hint').style.display = 'initial';
    byId('shuffle').style.display = 'initial';
    byId('explain').style.display = 'initial';

    var str = '';
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            str += '<img class="" onclick="choose(this);" id="t' + i + '_l' + j + '" src="img/blank.gif">'
        }
    }
    gameBox.innerHTML = str;
    toHTML();
}
function resume2() {
    byId('restart').style.display = 'initial';
    byId('hint').style.display = 'initial';
    byId('shuffle').style.display = 'initial';
    byId('stop').style.display = 'initial';

    var str = '';
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            str += '<img class="" onclick="choose(this);" id="t' + i + '_l' + j + '" src="img/blank.gif">'
        }
    }
    gameBox.innerHTML = str;
    toHTML();
}





function getRandomImage() {
    var t = 1111;
    var l = 1111;
    while(!boxArr['t' + t + '_l' + l]){
        t = Math.floor(Math.random() * h);
        l = Math.floor(Math.random() * w);
    }
    console.log('t' + t + '_l' + l);
    return 't' + t + '_l' + l;

}

function shuffle() {
    for(var i = 0; i < 30; i++){
        var e1 = getRandomImage();
        var e2 = getRandomImage();

        var tem = boxArr[e1].name;
        boxArr[e1].name = boxArr[e2].name;
        boxArr[e2].name = tem;
    }
    toHTML();
}

function restart() {
    init();
}

// randomly get the coordinates
function getPosition() {
    var t, l;
    (function () {
        t = parseInt(Math.random() * h);
        l = parseInt(Math.random() * w);
        if (('t' + t + '_l' + l) in boxArr) {
            arguments.callee();//调用正在执行的函数
        }
    })();
    return {t: t, l: l}
}

// create random coordinate grid
function CearteBox(name) {
    var p = getPosition();
    this.name = name;
    this.t = p.t;
    this.l = p.l;
    this.position = 't' + p.t + '_l' + p.l;
}



// push boxRrr
function pushBoxArr() {
    var index = 0;
    var last = arr.length - 1;
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            var a = new CearteBox(arr[index]);
            boxArr['t' + a.t + '_l' + a.l] = a;
            if (index === last) {
                index = 0;
            } else {
                index += 1;
            }
        }
    }
}

function toHTML() {
    for (var i in boxArr) {
        if(!boxArr[i]){
            continue;
        }
        byId(i).src = 'img/' + boxArr[i].name + '.jpg';
    }
}

// choose
function choose(el) {
    if (el.src.indexOf('blank') >= 0) {
        return false;
    } else {
        el.className = 'active';
        if (startBox == '' || startBox == el.id) {
            startBox = el.id;
        } else {
            endBox = el.id;
            test(boxArr[startBox], boxArr[endBox], implementKill);
        }
    }
}

function getHint() {
    for(var i in boxArr){
        if(!boxArr[i]){
            continue;
        }
        for(var j in boxArr){
            if(!boxArr[j]){
                continue;
            }
            if(boxArr[i].position === boxArr[j].position){
                continue;
            }
            if(boxArr[i].name === boxArr[j].name && canConnect(boxArr[i], boxArr[j])){
                console.log('sssssss', boxArr[i].position);
                console.log(boxArr[j].position);

                var image1 = document.getElementById(boxArr[i].position);
                var image2 = document.getElementById(boxArr[j].position);
                image1.className = 'ishint';
                image2.className = 'ishint';

                return {
                    first: boxArr[i],
                    second: boxArr[j]
                };
            }

        }
    }
    return null;
}

function canConnect(a, b) {
    return go(a, b, function (){});
}

// whether the two grids are available to connect
function test(a, b, implementKill) {
    var can = function (a, b) {
        if (a.name == b.name) {
            return true;
        } else {
            return false;

        }
    }(a, b);
    if (can) {
        go(a, b, implementKill);
    } else {
        byId(startBox).className = '';
        startBox = endBox;
        endBox = '';
    }
}

function implementKill(a, b, pt1, pt2, pt3, pt4) {
    kill(a, b);
    showLine(pt1, pt2, pt3, pt4);
}

function go(a, b, implementFunction) {
    var _ap = a.position, _bp = b.position;
    var a = a, b = b, temp, isKill = false;
    // create four points, to tell the connection between every two points
    var pt1, pt2, pt3, pt4;
    // from top to bottom
    if (isKill == false) {
        //change the positin
        if (a.t > b.t) {
            temp = a;
            a = b;
            b = temp;
        }
        for (var i = -1, len = h; i <= len; i++) {
            pt1 = a;
            pt2 = {t: i, l: a.l};
            pt3 = {t: i, l: b.l};
            pt4 = b;
            if ((!isNull(pt2) && (pt2.t != a.t) ) || ( !isNull(pt3) && (pt3.t != b.t) )) {
                continue;
            }
            else if (link4pt(pt1, pt2, pt3, pt4)) {
                isKill = true;
                // kill(a, b);
                // showLine(pt1, pt2, pt3, pt4);
                implementFunction(a, b, pt1, pt2, pt3, pt4);

                return true;

            }
        }
    }
    // from left to right
    if (isKill == false) {
        // change the position
        if (a.l > b.l) {
            temp = a;
            a = b;
            b = temp;
        }
        for (var i = -1, len = w; i <= len; i++) {
            pt1 = a;
            pt2 = {t: a.t, l: i};
            pt3 = {t: b.t, l: i};
            pt4 = b;
            if ((!isNull(pt2) && (pt2.l != a.l) ) || ( !isNull(pt3) && (pt3.l != b.l) )) {
                continue;
            }
            else if (link4pt(pt1, pt2, pt3, pt4)) {
                isKill = true;
                implementFunction(a, b, pt1, pt2, pt3, pt4);

                return true;
            }
        }
    }

    //finished scanning
    if (isKill == false) {
        endBox = '';
        byId(_ap).className = '';
        startBox = _bp;
        return false;
    }
    return false;
}

//kill the grid
function kill(a, b) {
    boxArr[a.position] = null;
    boxArr[b.position] = null;
    boxsLength -= 2;
    startBox = '';
    endBox = '';
}

// show the connection way
function showLine(a, b, c, d) {
    var line1 = show2pt(a, b);
    var line2 = show2pt(b, c);
    var line3 = show2pt(c, d);
    var hideLine = function () {
        gameBox.removeChild(line1);
        gameBox.removeChild(line2);
        gameBox.removeChild(line3);
        byId(a.position).src = byId(d.position).src = 'img/blank.gif';
        byId(a.position).className = byId(d.position).className = '';
        if (boxsLength <= 0) {

            // alert('Congratulations! You win the game!');
            byId("great-job").style.display = 'inherit'
            byId("game-box").innerHTML = '';
            byId("stop").style.display = 'none';
            byId("hint").style.display = 'none';
            byId("shuffle").style.display = 'none';
            byId("restart").style.display = 'none';
            byId("explain").style.display = 'none';
            byId('agin').style.display = 'block';

        }
    }
    setTimeout(hideLine, 300);

    function show2pt(a, b) {
        var top, left, width, height, line = document.createElement('div');
        var a = a, b = b, temp;
        // change position
        if (a.t > b.t || a.l > b.l) {
            temp = a;
            a = b;
            b = temp;
        }
        top = boxWidth * a.t + 30 + 'px';
        left = boxWidth * a.l + 30 + 'px';
        // 同行(t相等)
        if (a.t == b.t) {
            width = boxWidth * (b.l - a.l) + 1 + 'px';
            height = '1px';
        }
        // 同列(l相等)
        if (a.l == b.l) {
            width = '1px';
            height = boxWidth * (b.t - a.t) + 1 + 'px';
        }
        line.style.top = top;
        line.style.left = left;
        line.style.width = width;
        line.style.height = height;
        return gameBox.appendChild(line);
    }
}

// 单个格子是否空值
function isNull(a) {
    return boxArr['t' + a.t + '_l' + a.l] ? false : true;
}

// 2点是否连通
function link2pt(a, b) {
    var a = a, b = b, temp, canLink = true;
    // change position
    if (a.t > b.t || a.l > b.l) {
        temp = a;
        a = b;
        b = temp;
    }
    if (a.t == b.t) {   //同行（t相等），a在b的左边
        for (var i = a.l + 1, len = b.l - 1; i <= len; i++) {
            if (boxArr['t' + a.t + '_l' + i]) {
                canLink = false;
                break;
            }
        }
    } else if (a.l == b.l) {   //同列（l相等），a在b的上边
        for (var i = a.t + 1, len = b.t - 1; i <= len; i++) {
            if (boxArr['t' + i + '_l' + a.l]) {
                canLink = false;
                break;
            }
        }
    } else {
        throw ('位置错误：a.t=' + a.t + ' b.t=' + b.t + ' a.l=' + a.l + ' b.l=' + b.l);
    }
    return canLink;
}

// 4个点是否两两连通
function link4pt(pt1, pt2, pt3, pt4) {
    return link2pt(pt1, pt2) && link2pt(pt2, pt3) && link2pt(pt3, pt4);
}



function pauseFunction() {
    // console.log("ssssssssssssssss");
    if (byId("game-box").innerHTML == 'Pause') {
        byId("stop").innerHTML = 'Pause';
        byId("hint").style.display = "inherit";
        byId("restart").style.display = "inherit";
        byId("shuffle").style.display = "inherit";
        byId("explain").style.display = "inherit";
        resume1();
    } else {
        byId("game-box").innerHTML = 'Pause';
        byId("hint").style.display = "none";
        byId("stop").innerHTML = 'Continue';
        byId("restart").style.display = "none";
        byId("shuffle").style.display = "none";
        byId("explain").style.display = "none";
    }
}

function explainFunction() {
    if (byId("game-box").innerHTML == 'How to play') {
        byId("stop").style.display = 'inherit';
        byId("hint").style.display = "inherit";
        byId("restart").style.display = "inherit";
        byId("shuffle").style.display = "inherit";
        byId("start-pic").style.display = 'none'
        byId("explain").innerHTML = "How to play";
        resume2();
    } else {
        byId("start-pic").style.display = 'inherit'
        byId("game-box").innerHTML = 'How to play';
        byId("hint").style.display = "none";
        byId("stop").style.display = 'none';
        byId("restart").style.display = "none";
        byId("shuffle").style.display = "none";
        byId("explain").innerHTML = "go to play";
    }
}
