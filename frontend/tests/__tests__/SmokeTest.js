/* eslint-disable no-shadow */
let driver
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
// const remoteURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
const localURL = 'http://localhost:4100/'
beforeAll(() => {
  jest.setTimeout(30000)
  const options = new chrome.Options()
 // options.addArguments('--headless')
  options.addArguments('--no-sandbox')
  options.addArguments('--disable-dev-shm-usage')

  driver = new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build()
})


afterAll(() => {
  driver.quit()
})

function User(user) {
  const randomInt = Math.floor(Math.random() * Math.floor(1000000))
  this.email = `${randomInt}epost@test.se`
  this.passw = 'passw'
  this.dateOfBirth = undefined
  if (user === 'patient') {
    //this.dateOfBirth = '25092010' // works for windows?
    this.dateOfBirth = '002010-09-25' // works for mac?
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

async function logut(driver) {
  await driver.findElement(webdriver.By.id('logoutHeaderButton')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  expect(await driver.getCurrentUrl()).toEqual(`${localURL}login`)
}

async function login(driver, userPath, user) {
  await driver.get(localURL)
  await driver.findElement(webdriver.By.id('loginHeaderButton')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  await driver.findElement(webdriver.By.id('email')).sendKeys(user.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.id('loginButton')).click()
  await driver.wait(webdriver.until.urlIs(localURL + userPath))
  expect(await driver.getCurrentUrl()).toEqual(localURL + userPath)
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

async function registerPatient(driver, patient) {
  await driver.findElement(webdriver.By.id('parentsRegisterChildNew')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}register-patient`), 10000, 'Timed out after 5 sec', 100)
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
  await driver.findElement(webdriver.By.id('email')).sendKeys(patient.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(patient.passw)
  await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(patient.passw)
  await driver.findElement(webdriver.By.id('dateofbirth')).sendKeys(patient.dateOfBirth)
  await driver.findElement(webdriver.By.css("div[aria-labelledby='gender-label']")).click()
  await driver.findElement(webdriver.By.css("li[data-value='MALE']")).click()
  await driver.findElement(webdriver.By.css("div[aria-labelledby='disease-label']")).click()
  await driver.findElement(webdriver.By.css("li[data-value='DIABETES']")).click()
  await driver.findElement(webdriver.By.id('measurements')).sendKeys(5)
  await driver.findElement(webdriver.By.id('SU_LO')).sendKeys(0)
  await driver.findElement(webdriver.By.id('SU_HI')).sendKeys(15)
  await driver.findElement(webdriver.By.css('#main > main > div > form > button')).sendKeys(webdriver.Key.ENTER)
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`))
}
describe('General Smoke Test', () => {
  test('ID:S1. Test start application', async () => {
    await getHomePage(localURL)
    expect(await driver.getTitle()).toEqual('Healthify')
  })

  test('ID:S2. Test registration follow by auto login for parent', async () => {
    const user = new User('parent')
    await register(driver, user)
    await logut(driver)
  })

  test('ID:S3. Register a Patient', async () => {
    const user = new User()
    await register(driver, user)
    const patient = new User('patient')
    await registerPatient(driver, patient)
    await logut(driver)
  })

  test('ID:S4. Log out', async () => {
    const user = new User()
    await register(driver, user)
    await logut(driver)
    await login(driver, 'parent', user)
    await logut(driver)
  })

  test('ID:S5. Login as a registered Patient', async () => {
    const parent = new User('parent')
    await register(driver, parent)
    const patient = new User('patient')
    await registerPatient(driver, patient)
    await logut(driver)
    await login(driver, 'child', patient)
    await logut(driver)
  })

  test('ID:S6. Registration for an already registered email', async () => {
    const user = new User('parent')
    await register(driver, user)
    await logut(driver)
    await register(driver, user).catch(async () => {
      //const text = await driver.findElement(webdriver.By.xpath("//p[@id='email-helper-text']"), 10000).getText()
      const text = await driver.findElement(webdriver.By.id('email-helper-text'), 10000).getText()
      expect(text).toEqual('User already registered')
    })
  })
})
