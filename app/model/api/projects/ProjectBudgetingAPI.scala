package model.api.projects

import model.dataModels.BudgetBreakdowns
import model.databases.BudgetingDbApi
import model.tools.DateTimeNow
import play.api.db.DBApi
import play.api.libs.ws.WSClient

class ProjectBudgetingAPI(dbApi: DBApi, ws: WSClient) {

  private val breakDownsDb = new BudgetingDbApi(dbApi)

  def budgetBreakdownsByProject(projectId: Long, businessId: Long): Seq[BudgetBreakdownList] = {
    val list = breakDownsDb.allBudgetBreakdowns().filter(bd => bd.business_id == businessId && bd.project_id == projectId)

    val mapOfParentBudgetWithBreakdowns = list.groupBy(e => e.parent_budget_id)
    val parentBudgetBreakdowns = mapOfParentBudgetWithBreakdowns.get(None)

    if(parentBudgetBreakdowns.nonEmpty)
        parentBudgetBreakdowns.get.map(parentBudget => BudgetBreakdownList(breakDown = parentBudget, subBreakDowns = mapOfParentBudgetWithBreakdowns.getOrElse(parentBudget.id, Seq.empty[BudgetBreakdowns])))
    else {
        Seq.empty[BudgetBreakdownList]
    }
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

  def updateBudgetBreakdown(updateBudgetbreakdown: BudgetBreakdowns): Either[String, BudgetBreakdowns] = {
    val updatedRows = breakDownsDb.updateBreakdownItem(updateBudgetbreakdown)
    if(updatedRows == 1) {
      val updatedClient = breakDownsDb.byBudgetBreakDownId(updateBudgetbreakdown.id.get)
      Right(updatedClient.get)
    } else
      Left("Failed during database update or reading the updated breakdown back from database")
  }

  def deleteBreakDown(id: Long, projectId: Long, businessId: Long): Seq[BudgetBreakdownList] = {
    val rowsDeleted = breakDownsDb.deleteBudgetBreakDown(id, projectId, businessId)
    this.budgetBreakdownsByProject(projectId, businessId)
  }

}
