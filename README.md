Per fare un import del db su cloudnode

Esportare il db da locale con

`mongodump`

Copiare il contenuto dei bson all'interno di /app/<idapp>/dump
Posizionarsi all'interno della cartalla

Importare da shell da cloudnode con

`mongorestore -h mongodb_1:27017 -u antonio.dalessio -p 1QyxqMm0rC --db giorgini dump`