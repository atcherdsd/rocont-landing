# Rocont Landing

SPA‑проект с формой обратной связи и API‑сервером.

## Установка и запуск

```bash
git clone https://github.com/atcherdsd/rocont-landing.git
cd rocont-landing
npm install
npm run dev       # запуск клиента (Webpack Dev Server) на :3000 и API‑сервера на :8080
```

## API
- __POST__ `/api/feedback`
Тело в формате JSON или FormData.
__Ответ__ (200 OK):
```
json

{ 
    "message": "Форма отправлена" 
}
```
