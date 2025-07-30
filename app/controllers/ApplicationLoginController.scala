package controllers

import com.google.inject.Inject
import controllers.util.JsonFormats._
import controllers.util.ResponseTypes._
import model.api.businesses.AdminSignUpMessage
import model.api.users.{UsersApi, UsersFacade}
import pdi.jwt.{JwtAlgorithm, JwtJson}
import play.api.Logger
import play.api.db.DBApi
import scala.concurrent.ExecutionContext.Implicits.global
import play.api.libs.json.{JsValue, Json}
import play.api.libs.ws.WSClient
import play.api.mvc._

import scala.collection.immutable.Seq
import scala.concurrent.Future

class ApplicationLoginController  @Inject() (dbApi: DBApi, cc: ControllerComponents) extends AbstractController(cc) {
  private val jwtSecret = "wellplanner-jwt-sceret"
  private val logger = Logger(this.getClass)

  private val usersApi = new UsersFacade(dbApi)

  private def badRequest: Future[Result] =
    Future.successful(errorResponse(BAD_REQUEST, Seq("Unable to recognize request")))

  def logingSuccess(data: String) =
    logger.info(s"Successfully logged in: \n { $data } ")

  def loginUser: Action[JsValue] = Action(parse.json) { request =>
    val json = request.body
    (json \ "user_email").asOpt[String].flatMap { username =>
      (json \ "user_password").asOpt[String].flatMap { password =>
        usersApi.login(username, password) flatMap { user =>
          val token = JwtJson.encode(
            Json.obj("id" -> user.id, "username" -> user.username),
            jwtSecret,
            JwtAlgorithm.HS256
          )
          Some(Ok(Json.obj("token" -> token)))
        }
      }
    }.getOrElse {
      Unauthorized(Json.obj("error" -> "Invalid credentials"))
    }
  }

}
