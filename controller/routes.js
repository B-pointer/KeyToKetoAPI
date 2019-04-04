const bcrypt = require('bcrypt');//we need to move this into auth later on FIXME

module.exports = function (config, knex, auth, app) {
	app.post('/login', (req, res) => {
		if (!req.body.username || !req.body.password) {
			return res.json({
				success: false,
				message: 'Must submit username and password'
			});
		}
		
		knex('user').where({username: req.body.username}).select('uid', 'password').then(result => {
			if (result.rows.length != 1) {
				return res.json({
					success: false,
					message: 'Invalid username or password'
				});
			}
			var user = result.rows[0];
			bcrypt.compare(req.body.password, user.password).then((match) => {
				if (match) {
					return res.json({
						success: true,
						token: auth.signToken({uid:user.uid})
					});
				}
				res.json({
					success: false,
					message: 'Invalid username or password'
				});
			});
		});
	});

	app.get('/profile', auth.checkToken, (req, res) => {
		res.json({
			success: true,
			message: 'Profile data here'
		});
	});
};
