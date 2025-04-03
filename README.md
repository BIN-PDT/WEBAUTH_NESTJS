**1. PROJECT**

```
git clone https://github.com/BIN-PDT/WEBAUTH_NESTJS.git && rm -rf WEBAUTH_NESTJS/.git
```

_For privacy reasons, replace the sensitive information in `.env` with your own._

- _Replace `MAIL_ADDRESS` & `MAIL_PASSWORD` (Application Password) with your Gmail Account_.

- _Generate `SECRET_KEY`_.

  ```
  openssl rand -hex 32
  ```

**2. DEPENDENCY**

```
npm install
```

**3. DATABASE**

```
npm run migration:generate
```

```
npm run migration:run
```

**4. RUN APPLICATION**

```
npm run start:dev
```
