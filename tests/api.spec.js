import { test, expect } from '@playwright/test';

const baseURL = 'https://restful-booker.herokuapp.com';
let bookingId;
let token;

const newBooking = {
  firstname: 'Ann',
  lastname: 'Ivanova',
  totalprice: 150,
  depositpaid: true,
  bookingdates: {
    checkin: '2025-09-01',
    checkout: '2025-09-10',
  },
  additionalneeds: 'Breakfast',
};

const updatedBooking = {
  firstname: 'Anna',
  lastname: 'Sidorova',
  totalprice: 200,
  depositpaid: false,
  bookingdates: {
    checkin: '2025-09-02',
    checkout: '2025-09-12',
  },
  additionalneeds: 'Lunch',
};


test.describe('API-тесты для Restful-booker @api', () => {
  test.beforeAll(async ({ request }) => {
    // 1. Создание бронирования
    const createResp = await request.post(`${baseURL}/booking`, {
      data: newBooking,
    });

    expect(createResp.status()).toBe(200);
    const body = await createResp.json();
    
    expect(body).toHaveProperty('bookingid');
    bookingId = body.bookingid;

    // 2. Авторизация
     const authResp = await request.post(`${baseURL}/auth`, {
      data: { username: 'admin', password: 'password123' },
    });
    expect(authResp.status()).toBe(200);

    const authBody = await authResp.json();
    token = authBody.token;
  });

  test('Чтение бронирования', async ({ request }) => {
    const resp = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(resp.status()).toBe(200);

    const data = await resp.json();
    expect(data).toMatchObject(newBooking);
  });

   test('Обновление бронирования', async ({ request }) => {
    const resp = await request.put(`${baseURL}/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': `token=${token}`,
      },
      data: updatedBooking,
    });

    expect(resp.status()).toBe(200);
    const updated = await resp.json();
    expect(updated).toMatchObject(updatedBooking);
  });

  test('Удаление бронирования', async ({ request }) => {
    const resp = await request.delete(`${baseURL}/booking/${bookingId}`, {
      headers: {
        'Cookie': `token=${token}`,
      },
    });

    expect(resp.status()).toBe(201);

    const getResp = await request.get(`${baseURL}/booking/${bookingId}`);
    expect(getResp.status()).toBe(404);
  });
});
