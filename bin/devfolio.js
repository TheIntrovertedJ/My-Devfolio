#!/usr/bin/env node
/*
 Simple CLI for Devfolio common tasks:
  - up         : start MongoDB docker-compose
  - wait       : wait for MongoDB to be ready
  - seed       : seed the database
  - dev        : start backend dev server
  - start      : up -> wait -> seed -> dev
  - help       : show this help

 Usage:
  npx devfolio <command>
  node ./bin/devfolio.js <command>
*/

const { spawn } = require('child_process');
const path = require('path');

function run(cmd, args, opts = {}) {
	const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
	return new Promise((resolve, reject) => {
		p.on('exit', (code) => {
			if (code === 0) resolve(0);
			else
				reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`));
		});
		p.on('error', (err) => reject(err));
	});
}

async function up() {
	console.log('Starting MongoDB with docker-compose...');
	await run('docker', ['compose', 'up', '-d']);
}

async function waitForMongo() {
	console.log('Waiting for MongoDB to accept connections...');
	const waiter = path.join(
		__dirname,
		'..',
		'db',
		'scripts',
		'wait-for-mongo.js'
	);
	await run('node', [waiter]);
}

async function seed() {
	console.log('Seeding database...');
	await run('npm', ['run', 'db:seed'], {
		cwd: path.join(__dirname, '..') + '/backend',
	});
}

async function dev() {
	console.log('Starting backend dev server...');
	await run('npm', ['run', 'dev'], {
		cwd: path.join(__dirname, '..') + '/backend',
	});
}

async function startAll() {
	try {
		await up();
		await waitForMongo();
		await seed();
		await dev();
	} catch (err) {
		console.error('Error during start:', err.message || err);
		process.exit(1);
	}
}

function help() {
	console.log(`Devfolio CLI

Usage: devfolio <command>

Commands:
  up       Start docker-compose (MongoDB)
  wait     Wait for MongoDB to be ready
  seed     Run DB seed script
  dev      Start backend dev server
  start    up -> wait -> seed -> dev (full local start)
  help     Show this help
`);
}

async function main() {
	const cmd = process.argv[2] || 'help';
	try {
		switch (cmd) {
			case 'up':
				await up();
				break;
			case 'wait':
				await waitForMongo();
				break;
			case 'seed':
				await seed();
				break;
			case 'dev':
				await dev();
				break;
			case 'start':
				await startAll();
				break;
			default:
				help();
				break;
		}
	} catch (err) {
		console.error('Command failed:', err.message || err);
		process.exit(1);
	}
}

main();
