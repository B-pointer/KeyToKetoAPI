module.exports = function (config, knex, auth, app) {
	app.post('/login', (req, res) => {
		if (!req.body.username || !req.body.password) {
			return res.json({
				success: false,
				message: 'Must submit username and password'
			});
		}
		
		knex('user').where({username: req.body.username}).select('uid', 'password')
		var token = auth.signToken({uid:1234});
		res.json({
			success: true,
			token: token
		});
	});

	app.get('/profile', auth.checkToken, (req, res) => {
		res.json({
			success: true,
			message: 'Profile data here'
		});
	});
};
