/* eslint-disable no-shadow */
let driver;
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const localURL = "http://localhost:4100/";
beforeAll(() => {
  jest.setTimeout(300000);
  const options = new chrome.Options();
  options.addArguments("--test-type");
  options.addArguments("--start-maximized");
  driver = new webdriver.Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
});
afterAll(() => {
  driver.close();
});

async function connectToEHR() {
  await driver.get(localURL);
  await driver.wait(webdriver.until.alertIsPresent());
  const alert1 = await driver.switchTo().alert();
  // replace username with the username for openEHR
  await alert1.sendKeys(process.env.ehr_user);
  await alert1.accept();
  await driver.wait(webdriver.until.alertIsPresent());
  const alert2 = await driver.switchTo().alert();
  // replace pass with password from openEHR
  await alert2.sendKeys(process.env.ehr_user_pass);
  await alert2.accept();
}

function User() {
  const randomInt = Math.floor(Math.random() * Math.floor(1000000));
  this.email = `${randomInt}epost@test.se`;
  this.passw = "passw";
}

async function logout(driver) {
  await driver.findElement(webdriver.By.id("logoutHeaderButton")).click();
  await driver.wait(webdriver.until.urlIs(`${localURL}login`));
  expect(await driver.getCurrentUrl()).toEqual(`${localURL}login`);
}

async function login(driver, userPath, user) {
  await driver.get(localURL);
  await driver.findElement(webdriver.By.id("loginHeaderButton")).click();
  await driver.wait(webdriver.until.urlIs(`${localURL}login`));
  await driver.findElement(webdriver.By.id("email")).sendKeys(user.email);
  await driver.findElement(webdriver.By.id("password")).sendKeys(user.passw);
  await driver.findElement(webdriver.By.id("loginButton")).click();
  await driver.wait(webdriver.until.urlIs(localURL + userPath));
  expect(await driver.getCurrentUrl()).toEqual(localURL + userPath);
}

async function register(driver, user) {
  await driver.get(localURL);
  await driver.findElement(webdriver.By.id("registerHeaderButton")).click();
  await driver.findElement(webdriver.By.id("name")).sendKeys("Namn");
  await driver.findElement(webdriver.By.id("surname")).sendKeys("Efteramn");
  await driver.findElement(webdriver.By.id("email")).sendKeys(user.email);
  await driver.findElement(webdriver.By.id("password")).sendKeys(user.passw);
  await driver
    .findElement(webdriver.By.id("confirmPassword"))
    .sendKeys(user.passw);
  await driver.findElement(webdriver.By.id("registerUserButton")).click();
  await driver.wait(
    webdriver.until.urlIs(`${localURL}parent`),
    10000,
    "Timed out after 5 sec",
    100
  );
}

test("ID:103.1.1. Log out after registration", async () => {
  const user = new User();
  await connectToEHR();
  await register(driver, user);
  await logout(driver);
});

test("TestCaseID:13.1.1. Check login by pressing the login button with valid data of a parent", async () => {
  const user = new User();
  await connectToEHR();
  await register(driver, user);
  await logout(driver);
  await login(driver, "parent", user);
});

//141 is deleted
test("TestCaseID:141.1.1. Check if a parent is redirected to /parent after a sucessful log on", async () => {
  const user = new User();
  await connectToEHR();
  await register(driver, user);
  await logout(driver);
  await login(driver, "parent", user);
  expect(await driver.getCurrentUrl()).toEqual(`${localURL}parent`);
});
