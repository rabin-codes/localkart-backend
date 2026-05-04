# LocalKart Backend - STS IDE Setup Guide

## Quick Setup for STS IDE (Spring Tool Suite 4)

This guide shows how to download the ZIP file, extract it, and import it into STS IDE.

---

## Step 1: Download and Extract ZIP File

### Option A: Download from GitHub

1. Go to GitHub repository: https://github.com/yourusername/localkart-backend
2. Click **Code → Download ZIP**
3. Save to your Downloads folder
4. Right-click ZIP → **Extract All** (or use 7-Zip, WinRAR)
5. Note the extraction location

### Option B: Clone Using Git

```bash
git clone https://github.com/yourusername/localkart-backend.git localkart-backend
cd localkart-backend
```

---

## Step 2: Prepare Environment

### Prerequisites (One-time Setup)

1. **Install Java 17 JDK**
   - Download: https://www.oracle.com/java/technologies/downloads/
   - Install: Default location is fine
   - Verify: Open CMD, type `java -version`

2. **Install Maven**
   - Download: https://maven.apache.org/download.cgi
   - Extract to: `C:\Program Files\Maven` (Windows) or `/usr/local/opt/maven` (Mac)
   - Add to PATH or environment variables
   - Verify: Open CMD, type `mvn -version`

3. **Install MySQL 8.0**
   - Download: https://dev.mysql.com/downloads/mysql/
   - Install with port 3306 (default)
   - Start service (Windows: Services app, Mac: brew services)
   - Verify: Open CMD, type `mysql --version`

4. **Install STS IDE**
   - Download: https://spring.io/tools
   - Extract to: `C:\Program Files\STS` (Windows)
   - Run: `STS-x.x.exe`

---

## Step 3: Create Database

### Using MySQL Command Line

```bash
# Connect to MySQL
mysql -u root -p
# Press Enter and enter your MySQL password

# Execute these commands:
CREATE DATABASE IF NOT EXISTS localkart_db;
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'CHANGE_ME_IN_PRODUCTION';
GRANT ALL PRIVILEGES ON localkart_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
SHOW DATABASES;
EXIT;
```

### Database Verification

```bash
mysql -u root -p -h localhost -e "SHOW DATABASES;" | grep localkart_db
# Should show: localkart_db
```

---

## Step 4: Import into STS IDE

### Method 1: Import Existing Maven Project (Recommended)

1. **Open STS IDE**
   - Start Spring Tool Suite
   - Select workspace (default is fine)

2. **Go to File → Import**
   - Window will show import dialog

3. **Select Maven Option**
   - Expand: **Maven**
   - Select: **Existing Maven Projects**
   - Click: **Next**

4. **Browse Project Folder**
   - Click: **Browse**
   - Navigate to: extracted `localkart-backend` folder
   - Select the root folder (where `pom.xml` is located)
   - Click: **Open** or **Select Folder**
   - Click: **Next**

5. **Verify Project**
   - You should see: `localkart-backend [jar]`
   - Check the checkbox
   - Click: **Finish**

### Method 2: Using Import Wizard

1. **File → Import → General → Existing Projects into Workspace**
2. **Select root directory**: Browse to `localkart-backend`
3. **Finish**

---

## Step 5: Wait for Project Setup

STS will:
1. ✅ Download Maven dependencies (~500MB first time, 5-10 minutes)
2. ✅ Configure build path
3. ✅ Index the project
4. ✅ Validate configuration

**Watch the progress:**
- Bottom right: "Building workspace..." 
- Console: Maven download activity
- Problems panel: Should show 0 errors (warnings are OK)

---

## Step 6: Update Project Configuration

Once import is done:

1. **Right-click project name** (in Package Explorer)
   - Select: **Maven → Update Project...**
   - Or use: **Alt + F5**

2. **Update Configuration**
   - Check: "Force Update of snapshots/releases"
   - Click: **OK**
   - Wait for completion (1-2 minutes)

3. **Clean and Build**
   - Project → Clean...
   - Select: **localkart-backend**
   - Click: **OK**
   - Wait for build to complete

---

## Step 7: Run the Application

### From STS IDE

1. **Navigate to Main Class**
   - Expand: `src/main/java → com.localkart → LocalkartApplication.java`

2. **Run Application**
   - Right-click: `LocalkartApplication.java`
   - Select: **Run As → Java Application**
   - Or use: **Ctrl + F11**

