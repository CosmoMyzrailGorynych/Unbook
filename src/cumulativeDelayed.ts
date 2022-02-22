const cumulativeDelayed = function (fn: Function, ms, ctx?: unknown) {
    var args = Array.prototype.slice.call(arguments, 3)
    var timeout = null;
    return function cumulativeDelayeder () {
        var _args = Array.prototype.slice.call(arguments)
        var f = function cumulativeDelayedCaller () {
            return fn.apply(ctx || null, args.concat(_args));
        }
        if (timeout != null) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(f, ms);
        return timeout
    }
}
export default cumulativeDelayed;