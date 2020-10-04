package model.databases

import anorm.{Macro, RowParser, SQL}
import javax.inject.Inject
import model.dataModels.TeamMember
import play.api.db.DBApi
import model.tools.AnormExtension._


@javax.inject.Singleton
class TeamsDbFacade @Inject() (dbApi: DBApi) extends PostgresDatabase(dbApi) with TeamsDbApi {

  val parser: RowParser[TeamMember] = Macro.namedParser[TeamMember]

  def addNewTeamMember(teamMember: TeamMember): Option[Long] =
    db.withConnection { implicit connection =>
      SQL("insert into teams(business_id , member_name, email, modified_date, created_date) " +
        "values ({business_id} , {member_name}, {email}, {modified_date}, {created_date})")
        .on("id"  -> teamMember.id,
          "business_id" -> teamMember.business_id,
          "member_name" -> teamMember.member_name,
          "email" -> teamMember.email,
          "modified_date" -> teamMember.modified_date,
          "created_date" -> teamMember.created_date)
        .executeInsert()
    }

  def list(businessId: Int): Seq[TeamMember] =
    db.withConnection { implicit connection =>
      SQL("select * from teams where business_id = {business_id}")
        .on("business_id" -> businessId).as(parser.*)
    }

  override def byBusinessIdAndMemberId(businessId: Int, memberId: Int): Option[TeamMember] =
    db.withConnection { implicit connection =>
      SQL("select * from teams where business_id = {business_id} and id = {member_id}")
        .on("business_id" -> businessId, "member_id" -> memberId)
        .as(parser.singleOpt)
    }

  override def updateTeamMemberBy(updatedTeamMember: TeamMember): Int =
    db.withConnection { implicit connection =>
      SQL("update teams set member_name = {member_name}, email = {email}, modified_date = {modified_date}" +
          " where id = {member_id} and business_id = {business_id}")
        .on("member_name" -> updatedTeamMember.member_name, "email" -> updatedTeamMember.email,
            "modified_date" -> updatedTeamMember.modified_date, "business_id" -> updatedTeamMember.business_id,
            "member_id" -> updatedTeamMember.id)
        .executeUpdate()
    }
}

