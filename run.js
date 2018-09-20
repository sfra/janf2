'use strict';
const exec = require('child_process').exec, nodeWatch = require('node-watch'), execFile = require('child_process').execFile, colors = require('colors');

let childSocket, childServer, testMocha;




const dev = process.argv.some(arg=>{return arg==='dev';});
const test = process.argv.some(arg=>{return arg==='test';});

if(dev) {
	childSocket = exec('nodemon index.socket.js');
	childServer = exec('nodemon index.js -config ../config.json',()=>{});
	childServer.stdout.pipe(process.stdout);
} else {

	childServer = exec('node index.js -config ../config.json',()=>{});
	childServer.stdout.pipe(process.stdout);

}


if(test) {

	nodeWatch(['./system/','index.js'],{recursive: true},(env,name)=>{
		console.log('mocha');
		exec('npm run mocha',(err, stdout, stderr)=>{


			let passed =stdout.match(/[0-9]* passing/g); 
			let failed = stdout.match(/[0-9]* failing/g);

			console.log('                                        '.blue.bold.inverse);
			console.log('             tests results              '.blue.bold.inverse);
			console.log('                                        '.blue.bold.inverse);

			let full = '';
			if(passed) {
				for(let i=0, max=27-passed[0].length; i<max; i++) {
					full+=' ';
				}
				
				console.log(`             ${passed[0]}${full}`.green.bgBlack);
			}
			if(failed) {
				full='';
				for(let i=0, max=27-failed[0].length; i<max; i++) {
					full+=' ';
				}
				console.log(`             ${failed[0]}${full}`.red.bgBlack);
			}


			
		});
		});
}



