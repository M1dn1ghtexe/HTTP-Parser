
class ParserHTTP{


	start=0
	end=1;

	methodsCheck={
		'GET':'X',
		'HEAD':'X',
		'POST':'X',
		'PUT':'X',
		'DELETE':'X',
		'CONNECT':'X',
		'OPTIONS':'X',
		'TRACE':'X'

	}
	
	Parsed={
		headers:[]
	}
	



	Check(buffer){

		this.Parsed={
			headers:[]
		}

		 this.buffer=buffer.toString('hex')

		 

		var Meth="" 

		var currentHex=""
	
		

		var count=0;
		// i need the count because the hex values are 2 so for every pair of hex values i add 1 to the count (for optimizations and checking)


		while (currentHex!='20') {

			currentHex=""
			if (count>8) {
				
				console.log('Method not valid');
				return false

			}


			while (this.start<=this.end) {
				
				currentHex+=this.buffer[this.start]
				this.start++
			}

			if(currentHex==='20'){
				this.start=this.end+1
				this.end=this.start+1
				break;
			}

			Meth+=currentHex

			this.start=this.end+1
			this.end=this.start+1



			count++
			
		}



		
		const output=Buffer.from(Meth,'hex')
		
		

	
		if (!this.methodsCheck[output.toString('utf-8')]) {
			
			
			return false
		}
		else{
			

			this.Parsed.Method=output.toString('utf-8')

			
			return this.CheckPath(this.buffer)



		}


	}

	CheckPath(buffer){


		  var st=buffer[this.start]+buffer[this.end]
		 
		  if (st!='2f') {
			
			console.log('couldnt find the first path symbol');
			return false;
		  }


		   var Path=""
		   var currentHex=''
		   

		   while (currentHex!='20') {
			
			currentHex=''


			while (this.start<=this.end) {
				
				
				currentHex+=this.buffer[this.start]
				this.start++
			}

			if (currentHex==='20') {
				
				this.start=this.end+1
				this.end=this.start+1
				break;

			}


			if (this.buffer[this.end]===undefined) {
				
				console.log('Path problem, space delimiter not found');
				return false;
			}
			Path+=currentHex

			this.start=this.end+1
			this.end=this.start+1


		   }


		   
		   const output=Buffer.from(Path,'hex')

		



			this.Parsed.Path=output.toString('utf-8')

			
			return this.CheckVersion(this.buffer)



		}

		CheckVersion(buffer){


			var i=1;
			var en=10;
			
			var check=""

			while (i<=en) {
				
				check+=buffer[this.start]
				check+=buffer[this.end]
				this.start=this.end+1
				this.end=this.start+1
				i++
			}

			
			
			//checking 2 last hex values, the protocol rule is 0d 0a 

			var checkLast=check[check.length-4]+check[check.length-3]+check[check.length-2]+check[check.length-1]

			if (checkLast!='0d0a') {
				
				console.log('delimiter at the end of the version is wrong');
				return false
			}


			var x=0;
			var checkfirst=""

			while (x<=7) {
				
				checkfirst+=check[x]
				x++
			}

			

			if (checkfirst!='48545450') {
				
				console.log('Error version is not HTTP');
				return false
			}

			
			

			return this.Headers(this.buffer)
		


		}

		Headers(buffer){



			var final=''
			// final hex should be 0d0a0d0a which means CR NL CR NL

			
			
			while (final!='0d0a0d0a') {
				

				var finalOneHeader=''
				//this should mark the end of a header key:value 
				// it should be equal to 0d0a CR NL 

				var key=''
				//before 3a ' : '

				var value=''
				// after 3a until finalOneHeader 

				var curr=''
				//check if cur is not 3a or 0d0a

				

				while (curr!='3a' && this.end<=buffer.length) {
					
					curr=''
					
					key+=buffer[this.start]
					key+=buffer[this.end]

					curr+=buffer[this.start]
					curr+=buffer[this.end]
					
					

					

					this.start=this.end+1
					this.end=this.start+1

				}

				if (curr!='3a') {
					
					console.log('3a not found');
					return false
				}

				

				var space=buffer[this.start]+buffer[this.end]

				

				if (space!='20') {
					
					console.log('space 20 not found');
					return false
				}

				this.start=this.end+1
				this.end=this.start+1

				curr=''

				while (finalOneHeader!='0d0a' && this.end<=buffer.length) {
					
					finalOneHeader=''

					finalOneHeader+=buffer[this.start]
					finalOneHeader+=buffer[this.end]

					
					finalOneHeader+=buffer[this.end+1]
					finalOneHeader+=buffer[this.end+1+1]
					

					value+=buffer[this.start]
					value+=buffer[this.end]

					

					this.start=this.end+1
					this.end=this.start+1

					if (buffer[this.end]===undefined) {
						break
					}


				}

				
				value=value.split("")

				var i=0;
				while (i<2) {
					
					value.pop()
					i++
				}
				value=value.join("")

				
				key=key.split("")

				var checkNewL=key[0]+key[1]

				if (checkNewL==='0a') {
					
					var i=0;

					while (i<2) {
						
						key.shift()
						i++
					}
				}

				
				key=key.join("")
				


				var obj={}

				var outputkey=Buffer.from(key,'hex')
			var outputValue=Buffer.from(value,'hex')

			var outputEnglish=outputkey.toString('utf-8')
			var outputValueEnglish=outputValue.toString('utf-8')
			

			   obj[outputEnglish]=outputValueEnglish

			


				this.Parsed.headers.push(obj)

				
				
				var f=buffer[this.end+1]+buffer[this.end+2]+buffer[this.end+3]+buffer[this.end+4]

				if (f==='0d0a') {
					
					// it means we reached the end of the bits sequence 
					break
				}
			

			}
		
			return this.Parsed


		}

	}


module.exports=ParserHTTP