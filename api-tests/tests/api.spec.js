import { test, expect } from '@playwright/test';

const baseURL = 'https://restful-booker.herokuapp.com';
let bookingId;
let token;

test.describe('API-тесты для Restful-booker', () => {
  test.beforeAll(async ({ request }) => {
    // 1. Создание бронирования
    const createResp = await request.post(`${baseURL}/booking`, { // Объект с даннами бронирования лучше вынести в отдельную переменную, например newBooking и передавать его в 11 строку
      data: {
        firstname: 'Ann',
        lastname: 'Ivanova',
        totalprice: 150,
        depositpaid: true,
        bookingdates: {
          checkin: '2025-09-01',
          checkout: '2025-09-10'
        },
        additionalneeds: 'Breakfast'
      }
    });

    expect(createResp.status()).toBe(200);
    const body = await createResp.json();
    bookingId = body.bookingid;

    // 2. Авторизация
    const authResp = await request.post(`${baseURL}/auth`, {
    data: { username: 'admin', password: 'password123' }
  });
  expect(authResp.status()).toBe(200);

  const authBody = await authResp.json();
  token = authBody.token;
  });

  test('Чтение бронирования', async ({ request }) => {
    const resp = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(resp.status()).toBe(200);

    const data = await resp.json();
    expect(data.firstname).toBe('Ann'); // В строках 43-49 можно использовать один ассершн expect(data.booking).toMatchObject(newBooking);
    expect(data.lastname).toBe('Ivanova');
    expect(data.totalprice).toBe(150);
    expect(data.depositpaid).toBe(true);
    expect(data.bookingdates.checkin).toBe('2025-09-01');
    expect(data.bookingdates.checkout).toBe('2025-09-10');
    expect(data.additionalneeds).toBe('Breakfast');
  });

  test('Обновление бронирования', async ({ request }) => {
    const resp = await request.put(`${baseURL}/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${token}`
      },
      data: {
        firstname: 'Anna',
        lastname: 'Sidorova',
        totalprice: 200,
        depositpaid: false,
        bookingdates: {
          checkin: '2025-09-02',
          checkout: '2025-09-12'
        },
        additionalneeds: 'Lunch'
      }
    });

    expect(resp.status()).toBe(200);
    const updated = await resp.json();
    expect(updated.firstname).toBe('Anna'); // Можно порефакторить аналогично предыдущему тесту
    expect(updated.lastname).toBe('Sidorova');
    expect(updated.totalprice).toBe(200);
    expect(updated.depositpaid).toBe(false);
    expect(updated.bookingdates.checkin).toBe('2025-09-02');
    expect(updated.bookingdates.checkout).toBe('2025-09-12');
    expect(updated.additionalneeds).toBe('Lunch');
  });

  test('Удаление бронирования', async ({ request }) => {
    const resp = await request.delete(`${baseURL}/booking/${bookingId}`, {
      headers: {
        'Cookie': `token=${token}`
      }
    });

    expect(resp.status()).toBe(201);

    // Проверка, что запись реально удалена
    const getResp = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(getResp.status()).toBe(404);
  });
});
