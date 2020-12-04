/* eslint-disable no-shadow */
let driver
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
// const remoteURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
const localURL = 'http://localhost:4100/'
beforeAll(() => {
  jest.setTimeout(30000)
  const options = new chrome.Options()
  options.addArguments('--no-sandbox')
  options.addArguments('--disable-dev-shm-usage')

  driver = new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build()
})

afterAll(() => {
  driver.quit()
})

async function getHomePage(url) {
  await driver.get(url)
  await driver.wait(webdriver.until.alertIsPresent())
  const alert1 = await driver.switchTo().alert()
  // replace username with the username for openEHR
  await alert1.sendKeys(process.env.ehr_user)
  // await alert1.sendKeys('user')
  await alert1.accept()
  await driver.wait(webdriver.until.alertIsPresent())
  const alert2 = await driver.switchTo().alert()
  // replace pass with password from openEHR
  await alert2.sendKeys(process.env.ehr_user_pass)
  // await alert2.sendKeys('user')
  await alert2.accept()
}

async function login(driver, userPath) {
  await driver.get(localURL)
  await driver.findElement(webdriver.By.id('loginHeaderButton')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  await driver.findElement(webdriver.By.id('email')).sendKeys('b@b.com')
  await driver.findElement(webdriver.By.id('password')).sendKeys('b')
  await driver.findElement(webdriver.By.id('loginButton')).click()
  await driver.wait(webdriver.until.urlIs(localURL + userPath))
  expect(await driver.getCurrentUrl()).toEqual(localURL + userPath)
}

test('test login b@b.com', async () => {
  await getHomePage(localURL)
  await login(driver, 'child')
})
