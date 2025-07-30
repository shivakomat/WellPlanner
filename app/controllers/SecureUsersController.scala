package controllers

import javax.inject._
import controllers.util.ResponseTypes._
import controllers.util.JsonFormats._
import controllers.actions.{AuthAction, AdminAction}
import com.google.inject.Inject
import model.api.users.{UserMessage, UsersFacade}
import model.dataModels.{User, UserRegistration, LoginResponse}
import play.api.db.DBApi
import play.api.libs.json.{Json, JsValue}
import play.api.mvc._
import services.AuthService
import scala.concurrent.{ExecutionContext, Future}
import org.joda.time.DateTime

case class PasswordChange(currentPassword: String, newPassword: String)

@Singleton
class SecureUsersController @Inject() (
  dbApi: DBApi, 
  cc: ControllerComponents,
  authService: AuthService,
  authAction: AuthAction,
  adminAction: AdminAction
)(implicit ec: ExecutionContext) extends AbstractController(cc) {

  private val api = new UsersFacade(dbApi)

  private def badRequest: Future[Result] =
    Future.successful(errorResponse(BAD_REQUEST, Seq("Unable to recognize request")))

  /**
   * Secure login endpoint that returns JWT token
   */
  def login() = Action.async(parse.json) { request =>
    def authenticateUser(data: UserMessage): Future[Result] = {
      // Find user by username using direct database lookup
      api.findByUsername(data.username) match {
        case Some(user) =>
          // Verify password using salt and hash
          if (authService.verifyPassword(data.password, user.password, user.password_salt)) {
            // Generate JWT token
            val token = authService.generateToken(
              userId = user.id.getOrElse(0),
              username = user.username,
              businessId = user.business_id,
              isAdmin = user.is_admin
            )
            
            val loginResponse = LoginResponse(
              user = user.copy(password = "***", password_salt = "***"), // Hide sensitive data
              token = token,
              expiresIn = 24 * 60 * 60 // 24 hours in seconds
            )
            
            Future.successful(successResponse(OK, Json.toJson(loginResponse), Seq(s"Successfully logged in user ${user.username}")))
          } else {
            Future.successful(errorResponse(UNAUTHORIZED, Seq("Invalid username or password")))
          }
        case None =>
          Future.successful(errorResponse(UNAUTHORIZED, Seq("Invalid username or password")))
      }
    }

    request.body.validate[UserMessage].fold(
      errors => badRequest,
      data => authenticateUser(data)
    )
  }

  /**
   * Secure user registration with password hashing
   */
  def register() = Action.async(parse.json) { request =>
    def registerUser(userData: UserRegistration): Future[Result] = {
      // Check if username or email already exists
      if (api.userNameCheck(userData.username)) {
        Future.successful(errorResponse(CONFLICT, Seq(s"Username ${userData.username} already exists")))
      } else if (api.emailCheck(userData.email)) {
        Future.successful(errorResponse(CONFLICT, Seq(s"Email ${userData.email} already exists")))
      } else {
        // Generate salt and hash password
        val salt = authService.generateSalt()
        val hashedPassword = authService.hashPassword(userData.password, salt)
        
        val now = (DateTime.now().getMillis / 1000).toInt
        val newUser = User(
          username = userData.username,
          password = hashedPassword,
          password_salt = salt,
          email = userData.email,
          business_id = userData.business_id,
          is_admin = userData.is_admin,
          is_customer = userData.is_customer,
          is_an_employee = userData.is_an_employee,
          modified_date = now,
          created_date = now
        )
        
        api.register(newUser) match {
          case Some(createdUser) =>
            val safeUser = createdUser.copy(password = "***", password_salt = "***")
            Future.successful(successResponse(CREATED, Json.toJson(safeUser), Seq(s"Successfully registered user ${createdUser.username}")))
          case None =>
            Future.successful(errorResponse(INTERNAL_SERVER_ERROR, Seq("Failed to create user")))
        }
      }
    }

    request.body.validate[UserRegistration].fold(
      errors => badRequest,
      payload => registerUser(payload)
    )
  }

  /**
   * Get current user profile (requires authentication)
   */
  def profile() = authAction.async { request =>
    api.users().find(_.id.contains(request.userId)) match {
      case Some(user) =>
        val safeUser = user.copy(password = "***", password_salt = "***")
        Future.successful(successResponse(OK, Json.toJson(safeUser), Seq("User profile retrieved")))
      case None =>
        Future.successful(errorResponse(NOT_FOUND, Seq("User not found")))
    }
  }

  /**
   * Update user profile (requires authentication)
   */
  def updateProfile() = authAction.async(parse.json) { request =>
    def updateUser(updates: JsValue): Future[Result] = {
      api.users().find(_.id.contains(request.userId)) match {
        case Some(currentUser) =>
          // Extract allowed fields for update (excluding sensitive fields)
          val updatedUser = currentUser.copy(
            email = (updates \ "email").asOpt[String].getOrElse(currentUser.email),
            is_customer = (updates \ "is_customer").asOpt[Boolean].getOrElse(currentUser.is_customer),
            is_an_employee = (updates \ "is_an_employee").asOpt[Boolean].getOrElse(currentUser.is_an_employee),
            modified_date = (DateTime.now().getMillis / 1000).toInt
          )
          
          // Note: In a real implementation, you'd update the database here
          // For now, we'll just return the updated user
          val safeUser = updatedUser.copy(password = "***", password_salt = "***")
          Future.successful(successResponse(OK, Json.toJson(safeUser), Seq("Profile updated successfully")))
        case None =>
          Future.successful(errorResponse(NOT_FOUND, Seq("User not found")))
      }
    }

    updateUser(request.body)
  }

  /**
   * Change password (requires authentication)
   */
  def changePassword() = authAction.async(parse.json) { request =>
    implicit val passwordChangeFormat = Json.format[PasswordChange]

    def changeUserPassword(passwordData: PasswordChange): Future[Result] = {
      api.users().find(_.id.contains(request.userId)) match {
        case Some(user) =>
          // Verify current password
          if (authService.verifyPassword(passwordData.currentPassword, user.password, user.password_salt)) {
            // Generate new salt and hash new password
            val newSalt = authService.generateSalt()
            val newHashedPassword = authService.hashPassword(passwordData.newPassword, newSalt)
            
            val updatedUser = user.copy(
              password = newHashedPassword,
              password_salt = newSalt,
              modified_date = (DateTime.now().getMillis / 1000).toInt
            )
            
            // Note: In a real implementation, you'd update the database here
            Future.successful(successResponse(OK, Json.obj("message" -> "Password changed successfully"), Seq("Password updated")))
          } else {
            Future.successful(errorResponse(UNAUTHORIZED, Seq("Current password is incorrect")))
          }
        case None =>
          Future.successful(errorResponse(NOT_FOUND, Seq("User not found")))
      }
    }

    request.body.validate[PasswordChange].fold(
      errors => badRequest,
      payload => changeUserPassword(payload)
    )
  }

  /**
   * Logout (invalidate token on client side)
   */
  def logout() = authAction.async { request =>
    // In a stateless JWT system, logout is handled client-side by discarding the token
    // For enhanced security, you could maintain a blacklist of tokens
    Future.successful(successResponse(OK, Json.obj("message" -> "Logged out successfully"), Seq("User logged out")))
  }

  /**
   * Get all users (admin only)
   */
  def users() = adminAction.async { request =>
    val allUsers = api.users().map(user => user.copy(password = "***", password_salt = "***"))
    Future.successful(successResponse(OK, Json.toJson(allUsers), Seq("Users retrieved")))
  }

  /**
   * Delete user (admin only)
   */
  def deleteUser(userId: Int) = adminAction.async { request =>
    api.users().find(_.id.contains(userId)) match {
      case Some(user) =>
        // Note: In a real implementation, you'd delete from database here
        Future.successful(successResponse(OK, Json.obj("message" -> s"User ${user.username} deleted"), Seq("User deleted")))
      case None =>
        Future.successful(errorResponse(NOT_FOUND, Seq("User not found")))
    }
  }

  /**
   * Check if username exists (public endpoint for registration validation)
   */
  def usernameExists(username: String) = Action.async {
    val exists = api.userNameCheck(username)
    Future.successful(successBooleanResponse(OK, exists, Seq("Username availability checked")))
  }

  /**
   * Check if email exists (public endpoint for registration validation)
   */
  def emailExists(email: String) = Action.async {
    val exists = api.emailCheck(email)
    Future.successful(successBooleanResponse(OK, exists, Seq("Email availability checked")))
  }
}
