var driver;
const webdriver = require('selenium-webdriver');

beforeAll(() => {
    var chromeCapabilities = webdriver.Capabilities.chrome();

    //setting chrome options to start the browser fully maximized
    var chromeOptions = {
        'args': ['--test-type', '--start-maximized']
    };

    chromeCapabilities.set('chromeOptions', chromeOptions);

    driver = new webdriver.Builder().withCapabilities(chromeCapabilities).build();
});

function User() {
    var randomInt = Math.floor(Math.random() * Math.floor(1000000));
    this.email = randomInt+"epost@test.se";
    this.passw = "passw";
}


async function logut(driver) {
    await driver.findElement(webdriver.By.xpath("//span[text()='Logga ut']")).click();
    await driver.wait(webdriver.until.urlIs("http://tddc88-company-2-2020.kubernetes-public.it.liu.se/"));
    expect(await driver.getCurrentUrl()).toEqual("http://tddc88-company-2-2020.kubernetes-public.it.liu.se/");
    driver.findElement(webdriver.By.xpath("//span[text()='Logga in']"));
}

async function login(driver, userPath, user) {
    await driver.get("http://tddc88-company-2-2020.kubernetes-public.it.liu.se");
    await driver.findElement(webdriver.By.xpath("//span[text()='Logga in']")).click();
    await driver.wait(webdriver.until.urlIs("http://tddc88-company-2-2020.kubernetes-public.it.liu.se/login"));
    await driver.findElement(webdriver.By.id('email')).sendKeys(user.email);
    await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw);
    await driver.findElement(webdriver.By.xpath("//span[text()='Logga In']")).click();
    await driver.wait(webdriver.until.urlIs("http://tddc88-company-2-2020.kubernetes-public.it.liu.se/"+userPath));
    expect(await driver.getCurrentUrl()).toEqual("http://tddc88-company-2-2020.kubernetes-public.it.liu.se/"+userPath);
}


async function register(driver, user) {
    await driver.get("http://tddc88-company-2-2020.kubernetes-public.it.liu.se");
    await driver.findElement(webdriver.By.xpath("//span[text()='Registrera dig']")).click();
    await driver.findElement(webdriver.By.id('name')).sendKeys("Namn");
    await driver.findElement(webdriver.By.id('surname')).sendKeys("Efteramn");
    await driver.findElement(webdriver.By.id('email')).sendKeys(user.email);
    await driver.findElement(webdriver.By.id('password')).sendKeys(user.passw);
    await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(user.passw);
    await driver.findElement(webdriver.By.xpath("//span[text()='Registrera']")).click();
    await driver.wait(webdriver.until.urlIs("http://tddc88-company-2-2020.kubernetes-public.it.liu.se/parent"), 10000, "Timed out after 5 sec", 100);
}


async function registerPatient(driver, patient) {
    await driver.findElement(webdriver.By.className("MuiButtonBase-root MuiIconButton-root jss2 MuiIconButton-colorInherit MuiIconButton-edgeStart")).click();
    await driver.findElement(webdriver.By.xpath("//a[@href='/register-patient']")).click();
    await driver.wait(webdriver.until.urlIs("http://tddc88-company-2-2020.kubernetes-public.it.liu.se/register-patient"), 10000, "Timed out after 5 sec", 100);
    await driver.findElement(webdriver.By.id('name')).sendKeys("Namn");
    await driver.findElement(webdriver.By.id('surname')).sendKeys("Efteramn");
    await driver.findElement(webdriver.By.id('email')).sendKeys(patient.email);
    await driver.findElement(webdriver.By.id('password')).sendKeys(patient.passw);
    await driver.findElement(webdriver.By.id('confirmPassword')).sendKeys(patient.passw);
    await driver.findElement(webdriver.By.id('age')).sendKeys(10);
    await driver.findElement(webdriver.By.xpath("//span[text()='Registrera']")).click();
    await driver.wait(webdriver.until.urlIs("http://tddc88-company-2-2020.kubernetes-public.it.liu.se/parent"));
    await driver.get("http://tddc88-company-2-2020.kubernetes-public.it.liu.se/parent");
    driver.findElement(webdriver.By.className("MuiGrid-root"));
}


test ('ID:S1. Test start application', async() => {
    await driver.get("http://tddc88-company-2-2020.kubernetes-public.it.liu.se");
    expect(await driver.getTitle()).toEqual("Healthify")
});

test('ID:S2. Test registration follow by auto login for parent', async() => {
    var user = new User();
    await register(driver, user);
    await logut(driver);
});


test('ID:S3. Register a Patient', async () => {
    var user = new User();
    await register(driver, user);
    var patient = new User();
    await registerPatient(driver, patient);
    await logut(driver);
});


test ('ID:S4. Log out', async () => {
    var user = new User();
    await register(driver, user);
    await logut(driver);
    await login(driver, "parent", user);
    await logut(driver);
});


test('ID:S5. Login as a registered Patient', async() => {
    var parent = new User();
    await register(driver, parent);
    var patient = new User();
    await registerPatient(driver, patient);
    await logut(driver);
    await login(driver, "child", patient);
    await logut(driver);
});


test('ID:S6. Registration for an already registered email', async() => {
    var user = new User();
    await register(driver, user);
    await logut(driver);
    await expect(register(driver, user)).rejects.toThrow("Timed out after 5 sec");
});