3. **Watch Console**
   ```
   Spring Boot :: (v3.2.0)
   ========================================
      LocalKart Backend API Started
      Base URL: http://localhost:8080/api
      Environment: Default
   ========================================
   ```

### From Command Line

```bash
cd localkart-backend
mvn spring-boot:run
```

---

## Step 8: Verify Application

### Test in Browser

1. Open browser
2. Go to: `http://localhost:8080/api/products`
3. Should see JSON response:
   ```json
   {
     "status": "success",
     "message": "Products retrieved successfully",
     "data": []
   }
   ```

### Test with curl (Command Line)

```bash
curl http://localhost:8080/api/products
```

### Test with Postman

1. Download Postman: https://www.postman.com/downloads/
2. Import collection from project
3. Set variable: `base_url = http://localhost:8080/api`
4. Test endpoints

---

## Step 9: Stop the Application

### From IDE

- Click: Red **Stop** button in Console panel
- Or press: **Ctrl + F2**

### From Command Line

- Press: **Ctrl + C**

---

## Useful STS IDE Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl + F11 | Run as Java Application |
| Ctrl + F5 | Debug as Java Application |
| Alt + F5 | Update Maven Project |
| Ctrl + Shift + O | Organize Imports |
| Ctrl + Shift + F | Format Code |
| Ctrl + / | Toggle Comment |
| F3 | Go to Definition |
| Ctrl + H | Search in Project |

---

## Project Structure in IDE

After import, you'll see:

```
localkart-backend/
├── src/main/java/com/localkart/
│   ├── LocalkartApplication.java        ← Main class to run
│   ├── config/                          ← Configuration classes
│   ├── controller/                      ← REST API endpoints
│   ├── service/                         ← Business logic
│   ├── entity/                          ← Database entities
│   ├── repository/                      ← Data access
│   ├── dto/                             ← Data transfer objects
│   ├── security/                        ← JWT & security
│   ├── exception/                       ← Exception handling
│   └── util/                            ← Utilities
├── src/main/resources/
│   ├── application.properties           ← Main configuration
│   ├── application-dev.properties       ← Dev profile
│   └── application-prod.properties      ← Prod profile
├── src/test/                            ← Test classes
├── pom.xml                              ← Maven configuration
├── README.md                            ← Documentation
└── .gitignore                           ← Git ignore file
```

---

## Configuration Files

### application.properties

Main configuration already set up with:
- Server: Port 8080, Context: /api
- Database: MySQL on localhost:3306/localkart_db
- JWT: Secret key, 24-hour expiration
- Logging: DEBUG for com.localkart

### If Database Connection Fails

Edit `src/main/resources/application.properties`:

```properties
# Update these lines:
spring.datasource.url=jdbc:mysql://localhost:3306/localkart_db
spring.datasource.username=root
spring.datasource.password=CHANGE_ME_IN_PRODUCTION
```

---

## Common Issues & Solutions

### Issue: "Project has 0 error(s), but could not run"

**Solution:**
```bash
cd localkart-backend
mvn clean install
```

Then try running again from IDE.

### Issue: "MySQL connection failed"

**Solution:**
1. Verify MySQL is running
2. Check credentials in application.properties
3. Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Issue: "Port 8080 already in use"

**Solution:**
```bash
# Find process using port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in application.properties
server.port=8081
```

### Issue: "Cannot find Java 17"

**Solution:**
1. Go to: **Window → Preferences → Java → Installed JREs**
2. Add JRE: **Add...**
3. Browse to: `C:\Program Files\Java\jdk-17.x.x`
4. Set as Default

### Issue: Maven Dependencies Not Downloaded

**Solution:**
1. Right-click project: **Maven → Update Project**
2. Or run: `mvn clean install -U`

---

## Next Steps

1. ✅ Extract ZIP and set up environment
2. ✅ Create MySQL database
3. ✅ Import into STS IDE
4. ✅ Run application (LocalkartApplication.java)
5. ⏭️ Test API endpoints (see CONTROLLERS_DOCUMENTATION.md)
6. ⏭️ Set up React frontend (separate repository)
7. ⏭️ Integrate backend and frontend

---

## Support Resources

- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **STS Documentation**: https://github.com/spring-projects/sts4/wiki
- **MySQL**: https://dev.mysql.com/doc/
- **Maven**: https://maven.apache.org/guides/

---

**Last Updated**: April 2026  
**Version**: 1.0.0  
**Status**: Ready to Use ✅
