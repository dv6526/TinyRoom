const hbs = require('hbs');

hbs.registerHelper("ifEquals", function(arg1, arg2) {
    if(arg1 == arg2) {
        return 'inactive';
    }
    return '';
});

hbs.registerHelper("checked", function(skin, printSkin) {
    if(skin == printSkin)
        return 'checked';
    return '';
});