/* global requestAnimationFrame */

var eases = require("eases");

if (typeof requestAnimationFrame === "undefined") {
    var requestAnimationFrame = function (fn) {
        setTimeout(fn, 1000 / 60);
    }
}

function transformation (from, to, callback, args, after) {
    
    var dur, easing, cv, diff, c, lastExecution, fps;
    var canceled, paused, running, stopped;
    var timeElapsed, startTime, pauseTimeElapsed, pauseStartTime;
    
    args = args || {};
    
    if (typeof args === "function" && !after) {
        after = args;
        args = {};
    }
    
    after = typeof after === "function" ? after : function () {};
    
    if (typeof callback === "undefined" || !callback) {
        throw new Error("Argument callback must be a function.");
    }
    
    init();
    
    function init () {
        
        dur = typeof args.duration !== "undefined" && args.duration >= 0 ? args.duration : 500;
        cv = from;
        diff = to - from;
        c = 0, // number of times loop get's executed
        lastExecution = 0;
        fps = args.fps || 60;
        canceled = false;
        paused = false;
        running = false;
        stopped = false;
        timeElapsed = 0;
        startTime = 0;
        pauseTimeElapsed = 0;
        pauseStartTime = 0;
        easing = eases.linear;
        
        if (args.easing) {
            if (typeof args.easing === "function") {
                easing = args.easing;
            }
            else {
                easing = eases[args.easing];
            }
        }
    }
    
    function loop () {
        
        var dt, tElapsed;
        
        if (!running) {
            return;
        }
        
        if ((Date.now() - lastExecution) > (1000 / fps)) {
            
            if (canceled || paused) {
                return;
            }
            
            c += 1;
            tElapsed = elapsed();
            
            if (tElapsed > dur || stopped) {
                
                cv = from + diff;
                
                if (!stopped) {
                    stop();
                }
                
                return;
            }
            
            cv = easing(tElapsed / dur) * diff + from;
            
            callback(cv);
            
            dt = elapsed() - tElapsed;
            
            lastExecution = Date.now();
        }
        
        requestAnimationFrame(loop);
    };
    
    function elapsed () {
        
        if (running && !paused) {
            timeElapsed = ((+(new Date()) - startTime) - pauseTimeElapsed);
        }
        
        return timeElapsed;
    }
    
    function start () {
        
        reset();
        
        startTime = +(new Date());
        pauseStartTime = startTime;
        running = true;
        
        requestAnimationFrame(loop);
    }
    
    function stop () {
        
        running = false;
        paused = false;
        
        callback(to);
        after();
    }
    
    function resume () {
        
        if (!paused) {
            return;
        }
        
        paused = false;
        pauseTimeElapsed += +(new Date()) - pauseStartTime;
        
        requestAnimationFrame(loop);
    }
    
    function pause () {
        paused = true;
        pauseStartTime = +(new Date());
    }
    
    function cancel () {
        
        if (!running) {
            return;
        }
        
        elapsed();
        
        canceled = true;
        running = false;
        paused = false;
        
        after();
    }
    
    function reset () {
        
        if (running) {
            cancel();
        }
        
        init();
    }
    
    return {
        start: start,
        stop: stop,
        pause: pause,
        resume: resume,
        cancel: cancel,
        elapsed: elapsed,
        reset: reset
    };
}

function transform () {
    
    var t = transformation.apply(undefined, arguments);
    
    t.start();
    
    return t;
}

module.exports = {
    transformation: transformation,
    transform: transform
};
