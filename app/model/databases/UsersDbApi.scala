package model.databases

import model.api.users.NewUserMessage
import model.dataModels.User

trait UsersDbApi  {

  def login(username: String, password: String): Option[User]

  def logOff(username: String, password: String): Option[User]

  def find(username: String, password: String): Option[User]

  def userNameExists(username: String): Boolean

  def byAuth0Id(auth0Id: String): Option[User]

  def emailExists(email: String): Boolean

  def add(user: User): Option[User]

  def list(): Seq[User]

  def delete(username: String, password: String): Option[String]

  def findByUsername(username: String): Option[User]

}
