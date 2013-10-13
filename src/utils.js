var utils = {}

utils.log = function log(symbol, text, args) {
	var args = Array.prototype.slice.call(arguments, 2)
	text.toString().split('\n').map(function(line){
		console.log.apply(console, [symbol+' '+line].concat(args))
	})
}

module.exports = utils