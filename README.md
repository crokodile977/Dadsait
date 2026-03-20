# НордВестГаз — Сайт + Админ-панель

## Структура проекта

```
nwg-site/
├── server.js          ← Node.js сервер (Express)
├── package.json
├── railway.toml       ← конфиг Railway
├── .gitignore
└── public/
    ├── index.html     ← основной сайт
    ├── admin.html     ← панель управления заявками
    ├── logo.png       ← ваш логотип (добавьте сами)
    ├── image.png      ← фото для hero-фона
    ├── image1.png     ← портрет инженера
    ├── image2.png     ← фото процесса ремонта
    └── image3.png     ← фото команды / авто
```

---

## Запуск локально

```bash
cd nwg-site
npm install
npm start
# → http://localhost:3000
# → http://localhost:3000/admin.html
```

---

## Деплой на Railway через GitHub

### 1. Создайте GitHub-репозиторий

1. Зайдите на [github.com](https://github.com) → **New repository**
2. Название: `northwestgaz-site` (любое)
3. Visibility: **Private** (рекомендуется, там admin.html)
4. Нажмите **Create repository**

### 2. Загрузите файлы в репозиторий

```bash
# В папке nwg-site:
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/northwestgaz-site.git
git push -u origin main
```

Или перетащите папку прямо в GitHub через браузер (Upload files).

### 3. Создайте проект на Railway

1. Зайдите на [railway.app](https://railway.app) → **New Project**
2. Выберите **Deploy from GitHub repo**
3. Авторизуйте Railway в GitHub, выберите ваш репозиторий
4. Railway автоматически найдёт `package.json` и задеплоит

### 4. Получите домен

В Railway: Settings → **Generate Domain** → получите адрес вида `yourapp.up.railway.app`

Сайт:  `https://yourapp.up.railway.app/`
Админ: `https://yourapp.up.railway.app/admin.html`

---

## Обновление сайта

После изменений в файлах:
```bash
git add .
git commit -m "update"
git push
```
Railway автоматически передеплоит через ~1 минуту.

---

## Важно про заявки

Сейчас заявки хранятся в **localStorage браузера**. Это значит:
- Заявки видны только на том устройстве/браузере, где открывается `admin.html`
- При очистке браузера заявки пропадут

**Для продакшена** рекомендуется подключить отправку на email:
- Бесплатно: [Formspree.io](https://formspree.io) или [EmailJS.com](https://www.emailjs.com)
- С базой данных: добавить PostgreSQL через Railway (Add Service → Database)

---

## Пароль от админки

По умолчанию: `admin123`  
Смените в панели: `admin.html` → Настройки → Смена пароля
