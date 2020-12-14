package model

import model.tables.Tables.BusinessesRow
import java.sql.Timestamp
import java.text.SimpleDateFormat
import play.api.libs.json._

class JsonFormats {

  implicit object timestampFormat extends Format[Timestamp] {

    val format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SS'Z'")

    def reads(json: JsValue) = {
      val str = json.as[String]
      JsSuccess(new Timestamp(format.parse(str).getTime))
    }

    def writes(ts: Timestamp) = JsString(format.format(ts))
  }


//  implicit val BusinessRowFormat = Json.format[BusinessesRow]
//  implicit val CustomersRowFormat = Json.format[Customers]
//  implicit val ProjectsRowFormat = Json.format[Projects]
//
//  implicit val TasksRowFormat = Json.format[TasksRow]
//  implicit val TaskcommentsRowFormat = Json.format[Taskcomments]
//  implicit val UsersRowFormat = Json.format[Users]

}


//def create(name: String, city: String, state: String, country: String): Future[Business] = db.run {
//  (businesses.map(b => (b.name, b.city, b.state, b.country))
//  returning businesses.map(_.id)
//  into ((businessDetails, id) => Business(id, businessDetails._1, businessDetails._2, businessDetails._3, businessDetails._4))
//  ) += (name, city, state, country)
//}
