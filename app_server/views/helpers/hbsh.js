const hbs = require('hbs');

hbs.registerHelper('ifEquals', function(arg1, arg2) {
    return (arg1 == arg2)
});