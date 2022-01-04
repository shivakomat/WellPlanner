package model.api.projects

import model.dataModels.BudgetBreakdowns
import model.dataModels.Payment
import model.databases.{BudgetingDbApi, PaymentsDbApi}
import model.tools.DateTimeNow
import play.api.db.DBApi
import play.api.libs.ws.WSClient

class ProjectBudgetingAPI(dbApi: DBApi, ws: WSClient) {

  private val breakDownsDb = new BudgetingDbApi(dbApi)
  private val paymentsDb = new PaymentsDbApi(dbApi)

  def addPaymentToBudgetItem(payment: Payment): Either[String, Payment] = {
    val newPaymentAdded =
      paymentsDb.addPayment(payment.copy(modified_date = Some(DateTimeNow.getCurrent), created_date = Some(DateTimeNow.getCurrent)))
    val newPayment =
      for {
        id <- newPaymentAdded
        payment <- paymentsDb.byId(id)
      } yield (payment)

    newPayment match {
      case Some(_) => Right(newPayment.get)
      case None => Left("failed during database insertion or reading the newly created data")
    }
  }

  def updatePayment(updatedPayment: Payment): Either[String, Payment] = {
    val updatedRows = paymentsDb.updatePayment(updatedPayment)
    if(updatedRows == 1) {
      val paymentUpated = paymentsDb.byId(updatedPayment.id.get)
      Right(paymentUpated.get)
    } else
      Left("Failed during database update or reading the updated payment back from database")
  }

  def paymentsByBudgetItem(budgetId: Long, projectId: Long, businessId: Long): Seq[Payment] =
    paymentsDb.allPayments.filter(bd => bd.business_id == businessId && bd.project_id == projectId
                                  && bd.budget_id == budgetId)

  def paymentsByProject(projectId: Long, businessId: Long): Seq[Payment] =
    paymentsDb.allPayments.filter(bd => bd.business_id == businessId && bd.project_id == projectId)


  def budgetBreakdownsByProject(projectId: Long, businessId: Long): Seq[BudgetBreakdownList] = {
    val list = breakDownsDb.allBudgetBreakdowns().filter(bd => bd.business_id == businessId && bd.project_id == projectId)
    val listOfPayments = paymentsDb.allPaymentsByBusinessIdAndProjectId(businessId, projectId)

    val mapOfParentBudgetWithBreakdowns = list.groupBy(e => e.parent_budget_id)
    val parentBudgetBreakdowns = mapOfParentBudgetWithBreakdowns.get(None)

    if(parentBudgetBreakdowns.nonEmpty)
        parentBudgetBreakdowns.get.map(parentBudget => {
          val subBreakDowns = mapOfParentBudgetWithBreakdowns.getOrElse(parentBudget.id, Seq.empty[BudgetBreakdowns])
          val subBreakDownsWithPayments = subBreakDowns.map(subItem => {
            val payments = listOfPayments.filter(p => p.budget_id == subItem.id.get)
            SubBreakDownWithPayments(subItem, payments)
          })
          BudgetBreakdownList(parentBudget, subBreakDownsWithPayments)
        })
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

  def deletePayment(id: Long, projectId: Long, businessId: Long, budgetId: Long): Seq[Payment] = {
    val rowsDeleted = paymentsDb.deletePayment(id, projectId, businessId, budgetId)
    this.paymentsByBudgetItem(businessId, projectId, budgetId)
  }

}
