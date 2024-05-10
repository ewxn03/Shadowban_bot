const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const readline = require('readline');

puppeteer.use(StealthPlugin());

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function Login() {
    const browser = await puppeteer.launch({ headless: false });  
    const page = await browser.newPage();
    await page.goto('https://s.activision.com/activision/login', { waitUntil: 'networkidle0' });
    await page.type('#username', '#username', { delay: 100 });  // for security reasons actual username and password                           
    await page.type('#password', '#password', { delay: 110 });  // arn't included in any public versions of this code
    await page.click('#login-button');  
    await page.waitForNavigation({ waitUntil: 'networkidle0' });  

    console.log("Login successful! Solve the CAPTCHA then press Enter to contiinue...");
    rl.once('line', async () => {
    
        await page.goto('https://support.activision.com/ban-appeal', { waitUntil: 'networkidle0' });

        console.log("Searching for 'Continue' button...");
        await page.waitForSelector('#continue-button', { visible: true, timeout: 60000 });
        await page.click('#continue-button');  
        console.log("'Continue' button clicked.");

        console.log("Searching for Agree and Continue button...");
        await page.waitForSelector('.agree-appeal', { visible: true, timeout: 60000 });
        await page.click('.agree-appeal');  
        console.log("'Agree and Continue' button clicked.");

        await page.waitForSelector('.box-title', { visible: true, timeout: 60000 });
        const banStatus = await page.evaluate(() => {
            const element = document.querySelector('.box-title');
            return element ? element.innerText : 'Element not found';
        });

        console.log("Ban status:", banStatus);  

        console.log("Press ENTER to close the browser...");
        rl.once('line', () => {
            browser.close();
            rl.close();
        });
    });
}

Login();







