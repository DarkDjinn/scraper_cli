const InitOptions = {
	interactive: { default: true },
	url: {
		type: 'input',
		describe: 'Enter a url to scrape',
	},
	selectorType: {
		type: 'list',
		describe: 'What is the selector type?',
		choices: [
			'Class Name',
			'CSS',
			'Id',
			'JS Expression',
			'Link Text',
			'Name Attribute',
			'Partial Link Text',
			'Take Screenshot',
		],
	},
	multiple: {
		type: 'list',
		describe: 'Is it a single element or an array?',
		choices: ['Single', 'Multiple'],
	},
};

const jsExpressionOptions = {
	interactive: { default: true },
	expression: { type: 'input', describe: 'Enter the JS expression as a string' },
};

const selectorOptions = {
	interactive: { default: true },
	selector: {
		type: 'input',
		describe: 'Enter an element selector to scrape',
	},
};

const multiElementCommandOptions = {
	interactive: { default: true },
	command: {
		type: 'list',
		describe: 'What do you want me to do with the elements?',
		choices: [
			'Find child/children',
			'Get attribute',
			'Get CSS value',
			'Get ID',
			'Get tag name',
			'Get Text',
			'Take screenshot',
		],
	},
};

const singleElementCommandOptions = {
	interactive: { default: true },
	command: {
		type: 'list',
		describe: 'What do you want me to do with the element?',
		choices: [
			'Click',
			'Find child/children',
			'Get attribute',
			'Get CSS value',
			'Get ID',
			'Get tag name',
			'Get Text',
			'Take screenshot',
		],
	},
};

const selectorCountOptions = {
	interactive: { default: true },
	selectorType: {
		type: 'list',
		describe: 'What is the selector type?',
		choices: [
			'Class Name',
			'CSS',
			'Id',
			'JS Expression',
			'Link Text',
			'Name Attribute',
			'Partial Link Text',
			'Take Screenshot',
		],
	},
	multiple: {
		type: 'list',
		describe: 'Is it a single element or an array?',
		choices: ['Single', 'Multiple'],
	},
};

module.exports = {
	InitOptions,
	jsExpressionOptions,
	selectorOptions,
	multiElementCommandOptions,
	singleElementCommandOptions,
	selectorCountOptions,
};
