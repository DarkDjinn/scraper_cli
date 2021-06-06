const { Builder, By } = require('selenium-webdriver');

(async () => {
	let driver = await new Builder().forBrowser('firefox').build();
	try {
		await driver.get('http://www.amazon.com');

		// Get categories dropdown
		const dropdown = await driver.findElement(By.id('searchDropdownBox'));
		// Get all dropdown options (categories)
		const options = await dropdown.findElements(By.css('option'));

		// Extract options (categories) values
		let values = [];
		for await (let option of options) {
			values.push(await option.getAttribute('value'));
		}

		// Loop over categories
		for (let value of values) {
			// Search the category (empty search input)
			await driver.get(`https://www.amazon.com/s/ref=nb_sb_noss?url=${value}&field-keywords=`);
		}

		await driver.quit();
	} catch (e) {
		console.log(e);
		await driver.quit();
	}
})();
