/**
 * Return true if the warning should not be emitted, false to pass onto the next filter or back to node if there are no more filters.
 */
type FilterFunction = (...args: Parameters<typeof process["emitWarning"]>) => boolean;

function SuppressWarnings(opt?: FilterFunction[], whitelist?: boolean) {
	if (!opt) opt = [];
	whitelist = !!whitelist;
	const original = process.emitWarning;

	process.emitWarning = ((...args: Parameters<typeof process["emitWarning"]>) => {
		// I know I could probably shorten this and prevent duplication but I don't feel like it right now
		for (const f of opt) {
			if (!whitelist) {
				if (f(...args)) return;
				else continue;
			} else {
				if (!f(...args)) return;
				else continue;
			}
		}

		return original(...args);
	});
}

export = SuppressWarnings;
