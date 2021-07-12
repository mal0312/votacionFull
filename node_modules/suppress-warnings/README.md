# Suppress Warnings!
This module helps suppress some annoying warnings you may get that you're either too lazy to fix, or can't because it's not in a module you control.

The main function takes an array of "filter functions", as the first parameter, of which the arguments will be the same as [process.emitWarning](https://nodejs.org/api/process.html#process_process_emitwarning_warning_type_code_ctor) (It's also dynamic, so as node changes, it should also change.), the second parameter can be used to change the default behavior (blacklist), into a whitelist.

## Examples: 

### JavaScript
```js
// This must be called BEFORE any of the errors get sent, so require this first and run the function first before requiring any other modules
const SuppressWarnings = require("suppress-warnings");
// say you were getting a log like this: https://butts-are.cool/Code_-_Insiders_qeiR4Gtkyh.png
// (which is the warning that prompted me to make this)
// name: DeprecationWarning
// message: OutgoingMessage.prototype._headers is deprecated

// the first parameter is an array of filter functions
// return TRUE to hide the warning, and FALSE to pass it back to node

// the second parameter turns the default behavior (blacklist) into a whitelist
// where TRUE to pass it to node, and FALSE to hide it
SuppressWarnings([
	// warning can be an Error object or a string
	// name is always a string (can be absent)
	// I really don't know what ctor is, but it's in the ts definition
	(warning, name, ctor) => name === "DeprecationWarning" && warning.toString() === "OutgoingMessage.prototype._headers is deprecated"
]);
```

### TypeScript
```ts
// This must be called BEFORE any of the errors get sent, so require this first and run the function first before requiring any other modules
import SuppressWarnings from "suppress-warnings";

// this is all the same, see JavaScript version for details

SuppressWarnings([
	(warning, name, ctor) => name === "DeprecationWarning" && warning.toString() === "OutgoingMessage.prototype._headers is deprecated"
]);
```
