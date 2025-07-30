package model.dataModels

import org.joda.time.DateTime

case class User(id: Option[Int] = None, 
                user_auth_0_id: String = "", // Keep for backward compatibility, but make optional
                username: String, 
                password: String, // This will store the hashed password
                password_salt: String = "", // Salt for password hashing
                logged_in: Boolean = false, // Keep for backward compatibility
                email: String, 
                business_id: Int = 1, 
                is_admin: Boolean = false,
                is_customer: Boolean = false, 
                is_an_employee: Boolean = false,
                modified_date: Int, 
                created_date: Int)

// Case class for user registration with plain text password
case class UserRegistration(username: String,
                           password: String, // Plain text password for registration
                           email: String,
                           business_id: Int = 1,
                           is_admin: Boolean = false,
                           is_customer: Boolean = false,
                           is_an_employee: Boolean = false)

// Case class for login response with token
case class LoginResponse(user: User, token: String, expiresIn: Long)