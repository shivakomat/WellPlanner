error id: file://<WORKSPACE>/app/model/api/businesses/BusinessesApi.scala:scala/package.Right.
file://<WORKSPACE>/app/model/api/businesses/BusinessesApi.scala
empty definition using pc, found symbol in pc: scala/package.Right.
empty definition using semanticdb
empty definition using fallback
non-local guesses:

offset: 1950
uri: file://<WORKSPACE>/app/model/api/businesses/BusinessesApi.scala
text:
```scala
package model.api.businesses

import model.api.users.{UsersApi, UsersFacade}
import model.dataModels.{Business, TeamMember, User}
import model.databases.{BusinessesDb, TeamsDbApi, TeamsDbFacade}
import model.tools.{DateTimeNow, PasswordProtector}
import org.joda.time.DateTime
import play.api.db.DBApi
import play.api.libs.ws.WSClient

class BusinessesApi(dbApi: DBApi, ws: WSClient) {

  val businessesDb: BusinessesDb =  new BusinessesDb(dbApi)
  val usersApi: UsersApi = new UsersFacade(dbApi)
  val teamsApi: TeamsDbApi =  new TeamsDbFacade(dbApi)

  def signUpBusiness(newBusiness: AdminSignUpMessage): Either[String, (Business, User)] = {

      println("Business Sign up process for new business -> " + AdminSignUpMessage.toString())

      def registerBusiness: Option[Business] = {
        val business =
          Business(name = newBusiness.businessName, email = newBusiness.email,  city = "N/A",
                   state = "N/A", phone_number = "", social_media_link = newBusiness.socialMediaUrl,
                   country = "N/A", modified_date = DateTimeNow.getCurrent, created_date = DateTimeNow.getCurrent)

        businessesDb
          .addNewBusiness(business)
          .map(id => business.copy(id = Some(id.toInt)))
      }

    def registerUser(newBusinessId: Int): Option[User] = {
        usersApi.register(User(username = newBusiness.email, user_auth_0_id = newBusiness.auth0Id,
                               password = PasswordProtector.md5HashString(newBusiness.password),
                               email = newBusiness.email, business_id = newBusinessId,
                               modified_date = DateTimeNow.getCurrent, created_date = DateTimeNow.getCurrent))
      }

      val businessRegistered = registerBusiness
      businessRegistered match {
        case Some(business) =>
          val userRegistered = registerUser(business.id.get)
          userRegistered match {
            case Some(user) => Rig@@ht((business, user))
            case None => 
              deleteBusiness(business.id.get)
              Left("Failed to Register User with business id: " + business.id.get + " and user informaiton: " + newBusiness.email)
          }
        case None => Left("Failed to Register Business Name")
      }

      val result = for {
         businessRegistered <- registerBusiness
         println(businessRegistered)
         userRegistered <- registerUser(businessRegistered.id.get)
         println(userRegistered)
        } yield Right((businessRegistered, userRegistered))

      result.getOrElse(Left("Failed to Register"))
  }

  def businessExists(businessName: String): Boolean = {
    businessesDb.existsByName(businessName)
  }

  def businessInfo(businessId: Int): Option[Business] = {
    businessesDb.byId(businessId)
  }


  def updateBusinessInfoBy(updatedBusiness: Business): Either[String, Business] = {
    val updatedRows = businessesDb.updateBusinessInfo(updatedBusiness)
    if(updatedRows == 1) {
      val updatedClient = businessesDb.byId(updatedBusiness.id.get)
      Right(updatedClient.get)
    } else
      Left("Failed during database update or reading the updated business info back from database")
  }

  def addTeamMemberToBusiness(teamMember: TeamMember): Either[String, TeamMember] = {
    val teamMemberAdded =
      teamsApi.addNewTeamMember(teamMember.copy(modified_date = Some(DateTimeNow.getCurrent),
                                                created_date = Some(DateTimeNow.getCurrent)))
    val updatedTeam =
      for {
        id <- teamMemberAdded
        team <- teamsApi.byBusinessIdAndMemberId(teamMember.business_id, id.toInt)
      } yield team

    if(updatedTeam.nonEmpty) Right(updatedTeam.get)
    else Left("failed during database insertion or reading the newly created data")
  }

  def getAllTeamMembers(businessId: Int): Seq[TeamMember] =
    teamsApi.list(businessId)


  def updateTeamMemberBy(updatedTeamMember: TeamMember): Either[String, TeamMember] = {
    val updatedRows = teamsApi.updateTeamMemberBy(updatedTeamMember)
    if(updatedRows == 1) {
      val updatedMember = teamsApi.byBusinessIdAndMemberId(updatedTeamMember.business_id, updatedTeamMember.id.get)
      Right(updatedMember.get)
    } else
      Left("Failed during database update or reading the updated team member info back from database")
  }


}
```


#### Short summary: 

empty definition using pc, found symbol in pc: scala/package.Right.