import SuppressWarnings from "..";

SuppressWarnings([
	(warning, name, ctor) => warning.toString().indexOf("test") !== -1,
	(warning, name, ctor) => name === "TestWarning"
]);

process.emitWarning("test"); // name: Warning (default)
process.emitWarning("some warning that will also not get emitted", "TestWarning");
process.emitWarning("some warning that will get emitted", "SomeWarningName");
