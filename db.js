var mysql = require('mysql');

var conn = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "123*"
});

function Connect()
{
	conn.connect((err) => { 
		if(err)
			throw err;

		console.log("Connected!");
	});
}

exports.GetStudGradesByID = function GetStudGradesByID(id)
{
	return new Promise((resolve, reject) => {
		conn.query(`SELECT * FROM ecomnewdb.new_stud_group WHERE stud_id='${id}';`, (err, res) => 
		{
			if(err) reject(err);

			//console.log("Got grades.");
			resolve(res);
		});
	});
}

exports.GetStudInfoByID = function(id)
{
	return new Promise((resolve, reject) =>
	{
		conn.query(`SELECT * FROM ecomnewdb.newsys_stud WHERE stud_id = '${id}';`, (err, res) =>
		{
			if(err) reject(err);

			//console.log("Got info.");
			resolve(res);
		});
	});
}

exports.CheckLoginInfo = function(user, pass)
{
	return new Promise((resolve, reject) => 
	{
		let sql = `SELECT * FROM ecomnewdb.accounts WHERE id = '${user}' AND password = '${pass}';`;
		conn.query(sql, (err, res) =>
		{
			if(err)
				reject(err);

			if(res.length > 0)
				resolve(true);
			else
				resolve(false);
		});
	});
}