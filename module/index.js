var fs = require('fs-extra');
var ejs = require('ejs');
var beautify = require('js-beautify').js_beautify;

var generators = require('yeoman-generator');
var constants = require("./constants");

var moduleFileContents = {
    style: fs.readFileSync(__dirname + "/module_template/style.css", "utf-8"),
    config: fs.readFileSync(__dirname + "/module_template/config.js", "utf-8"),
    template: fs.readFileSync(__dirname + "/module_template/template.html", "utf-8"),
    module: fs.readFileSync(__dirname + "/module_template/index.ejs", "utf-8"),
}



var getApps = function () {
    return fs.readdirSync(constants.apps);
}

var getModules = function (path) {
    return fs.readdirSync(path);
}

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
    },
    prompting: function () {
        return this.prompt([{
            type: 'list',
            name: 'type',
            message: 'What type of module you want to create?',
            choices: [constants.app_specific, constants.commonName],
            default: constants.app_specific
        }, {
            when: function (answers) {
                return (answers.type === constants.app_specific);
            },
            type: 'list',
            name: 'app',
            message: 'Where?',
            choices: function (answers) {
                return getApps();
            }
        }, {
            type: 'input',
            name: 'moduleName',
            message: 'Module Name',
            validate: function (input, answers) {
                var done = this.async();

                if (answers.type === constants.app_specific && getModules(constants.apps + "/" + answers.app).indexOf(input) > -1) {
                    done('You need to provide a module name which does not exist')
                } else if (answers.type === constants.commonName && getModules(constants.common_modules).indexOf(input) > -1) {
                    done('You need to provide a module name which does not exist')
                } else {
                    done(null, true);
                }
            }
        }, {
            type: 'confirm',
            name: 'requireStylesheet',
            default: false,
            message: 'Would you like to create stylesheet for module?'
        }, {
            type: 'confirm',
            name: 'requireConfig',
            default: false,
            message: 'Would you like to create config file for module?'
        }, {
            type: 'confirm',
            name: 'requireTemplate',
            default: false,
            message: 'Would you like to create template file for module?'
        }, {
            type: 'confirm',
            name: 'requireRenderFn',
            default: false,
            message: 'Would you like to BLinx to take care of rendering?'
        }]).then(function (answers) {

            var filesLocation = (answers.type === constants.app_specific) ? constants.apps : constants.common;
            var compiledTemplate = ejs.compile(moduleFileContents.module);

            fs.ensureDirSync(filesLocation + "/" + answers.app + "/" + answers.moduleName);
            if (answers.requireStylesheet) fs.writeFileSync(filesLocation + "/" + answers.app + "/" + answers.moduleName + "/style.css", moduleFileContents.style);
            if (answers.requireConfig) fs.writeFileSync(filesLocation + "/" + answers.app + "/" + answers.moduleName + "/config.js", moduleFileContents.config);
            if (answers.requireTemplate) fs.writeFileSync(filesLocation + "/" + answers.app + "/" + answers.moduleName + "/template.html", moduleFileContents.template);
            fs.writeFileSync(filesLocation + "/" + answers.app + "/" + answers.moduleName + "/index.js", beautify(compiledTemplate(answers), { indent_size: 4 }));

        }.bind(this));
    }
});