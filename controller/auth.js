const jwt = require('jsonwebtoken');

module.exports = function (config, knex) {
	var result = {};
	
	result.checkToken = function (req, res, next) {
		var token = req.headers['authorization'];
		
		if (!token || token.length < 8) {
			return res.json({//should make this a 403
				success: false,
				message: 'Must supply valid token'
			});
		}
		
		token.slice(7, token.length);
		
		jwt.verify(token, config.jwt.secret, (err, data) => {
			if (err)
				return res.json({//also change return type
					success: false,
					message: 'Invalid token, must login again'
				});
			
			req.tokenData = data;
			next();
		});
	};
	
	result.signToken = function (data) {
		return jwt.sign(data, config.jwt.secret, {expiresIn:config.jwt.expireTime});
	};
	
	return result;
};
