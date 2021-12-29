/*Here starts the modules Importation through 'require()' */
const http = require('http'),
  fs = require('fs'),
  url = require('url');
/*Here ends the modules Importation through 'require()' */

/*Here starts the server creation.*/
http.createServer((request, response) => {/* Here the http module createServer() function is used to create the server with the 'request' and 'response' arguments.*/
  let addr = request.url,/* Here request.url allows to get the URL from the 'request' (the first argument from createServer()).*/
    q = url.parse(addr, true),/* Here the url.parse function is being used on the new addr variable, and the results of that are being set to a new variable, q.*/
    filePath = '';

    /* Under with the appendFile() function from fs(File Server) we send the information of recent log requests to the server
    to a new file 'log.txt'. With this information we will be able to track the most visited URL's, debug code, and more.
    The appendFile() function takes three arguments:
    - File name to append the information ('log.txt')
    - The new information to be appended (addr and new Date)
    - Error-handling function (err) */
  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });
  
  /* Under refiring 'q' to the previous url.parse it 'documentation.html is there, and if yes is added to the directory Url, if not, goes back to index.html*/
  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }
  /* Under fs(File Server) uses the readFile() function to to grab the appropriated requested file from the server.
  And because the first argument given to it is the filePath variable with the full pathname of the URL you fetched and parsed, the function knows what information to send back */
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();

  });

}).listen(8080);/* Listens for a response on port 8080 */
/*Here ends the server creation.*/
console.log('My test server is running on Port 8080.');
