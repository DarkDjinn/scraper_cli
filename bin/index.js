#!/usr/bin/env node
const handleExit = require('./handleExit');
const { initDriver, work } = require('./funcs');

(async () => {
	const driver = await initDriver();
	await handleExit(driver);
	let initRun = true;
	while (true) {
		const res = await work(driver, initRun);
		initRun = res.initRun;
		console.log(`You are currently on ${res.currUrl}`);
	}
})();
