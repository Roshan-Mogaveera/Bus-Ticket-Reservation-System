const mysql = require('mysql2');
const db = mysql.createConnection({host: 'localhost', user: 'root', database: 'bus_reservation'});
db.query('UPDATE users SET password=?', ['$2a$10$n0OBDzhT8jR3y/rUWRprhejvIgzAZ4owzN7ZGySkAgRVya4k8uTL2'], () => {
    db.query('UPDATE admin SET password=?', ['$2a$10$R5diVVNfUg.41lBnYfSSVe0N6Ea5Qq.0lyzEk/vaR3PZPX3PHBr9W'], () => {
        console.log('Done!');
        process.exit(0);
    });
});
