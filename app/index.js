var generators = require('yeoman-generator');
var clone = require("git-clone");

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
    },
    prompting: function () {
        return this.prompt([{
            type: 'input',
            name: 'name',
            message: 'Your project name'
        }]).then(function (answers) {
            var self = this;
            self.spawnCommandSync("git", ["clone", "https://github.com/blinxjs/blinx-boilerplate.git", answers.name]);
            console.info("Generated project directory named: " + answers.name);
            console.info("Installing dependencies. If this fails, try running the command [npm install] yourself inside project directory: " + answers.name);
            self.spawnCommandSync("npm", ["install"], { cwd: answers.name});
        }.bind(this));
    }
});