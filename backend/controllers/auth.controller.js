import authService from "../services/auth.service.js";

class AuthController {
	// Register user
	async register(req, res) {
		try {
			const { name, email, password } = req.body;

			// Validate input data
			const validation = authService.validateRegistrationData(name, email, password);
			if (!validation.isValid) {
				return res.status(400).json({
					success: false,
					message: validation.errors.join(", "),
				});
			}

			// Check if user already exists
			const userExists = await authService.checkUserExists(email);
			if (userExists) {
				return res.status(400).json({
					success: false,
					message: "User with this email already exists",
				});
			}

			// Create new user
			const user = await authService.createUser(name, email, password);

			// Set session
			req.session.userId = user._id;
			req.session.isAuthenticated = true;

			res.status(201).json({
				success: true,
				message: "User registered successfully",
				user: authService.formatUserResponse(user),
			});
		} catch (error) {
			console.error("Registration error:", error);
			res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	}

	// Login user
	async login(req, res) {
		try {
			const { email, password } = req.body;

			// Validate input data
			const validation = authService.validateLoginData(email, password);
			if (!validation.isValid) {
				return res.status(400).json({
					success: false,
					message: validation.errors.join(", "),
				});
			}

			// Authenticate user
			const authResult = await authService.authenticateUser(email, password);
			if (!authResult.success) {
				return res.status(401).json({
					success: false,
					message: authResult.message,
				});
			}

			// Set session
			req.session.userId = authResult.user._id;
			req.session.isAuthenticated = true;

			res.json({
				success: true,
				message: "Login successful",
				user: authService.formatUserResponse(authResult.user),
			});
		} catch (error) {
			console.error("Login error:", error);
			res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	}

	// Logout user
	async logout(req, res) {
		req.session.destroy((err) => {
			if (err) {
				return res.status(500).json({
					success: false,
					message: "Could not log out",
				});
			}
			res.clearCookie("connect.sid");
			res.json({
				success: true,
				message: "Logout successful",
			});
		});
	}

	// Get current user
	async getCurrentUser(req, res) {
		try {
			if (!req.session.isAuthenticated || !req.session.userId) {
				return res.status(401).json({
					success: false,
					message: "Not authenticated",
				});
			}

			const user = await authService.getUserById(req.session.userId);
			if (!user) {
				return res.status(404).json({
					success: false,
					message: "User not found",
				});
			}

			res.json({
				success: true,
				user: authService.formatUserResponse(user),
			});
		} catch (error) {
			console.error("Get user error:", error);
			res.status(500).json({
				success: false,
				message: "Internal server error",
			});
		}
	}
}

export default new AuthController();
