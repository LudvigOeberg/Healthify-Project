let driver
const webdriver = require('selenium-webdriver')
// const remoteURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
const localURL = 'http://localhost:4100/'
beforeAll(() => {
  jest.setTimeout(30000)
  const chromeCapabilities = webdriver.Capabilities.chrome()

  // setting chrome options to start the browser fully maximized
  const chromeOptions = {
    args: ['--test-type', '--start-maximized'],
  }

  chromeCapabilities.set('chromeOptions', chromeOptions)

  driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build()
})

afterAll(() => {
  driver.close()
})

// generate a random date between two dates
const randomDate = (start, end) => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toLocaleDateString()
    .split('/')
    .join('')
  return date
}

function User(user) {
  const randomInt = Math.floor(Math.random() * Math.floor(1000000))
  this.email = `${randomInt}epost@test.se`
  this.passw = 'passw'
  this.age = undefined
  if (user === 'patient') {
    this.age = randomDate(new Date(2010, 1, 1), new Date(2020, 8, 31))
  }
}

async function getHomePage(url) {
  await driver.get(url)
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
}

// eslint-disable-next-line no-shadow
async function login(driver, userPath, user) {
  await driver.get(localURL)
  await driver.findElement(webdriver.By.xpath("//span[text()='Logga in']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  await driver.findElement(webdriver.By.id('email')).sendKeys(user.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw)
  await driver.findElement(webdriver.By.xpath("//span[text()='Logga In']")).click()
  // await driver.wait(webdriver.until.urlIs(localURL + userPath))
  // expect(await driver.getCurrentUrl()).toEqual(localURL + userPath)
}

// eslint-disable-next-line no-shadow
async function logout(driver) {
  await driver.findElement(webdriver.By.xpath("//span[text()='Logga ut']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  // expect(await driver.getCurrentUrl()).toEqual(`${localURL}login`)
}

// eslint-disable-next-line no-shadow
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

// eslint-disable-next-line no-shadow
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
  await driver.findElement(webdriver.By.id('dateofbirth')).sendKeys(patient.age)
  await driver
    .findElement(
      webdriver.By.xpath(
        "//div[@class='MuiInputBase-root MuiOutlinedInput-root Mui-focused Mui-focused MuiInputBase-formControl']/div[@class='MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiSelect-outlined MuiInputBase-input MuiOutlinedInput-input' and 1]",
      ),
    )
    .sendKeys('Man')
  await driver.findElement(webdriver.By.xpath("//span[text()='Registrera']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`))
}
const childParent = new User('parent')
const patient = new User('patient')
test('Invalid Email address', async () => {
  await getHomePage(localURL)
  await register(driver, childParent)
  await registerPatient(driver, patient)
  await logout(driver)
  patient.email = 'wrongemail.se'
  await login(driver, 'child', patient).catch(async () => {
    const text = await driver.findElement(webdriver.By.id('email-helper-text'), 10000).getText()
    expect(text).toEqual('Not a valid email address')
  })
})
