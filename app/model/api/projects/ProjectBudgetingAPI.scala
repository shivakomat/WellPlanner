package model.api.projects

import model.dataModels.BudgetBreakdowns
import model.databases.BudgetingDbApi
import model.tools.DateTimeNow
import play.api.db.DBApi
import play.api.libs.ws.WSClient

class ProjectBudgetingAPI(dbApi: DBApi, ws: WSClient) {

  private val breakDownsDb = new BudgetingDbApi(dbApi)

  def budgetBreakdownsByProject(projectId: Long, businessId: Long): Seq[BudgetBreakdownList] = {
    val list = breakDownsDb.allBudgetBreakdowns()
    list
      .groupBy(e => e.parent_budget_id)
      .flatMap(b => {
        if(b._1.get > 0) Some(BudgetBreakdownList(breakDown = list.find(e => e.id.get == b._1.get).get, subBreakDowns = b._2))
        else None
      })
      .toSeq
  }

  def addNewBreakDown(breakDown: BudgetBreakdowns): Either[String, BudgetBreakdowns] = {
     val newBreakDownAdded =
       breakDownsDb.addNewBreakDown(breakDown.copy(modified_date = Some(DateTimeNow.getCurrent), created_date = Some(DateTimeNow.getCurrent)))

     val newBreakDown =
       for {  id <- newBreakDownAdded
         breakDown <- breakDownsDb.byBudgetBreakDownId(id)
       } yield (breakDown)

     newBreakDown match {
       case Some(_) => Right(newBreakDown.get)
       case None => Left("failed during database insertion or reading the newly created data")
     }
  }


  def deleteBreakDown(id: Long, projectId: Long, businessId: Long): Seq[BudgetBreakdownList] = {
    val rowsDeleted = breakDownsDb.deleteBudgetBreakDown(id, projectId, businessId)
    this.budgetBreakdownsByProject(projectId, businessId)
  }

}
