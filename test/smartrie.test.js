"use strict";
require("should");
const Smartrie = require("../src/js/smartrie.js").Smartrie
const {stringSimilarity,trieToString,trieIsComplete} = require("../src/js/smartrie.js").util
describe("Smartrie utility functions", () => {
	it("should determine the length of the parts of two strings which are similar", () => {
		stringSimilarity("bob","bobbert").should.eql(3)
		stringSimilarity("allen","alex").should.eql(2)
		stringSimilarity("sherman","constantina").should.eql(0)
		stringSimilarity("","").should.eql(0)
	});
	it("should map a trie to its completion value with trieIsComplete", function() {
		let trie = new Smartrie("bob")
		trieIsComplete(trie).should.eql(0)
		trie.complete = 1
		trieIsComplete(trie).should.eql(1)
	});
	it("should map a trie node to a string with trieIsComplete", function() {
		let trie = new Smartrie("bob")
		trieToString(trie).should.eql("bob")
	});
})
describe("Smartrie", () => {
	let smartrie;
	beforeEach("setup", () => {
		smartrie = new Smartrie();
	});
	it("should implement expected properties and methods", () => {
		smartrie.should.have.property("value").eql("")	
		smartrie.should.have.property("children").eql([])
		smartrie.should.have.property("complete").eql(0);
		(typeof smartrie.add).should.eql("function");
		(typeof smartrie.find).should.eql("function");
		(typeof smartrie.countCompletions).should.eql("function")
	});
	it("should add children, returning the new child", () => {
		let ret = smartrie.addChild("bob")
		let compare = new Smartrie("bob")
		compare.complete = 1
		ret.should.eql(compare)
		smartrie.children[0].should.deepEqual(ret)
		smartrie.addChild("alice")
		smartrie.children[1].value.should.eql("alice")
	});
	it("should find matches in children", () => {
		let tail = smartrie.addChild("b").addChild("o").addChild("b");
		smartrie.find("b").trie.value.should.eql("b")
		smartrie.find("bo").trie.value.should.eql("o")
		smartrie.find("bob").trie.should.deepEqual(tail)
		smartrie.find("bob").tail.should.eql("")
		smartrie.find("bob").head.should.eql("b")
		smartrie.find("bobby").trie.should.deepEqual(tail)
		smartrie.find("bobby").head.should.eql("b")
		smartrie.find("bobby").tail.should.eql("by")
	});
	it("should recursively add strings", () => {
		let ret = smartrie.addChild("bob")
		smartrie.add("bobby")
		ret.children[0].value.should.eql("by")
		smartrie.add("bobina")
		ret.children[1].value.should.eql("ina")
	});
	it("should correctly split during an add", () => {
		smartrie.add("bobby")
		smartrie.add("bob")
		smartrie.add("bret")
		smartrie.add("bobina")
		smartrie.add("bobacus")
		smartrie.children.length.should.eql(1)
		smartrie.children[0].value.should.eql("b")
		smartrie.children[0].children.length.should.eql(2)
		smartrie.children[0].children[0].value.should.eql("ob")
		smartrie.children[0].children[1].value.should.eql("ret")
		smartrie.children[0].children[0].children.length.should.eql(3)
		smartrie.children[0].children.map(trieToString).should.eql(["ob","ret"])
		smartrie.children[0].children[0].children.map(trieToString).should.eql(["by","ina","acus"])
		smartrie.add("brad")
		smartrie.children[0].children[1].value.should.eql("r")
		smartrie.children[0].children[1].children.map(trieToString).should.eql(["et","ad"])
		smartrie.add("allen")
		smartrie.children.length.should.eql(2)
		smartrie.children[1].value.should.eql("allen")
		smartrie.add("allison")
		smartrie.children[1].children.length.should.eql(2)
		smartrie.children[1].value.should.eql("all")
		// regression test: bug where "all" would split to "all" -> "e" -> "n","x" here
		smartrie.add("alex")
		smartrie.children[1].value.should.eql("al")
		smartrie.children[1].children.map(trieToString).should.eql(["l","ex"])
		smartrie.children[1].children[0].children.map(trieToString).should.eql(["en","ison"])
	});
	it("should update completions during adds and splits", () => {
		smartrie.add("bobby")
		smartrie.add("bobina")
		smartrie.children[0].value.should.eql("bob")
		smartrie.children[0].complete.should.eql(0)
		smartrie.children[0].children.map(trieIsComplete).should.eql([1,1])	
		smartrie.add("bob")
		smartrie.children[0].complete.should.eql(1)
		smartrie.add("bret")
		smartrie.children[0].complete.should.eql(0)
		smartrie.find("bob").trie.complete.should.eql(1)
	});
	it("should count completions", () => {
		smartrie.add("bobby")
		smartrie.add("bobina")
		smartrie.add("bret")
		smartrie.add("brad")
		smartrie.add("bob")
		smartrie.add("bryan")
		smartrie.add("bartholomew")
		smartrie.countCompletions().should.eql(7)
		smartrie.add("allen")
		smartrie.add("allison")
		smartrie.add("alex")
		smartrie.add("adrian")
		smartrie.add("adonus")
		smartrie.countCompletions().should.eql(12)
		smartrie.find("b").trie.countCompletions().should.eql(7)
		smartrie.find("a").trie.countCompletions().should.eql(5)
		smartrie.find("bob").trie.countCompletions().should.eql(3)
		smartrie.find("br").trie.countCompletions().should.eql(3)
		smartrie.find("bra").trie.countCompletions().should.eql(1)
		smartrie.find("bar").trie.countCompletions().should.eql(1)
		smartrie.find("al").trie.countCompletions().should.eql(3)
		smartrie.find("ad").trie.countCompletions().should.eql(2)
		smartrie.find("all").trie.countCompletions().should.eql(2)
		smartrie.find("alle").trie.countCompletions().should.eql(1)
		smartrie.find("adr").trie.countCompletions().should.eql(1)
		smartrie.find("ado").trie.countCompletions().should.eql(1)
	});
});
