# Система конфигурируемой фильтрации сообщений
Функция фильтрации, которая примет фильтры в виде js-объектов, сообщения и выдаст отфильтрованные сообщения  

## Возможности фильтров
- Могут быть И/Или условия
- Могут быть условия на типы: `string`, `boolean`, `Date`, `number`
- Условия для number: `equal`, `greater`, `greaterOrEqual`, `less`, `lessOrEqual`
- Условия для string: `equal`, `startsWith`, `endsWith`, `contains`
- Условия для boolean: `equal`
- Условия для Date: `equal`, `after`, `before`  

## Установка
```console
git clone https://github.com/vova-admitriev/filters-fn.git
```
```console
cd filters-fn
```
```console
yarn
```

## Использование
```js
filterMessages(
  messages,
  {
    field: 'someField',
    type: 'string',
    operation: 'endsWith',
    value: 'expected and of string.'
  },
),
```

## Запуск тестов
```js
yarn test
```