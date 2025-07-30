package model.api.users

import javax.inject.Inject
import model.api.businesses.UsernameAndEmailCheckMessage
import model.dataModels.User
import model.databases.{UsersDbApi, UsersDbFacade}
import play.api.db.DBApi

@javax.inject.Singleton
class UsersFacade @Inject() (dbApi: DBApi) extends UsersApi {

  private val db: UsersDbApi = new UsersDbFacade(dbApi)

  override def userNameAndEmailCheck(username: String, email: String): UsernameAndEmailCheckMessage =
    UsernameAndEmailCheckMessage(usernameExists = db userNameExists(username), emailExists = db emailExists(email))

  override def userNameCheck(username: String): Boolean =
    db userNameExists(username)


  override def emailCheck(email: String): Boolean =
    db.emailExists(email)


  override def login(username: String, password: String): Option[User] =
    for {
      user <- db find(username, password)
      loggedInUser <- if(user.logged_in) db login(user.username, user.password) else None
    } yield loggedInUser

  override def logOff(username: String, password: String): Option[User] =
    for {
      user <- db find(username, password)
      loggedOffUser <- db logOff(user.username, user.password)
    } yield loggedOffUser

  override def register(newUser: User): Option[User] =
    db.add(newUser)

  override def users(): Seq[User] =
    db.list

  override def remove(userMessage: UserMessage): Option[String] =
    db.delete(userMessage.username, userMessage.password)


  override def byAuth0Id(id: String): Option[User] =
    db.byAuth0Id(id)

  def findByUsername(username: String): Option[User] =
    db.findByUsername(username)

}
