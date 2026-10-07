const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { app } = require('../server');

test('GET /api/products returns products', async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/api/products`);
    assert.equal(response.status, 200);
    const data = await response.json();
    assert.ok(Array.isArray(data));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('register, login, and profile persistence work end to end', async () => {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const testEmail = `test.user.${Date.now()}@example.com`;

  try {
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: testEmail,
        phone: '9999999999',
        password: 'secret123'
      })
    });

    assert.equal(registerResponse.status, 201);
    const registerData = await registerResponse.json();
    assert.equal(registerData.success, true);
    assert.equal(registerData.user.email, testEmail);

    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'secret123'
      })
    });

    assert.equal(loginResponse.status, 200);
    const loginData = await loginResponse.json();
    assert.equal(loginData.success, true);
    assert.equal(loginData.user.email, testEmail);

    const profileResponse = await fetch(`${baseUrl}/api/user/profile?email=${encodeURIComponent(testEmail)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: testEmail,
        phone: '9999999999',
        address: '123 Test Street',
        city: 'Delhi',
        pincode: '110001'
      })
    });

    assert.equal(profileResponse.status, 200);
    const profileData = await profileResponse.json();
    assert.equal(profileData.success, true);

    const profileGetResponse = await fetch(`${baseUrl}/api/user/profile?email=${encodeURIComponent(testEmail)}`);
    assert.equal(profileGetResponse.status, 200);
    const storedProfile = await profileGetResponse.json();
    assert.equal(storedProfile.email, testEmail);
    assert.equal(storedProfile.address, '123 Test Street');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
