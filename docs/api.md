# Отправка SMS через API

* Если API ключ ещё не создан, сначала см. [Получение API ключа](./web.md#api).

1. Открыть терминал
2. Выполнить POST-запрос с API ключом

Пример запроса:
```bash
curl -X POST http://localhost:3000/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "phone_to": "+78888888888",
    "text": "Тестовое сообщение"
  }'
```

Пример ответа сервера:
```json
{
  "id_message": 70,
  "id_device": 238101,
  "phone_to": "+78888888888",
  "text": "Тестовое сообщение",
  "status": "pending",
  "created_at": "2026-05-08T14:35:01.592Z"
}
```