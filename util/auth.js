var jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
	generateJwt: async (user, next) => {
		try {
			var payload = { userId: user._id };
			var token = await jwt.sign(payload, process.env.SECRET);
			console.log(process.env.SECRET);
			return token;
		} catch (error) {
			next(error);
		}
	},
	validateJwt: async (req, res, next) => {
		try {
			var token = req.headers["authorization"] || "";
			if (!token && !req.isGuestAllowed) {
				return res.status(401).json({ message: "token required" });
			}
			console.log(token);
			let payload = jwt.verify(token, process.env.SECRET);
			console.log("Payload: ",payload);
			req.userId = payload.userId;
			next();
			console.log(process.env.SECRET);
		} catch (error) {
			if(req.isGuestAllowed) {
				next();
			} else {
				return res
					.status(401)
					.json({ error: error.message || "something went wrong" });
			}
		}
	},
	
	allowGuest: (req, res, next) => {
		req.isGuestAllowed = true;
		next();
	}
};
