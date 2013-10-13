'use strict'

var http = require('http'),
	url = require('url'),
	utils = require('./utils')

var DEFAULT_PORT = 2048


function NetPipe(pipe, args, options) {
	this.pipe = pipe
	this.args = args
	this.verbose = options.verbose
	this.handshake = false
	this._pipe = this._makePipe(this.pipe, this.args)
	this._helo(this._pipe)
}

NetPipe.prototype._log = function() {
	if (this.verbose)
		utils.log.apply(null, arguments)
}

NetPipe.prototype._params = function(args) {
	if (!args.length)
		return ''
	var params = args.map(function(arg){
		return encodeURI(arg)
	})
	return '?' + params.join('&')
}

NetPipe.prototype._makePipe = function(pipe, args) {
	var self = this,
		target = url.parse(pipe),
		pipe = {}
	var options = {
		method: 'POST',
		protocol: target.protocol,
		hostname: target.hostname,
		port: target.port || DEFAULT_PORT,
		path: target.pathname + this._params(args)
	}
	self._log('*', 'Requesting `%s` on `%s`', target.pathname, target.host)
	self._log('*', 'Arguments: %s', args)
	pipe.req = http.request(options, function(res){
		pipe.res = res
		self._log('*', 'Opened the response pipe')
		self._pipeToStdout(pipe)
	})
	return pipe
}

NetPipe.prototype._helo = function(pipe) {
	this._log('*', 'Shaking hands')
	this._log('>', 'HI PLUG')
	pipe.req.write('HI PLUG')
}

NetPipe.prototype._pipeFromStdin = function(pipe) {
	var self = this
	process.stdin.on('data', function(chunk){
		self._log('>', chunk)
		pipe.req.write(chunk)
	})
	process.stdin.on('end', function(){
		self._log('>', 'EOF')
		pipe.req.end()
	})
}

NetPipe.prototype._pipeToStdout = function(pipe) {
	var self = this
	pipe.res.on('data', function(chunk){
		if (self.ended || self.failed)
			return
		self._log('<', chunk)
		if (!self.handshake) {
			if (chunk == 'HI PIPE') {
				self._log('*', 'Got the handshake')
				self.handshake = true
				self._pipeFromStdin(pipe)
			}
			else {
				self._log('>', '401 BAD REQUEST')
				pipe.req.status = 401
				pipe.req.end("How's that for manners?")
				self.failed = true
			}
		}
		else
			process.stdout.write(chunk)
	})
	pipe.res.on('end', function(){
		self._log('<', 'EOF')
		process.stdin.end()
		self.ended = true
	})
}

module.exports = NetPipe
