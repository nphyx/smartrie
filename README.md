Smartrie
========
Smartrie is a Javascript implementation of a [Trie](https://en.wikipedia.org/wiki/Trie) that uses lazy forking to avoid unnecessary memory consumption and tree traversal. Here's an example, with brackets showing tree structure after each operation:
```
[]
add bob
[ [bob] ] # create branch "bob"
add bobby
[ [bob[by]] ] # tail "by" is added to branch "bob"
add bret
[ [b[ret] [ob[by]]] ] # bob is forked to "b"-> "ob", "ret" is added under "b"
add brad
[ [b[r[ad][et]] [ob[by]]] ] # ret is forked to "r"->"et", "ad" is added under "r"
add alex
[ [alex] [b[r[ad][et]] [ob[by]]] ] # "alex" is added as a new branch under root
add allan
[ [al[ex][lan]] [b[r[ad][et]] [ob[by]]] ] # "alex" is forked to "al"->"ex", "lan" is added under "al"
```

Hope that makes sense. Using this approach, the number of nodes in the tree is related to the number of strings added to the tree, rather than the number of characters, as in a naive implementation:

```
[]
add bob
[ [b[o[b]]] ] # bob is immediately forked out to b->o->b
```

Compared to the naive version, smartrie uses far less memory, traverses with fewer steps, and is typically faster. The absolute worst case memory usage and traversal time is equivalent to the naive tree, but typical cases are substantially better, with no substantial drawbacks in terms of complexity. 

It's still kind of slow and heavy compared to native binary in a statically typed language, but sometimes JS is what you need!

Usage
=====
Smartrie can be used via its API or directly at the command line through its CLI.

API
===
Smartrie provides an object-oriented interface for use within an application.

```javascript
const Smartrie = require("./src/js/smartrie.js").Smartrie
let trie = new Smartrie(); // create root node

// add items to the trie with trie.add()
trie.add("bob");
trie.add("bobby");
trie.add("bret");
trie.add("brad");
trie.add("alex");
trie.add("allan");

// find matching child with trie.find(), returns closest find, head (matching part), tail (remaining)
trie.find("al"); // {trie:{value:"al",children:[(..lan..),(..ex..)]},head:"al",tail:""}
trie.find("allison"); // {trie:{value:"al",children:[(..lan..),(..ex..)]},head:"al",tail:"lison"}

// count completions of a string with trie.countCompletions()
trie.find("b").trie.countCompletions(); // 4
trie.countCompletions("b"); // 4 (TODO: UNIMPLEMENTED)

// list completions of a string with trie.complete()
trie.find("b").complete(); // ["ob","obby","ret","rad"]
trie.complete("b"); // ["bob","bobby","bret","brad"] (TODO: UNIMPLEMENTED)
```

CLI
===
Smartrie also provides a direct command-line interface for systems use. The CLI is quiet, meaning it only produces output for requests with a return value. 

```bash
node smartrie/index.js
> add bob
> add bobby
> add bret
> add brad
> add alex
> add allan
> find b # count complete children of "b"
4
> find bob # count complete children of "bob"
2
> find al # count complete children of "al"
2
> find al # count complete children of "all"
1
```

License
=======
The MIT License (MIT)
Copyright (c) 2016 Justen Robertson 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
