"use strict";
function similar(a, b) {
	let i = 0
	for(i; i < a.length, i < b.length; ++i) {
		if(a[i] == b[i]) continue 
		else return i
	}
	return i
}

let Smartrie = function(str) {
	this.value = str 
	this.children = []
	this.complete = 0
}

let SmartrieFindResult = function(trie, head, tail) {
	this.trie = trie
	this.head = head
	this.tail = tail 
}

Smartrie.prototype.split = function(pos) {
	let val = this.value
	let pre = val.substr(0, pos)
	let suf = val.substr(pos)
	let tmpchildren = this.children.slice(0)
	this.value = pre
	let newchild = new Smartrie(suf)
	newchild.children = tmpchildren
	newchild.complete = this.complete
	this.complete = 0
	this.children = [newchild]
}

Smartrie.prototype.addChild = function(str) {
	let child = new Smartrie(str)
	child.complete = 1
	this.children.push(child)
}

Smartrie.prototype.add = function(str) {
	if(str.length === 0) return this;
	if(this.value == str) { // already equal
		this.complete = 1
		return this
	}
	let found = this.find(str)
	if(found.head !== "" && found.tail !== "" && found.trie.value !== found.head) {
		found.trie.split(found.head.length)
	}
	found.trie.addChild(found.tail)
}

Smartrie.prototype.find = function(str) {
	if(str === this.value) return new SmartrieFindResult(this, str, "")
	let i = 0, found, children = this.children, len = children.length,
		sim = similar(this.value, str), tail = str.substring(sim), head = str.substring(0, sim)
	if(tail && (sim !== 0 || this.value === "")) {
		for(i; i < len; ++i) {
			found = children[i].find(tail)
			if(found.head) return found
		}
	}
	return new SmartrieFindResult(this, head, tail);
}

Smartrie.prototype.countCompletions = function() {
	let completions = 0, i, children = this.children, len = children.length;
	for(i = 0; i < len; ++i) {
		completions += children[i].countCompletions()
	}
	return completions + this.complete
}

Smartrie.prototype.enumerate = function(str = "", d=0) {
	let i, children = this.children, len = children.length;
	for(i = 0; i < len; ++i) {
		children[i].enumerate(str+this.value, d+1)
	}
	console.log("c:", str+this.value, "v:", this.value, this.complete?"(complete)":"", "d:", d);
}

if(module) {
	module.exports.Smartrie = Smartrie;
}
