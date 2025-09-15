import User from "../models/User.js";

class AuthService {
	// Validate user registration data
	validateRegistrationData(name, email, password) {
		const errors = [];

		if (!name || !email || !password) {
			errors.push("Please provide name, email, and password");
		}

		if (password && password.length < 6) {
			errors.push("Password must be at least 6 characters long");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	// Check if user exists by email
	async checkUserExists(email) {
		const user = await User.findOne({ email });
		return user !== null;
	}

	// Create new user
	async createUser(name, email, password) {
		const user = new User({ name, email, password });
		await user.save();
		return user;
	}

	// Validate login credentials
	validateLoginData(email, password) {
		const errors = [];

		if (!email || !password) {
			errors.push("Please provide email and password");
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	// Authenticate user
	async authenticateUser(email, password) {
		const user = await User.findOne({ email });
		if (!user) {
			return { success: false, message: "Invalid email or password" };
		}

		const isPasswordValid = await user.comparePassword(password);
		if (!isPasswordValid) {
			return { success: false, message: "Invalid email or password" };
		}

		return { success: true, user };
	}

	// Get user by ID
	async getUserById(userId) {
		const user = await User.findById(userId).select("-password");
		return user;
	}

	// Format user response (remove sensitive data)
	formatUserResponse(user) {
		return {
			id: user._id,
			name: user.name,
			email: user.email,
		};
	}
}

export default new AuthService();
