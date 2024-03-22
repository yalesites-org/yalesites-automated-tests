import { test, expect } from "@playwright/test";
import { assignRoles, getLoginUrl, createUser, doesUserExist } from "@support/login";
import getLocationBasedOnUrl from "@support/projectLocation";

const projectLocation = getLocationBasedOnUrl();

test("doesUserExist should know if a user exists", async ({ }) => {
  expect(doesUserExist(projectLocation, 'nonexist')).toBeFalsy();
});

test("createUser should create a user", async ({ }) => {
  const username = "testuser" + Math.floor(Math.random() * 1000);
  expect(createUser(projectLocation, username)).toBeTruthy();
  expect(doesUserExist(projectLocation, username)).toBeTruthy()
});

test("getLoginUrl should get the login URL for a user", async ({ }) => {
  const username = "testuser" + Math.floor(Math.random() * 1000);
  if (!doesUserExist(projectLocation, username)) {
    createUser(projectLocation, username);
  }
  expect(getLoginUrl({ user: username, drupalPath: projectLocation, roles: ['site_admin'] })).toEqual(expect.stringContaining('http'));
});

test("assignRoles can assign multiple roles to a user", async ({ }) => {
  const username = "testuser" + Math.floor(Math.random() * 1000);
  if (!doesUserExist(projectLocation, username)) {
    createUser(projectLocation, username);
  }
  expect(assignRoles(projectLocation, username, ['site_admin', 'platform_admin'])).toBeTruthy();
});
