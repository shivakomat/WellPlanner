package controllers.actions

import javax.inject.{Inject, Singleton}
import play.api.mvc._
import play.api.libs.json.Json
import services.AuthService
import scala.concurrent.{ExecutionContext, Future}
import controllers.util.ResponseTypes.errorResponse
import play.api.http.Status._

case class AuthenticatedRequest[A](
  userId: Int,
  username: String,
  businessId: Int,
  isAdmin: Boolean,
  token: String,
  request: Request[A]
) extends WrappedRequest[A](request)

@Singleton
class AuthAction @Inject()(
  authService: AuthService,
  parser: BodyParsers.Default
)(implicit ec: ExecutionContext) extends ActionBuilder[AuthenticatedRequest, AnyContent] {

  override def executionContext: ExecutionContext = ec
  override def parser: BodyParser[AnyContent] = parser

  override def invokeBlock[A](request: Request[A], block: AuthenticatedRequest[A] => Future[Result]): Future[Result] = {
    extractToken(request) match {
      case Some(token) =>
        authService.validateToken(token) match {
          case Some(payload) =>
            val userId = (payload \ "userId").as[Int]
            val username = (payload \ "username").as[String]
            val businessId = (payload \ "businessId").as[Int]
            val isAdmin = (payload \ "isAdmin").as[Boolean]
            
            val authenticatedRequest = AuthenticatedRequest(userId, username, businessId, isAdmin, token, request)
            block(authenticatedRequest)
          case None =>
            Future.successful(errorResponse(UNAUTHORIZED, Seq("Invalid or expired token")))
        }
      case None =>
        Future.successful(errorResponse(UNAUTHORIZED, Seq("Authentication token required")))
    }
  }

  private def extractToken(request: RequestHeader): Option[String] = {
    request.headers.get("Authorization").flatMap { authHeader =>
      if (authHeader.startsWith("Bearer ")) {
        Some(authHeader.substring(7))
      } else {
        None
      }
    }
  }
}

@Singleton
class AdminAction @Inject()(
  authAction: AuthAction
)(implicit ec: ExecutionContext) extends ActionBuilder[AuthenticatedRequest, AnyContent] {

  override def executionContext: ExecutionContext = ec
  override def parser: BodyParser[AnyContent] = authAction.parser

  override def invokeBlock[A](request: Request[A], block: AuthenticatedRequest[A] => Future[Result]): Future[Result] = {
    authAction.invokeBlock(request, { authRequest: AuthenticatedRequest[A] =>
      if (authRequest.isAdmin) {
        block(authRequest)
      } else {
        Future.successful(errorResponse(FORBIDDEN, Seq("Admin access required")))
      }
    })
  }
}
