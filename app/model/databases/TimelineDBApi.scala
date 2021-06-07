package model.databases

import anorm.{Macro, RowParser, SQL}
import javax.inject.Inject
import model.dataModels.TimelineItem
import play.api.db.DBApi

class TimelineDBApi @Inject() (dbApi: DBApi) extends PostgresDatabase(dbApi) {

  val timelineItemParser: RowParser[TimelineItem] = Macro.namedParser[TimelineItem]

  def addTimelineItem(timelineItem: TimelineItem): Option[Long] =
    db.withConnection { implicit connection =>
      SQL("insert into timeline_items(business_id, project_id, parent_id, time, date, duration, description, contact, category, notes, is_completed, modified_date, created_date) " +
        "values ({business_id} , {project_id}, {parent_id}, {time}, {date}, {duration}, {description}, {contact}, {category}, {notes}, {is_completed}, {modified_date}, {created_date})")
        .on("project_id" -> timelineItem.project_id,  "business_id" -> timelineItem.business_id, "parent_id" -> timelineItem.parent_id,
          "time" -> timelineItem.time, "date" -> timelineItem.date,  "duration"  -> timelineItem.duration,
          "description" -> timelineItem.description, "contact" -> timelineItem.contact, "category" -> timelineItem.category,
          "notes" -> timelineItem.notes, "is_completed" -> timelineItem.is_completed, "modified_date" -> timelineItem.modified_date, "created_date" -> timelineItem.created_date)
        .executeInsert()
    }

  def byId(timelineItemId: Long): Option[TimelineItem] =
    db.withConnection { implicit connection =>
      SQL("select * from  timeline_items where id = {id}").on("id" -> timelineItemId).as(timelineItemParser.singleOpt)
    }

  def allItems(): Seq[TimelineItem] =
    db.withConnection { implicit connection =>
      SQL("select * from  timeline_items").as(timelineItemParser.*)
    }


  def timelineBy(businessId: Int, projectId: Int): Seq[TimelineItem] =
    allItems().filter(item => (item.business_id == businessId && item.project_id == projectId))


  def updateItem(updatedTimelineItem: TimelineItem): Int =
    db.withConnection { implicit connection =>
      SQL("update timeline_items set time = {time}, date = {date}, duration = {duration}, description = {description}, " +
        "contact = {contact}, category = {category}, notes = {notes}, is_completed = {is_completed}, modified_date = {modified_date} where id = {id} and business_id = {business_id} and project_id = {project_id}")
        .on("time" -> updatedTimelineItem.time, "date"  -> updatedTimelineItem.date, "duration" -> updatedTimelineItem.duration, "description" -> updatedTimelineItem.description,
          "contact" -> updatedTimelineItem.contact, "category" -> updatedTimelineItem.category, "notes" -> updatedTimelineItem.notes, "id" -> updatedTimelineItem.id, "project_id" -> updatedTimelineItem.project_id,
          "business_id" -> updatedTimelineItem.business_id, "is_completed" -> updatedTimelineItem.is_completed,
          "modified_date" -> updatedTimelineItem.modified_date, "created_date" -> updatedTimelineItem.created_date)
        .executeUpdate()
    }

  def deleteTimelineItem(id: Long, projectId: Long, businessId: Long): Int =
    db.withConnection { implicit connection =>
      SQL("delete from timeline_items where id = {id} and business_id = {business_id} and project_id = {project_id}")
        .on("id" -> id, "project_id" -> projectId, "business_id" -> businessId)
        .executeUpdate()
    }
}
