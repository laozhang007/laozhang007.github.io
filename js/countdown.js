var now = new Date().getTime() + 9000;//当前时间加上9秒，用这种形式方便以后更改成倒计时到指定日期
var endTime = new Date(now);

var curShowTimeSeconds = 0;

var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function(){

    WINDOW_WIDTH = document.documentElement.clientWidth - 20;
    WINDOW_HEIGHT = document.documentElement.clientHeight - 20;
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 100)-1;//小球半径为屏幕宽度五分之四再除以一百
    MARGIN_LEFT = Math.round(WINDOW_WIDTH /2 - 5*RADIUS);//左边距为屏幕宽度减去五个小球半径
    MARGIN_TOP = Math.round(WINDOW_HEIGHT /5);

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext("2d");

    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;

    curShowTimeSeconds = getCurrentShowTimeSeconds();
    setInterval(
        function(){
            render( context );
            update();
        }
        ,
        50
    );
}

function getCurrentShowTimeSeconds() {//获得当前时间和目标时间的时间差
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round( ret/1000 )

    return ret >= 0 ? ret : 0;
}

function update(){//更新每次要显示的数字

    var nextShowTimeSeconds = getCurrentShowTimeSeconds();

    var nextSeconds = nextShowTimeSeconds % 60
    
    var curSeconds = curShowTimeSeconds % 60

    if( nextSeconds != curSeconds ){
        
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT, MARGIN_TOP , parseInt(nextSeconds%10) );
        }

        curShowTimeSeconds = nextShowTimeSeconds;
    }
    updateBalls();
}

function updateBalls(){//按照物理运动规律更新小球的位置

    for( var i = 0 ; i < balls.length ; i ++ ){

        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;

        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = - balls[i].vy*0.75;
        }
    }

    var cnt = 0;//统计小球个数，并把超出屏幕范围的小球从数组中删除
    for( var i = 0 ; i < balls.length ; i ++ )
        if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH )
            balls[cnt++] = balls[i]
    while( balls.length > cnt ){
        balls.pop();
    }
}

function addBalls( x , y , num ){//根据数字生成对应的小球，并给它们赋上随机的速度和加速度

    for( var i = 0  ; i < digit[num].length ; i ++ )
        for( var j = 0  ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                var aBall = {
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
                    vy:-5,
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                }
                balls.push( aBall )
            }
}

function render( cxt ){//渲染函数负责清空画布并画数字和小球

    cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);
    var seconds = curShowTimeSeconds % 60
    renderDigit( MARGIN_LEFT, MARGIN_TOP , parseInt(seconds%10) , cxt);

    for( var i = 0 ; i < balls.length ; i ++ ){
        cxt.fillStyle=balls[i].color;
        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
        cxt.closePath();
        cxt.fill();
    }
}

function renderDigit( x , y , num , cxt ){//渲染数字的函数，通过读取digit数组来确定哪个位置需要画小球，并调用arc方法来画小球

    cxt.fillStyle = "rgb(0,102,153)";

    for( var i = 0 ; i < digit[num].length ; i ++ )
        for(var j = 0 ; j < digit[num][i].length ; j ++ )
            if( digit[num][i][j] == 1 ){
                cxt.beginPath();
                cxt.arc( x+j*2*(RADIUS+1)+(RADIUS+1) , y+i*2*(RADIUS+1)+(RADIUS+1) , RADIUS , 0 , 2*Math.PI )
                cxt.closePath()
                cxt.fill()
            }
}

