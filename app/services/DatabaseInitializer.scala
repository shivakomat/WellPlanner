package services

import javax.inject.{Inject, Singleton}
import play.api.db.DBApi
import play.api.Logger
import anorm._
import scala.util.{Try, Success, Failure}

@Singleton
class DatabaseInitializer @Inject()(dbApi: DBApi, authService: AuthService) {

  private val logger = Logger(this.getClass)
  private val db = dbApi.database("default")

  def initializeDatabase(): Unit = {
    db.withConnection { implicit connection =>
      try {
        // Create businesses table if it doesn't exist
        createBusinessesTable()
        
        // Create users table if it doesn't exist
        createUsersTable()
        
        // Insert sample data
        insertSampleData()
        
        logger.info("Database initialization completed successfully")
      } catch {
        case e: Exception =>
          logger.error(s"Database initialization failed: ${e.getMessage}", e)
      }
    }
  }

  private def createBusinessesTable()(implicit connection: java.sql.Connection): Unit = {
    Try {
      SQL("""
        CREATE TABLE IF NOT EXISTS businesses (
          id INTEGER PRIMARY KEY,
          name VARCHAR(100),
          created_date INTEGER,
          modified_date INTEGER
        )
      """).execute()
      logger.info("Businesses table created/verified")
    } match {
      case Success(_) => // Success
      case Failure(e) => logger.warn(s"Error creating businesses table: ${e.getMessage}")
    }
  }

  private def createUsersTable()(implicit connection: java.sql.Connection): Unit = {
    Try {
      SQL("""
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER AUTO_INCREMENT PRIMARY KEY,
          user_auth_0_id VARCHAR(100) DEFAULT '',
          logged_in BOOLEAN DEFAULT false,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          password_salt VARCHAR(255) DEFAULT '',
          email VARCHAR(100) UNIQUE NOT NULL,
          business_id INTEGER DEFAULT 1,
          is_admin BOOLEAN DEFAULT false,
          is_customer BOOLEAN DEFAULT false,
          is_an_employee BOOLEAN DEFAULT false,
          modified_date INTEGER,
          created_date INTEGER
        )
      """).execute()
      logger.info("Users table created/verified")
    } match {
      case Success(_) => // Success
      case Failure(e) => logger.warn(s"Error creating users table: ${e.getMessage}")
    }
  }

  private def insertSampleData()(implicit connection: java.sql.Connection): Unit = {
    // Insert default business
    Try {
      val businessExists = SQL("SELECT COUNT(*) as count FROM businesses WHERE id = 1")
        .as(SqlParser.scalar[Long].single) > 0
      
      if (!businessExists) {
        SQL("""
          INSERT INTO businesses (id, name, created_date, modified_date)
          VALUES (1, 'Default Business', 20240127, 20240127)
        """).execute()
        logger.info("Default business inserted")
      }
    } match {
      case Success(_) => // Success
      case Failure(e) => logger.warn(s"Error inserting business data: ${e.getMessage}")
    }

    // Insert sample users with properly hashed passwords
    insertSampleUser("admin", "admin123", "admin@wellplanner.com", isAdmin = true)
    insertSampleUser("testuser", "password123", "testuser@wellplanner.com", isAdmin = false)
  }

  private def insertSampleUser(username: String, plainPassword: String, email: String, isAdmin: Boolean)(implicit connection: java.sql.Connection): Unit = {
    Try {
      val userExists = SQL("SELECT COUNT(*) as count FROM users WHERE username = {username}")
        .on("username" -> username)
        .as(SqlParser.scalar[Long].single) > 0
      
      if (!userExists) {
        val salt = authService.generateSalt()
        val hashedPassword = authService.hashPassword(plainPassword, salt)
        val now = (System.currentTimeMillis() / 1000).toInt
        
        SQL("""
          INSERT INTO users (username, password, password_salt, email, business_id, is_admin, is_customer, is_an_employee, modified_date, created_date)
          VALUES ({username}, {password}, {salt}, {email}, 1, {isAdmin}, {isCustomer}, {isEmployee}, {modifiedDate}, {createdDate})
        """).on(
          "username" -> username,
          "password" -> hashedPassword,
          "salt" -> salt,
          "email" -> email,
          "isAdmin" -> isAdmin,
          "isCustomer" -> !isAdmin,
          "isEmployee" -> true,
          "modifiedDate" -> now,
          "createdDate" -> now
        ).execute()
        
        logger.info(s"Sample user '$username' created with hashed password")
      }
    } match {
      case Success(_) => // Success
      case Failure(e) => logger.warn(s"Error inserting user '$username': ${e.getMessage}")
    }
  }
}
