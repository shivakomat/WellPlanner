package model.databases

import anorm.{Macro, RowParser, _}
import javax.inject.Inject
import model.dataModels.{Business, User}
import model.tools.AnormExtension._
import play.api.db.DBApi

@javax.inject.Singleton
class BusinessesDb @Inject() (dbApi: DBApi) extends PostgresDatabase(dbApi) with BusinessDbApi {

  val parser: RowParser[Business] = Macro.namedParser[Business]

  override def addNewBusiness(business: Business): Option[Long] = {
    println("Adding new Business insert statement")

    db.withConnection { implicit connection =>
      SQL("insert into businesses(name , city , phone_number, state, country, modified_date, created_date) " +
        "values ({name} , {city} , {phone_number}, {state}, {country}, {modified_date}, {created_date})")
        .on("name"  -> business.name, "city" -> business.city,
          "phone_number" -> business.phone_number, "state" -> business.state, "country" -> business.country,
          "modified_date" -> business.modified_date, "created_date" -> business.created_date)
        .executeInsert()
    }
  }

  override def list(): Seq[Business] =
    db.withConnection { implicit connection =>
      SQL("select * from businesses").as(parser.*)
    }

  def find(businessName: String): Option[Business] =
    db.withConnection { implicit connection =>
      SQL(s"select * from businesses where name = {businessName}")
        .on("businessName" -> businessName)
        .as(parser.singleOpt)
    }

  def existsByName(businessName: String): Boolean =
    find(businessName).nonEmpty


  def byId(businessId: Int): Option[Business] =
    db.withConnection { implicit connection =>
      SQL(s"select * from businesses where id = {id}")
        .on("id" -> businessId)
        .as(parser.singleOpt)
    }


}