/* GET home page */
const index = (req, res) => {
    res.render('index', { title: 'Express' });
};

const private = (req, res) => {
    res.render('private', { title: 'Express'});
}

const profile = (req, res) => {
    res.render('profile', { title: 'Express'});
}

const register = (req, res) => {
    res.render('register', { title: 'Express'});
}

module.exports = {
    index,
    private,
    profile,
    register
};