package model.dataModels

case class VendorBuckets(id: Option[Int] = None, business_id: Int, bucket_name: String, bucket_type: String,
                         budget_amount: Int, modified_date: Int, created_date: Int)