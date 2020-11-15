/* eslint-disable no-shadow */
let driver
const webdriver = require('selenium-webdriver')
// const remoteURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
const localURL = 'http://localhost:4100/'

beforeEach(() => {
  const chromeCapabilities = webdriver.Capabilities.chrome()
  // setting chrome options to start the browser fully maximized
  const chromeOptions = {
    args: ['--test-type', '--start-maximized'],
  }
  chromeCapabilities.set('chromeOptions', chromeOptions)
  driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build()
})

afterEach(() => {
  driver.close()
})

async function connectToEHR() {
  await driver.get(localURL)
  await driver.wait(webdriver.until.alertIsPresent())
  const alert1 = await driver.switchTo().alert()
  // replace username with the username for openEHR
  await alert1.sendKeys('username')
  await alert1.accept()
  await driver.wait(webdriver.until.alertIsPresent())
  const alert2 = await driver.switchTo().alert()
  // replace pass with password from openEHR
  await alert2.sendKeys('password')
  await alert2.accept()
}

function User() {
  const randomInt = Math.floor(Math.random() * Math.floor(1000000))
  this.email = `${randomInt}epost@test.se`
  this.passw = 'passw'
}

async function logout(driver) {
  await driver.findElement(webdriver.By.xpath("//span[text()='Logga ut']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  expect(await driver.getCurrentUrl()).toEqual(`${localURL}login`)
}

async function login(driver, userPath, user) {
  await driver.get(localURL)
  await driver.findElement(webdriver.By.xpath("//span[text()='Logga in']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  await driver.findElement(webdriver.By.id('email')).sendKeys(user.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.xpath("//span[text()='Logga In']")).click()
  await driver.wait(webdriver.until.urlIs(localURL + userPath))
  expect(await driver.getCurrentUrl()).toEqual(localURL + userPath)
}

async function register(driver, user) {
  await driver.get(localURL)
  await driver.findElement(webdriver.By.xpath("//span[text()='Registrera dig']")).click()
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
  await driver.findElement(webdriver.By.id('email')).sendKeys(user.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.xpath("//span[text()='Registrera']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 10000, 'Timed out after 5 sec', 100)
}

// Finns ingen req.
/*
  test('ID:XX. Log out after registration', async () => {
    const user = new User()
    await connectToEHR()
    await register(driver, user)
    await logout(driver)
  }) */

test('TestCaseID:131. Log in', async () => {
  const user = new User()
  await connectToEHR()
  await register(driver, user)
  await logout(driver)
  await login(driver, 'parent', user)
})
