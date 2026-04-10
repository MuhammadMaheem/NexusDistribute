type LoginCredentials = {
  email: string;
  password: string;
};

type SmokeContext = {
  baseUrl: string;
  adminCookie: string;
  shopCookie: string;
  deliveryCookie: string;
};

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3001';

const credentials = {
  admin: {
    email: process.env.SMOKE_ADMIN_EMAIL ?? 'admin@nexusdistribute.com',
    password: process.env.SMOKE_ADMIN_PASSWORD ?? 'password123',
  },
  shop: {
    email: process.env.SMOKE_SHOP_EMAIL ?? 'shop1@test.com',
    password: process.env.SMOKE_SHOP_PASSWORD ?? 'password123',
  },
  delivery: {
    email: process.env.SMOKE_DELIVERY_EMAIL ?? 'delivery@nexusdistribute.com',
    password: process.env.SMOKE_DELIVERY_PASSWORD ?? 'password123',
  },
};

function assertCondition(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function extractCookie(setCookieHeader: string | null): string {
  if (!setCookieHeader) {
    throw new Error('Login response did not include auth cookies.');
  }

  const accessTokenMatch = setCookieHeader.match(/access_token=([^;]+)/);
  const refreshTokenMatch = setCookieHeader.match(/refresh_token=([^;]+)/);

  if (!accessTokenMatch || !refreshTokenMatch) {
    throw new Error('Unable to parse access_token/refresh_token from login cookies.');
  }

  return `access_token=${accessTokenMatch[1]}; refresh_token=${refreshTokenMatch[1]}`;
}

async function login(baseUrl: string, creds: LoginCredentials): Promise<string> {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creds),
    redirect: 'manual',
  });

  if (response.status !== 200) {
    const body = await response.text();
    throw new Error(`Login failed for ${creds.email}. Status ${response.status}. Body: ${body}`);
  }

  return extractCookie(response.headers.get('set-cookie'));
}

async function requestWithCookie(url: string, cookie?: string): Promise<Response> {
  return fetch(url, {
    method: 'GET',
    headers: cookie
      ? {
          Cookie: cookie,
        }
      : undefined,
    redirect: 'manual',
  });
}

async function runChecks(context: SmokeContext): Promise<void> {
  const unauthAdminPage = await requestWithCookie(`${context.baseUrl}/admin/dashboard`);
  assertCondition(
    unauthAdminPage.status === 307,
    `Expected unauthenticated /admin/dashboard to redirect with 307, got ${unauthAdminPage.status}`
  );

  const redirectLocation = unauthAdminPage.headers.get('location') ?? '';
  assertCondition(
    redirectLocation.startsWith('/login'),
    `Expected redirect to /login, got ${redirectLocation || '<empty>'}`
  );

  const adminOwnPortal = await requestWithCookie(
    `${context.baseUrl}/admin/dashboard`,
    context.adminCookie
  );
  assertCondition(
    adminOwnPortal.status === 200,
    `Expected admin to access /admin/dashboard with 200, got ${adminOwnPortal.status}`
  );

  const adminToShop = await requestWithCookie(
    `${context.baseUrl}/shop/dashboard`,
    context.adminCookie
  );
  assertCondition(
    adminToShop.status === 307,
    `Expected admin hitting /shop/dashboard to redirect with 307, got ${adminToShop.status}`
  );

  const shopOwnPortal = await requestWithCookie(
    `${context.baseUrl}/shop/dashboard`,
    context.shopCookie
  );
  assertCondition(
    shopOwnPortal.status === 200,
    `Expected shop to access /shop/dashboard with 200, got ${shopOwnPortal.status}`
  );

  const shopToAdmin = await requestWithCookie(
    `${context.baseUrl}/admin/dashboard`,
    context.shopCookie
  );
  assertCondition(
    shopToAdmin.status === 307,
    `Expected shop hitting /admin/dashboard to redirect with 307, got ${shopToAdmin.status}`
  );

  const deliveryOwnPortal = await requestWithCookie(
    `${context.baseUrl}/delivery/orders`,
    context.deliveryCookie
  );
  assertCondition(
    deliveryOwnPortal.status === 200,
    `Expected delivery user to access /delivery/orders with 200, got ${deliveryOwnPortal.status}`
  );

  const unauthAdminApi = await requestWithCookie(`${context.baseUrl}/api/admin/shops`);
  assertCondition(
    unauthAdminApi.status === 401,
    `Expected unauthenticated /api/admin/shops to return 401, got ${unauthAdminApi.status}`
  );

  const shopAdminApi = await requestWithCookie(
    `${context.baseUrl}/api/admin/shops`,
    context.shopCookie
  );
  assertCondition(
    shopAdminApi.status === 403,
    `Expected shop access to /api/admin/shops to return 403, got ${shopAdminApi.status}`
  );
}

async function main(): Promise<void> {
  try {
    console.log(`Running auth smoke checks against ${BASE_URL}`);

    const [adminCookie, shopCookie, deliveryCookie] = await Promise.all([
      login(BASE_URL, credentials.admin),
      login(BASE_URL, credentials.shop),
      login(BASE_URL, credentials.delivery),
    ]);

    await runChecks({
      baseUrl: BASE_URL,
      adminCookie,
      shopCookie,
      deliveryCookie,
    });

    console.log('Auth smoke checks passed.');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Auth smoke checks failed: ${message}`);
    process.exit(1);
  }
}

void main();
