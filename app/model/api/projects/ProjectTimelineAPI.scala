package model.api.projects

import model.dataModels.TimelineItem
import model.databases.TimelineDBApi
import model.tools.DateTimeNow
import play.api.db.DBApi
import play.api.libs.ws.WSClient

class ProjectTimelineAPI(dbApi: DBApi, ws: WSClient) {

  private val timelineItemsDb = new TimelineDBApi(dbApi)

  def timelineItemsByProject(projectId: Long, businessId: Long): Seq[TimelineItem] =
    timelineItemsDb.allItems().filter(t => t.business_id == businessId && t.project_id == projectId)


  def allTimelineItems(projectId: Long, businessId: Long): Seq[TimelineItemsList] = {
    val listOfTimelineItems = timelineItemsDb.allItems().filter(t => t.business_id == businessId && t.project_id == projectId)

    val mapOfParentTimelineItemsWithSubItems = listOfTimelineItems.groupBy(_.parent_id)
    val parentTimelineItems: Option[Seq[TimelineItem]] = mapOfParentTimelineItemsWithSubItems.get(None)

    if(parentTimelineItems.nonEmpty)
      parentTimelineItems.get.map(parentTimelineItem => TimelineItemsList(parent = parentTimelineItem, subItems = mapOfParentTimelineItemsWithSubItems.getOrElse(parentTimelineItem.id, Seq.empty[TimelineItem])))
    else
      Seq.empty[TimelineItemsList]
  }


  def addNewItem(item: TimelineItem): Either[String, TimelineItem] = {
    val newitemAdded =
      timelineItemsDb.addTimelineItem(item.copy(modified_date = Some(DateTimeNow.getCurrent), created_date = Some(DateTimeNow.getCurrent)))

    val newitem =
      for {  id <- newitemAdded
             item <- timelineItemsDb.byId(id)
             } yield (item)

    newitem match {
      case Some(_) => Right(newitem.get)
      case None => Left("failed during database insertion or reading the newly created data")
    }
  }

  def updateItem(updatedItem: TimelineItem): Either[String, TimelineItem] = {
    val updatedRows = timelineItemsDb.updateItem(updatedItem)
    if(updatedRows == 1) {
      val itemFromDb = timelineItemsDb.byId(updatedItem.id.get)
      Right(itemFromDb.get)
    } else
      Left("Failed during database update or reading the updated breakdown back from database")
  }

  def deleteTimelineItem(id: Long, projectId: Long, businessId: Long): Seq[TimelineItem] = {
    val rowsDeleted = timelineItemsDb.deleteTimelineItem(id, projectId, businessId)
    this.timelineItemsByProject(projectId, businessId)
  }

}
