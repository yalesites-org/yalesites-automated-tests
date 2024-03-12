import { test, expect } from "@playwright/test";
import { assignRoles, getLoginUrl, createUser, doesUserExist } from "@support/login";

test("doesUserExist should know if a user exists", async ({ }) => {
  expect(doesUserExist('../yalesites-project', 'db2553')).toBeTruthy()
  expect(doesUserExist('../yalesites-project', 'nonexist')).toBeFalsy();
});

test("createUser should create a user", async ({ }) => {
  const username = "testuser" + Math.floor(Math.random() * 1000);
  expect(createUser('../yalesites-project', username)).toBeTruthy();
});

test("getLoginUrl should get the login URL for a user", async ({ }) => {
  const username = "testuser" + Math.floor(Math.random() * 1000);
  if (!doesUserExist('../yalesites-project', username)) {
    createUser('../yalesites-project', username);
  }
  expect(getLoginUrl({ user: username, drupalPath: '../yalesites-project', roles: ['site_admin'] })).toEqual(expect.stringContaining('http'));
});

test("assignRoles can assign multiple roles to a user", async ({ }) => {
  const username = "testuser" + Math.floor(Math.random() * 1000);
  if (!doesUserExist('../yalesites-project', username)) {
    createUser('../yalesites-project', username);
  }
  expect(assignRoles('../yalesites-project', username, ['site_admin', 'platform_admin'])).toBeTruthy();
});