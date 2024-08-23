
// I created this mini-application to strengthen my understanding of the Hypertext Transfer Protocol.
// Frameworks like express does this parsing behind the scenes.
// Note that requests and responses in HTTP are just plain strings.

// When we observe the bits inside a request and a response, we can see a pattern, a rule that will follow everytime, hence the name Protocol.

// In this mini-application I will check every bit of an HTTP request and parse it in a nice object.

// I did this by myself so it may not be the most optimized solution.

const net=require('net')
const parser=require('./Parser')

const port=3000;


const server=net.createServer()
//...creating a server


server.on('connection',(socket)=>{

	// when my server gets a connection it will execute this callback function, which will have a socket
	//this socket is a Duplex Stream which means I can read and write to it in a smart and fast way
	//(not filling the RAM memory , letting the buffer drain ...)

	const HttpParser=new parser()

	socket.on('data', (buffer)=>{

		// when data is received, this callback function will fire
		
	

		// the buffer received will be passed to the Parser Object I created
		var pr= HttpParser.Check(buffer)


		console.log(pr.Method);
		console.log(pr.Path);	
		console.log(pr.headers);
		
		
		

	})


})


server.listen(port,'127.0.0.1',()=>{

	console.log(`Server now listening on ${port}`);
})










