let driver
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
// const remoteURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
const localURL = 'http://localhost:4100/'
beforeAll(() => {
  jest.setTimeout(30000)
  const options = new chrome.Options()
  options.addArguments('--test-type')
  options.addArguments('--start-maximized')
  // options.addArguments('--headless')
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
  await alert1.accept()
  await driver.wait(webdriver.until.alertIsPresent())
  const alert2 = await driver.switchTo().alert()
  // replace pass with password from openEHR
  await alert2.sendKeys(process.env.ehr_user_pass)
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
        "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-5 MuiIconButton-colorInherit MuiIconButton-edgeStart']",
      ),
    )
    .click()
  await driver.findElement(webdriver.By.xpath('//a[3]')).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}register-patient`), 10000, 'Timed out after 5 sec', 100)
  await driver.findElement(webdriver.By.id('name')).sendKeys('Namn')
  await driver.findElement(webdriver.By.id('surname')).sendKeys('Efteramn')
  await driver.findElement(webdriver.By.id('email')).sendKeys(patient.email)
  await driver.findElement(webdriver.By.id('password')).sendKeys(patient.passw)
  await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(patient.passw)
  await driver.findElement(webdriver.By.id('dateofbirth')).sendKeys('25092011')
  await driver.findElement(webdriver.By.css("div[aria-labelledby='gender-label']")).click()
  await driver.findElement(webdriver.By.css("li[data-value='FEMALE']")).click()
  await driver.findElement(webdriver.By.css("div[aria-labelledby='disease-label']")).click()
  await driver.findElement(webdriver.By.css("li[data-value='DIABETES']")).click()
  await driver.findElement(webdriver.By.css('#main > main > div > form > button')).sendKeys(webdriver.Key.ENTER)
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 5000, 'Timed out after 5 sec', 100)
}

// Test Cases
describe('Testing patient login', () => {
  const childParent = new User('parent')
  const patient = new User('patient')
  test('Invalid Email address and valid password', async () => {
    await getHomePage(localURL)
    await register(driver, childParent)
    await registerPatient(driver, patient)
    await logout(driver)
    const clonedPatient = JSON.parse(JSON.stringify(patient))
    clonedPatient.email = 'wrongemail.se'
    await login(driver, 'child', clonedPatient).catch(async () => {
      const text = await driver.findElement(webdriver.By.id('email-helper-text'), 10000).getText()
      expect(text).toEqual('Not a valid email address')
    })
  })

  test('Valid email and invalid password', async () => {
    const clonedPatient = JSON.parse(JSON.stringify(patient))
    clonedPatient.passw = 'wrongpass'
    await login(driver, 'child', clonedPatient).catch(async () => {
      const text = await driver.findElement(webdriver.By.id('password-helper-text'), 10000).getText()
      expect(text).toEqual('User not found or wrong password')
    })
  })

  test('Invalid email and invalid password', async () => {
    const clonedPatient = JSON.parse(JSON.stringify(patient))
    clonedPatient.email = 'wrongemail.se'
    clonedPatient.passw = 'wrongpass'
    await login(driver, 'child', clonedPatient).catch(async () => {
      const text = await driver.findElement(webdriver.By.id('email-helper-text'), 10000).getText()
      expect(text).toEqual('User not found or wrong password')
    })
  })

  test('Valid email and valid password', async () => {
    await login(driver, 'child', patient).catch(async () => {
      await driver.wait(webdriver.until.urlIs(`${localURL}child`))
      expect(await driver.getCurrentUrl()).toEqual(`${localURL}child`)
    })
  })
})
