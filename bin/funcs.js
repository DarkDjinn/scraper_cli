const {
	InitOptions,
	jsExpressionOptions,
	selectorOptions,
	multiElementCommandOptions,
	singleElementCommandOptions,
	selectorCountOptions,
} = require('./options');
const yargsInteractive = require('yargs-interactive');
const { Builder, By, Key } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const firefoxOptions = new firefox.Options();
firefoxOptions.headless();
const profile = firefoxOptions.setProfile(
	'/Users/victor/Library/Application Support/Firefox/Profiles/48r1pws3.default'
);
profile.setPreference('dom.webdriver.enabled', false);
profile.setPreference('useAutomationExtension', false);

const initDriver = async () => {
	return await new Builder().forBrowser('firefox').setFirefoxOptions(firefoxOptions).build();
};

const checkSelectorType = async (driver, multiple, type, selector) => {
	try {
		let element;
		switch (type) {
			case 'Class Name':
				if (multiple === 'Single') {
					element = await driver.findElement(By.className(selector));
				} else {
					element = await driver.findElements(By.className(selector));
				}
				break;
			case 'CSS':
				if (multiple === 'Single') {
					element = await driver.findElement(By.css(selector));
				} else {
					element = await driver.findElements(By.css(selector));
				}
				break;
			case 'Id':
				if (multiple === 'Single') {
					element = await driver.findElement(By.id(selector));
				} else {
					element = await driver.findElements(By.id(selector));
				}
				break;
			case 'Link Text':
				if (multiple === 'Single') {
					element = await driver.findElement(By.linkText(selector));
				} else {
					element = await driver.findElements(By.linkText(selector));
				}
				break;
			case 'Name Attribute':
				if (multiple === 'Single') {
					element = await driver.findElement(By.name(selector));
				} else {
					element = await driver.findElements(By.name(selector));
				}
				break;
			case 'Partial Link Text':
				if (multiple === 'Single') {
					element = await driver.findElement(By.partialLinkText(selector));
				} else {
					element = await driver.findElements(By.partialLinkText(selector));
				}
				break;
			default:
				break;
		}

		return element;
	} catch (e) {
		console.log(`[-] ${e.message}`);
	}
};

const handleMultipleElements = async (element, driver) => {
	const { command } = await yargsInteractive().interactive(multiElementCommandOptions);
	let counter = 1;
	let attribute;
	let cssValue;
	for await (let el of element) {
		const res = await checkCommand(el, command, driver, counter, attribute, cssValue);
		attribute = res.attribute;
		cssValue = res.cssValue;
		counter++;
	}
};

const handleSingleElement = async (element, driver) => {
	const { command } = await yargsInteractive().interactive(singleElementCommandOptions);
	await checkCommand(element, command, driver);
};

