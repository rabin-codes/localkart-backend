# Security Guidelines for LocalKart

## ⚠️ CRITICAL: Sensitive Information

This project contains configuration files that should **NEVER** be committed to version control.

### Files That Should NOT Be Committed

- `backend/src/main/resources/application.properties` - Contains database credentials
- `backend/src/main/resources/application-dev.properties` - Contains dev database credentials
- `backend/src/main/resources/application-prod.properties` - Contains prod database credentials
- `.env` - Contains all environment variables and secrets

These files are excluded via `.gitignore` - **DO NOT override this**.

## 🔐 Setup Instructions

### 1. Configure Backend (Spring Boot)

```bash
# Copy the example configuration file
cp backend/src/main/resources/application.properties.example \
   backend/src/main/resources/application.properties

# Edit and add your actual database credentials
# For Windows:
notepad backend/src/main/resources/application.properties
```

**Required values to set:**
```properties
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_SECURE_PASSWORD
jwt.secret=YOUR_STRONG_RANDOM_KEY_MIN_32_CHARS
```

### 2. Configure Development Profile

```bash
# Copy the example dev configuration
cp backend/src/main/resources/application-dev.properties.example \
   backend/src/main/resources/application-dev.properties

# Edit with your development database credentials
```

### 3. Configure Production Profile

```bash
# Copy the example prod configuration
cp backend/src/main/resources/application-prod.properties.example \
   backend/src/main/resources/application-prod.properties

# For production, use environment variables instead of hardcoding:
export SPRING_DATASOURCE_URL=jdbc:mysql://prod-server:3306/db
export SPRING_DATASOURCE_USERNAME=prod_user
export SPRING_DATASOURCE_PASSWORD=prod_password_here
export JWT_SECRET=your_production_secret
```

### 4. Configure Legacy Node.js Backend

```bash
export AUTH_SECRET=your_secret_key_here
export PORT=8080
export NODE_ENV=development
```

### 5. Create Environment File

```bash
# Copy the example .env file
cp .env.example .env

# Edit with your local development values
# For Windows:
notepad .env
```

## 🛡️ Best Practices

✅ **DO:**
- Use environment variables for all secrets in production
- Generate strong random keys (minimum 32 characters)
- Use different credentials for dev, staging, and production
- Rotate credentials regularly
- Use `.env.example` files to document required variables
- Enable HTTPS in production
- Use strong, unique database passwords

❌ **DON'T:**
- Commit configuration files with real credentials
- Use the same password across environments
- Use weak or simple passwords
- Share credentials in chat, email, or documentation
- Use default passwords in production
- Hardcode secrets in source code

## 🔄 If You Accidentally Commit Secrets

1. **Rotate all exposed credentials immediately**
2. Use `git filter-branch` to remove from history:
   ```bash
   git filter-branch --tree-filter 'rm -f backend/src/main/resources/application.properties' HEAD
   git push --force-with-lease origin main
   ```
3. Notify your team
4. Review git logs to see what was exposed

## 📋 Deployment Checklist

- [ ] All `.properties` files are ignored via `.gitignore`
- [ ] Environment variables are set on deployment server
- [ ] `.env` file is not committed
- [ ] Database credentials are changed from defaults
- [ ] JWT secret is a strong random string
- [ ] HTTPS is enabled
- [ ] Logs do not contain sensitive information
- [ ] Regular security audits are scheduled

## 📚 References

- Spring Boot Configuration: https://spring.io/projects/spring-boot
- Environment Variables: https://12factor.net/config
- JWT Best Practices: https://tools.ietf.org/html/rfc7519

---

**Last Updated:** 2026-05-04
