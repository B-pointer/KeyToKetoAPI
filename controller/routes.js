const bcrypt = require('bcrypt');//we need to move this into auth later on FIXME

module.exports = function (config, knex, auth, app) {
	app.post('/login', (req, res) => {
		if (!req.body.username || !req.body.password) {
			return res.json({
				success: false,
				message: 'Must submit username and password'
			});
		}
		
		knex('user').where({username: req.body.username}).select('uid', 'password').then(rows => {
			if (rows.length != 1) {
				return res.json({
					success: false,
					message: 'Invalid username or password'
				});
			}
			var user = rows[0];
			bcrypt.compare(req.body.password, user.password).then((match) => {
				if (match) {
					return res.json({
						success: true,
						token: auth.getToken({uid:user.uid})
					});
				}
				res.json({
					success: false,
					message: 'Invalid username or password'
				});
			});
		});
	});
	
	app.post('/logout', auth.checkToken, (req, res) => {
		return res.json({success: true});//NOP for now, change to deleting row from session table later
	});
	
	app.post('/register', (req, res) => {
		//FIXME add input validation for this and /login via validate.js
		//make sure to verify email
		bcrypt.hash(req.body.password, 10).then((hash) => {
			req.body.password = hash;
			return knex('user').insert(req.body);
		}).then(() => {//FIXME need to check result
			res.json({
				success: true,
				message: 'Account successfully created' //should probably just log them in here but we don't know their uid so we'd have to do all of the login logic over again
			});
		});
	});
	
	app.get('/checkUsername/:username', (req, res) => {
		knex('user').where({username: req.params.username}).select('uid').then(rows => {
			if (rows.length != 1) {
				return res.json({
					success: true,
					exists: false
				});
			} else {
				return res.json({
					success: true,
					exists: true
				});
			}
		});
	});
	
	app.get('/profile', auth.checkToken, (req, res) => {
		knex('user').where({uid: req.tokenData.uid})
		.select('username', 'birthdate', 'weight', 'height', 'email', 'gender', 'calorie_goal')
		.then(rows => {
			res.json({
				success: true,
				profile: rows[0]
			});
		});
	});
	
	app.post('/profile', auth.checkToken, (req, res) => {
		knex('user').where({uid: req.tokenData.uid})//FIXME make email a special case and verify
		.update(req.body)//FIXME, make sure they don't change the password here
		.then(rows => {
			res.json({
				success: true
			});
		});
	});
	
	app.post('/changePassword', auth.checkToken, (req, res) => {
		knex('user').where({uid: req.tokenData.uid}).select('password').then(rows => {
			bcrypt.compare(req.body.oldPassword, rows[0].password).then((match) => {
				if (match) {
					bcrypt.hash(req.body.password, 10).then((hash) => {
						return knex('user').where({uid: req.tokenData.uid})
						.update({password: hash});
					})
					.then(rows => {
						res.json({
							success: true
						});
					});
				} else {
					res.json({
						success: false,
						message: 'Invalid original password'
					});
				}
			});
		});
	});
	
	app.get('/foodSearch/:foodName', auth.checkToken, (req, res) => {
		knex('food').where('name', 'like', '%' + req.params.foodName + '%')
		/*.andWhere((builder) => {
			builder.where({uid: req.tokenData.uid})
			.orWhereNull('uid')
		})*/
		.limit(25)
		.then(rows => {
			res.json({
				success: true,
				results: rows
			});
		});
	});
	
	app.get('/food/:foodID', auth.checkToken, (req, res) => {
		knex('food').where({fid: req.params.foodID})
		/*.andWhere((builder) => {
			builder.where({uid: req.tokenData.uid})
			.orWhereNull('uid')
		})*/
		.then(rows => {
			res.json({
				success: true,
				results: rows[0]
			});
		});
	});
	
	/*app.post('/food/:foodID', auth.checkToken, (req, res) => {
		var qb = knex('food').where({fid: req.params.foodID, uid: req.tokenData.uid})
		req.body.fid = req.params.foodID;//fixme, just unset these
		req.body.uid = req.tokenData.uid;
		if (remove in req.body)
			qb.del();
		else
			qb.update(req.body);
		qb.then(rows => {
			res.json({
				success: true
			});
		});
	});
	
	app.post('/food', auth.checkToken, (req, res) => {
		req.body.uid = req.tokenData.uid;
		knex('food')
		.insert(req.body)
		.then(rows => {
			res.json({
				success: true
			});
		});
	});*/
	
	app.get('/meal', auth.checkToken, (req, res) => {
		knex('meal')
		.where({uid: req.tokenData.uid})
		.orderBy('consumed_at', 'desc')
		.then(rows => {
			res.json({
				success: true,
				results: rows
			});
		});
	});
	
	app.post('/meal', auth.checkToken, (req, res) => {
		req.body.uid = req.tokenData.uid;
		knex('meal')
		.insert(req.body, ['mid'])
		.then(rows => {
			res.json({
				success: true,
				mid: rows[0]
			});
		});
	});
	
	app.get('/meal/:mealID', auth.checkToken, (req, res) => {
		knex('meal')//FIXME also add calculated column
		.where({mid: req.params.mealID, uid: req.tokenData.uid})
		.then(rows => {
			res.json({
				success: true,
				meal: rows[0]
			});
		});
	});
	
	app.post('/meal/:mealID', auth.checkToken, (req, res) => {
		var qb = knex('meal')
		.where({mid: req.params.mealID, uid: req.tokenData.uid});
		if (req.body.remove)
			qb.del();
		else
			qb.update(req.body);
		qb.then(rows => {
			res.json({
				success: true
			});
		});
	});
	
	/*app.get('/stats', auth.checkToken, (req, res) => {
		knex('meal')//FIXME add calculated column for calories = servings * calories_per_serving
		.sum('calories')//might need to be a subquery, don't know with knex
		.innerJoin('food', 'meal.fid', 'food.fid')
		.where({"meal.uid": req.tokenData.uid})
		.andWhere('consumed_at', '>', knex.raw('DATE_SUB(now(), INTERVAL 1 YEAR)'))
		//.limit(req.body.limit)
		//.offset(req.body.offset)
		.orderBy('consumed_at', 'desc')
		.groupBy(knex.raw('WEEK(consumed_at)'))
		.then(rows => {
			res.json({
				success: true,
				results: rows
			});
		});
	});*/
};
