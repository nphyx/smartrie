"use strict";
let Smartrie = require("./src/js/smartrie.js").Smartrie
process.stdin.resume()
process.stdin.setEncoding("ascii")

var input = ""

process.stdin.on("data", function (data) {
	input += data
});

process.stdin.on("end", function () {
	main(input)
});

/////////////// ignore above this line ////////////////////



function main(input) {
	let rows = input.split("\n"), i = 1, len = rows.length, row, end
	var contacts = new Smartrie("")
	contacts.complete = 0;
	for(i; i < len; ++i) {
		row = rows[i]
		let split = rows[i].indexOf(" ")
		switch(row.substring(0, split)) {
			case "add": 
				contacts.add(row.substring(split+1))
				break;
			case "find": 
				end = contacts.find(row.substring(split+1))
				if(end.tail !== "") console.log(0)
					else console.log(end.trie.countCompletions())
				break;
			case "enum":
				console.log("enumerating")
				contacts.enumerate()
				break;
		}
	}
}
