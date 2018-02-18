var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var heroes = [
      {id: 11, name: 'Mr. Nice'},
      {id: 12, name: 'Narco'},
      {id: 13, name: 'Bombasto'},
      {id: 14, name: 'Celeritas'},
      {id: 15, name: 'Magneta'},
      {id: 16, name: 'RubberMan'},
      {id: 17, name: 'Dynama'},
      {id: 18, name: 'Dr IQ'},
      {id: 19, name: 'Magma'},
      {id: 20, name: 'Tornado'}
    ];

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/website'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
      extended: true
}))

// views is directory for all template files
app.set('views', __dirname + '/website');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.render('main/index');
});

app.get('/myData', function(request, response) {
	response.send(heroes);
});

app.delete('/myData/:id', function(request, response) {
      var id = request.params.id;

      var arrayId;
      heroes.map(hero => {
            if(hero.id == id) arrayId = heroes.indexOf(hero);
      });

      heroes.splice(arrayId,1);
      response.send('deleted');
});

app.put('/myData/:id', function(request, response) {
      var updatedHero = request.body;
      heroes = heroes.map(hero => {
            if (hero.id == updatedHero.id) return updatedHero;
            else return hero;
      });
      response.send('updated');
});

app.post('/CreateHero', function(request, response) {
      var newHeroName = request.body.name;
      var maxId = 0;
      heroes.map(hero => {
            if (hero.id > maxId) maxId = hero.id;
      });

      var hero = {id: maxId+1, name: newHeroName};
      heroes.push(hero);
      response.send('added');
});

app.get('/*', function(request, response) {
	response.render('main/index');
});


app.use(function(request, response) {
	response.render('404');
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});