const app = require("../server.js");

module.exports = (req, res) => {
    app(req, res);
    app.get('/', (req,res)=>{
        res.json('express running')
    })
};
