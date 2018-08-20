const express = require('express');
var session = require('express-session');
const {buildSchema} = require('graphql');
const graphqlhttp = require('express-graphql');
const bodyparser = require('body-parser');
const db = require('./db');

var schema = buildSchema(`
		type Query
		{
			student: Student
		}

		type Grade
		{
			ccode: String
			grade: String
			term: Int
			level: Int
			year: Int
			result: Int
			termwork: Int
			examwork: Int
		}

		type Student
		{
			id: String!
			data: StudData
			grades: [Grade]
		}

		type StudData
		{
			name: String
			currentLevel: Int
			year: Int
			GPA: Float
			major: String
			minor: String
			track: String
			advisor: Int
			total: Int
			status: String
		}
	`);

class Grade
{
	constructor(data)
	{
		this.ccode = data.subj_id;
		this.grade = data.grade;
		this.term = data.term;
		this.level = data.level;
		this.year = data.year;
		this.result = data.result;
		this.termwork = data.term_work;
		this.examwork = data.exam_work;
	}
}

class StudData
{
	constructor(res)
	{
		res = res[0];
		this.name = res.name;
		this.currentLevel = res.current_level;
		this.year = res.year;
		this.GPA = res.GPA;
		this.major = res.major;
		this.minor = res.minor;
		this.track = res.track;
		this.advisor = res.advisor;
		this.total = res.total;
		this.status = res.status;
	}
}

class Student
{
	constructor()
	{
		if(session.loggedIn)
			this.id = session.user;
		else
			this.id = "Not logged in!";
	}

	data()
	{
		if(session.loggedIn)
			return db.GetStudInfoByID(this.id).then((res) =>
			{
				let data = new StudData(res);
				return data;
			}).catch();
		else
			return [];
	}

	grades()
	{
		if(session.loggedIn)
			return db.GetStudGradesByID(this.id).then((res) => {
				let gradesRes = [];
				res.forEach((grade) =>
				{
					gradesRes.push(new Grade(grade));
				});

				//console.log(gradesRes);
				return gradesRes;
			}).catch();
		else
			return [];
	}
}

var root = {
	student: ({id}) => { return new Student(id) }
};

const app = express();

app.use(session(
	{
		secret: 'XASDASDA',
		resave: false,
		saveUninitialized: true
	}));
app.use('/graphql', (req, res, next) => 
	{
		session = req.session;
		next();
	},
	graphqlhttp(
	{
		schema: schema,
		rootValue: root,
		graphiql: true
	}));

app.post('/login', bodyparser.json(), bodyparser.urlencoded({ extended: true }), (req, res) => {
	db.CheckLoginInfo(req.body.username, req.body.password).then((res2) => 
	{
		if(res2)
		{
			session = req.session;

			console.log(req.body.username);
			session.user = req.body.username;
			session.password = req.body.password;
			session.loggedIn = true;

			res.end("Logged in!");
		}
		res.end("Failed to login!");
	}).catch();
	
});

app.get('/', (req, res) => {
	res.end("Hello World!");
});

app.listen(3000, () => {
	console.log("Listening on 3000");
});