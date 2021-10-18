# Starting project
`npm run start:watch``
Run server in watch mode.
This command in dev environment watch file scss, js and template in order to put them into dist(or antother folder in env file)
Gruntfile is obsolete.

Open site on 127.0.0.1:15645

#Per fare un import del db su cloudnode

Esportare il db da locale con

`mongodump`

Copiare il contenuto dei bson all'interno di /app/<idapp>/dump
Posizionarsi all'interno della cartalla

Importare da shell da cloudnode con

`mongorestore -h mongodb_1:27017 -u antonio.dalessio -p 1QyxqMm0rC --db fristudio dump`