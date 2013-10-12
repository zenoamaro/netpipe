var http = require('http')

var options = {
	method: 'POST',
	path: '/test',
	host: 'localhost',
	port: 3000,
}

var req = http.request(options, function(res){
	res.on('data', function(chunk){
		console.log('> %s', chunk)
	})
})

req.write('HELO')