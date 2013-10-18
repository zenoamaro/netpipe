'use strict'

var optimist = require('optimist'),
	NetPipe = require('./netpipe')


var usage = 'Pipes STDIN/STDOUT to a remote plug.\n' +
            'Usage: netpipe [options] plug_url [arguments...]'

var options = {
	'verbose': { alias:'v', boolean:true,
	             describe:'Show verbose and debugging output' },
	'help':    { alias:'h', boolean:true,
	             describe:'Show this help screen' },
}

function checkArguments(argv) {
	if (argv.help)
		throw null
	if (argv._.length < 1)
		throw 'ERROR: Please provide the URL for the pipe.'
}


var argv = optimist
	.usage(usage)
	.options(options)
	.check(checkArguments)
	.argv


var pipe = argv._[0], // First
	args = argv._.slice(1) // Rest

var netpipe = new NetPipe(pipe, args, {
	verbose: argv.verbose,
})
