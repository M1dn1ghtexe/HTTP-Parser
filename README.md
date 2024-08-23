 When we observe the bits inside a request and a response, we can see a pattern, a rule that will follow everytime, hence the name Protocol.<br>
 I created this class that processes raw byte buffers to extract and convert hex values into a structured object. 
 <br>It reads the incoming buffer byte by byte, identifying and capturing every hexadecimal value present.<br>
 The parsed values are then stored in an object, resulting in a key-value representation  <br>
 Frameworks like express does this parsing behind the scenes.
