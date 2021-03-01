package model.databases

import anorm.{Macro, RowParser, SQL}
import javax.inject.Inject
import model.dataModels.Payment
import play.api.db.DBApi

class PaymentsDbApi @Inject() (dbApi: DBApi) extends PostgresDatabase(dbApi) {

  val paymentsParser: RowParser[Payment] = Macro.namedParser[Payment]

  def addPayment(payment: Payment): Option[Long] =
    db.withConnection { implicit connection =>
      SQL("insert into payment(budget_id , business_id, project_id, payment_amount, payment_date, modified_date, created_date) " +
        "values ({budget_id} , {business_id} , {project_id}, {payment_amount}, {payment_date}, {modified_date}, {created_date})")
        .on("budget_id"  -> payment.budget_id, "project_id" -> payment.project_id,  "business_id" -> payment.business_id,
          "payment_amount"  -> payment.payment_amount, "payment_date" -> payment.payment_date,
          "modified_date" -> payment.modified_date, "created_date" -> payment.created_date)
        .executeInsert()
    }

  def byId(paymentId: Long): Option[Payment] =
    db.withConnection { implicit connection =>
      SQL("select * from  payments where id = {id}").on("id" -> paymentId).as(paymentsParser.singleOpt)
    }

  def allPayments(): Seq[Payment] =
    db.withConnection { implicit connection =>
      SQL("select * from  payments").as(paymentsParser.*)
    }


  def updatePayment(updatedPayment: Payment): Int =
    db.withConnection { implicit connection =>
      SQL("update payment set payment_amount = {payment_amount}, payment_date = {payment_date}," +
        " modified_date = {modified_date} where id = {id} and budget_id = {budget_id}")
        .on("payment_amount" -> updatedPayment.payment_amount, "payment_date"  -> updatedPayment.payment_date,
          "modified_date" -> updatedPayment.modified_date, "id" -> updatedPayment.id, "budget_id" -> updatedPayment.budget_id)
        .executeUpdate()
    }

  def deletePayment(id: Long, projectId: Long, businessId: Long, budgetId: Long): Int =
    db.withConnection { implicit connection =>
      SQL("delete from budget_breakdowns where id = {id} and business_id = {business_id} and budget_id = {budgetId}")
        .on("id" -> id, "projectId" -> projectId, "business_id" -> businessId, "budgetId" -> budgetId)
        .executeUpdate()
    }
}