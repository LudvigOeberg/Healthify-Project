let driver;
const webdriver = require("selenium-webdriver");
// const remoteURL = 'http://tddc88-company-2-2020.kubernetes-public.it.liu.se/'
const localURL = "http://localhost:4100/";

beforeEach(() => {
  const chromeCapabilities = webdriver.Capabilities.chrome();
  // setting chrome options to start the browser fully maximized
  const chromeOptions = {
    args: ["--test-type", "--start-maximized"],
  };
  chromeCapabilities.set("chromeOptions", chromeOptions);
  driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
});

afterEach(() => {
  driver.close();
});


async function connectToEHR() {
    await driver.get(localURL);
    await driver.wait(webdriver.until.alertIsPresent());
    const alert1 = await driver.switchTo().alert();
    // replace username with the username for openEHR
    await alert1.sendKeys("username");
    await alert1.accept();
    await driver.wait(webdriver.until.alertIsPresent());
    const alert2 = await driver.switchTo().alert();
    // replace pass with password from openEHR
    await alert2.sendKeys("password");
    await alert2.accept();
  }

function User() {
    const randomInt = Math.floor(Math.random() * Math.floor(1000000));
    this.email = `${randomInt}epost@test.se`;
    this.passw = "passw";
  }

  async function register(driver, user) {
    await driver.get(localURL);
    await driver
      .findElement(webdriver.By.xpath("//span[text()='Registrera dig']"))
      .click();
    await driver.findElement(webdriver.By.id("name")).sendKeys("Namn");
    await driver.findElement(webdriver.By.id("surname")).sendKeys("Efteramn");
    await driver.findElement(webdriver.By.id("email")).sendKeys(user.email);
    await driver.findElement(webdriver.By.id("password")).sendKeys(user.passw);
    await driver
      .findElement(webdriver.By.id("confirmPassword"))
      .sendKeys(user.passw);
    await driver
      .findElement(webdriver.By.xpath("//span[text()='Registrera']"))
      .click();
    await driver.wait(
      webdriver.until.urlIs(`${localURL}parent`),
      10000,
      "Timed out after 5 sec",
      100
    );
  }


  async function registerPatient(driver, patient) {
    await driver
      .findElement(
        webdriver.By.xpath(
          "//button[@class='MuiButtonBase-root MuiIconButton-root makeStyles-menuButton-2 MuiIconButton-colorInherit MuiIconButton-edgeStart']"
        )
      )
      .click();
    await driver
      .findElement(webdriver.By.xpath("//a[@href='/register-patient']"))
      .click();
    await driver.wait(
      webdriver.until.urlIs(`${localURL}register-patient`),
      10000,
      "Timed out after 5 sec",
      100
    );
    await driver.findElement(webdriver.By.id("name")).sendKeys("Namn");
    await driver.findElement(webdriver.By.id("surname")).sendKeys("Efteramn");
    await driver.findElement(webdriver.By.id("email")).sendKeys(patient.email);
    await driver.findElement(webdriver.By.id("password")).sendKeys(patient.passw);
    await driver
      .findElement(webdriver.By.id("confirmPassword"))
      .sendKeys(patient.passw);
    await driver
      .findElement(webdriver.By.id("dateofbirth"))
      .sendKeys("2010-01-01T00:00:00Z");
    await driver
      .findElement(webdriver.By.css("div[aria-labelledby='gender-label']"))
      .click();
    await driver.findElement(webdriver.By.css("li[data-value='FEMALE']")).click();
    await driver
      .findElement(webdriver.By.css("div[aria-labelledby='disease-label']"))
      .click();
    await driver
      .findElement(webdriver.By.css("li[data-value='DIABETES']"))
      .click();
    await driver
      .findElement(webdriver.By.xpath("//span[text()='Registrera']"))
      .click();
    await driver.wait(
      webdriver.until.urlIs(`${localURL}parent`),
      5000,
      "Timed out after 5 sec",
      100
    );
  }


test("TestCaseID:182. Enter overview page", async () => {
    const user = new User();
    await connectToEHR();
    await register(driver, user);
    const patient = new User();
    await registerPatient(driver, patient);
    await driver
    .findElement(webdriver.By.xpath("//span[text()='Gå till översikt']"))
    .click();
    expect(await driver.getCurrentUrl()).toContain(`${localURL}parent-child-overview`);

  });
  




