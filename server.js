const express = require('express');
const server = express();


//config da template engine 

const nunjucks  = require('nunjucks'); 
nunjucks.configure('./', {
    express: server,
    noCache: true,
})

//config das configurações extras p/ arquivos estáticos
server.use(express.static('public'));

server.use(express.urlencoded({ extended: true}));

//config da conexão com o banco
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'Doe'
})


server.get('/', function(req, res){

    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro no banco de dados")

        const donors = result.rows;

        return res.render("index.html", { donors });
    });
    
    
});


server.post('/', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood ==  "") {
        return res.send("Todos os campos devem ser preenchidos")
    }

    //passar valroes para dentro do banco
    const query = `
        INSERT INTO donors ("name", "email", "blood")
        VALUES ($1, $2, $3)`


    const values = [name, email, blood]

    db.query(query, values, function(err){
        if(err) return res.send("Erro no banco de dados.")
        
        return res.redirect("/") 
    });
    

});


server.listen(3000, function() {
    console.log('Serve Iniciado')
});
