package services

import javax.inject.{Inject, Singleton}
import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Base64
import pdi.jwt.{JwtAlgorithm, JwtClaim, JwtJson}
import play.api.Configuration
import play.api.libs.json.{Json, JsObject}
import scala.util.{Success, Failure, Try}
import org.joda.time.DateTime

@Singleton
class AuthService @Inject()(config: Configuration) {

  private val secretKey = config.get[String]("play.http.secret.key")
  private val algorithm = JwtAlgorithm.HS256
  private val tokenExpirationHours = 24 // Token expires in 24 hours

  /**
   * Hash a password with salt using SHA-256
   */
  def hashPassword(password: String, salt: String): String = {
    val md = MessageDigest.getInstance("SHA-256")
    md.update((password + salt).getBytes("UTF-8"))
    Base64.getEncoder.encodeToString(md.digest())
  }

  /**
   * Generate a random salt
   */
  def generateSalt(): String = {
    val random = new SecureRandom()
    val saltBytes = new Array[Byte](16)
    random.nextBytes(saltBytes)
    Base64.getEncoder.encodeToString(saltBytes)
  }

  /**
   * Verify a password against its hash
   */
  def verifyPassword(password: String, hash: String, salt: String): Boolean = {
    val computedHash = hashPassword(password, salt)
    computedHash == hash
  }

  /**
   * Generate a JWT token for a user
   */
  def generateToken(userId: Int, username: String, businessId: Int, isAdmin: Boolean): String = {
    val now = DateTime.now()
    val expiration = now.plusHours(tokenExpirationHours)
    
    val claim = JwtClaim(
      content = Json.stringify(Json.obj(
        "userId" -> userId,
        "username" -> username,
        "businessId" -> businessId,
        "isAdmin" -> isAdmin,
        "iat" -> now.getMillis / 1000,
        "exp" -> expiration.getMillis / 1000
      )),
      issuedAt = Some(now.getMillis / 1000),
      expiration = Some(expiration.getMillis / 1000)
    )
    
    JwtJson.encode(claim, secretKey, algorithm)
  }

  /**
   * Validate and decode a JWT token
   */
  def validateToken(token: String): Option[JsObject] = {
    JwtJson.decodeJson(token, secretKey, Seq(algorithm)) match {
      case Success(payload) =>
        Try(payload.as[JsObject]).toOption
      case Failure(_) =>
        None
    }
  }

  /**
   * Extract user ID from token
   */
  def getUserIdFromToken(token: String): Option[Int] = {
    validateToken(token).flatMap { payload =>
      (payload \ "userId").asOpt[Int]
    }
  }

  /**
   * Extract username from token
   */
  def getUsernameFromToken(token: String): Option[String] = {
    validateToken(token).flatMap { payload =>
      (payload \ "username").asOpt[String]
    }
  }

  /**
   * Check if user is admin from token
   */
  def isAdminFromToken(token: String): Boolean = {
    validateToken(token).flatMap { payload =>
      (payload \ "isAdmin").asOpt[Boolean]
    }.getOrElse(false)
  }
}