const checkCommand = async (
	element,
	command,
	driver,
	counter = false,
	att = false,
	css = false
) => {
	try {
		switch (command) {
			case 'Click':
				await driver.executeScript(
					`arguments[0].scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center"
        })`,
					element
				);
				///////////////
				// Opens new tab and switches to it
				// await driver.actions().keyDown(Key.COMMAND).click(element).perform();
				// const tabs = await driver.getAllWindowHandles();
				// await driver.switchTo().window(tabs[tabs.length - 1]);
				///////////////
				await element.click().then(async res => {
					await driver.wait(function () {
						return driver.executeScript('return document.readyState').then(function (readyState) {
							return readyState === 'complete';
						});
					});
				});
				break;
			case 'Find child/children':
				const { selectorType, multiple } = await yargsInteractive().interactive(
					selectorCountOptions
				);
				const { selector } = await yargsInteractive().interactive(selectorOptions);

				let el = await checkSelectorType(element, multiple, selectorType, selector);
				if (multiple === 'Single') {
					await handleSingleElement(el, driver);
				} else {
					await handleMultipleElements(el, driver);
				}
				break;
			case 'Get attribute':
				let attribute = att;
				if (!attribute) {
					const res = await yargsInteractive().interactive({
						interactive: { default: true },
						attribute: { type: 'input', describe: 'Enter the attribute' },
					});
					attribute = res.attribute;
				}
				const value = await element.getAttribute(attribute);
				const innerText = await element.getText(attribute);
				if (value) {
					console.log({ attribute, value, innerText });
				}
				return { attribute, cssValue: false };
			case 'Get CSS value':
				let cssValue = css;
				if (!css) {
					const res = await yargsInteractive().interactive({
						interactive: { default: true },
						cssValue: { type: 'input', describe: 'Enter the CSS value' },
					});
					cssValue = res.cssValue;
				}
				const val = await element.getCssValue(cssValue);
				console.log(val);
				return { cssValue, attribute: false };
			case 'Get ID':
				const id = await element.getId();
				if (id) {
					console.log(id);
				}
				break;
			case 'Get tag name':
				const tag = await element.getTagName();
				if (tag) {
					console.log(tag);
				}
				break;
			case 'Get Text':
				const text = await element.getText();
				if (text) {
					console.log(text);
				}
				break;
			case 'Take screenshot':
				try {
					const screenshotBase64 = await element.takeScreenshot();
					require('fs').writeFile(
						`screenshot-${counter ? counter : 'element'}.png`,
						screenshotBase64,
						'base64',
						() => {
							console.log('Screenshot saved successfully.');
						}
					);
				} catch (e) {
					console.log(e);
					console.log('Failed to take screenshot.');
				}
				break;
			default:
				break;
		}
	} catch (e) {
		console.log(`[-] ${e.message}`);
	}
};

const work = async (driver, initRun) => {
	return new Promise(async (resolve, reject) => {
		let { url, multiple, selectorType } = await yargsInteractive()
			.usage('$0 <command> [args]')
			.interactive(initRun ? InitOptions : selectorCountOptions);
		try {
			var pat = /^https?:\/\//i;
			if (url) {
				url = !pat.test(url) ? `http://${url}` : url;
			}

			if (selectorType === 'JS Expression') {
				const { expression } = await yargsInteractive().interactive(jsExpressionOptions);
				if (url) {
					await driver.get(url);
				}
				let element;
				if (multiple === 'Single') {
					element = await driver.findElement(By.js('return ' + expression));
				} else {
					element = await driver.findElements(By.js('return ' + expression));
				}

				if (!element) return resolve({ initRun: false, currUrl: await driver.getCurrentUrl() });

				if (multiple === 'Single') {
					await handleSingleElement(element, driver);
				} else {
					await handleMultipleElements(element, driver);
				}
				resolve({ initRun: false, currUrl: await driver.getCurrentUrl() });
			} else if (selectorType === 'Take Screenshot') {
				if (url) {
					await driver.get(url);
				}
				try {
					const screenshotBase64 = await driver.takeScreenshot();
					require('fs').writeFile(`screenshot.png`, screenshotBase64, 'base64', () => {
						console.log('Screenshot saved successfully.');
					});
				} catch (e) {
					console.log(e);
					console.log('Failed to take screenshot.');
				}
				resolve({ initRun: false, currUrl: await driver.getCurrentUrl() });
			} else {
				if (url) {
					await driver.get(url);
				}
				const { selector } = await yargsInteractive().interactive(selectorOptions);
				const element = await checkSelectorType(driver, multiple, selectorType, selector);

				if (!element) return resolve({ initRun: false, currUrl: await driver.getCurrentUrl() });

				if (multiple === 'Single') {
					await handleSingleElement(element, driver);
				} else {
					await handleMultipleElements(element, driver);
				}

				resolve({ initRun: false, currUrl: await driver.getCurrentUrl() });
			}
		} catch (e) {
			console.log(e);
		}
	});
};

module.exports = {
	initDriver,
	work,
};
