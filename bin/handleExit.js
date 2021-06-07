module.exports = driver => {
	async function exitHandler(evtOrExitCodeOrError) {
		try {
			await driver.quit();
		} catch (e) {
			console.error('EXIT HANDLER ERROR', e);
		}
		process.exit(isNaN(+evtOrExitCodeOrError) ? 1 : +evtOrExitCodeOrError);
	}

	[
		'beforeExit',
		'uncaughtException',
		'unhandledRejection',
		'SIGHUP',
		'SIGINT',
		'SIGQUIT',
		'SIGILL',
		'SIGTRAP',
		'SIGABRT',
		'SIGBUS',
		'SIGFPE',
		'SIGUSR1',
		'SIGSEGV',
		'SIGUSR2',
		'SIGTERM',
	].forEach(evt => process.on(evt, exitHandler));
};
