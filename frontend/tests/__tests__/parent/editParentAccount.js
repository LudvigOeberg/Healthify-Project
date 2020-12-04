/* eslint-disable no-shadow */
let driver
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const localURL = 'http://localhost:4100/'
beforeAll(() => {
  jest.setTimeout(30000)
  const options = new chrome.Options()
  options.addArguments('--test-type')
  options.addArguments('--start-maximized')
  driver = new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build()
})

afterAll(() => {
  driver.close()
})

function User(user) {
  const randomInt = Math.floor(Math.random() * Math.floor(1000000))
  this.email = `${randomInt}epost@test.se`
  this.passw = 'passw'
  this.dateOfBirth = undefined
  if (user === 'patient') {
    this.dateOfBirth = '25092010'
  }
}

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

async function register(driver, user) {
  await driver.get(localURL)
  await driver.findElement(webdriver.By.id('registerHeaderButton')).click()
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
  await driver.findElement(webdriver.By.id('email')).sendKeys(user.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.id('registerUserButton')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 10000, 'Timed out after 5 sec', 100)
}

async function logut(driver) {
  await driver.findElement(webdriver.By.id('logoutHeaderButton')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  expect(await driver.getCurrentUrl()).toEqual(`${localURL}login`)
}

async function editParent(driver, user) {
  await driver.findElement(webdriver.By.id('openDrawerButton')).click()
  await driver.findElement(webdriver.By.xpath('//a[2]')).click()
  await driver.findElement(webdriver.By.id('parentsChangeEmailButton')).click()
  await driver.findElement(webdriver.By.id('parentsEditEmailButton')).sendKeys(user.email)
  await driver.findElement(webdriver.By.id('parentsSaveEmailChangeButton')).click()
}

async function deleteParentAccount(driver) {
  await driver.findElement(webdriver.By.id('openDrawerButton')).click()
  await driver.findElement(webdriver.By.xpath('//a[2]')).click()
  await driver.findElement(webdriver.By.id('parentsDeleteAccountButton')).click()
  await driver.findElement(webdriver.By.id('parentsComfirmDeleteButton')).click()
}
describe('TestID:32 Edit Parent Account', () => {
  test('TestCaseID: 32.1.1. Edit parent account with a valid Email', async () => {
    const parent = new User('parent')
    await getHomePage(localURL)
    await register(driver, parent)
    await editParent(driver, parent)
    let msg1 = await driver
      .wait(webdriver.until.elementLocated(webdriver.By.xpath("//div[@class='MuiAlert-message']")), 10000)
      .getText()
    expect(msg1).toEqual('Du ändrade din emailadress')
    await logut(driver)
  })

  test('TestCaseID: 32.1.2. Edit parent account with an invalid Email', async () => {
    const parent = new User('parent')
    await register(driver, parent)
    parent.email = '@mail.com'
    await editParent(driver, parent).catch(async () => {
      let msg2 = await driver.findElement(webdriver.By.xpath("//p[@id='email-helper-text']"), 10000).getText()
      expect(msg2).toEqual('Not a valid email address')
    })
  })

  test('TestCaseID: 32.1.3. Deleting a parent account', async () => {
    const parent = new User('parent')
    await driver.get(localURL)
    await logut(driver)
    await register(driver, parent)
    await deleteParentAccount(driver)
    let msg3 = await driver
      .wait(webdriver.until.elementLocated(webdriver.By.xpath("//div[@class='MuiAlert-message']")), 10000)
      .getText()
    expect(msg3).toContain('Du tog bort kontot')
  })
})
