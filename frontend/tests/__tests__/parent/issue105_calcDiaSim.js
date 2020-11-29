/* eslint-disable no-shadow */
let driver
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
// const remoteURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
const localURL = 'http://localhost:4100/'
beforeAll(() => {
  jest.setTimeout(300000)
  const options = new chrome.Options()
  options.addArguments('--test-type')
  options.addArguments('--start-maximized')
  // options.addArguments('--headless')
  driver = new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build()
})

afterAll(() => {
  driver.close()
})

function User() {
  const randomInt = Math.floor(Math.random() * Math.floor(1000000))
  this.email = `${randomInt}epost@test.se`
  this.passw = 'passw'
}

async function connectToEHR() {
  await driver.get(localURL)
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



async function register(driver, user) {
  // await driver.get(localURL)
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
        "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-6 MuiIconButton-colorInherit MuiIconButton-edgeStart']",
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
  await driver.findElement(webdriver.By.id('dateofbirth')).sendKeys('2010-01-01T00:00:00Z')
  await driver.findElement(webdriver.By.css("div[aria-labelledby='gender-label']")).click()
  await driver.findElement(webdriver.By.css("li[data-value='FEMALE']")).click()
  await driver.findElement(webdriver.By.css("div[aria-labelledby='disease-label']")).click()
  await driver.findElement(webdriver.By.css("li[data-value='DIABETES']")).click()
  await driver.findElement(webdriver.By.id('st')).sendKeys(5)
 // await driver.findElement(webdriver.By.xpath("//*[text()='Lägsta blodsockernivå']")).sendKeys(3)
 // await driver.findElement(webdriver.By.xpath("//*[text()='Högsta blodsockernivå']")).sendKeys(10)
    
  await driver.findElement(webdriver.By.css('#main > main > div > form > button')).sendKeys(webdriver.Key.ENTER)
  await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 30000, 'Timed out after 15 sec', 100)

}

async function logout(driver) {
  await driver.findElement(webdriver.By.xpath("//span[text()='Logga ut']")).click()
  await driver.wait(webdriver.until.urlIs(`${localURL}login`))
  expect(await driver.getCurrentUrl()).toEqual(`${localURL}login`)
}

test('TestCaseID:105.1.1 calculateDiabetesSim', async () => {
    const user = new User()
    await connectToEHR()
    await register(driver, user)
    const patient = new User()
    await registerPatient(driver, patient)
    await driver.findElement(webdriver.By.xpath("//span[text()='Gå till översikt']")).click()
    expect(await driver.getCurrentUrl()).toContain(`${localURL}parent-child-overview`)
    //A parent and child have been created here
    await driver.findElement(webdriver.By.xpath("//a[@class='MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedSecondary MuiButton-fullWidth']")).click()
    await driver.findElement(webdriver.By.id('childValue')).sendKeys('5')
    await driver.findElement(webdriver.By.id('addValueToChildButton')).click()
    //A measurement value has now been added to the child
    await driver.findElement(webdriver.By.id('healthifyIconButton')).click()
    await driver.findElement(webdriver.By.id('parentsChildOverviewButton')).click()
    await driver.findElement(webdriver.By.id('toSimulatePageButton')).click()
    //User is now in the simulation page. Due to problems with the accordian on the simulation page the user has to enter values manualy
    await driver.wait(webdriver.until.urlIs(`${localURL}parent`), 30000, 'Timed out after 15 sec', 100)


    })


