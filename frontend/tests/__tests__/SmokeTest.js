
/* eslint-disable no-shadow */
let driver
const webdriver = require('selenium-webdriver')
// const remoteURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
const localURL = 'http://localhost:4100/'
beforeAll(() => {
  jest.setTimeout(10000)
  const chromeCapabilities = webdriver.Capabilities.chrome()

  // setting chrome options to start the browser fully maximized
  const chromeOptions = {
    args: ['--test-type', '--start-maximized'],
  }

  chromeCapabilities.set('chromeOptions', chromeOptions)

  driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build()
})

function User() {
  const randomInt = Math.floor(Math.random() * Math.floor(1000000))
  this.email = `${randomInt}epost@test.se`
  this.passw = 'passw'
}

async function logut(driver) {
  await driver.findElement(webdriver.By.xpath("//span[text()='Logga ut']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  expect(await driver.getCurrentUrl()).toEqual(`${localURL}login`)
  // driver.findElement(webdriver.By.xpath("//span[text()='Logga in']"))
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

async function registerPatient(driver, patient) {
  await driver
    .findElement(
      webdriver.By.xpath(
        "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-2 MuiIconButton-colorInherit MuiIconButton-edgeStart']",
      ),
    )
    .click()
  await driver.findElement(webdriver.By.xpath("//a[@href='/register-patient']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}register-patient`), 10000, 'Timed out after 5 sec', 100)
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
  await driver.findElement(webdriver.By.id('email')).sendKeys(patient.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(patient.passw)
  await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(patient.passw)
  await driver.findElement(webdriver.By.id('age')).sendKeys(10)
  await driver.findElement(webdriver.By.xpath("//span[text()='Registrera']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`))
  // await driver.get(`${localURL}parent`)
  // driver.findElement(webdriver.By.className(await driver.wait(webdriver.until.alertIsPresent()),'MuiGrid-root'))
}

test('ID:S1. Test start application', async () => {
  await driver.get(localURL)
  await driver.wait(webdriver.until.alertIsPresent())
  const alert1 = await driver.switchTo().alert()
  // replace username with the username for openEHR
  await alert1.sendKeys('username')
  await alert1.accept()
  await driver.wait(webdriver.until.alertIsPresent())
  const alert2 = await driver.switchTo().alert()
  // replace pass with password from openEHR
  await alert2.sendKeys('pass')
  await alert2.accept()
  expect(await driver.getTitle()).toEqual('Healthify')
})

test('ID:S2. Test registration follow by auto login for parent', async () => {
  const user = new User()
  await register(driver, user)
  await logut(driver)
})

test('ID:S3. Register a Patient', async () => {
  const user = new User()
  await register(driver, user)
  const patient = new User()
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
  const parent = new User()
  await register(driver, parent)
  const patient = new User()
  await registerPatient(driver, patient)
  await logut(driver)
  await login(driver, 'child', patient)
  await logut(driver)
})

test('ID:S6. Registration for an already registered email', async () => {
  const user = new User()
  await register(driver, user)
  await logut(driver)
  await register(driver, user)
  const text = await driver.findElement(webdriver.By.xpath("//p[@id='email-helper-text']")).getText()
  // await expect(register(driver, user)).rejects.toThrow('Timed out after 5 sec')
  await expect(text).toEqual('User already registered')
})
