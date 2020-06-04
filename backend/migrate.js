const mongoose = require('mongoose');
const fs = require('fs');
const initializeDB = require('./api/mongoose');

const ALLOWED_COMMANDS = ['run', 'revert'];

// initialize db on the top to have models available below
initializeDB();

const Migration = mongoose.model('Migration');

function loadCurrentMigrations() {
  return Migration.find()
    .select('name')
    .sort({ updatedAt: -1 })
    .lean()
    .then(docs => {
      return docs.map(d => d.name);
    });
}

function loadAllMigrations() {
  return new Promise((resolve, reject) => {
    fs.readdir(`${__dirname}/migrations`, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

function getFunc(name) {
  let migration;

  try {
    migration = require(`./migrations/${name}`); // eslint-disable-line
  } catch (e) {
    throw new Error(`Doh! migration ./migrations/${name} is not found`);
  }

  return migration;
}

function revertMigration(name) {
  if (!name) {
    throw new Error('Migration not found');
  }

  const migrateDown = getFunc(name).down;

  return migrateDown()
    .then(() => {
      return Migration.deleteOne({ name });
    })
    .then(() => {
      console.log(`Reverted ${name}`);
    });
}

function runMigrations(allMigrations, currentMigrations) {
  const migrations = allMigrations
    .map(m => m.substr(0, m.length - 3))
    .filter(m => currentMigrations.indexOf(m) === -1);

  if (!migrations.length) {
    console.log('No migrations to run');
    return Promise.resolve();
  }

  return migrations.reduce((promise, name) => {
    return promise.then(() => {
      const { up } = getFunc(name);
      const t = Date.now();
      return up()
        .then(() => {
          const m = new Migration({ name });
          return m.save();
        })
        .then(() => {
          console.log(`Ran ${name} +${Date.now() - t}ms`);
        });
    });
  }, Promise.resolve());
}

function run() {
  const args = process.argv.slice(2);
  const command = args[0] || 'run';
  const migrationName = args[1];

  if (ALLOWED_COMMANDS.indexOf(command) === -1) {
    console.error(`"${command}" is not recognized command`);
    process.exit(1);
  }

  return Promise.all([loadCurrentMigrations(), loadAllMigrations()])
    .then(result => {
      const currentMigrations = result[0];
      const allMigrations = result[1];

      switch (command) {
        case 'revert':
          return revertMigration(migrationName || currentMigrations[0]);
        case 'run':
        default:
          return runMigrations(allMigrations, currentMigrations);
      }
    })
    .then(() => {
      process.exit(0);
    })
    .catch(e => {
      console.log(`There was some problem running migration`);
      console.error(e);
      process.exit(1);
    });
}

run();
