const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost/smalltalk';
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

mongoose.connection.on('connected', () => {
  console.log(`Mongoose je povezan na ${dbURI}.`);
});

mongoose.connection.on('error', (napaka) => {
  console.log('Mongoose napaka pri povezavi: ', napaka);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose ni povezan.');
});

const pravilnaZaustavitev = (sporocilo, povratniKlic) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose je zaprl povezavo preko '${sporocilo}'`);
    povratniKlic();
  });
};

// Ponovni zagon nodemon
process.once('SIGUSR2', () => {
  pravilnaZaustavitev('nodemon ponovni zagon', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

// Izhod iz aplikacije
process.on('SIGINT', () => {
  pravilnaZaustavitev('izhod iz aplikacije', () => {
    process.exit(0);
  });
});

// Izhod iz aplikacije na Heroku
process.on('SIGTERM', () => {
  pravilnaZaustavitev('izhod iz aplikacije na Heroku', () => {
    process.exit(0);
  });
}); 

require('./uporabniki');
require('./privateRoom');