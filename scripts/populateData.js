'use strict';

const { exec } = require('child_process');
const path = require('path');

// List of script names and their arguments
const scripts = [
    { name: 'populateBaseballData.js', args: ['Baseball.json'] },
    { name: 'populateBasketballData.js', args: ['Basketball.json'] },
    { name: 'populateFootballData.js', args: ['Football.json'] },
    { name: 'populateSoccerData.js', args: ['Soccer.json'] },
    { name: 'populateHockeyData.js', args: ['Hockey.json'] },
    { name: 'populateValorantData.js', args: ['valorantTeams.json'] },
];

const outputDirectory = path.resolve(__dirname, '../sportsData');

// Function to run a script with arguments
function runScript(script) {
    const scriptPath = path.resolve(__dirname, script.name);
    const command = `node ${scriptPath} ${script.args.join(' ')}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing ${script.name}:`, error);
            return;
        }
        if (stderr) {
            console.error(`Error output from ${script.name}:`, stderr);
        }
        console.log(`Output from ${script.name}:`, stdout);
    });
}

// Run all scripts
scripts.forEach(runScript);

//have to manually move the scripts to the sportsData directory because for some reason code execution will fail. Probably a permissions issue.