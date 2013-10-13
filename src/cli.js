'use strict'

var NetPipe = require('./netpipe')

var USAGE =
	'Usage: netpipe [-h] pipe [arguments...]\n\n'+
	'Options:\n'+
	'  pipe           The pipe to read from or write to\n'+
	'  arguments...   A list of arguments to pass to the pipe in the form\n'+
	'                 arg=value another-arg=another-value\n'+
	'  -h, --help     Shows this help screen'
	'  -v, --verbose  Enable verbose debugging output'

function usage() {
	console.error(USAGE)
	process.exit(1)
}

// Ignore Node and script name
var args = process.argv.slice(2),
	options = {},
	remaining = []

// Not using a forEach as we're going to
// alter the counter during looping
for (var i=0, l=args.length; i<l; i++) {
	var arg = args[i]
	// Not an option, we'll store and parse this later
	if (arg[0] != '-')
		remaining.push(arg)
	// Starts with `-` so treat it as an option
	else switch (arg) {
		// These are bools and we can just switch them
		case '-v':
		case '--verbose':
			options['verbose'] = true
			break
		// Display usage when requested or specifying an invalid option
		case '-h':
		case '--help':
		default:
			usage()
	}
}

// The pipe resource is required
if (!remaining.length)
	usage()

var pipe = remaining[0],
	args = remaining.slice(1)

var netpipe = new NetPipe(pipe, args, options)
