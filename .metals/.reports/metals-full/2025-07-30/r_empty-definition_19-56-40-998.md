error id: file://<WORKSPACE>/app/model/databases/BusinessesDb.scala:`<none>`.
file://<WORKSPACE>/app/model/databases/BusinessesDb.scala
empty definition using pc, found symbol in pc: `<none>`.
empty definition using semanticdb
empty definition using fallback
non-local guesses:
	 -anorm/business/about.
	 -anorm/business/about#
	 -anorm/business/about().
	 -model/tools/AnormExtension.business.about.
	 -model/tools/AnormExtension.business.about#
	 -model/tools/AnormExtension.business.about().
	 -business/about.
	 -business/about#
	 -business/about().
	 -scala/Predef.business.about.
	 -scala/Predef.business.about#
	 -scala/Predef.business.about().
offset: 2725
uri: file://<WORKSPACE>/app/model/databases/BusinessesDb.scala
text:
```scala
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
      SQL("insert into businesses(\"name\", \"city\", \"email\", \"phone_number\", \"social_media_link\", \"state\", \"country\", \"modified_date\", \"created_date\") " +
        "values ({name}, {city}, {email}, {phone_number}, {social_media_link}, {state}, {country}, {modified_date}, {created_date})")
        .on("name"  -> business.name, "city" -> business.city,
          "email" -> business.email, "phone_number" -> business.phone_number, "social_media_link" -> business.social_media_link, "state" -> business.state, "country" -> business.country,
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


  def byId(businessId: Int): Option[Business] = {
    println("Business id: " + businessId)
    db.withConnection { implicit connection =>
      SQL(s"select * from businesses where id = {id}")
        .on("id" -> businessId)
        .as(parser.singleOpt)
    }
  }

  def deleteBusiness(id: Int): Int = 
    db.withConnection { implicit connection =>
      SQL("delete from businesses where id = {id}")
        .on("id" -> id)
        .executeUpdate()
    }

  def updateBusinessInfo(business: Business): Int = 
    db.withConnection { implicit connection =>
      SQL("update businesses set name = {name}," +
        " about = {about}, email = {email}, city = {city}, phone_number = {phone_number}, social_media_link = {social_media_link}," +
        " state = {state}, country = {country}, modified_date = {modified_date}, created_date = {created_date}" +
        " where id = {business_id}")
        .on("name"  -> business.name, "email" -> business.email, "city" -> business.city,
          "about" -> business.a@@bout, "phone_number" -> business.phone_number, "social_media_link" -> business.social_media_link,
          "state" -> business.state, "country" -> business.country, "modified_date" -> business.modified_date,
          "created_date" -> business.created_date, "business_id" -> business.id)
        .executeUpdate()
    }

}
```


#### Short summary: 

empty definition using pc, found symbol in pc: `<none>`.