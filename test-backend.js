#!/usr/bin/env node

/**
 * Quick test script to verify backend setup
 * Run: node test-backend.js
 */

const http = require('http');

// Test endpoints
const tests = [
	{
		path: '/api/health',
		method: 'GET',
		name: 'Health Check',
	},
	{
		path: '/api/projects',
		method: 'GET',
		name: 'Get All Projects',
	},
	{
		path: '/api/skills',
		method: 'GET',
		name: 'Get All Skills',
	},
];

function testEndpoint(test) {
	return new Promise((resolve) => {
		const options = {
			hostname: 'localhost',
			port: 4000,
			path: test.path,
			method: test.method,
		};

		const req = http.request(options, (res) => {
			let data = '';
			res.on('data', (chunk) => {
				data += chunk;
			});
			res.on('end', () => {
				console.log(`✓ ${test.name} (${res.statusCode})`);
				if (data) {
					try {
						const json = JSON.parse(data);
						console.log(`  Response:`, json);
					} catch {
						console.log(`  Response: ${data.substring(0, 100)}...`);
					}
				}
				resolve();
			});
		});

		req.on('error', (error) => {
			console.log(`✗ ${test.name}: ${error.message}`);
			resolve();
		});

		req.end();
	});
}

async function runTests() {
	console.log('Testing Devfolio Backend API\n');
	console.log(
		'Make sure MongoDB is running and server is started with: npm run dev\n'
	);

	for (const test of tests) {
		await testEndpoint(test);
		await new Promise((r) => setTimeout(r, 500));
	}

	console.log('\nTests complete!');
}

runTests();
