package controllers

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import javax.inject.Inject
import play.api.cache._
import play.api.http.HeaderNames
import play.api.http.MimeTypes
import play.api.libs.json.{JsObject, JsValue, Json}
import play.api.libs.json.Json.toJsFieldJsValueWrapper
import play.api.libs.ws._
import play.api.mvc.{Action, AnyContent, BaseController, ControllerComponents}
import controllers.util.Auth0Config
import play.api.Configuration
import play.api.cache.SyncCacheApi
import model.api.users.{Users, _}
import model.dataModels.User
import play.api.db.DBApi

class CallbackController @Inject() (dbApi: DBApi, cache: DefaultSyncCacheApi, ws: WSClient, configuration: Configuration, cc: ControllerComponents) extends BaseController {
  override protected def controllerComponents: ControllerComponents = cc

  private val config = Auth0Config.get(configuration)

  private val userApi = new UsersFacade(dbApi)


  def callback(codeOpt: Option[String] = None, stateOpt: Option[String] = None): Action[AnyContent] = Action.async { request =>
    val sessionId = request.session.get("id").get
    println("sessionId = " + sessionId)
    if (stateOpt == cache.get(sessionId + "state")) {
      (for {
        code <- codeOpt
      } yield {
        getToken(code, sessionId).flatMap { case (idToken, accessToken) =>
          getUser(accessToken).map { user =>
            val id = request.session.get("id").get
            cache.set(request.session.get("id").get + "profile", user)
            println("profile page route")
            println(routes.ProfileController.profilePage)
            Redirect(routes.ProfileController.profilePage)
              .withSession(
                "idToken" -> idToken,
                "accessToken" -> accessToken,
                "id" -> id // TODO need to check if this is a safe way, passing the session id
              )
          }
        }.recover {
          case ex: IllegalStateException => Unauthorized(ex.getMessage)
        }
      }).getOrElse(Future.successful(BadRequest("No parameters supplied")))
    } else {
      Future.successful(BadRequest("Invalid state parameter"))
    }
  }

  def getToken(code: String, sessionId: String): Future[(String, String)] = {
    val tokenResponse = ws.url(String.format("https://%s/oauth/token", config.domain))
      .withHeaders(HeaderNames.ACCEPT -> MimeTypes.JSON)
      .post(
        Json.obj(
          "client_id" -> config.clientId,
          "client_secret" -> config.secret,
          "redirect_uri" -> config.callbackURL,
          "code" -> code,
          "grant_type"-> "authorization_code",
          "audience" -> config.audience
        )
      )

    tokenResponse.flatMap { response =>
      (for {
        idToken <- (response.json \ "id_token").asOpt[String]
        accessToken <- (response.json \ "access_token").asOpt[String]
      } yield {
        cache.set(sessionId + "id_token", idToken)
        cache.set(sessionId + "access_token", accessToken)
        Future.successful((idToken, accessToken))
      }).getOrElse(Future.failed[(String, String)](new IllegalStateException("Tokens not sent")))
    }
  }

  def getUser(accessToken: String): Future[JsValue] = {
    val userResponse = ws.url(String.format("https://%s/userinfo", config.domain))
      .withQueryString("access_token" -> accessToken)
      .get()

    userResponse.flatMap(response => {
      Future.successful(getExistingUserOrRegisterNewUser(response.json))
    })
  }

  def getExistingUserOrRegisterNewUser(userData: JsValue): JsValue = {
    val authOUserId = (userData \ "sub").as[String]
    if(Users.userExists(authOUserId)) {
      val user = Users.getByAuth0Id(authOUserId)
      if(user.nonEmpty)
        (userData.as[JsObject] + ("app_user_id" -> Json.toJson(user.get.id)))
      else
        userData
    } else {
      println((userData \ "name").as[String])
      val newUser =
        Users.register(
          fullName = (userData \ "name").as[String],
          auth0Id = authOUserId)
      (userData.as[JsObject] + ("app_user_id" -> Json.toJson(newUser.id)))
    }
  }

}