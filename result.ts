import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
import {sendImageToSlack} from "./slack";

dotenv.config();

const URL_LOGIN = 'https://dhlottery.co.kr/user.do?method=login';
const URL_RESULT = 'https://dhlottery.co.kr/myPage.do?method=lottoBuyList';

const SELECTOR_ID_FOR_LOGIN = '[name="userId"]';
const SELECTOR_PASSWORD_FOR_LOGIN = '[name="password"]';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36';

const ENV_USER_ID = process.env.DH_LOTTERY_USER_ID;
const ENV_USER_PW = process.env.DH_LOTTERY_PASSWORD;

const getDay = () => ['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()] + '요일';

function getDate(): string {
  const today = new Date();

  const year = today.getFullYear(); // 2023
  const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 06
  const day = today.getDate().toString().padStart(2, '0'); // 18

  return year + month + day;
}

function getPrevDate(): string {
  const today = new Date();
  const prevDay = new Date(today.setDate(today.getDate() - 7));

  const year = prevDay.getFullYear(); // 2023
  const month = (prevDay.getMonth() + 1).toString().padStart(2, '0'); // 06
  const day = prevDay.getDate().toString().padStart(2, '0'); // 18

  return year + month + day;
}

const lotto = async () => {
  console.log('=== 오 늘 의 로 또 ===');
  if (ENV_USER_ID === undefined || ENV_USER_PW === undefined) {
    throw new Error(`DH_LOTTERY_USER_ID, DH_LOTTERY_PASSWORD must be defined in .env file`);
  }

  if (ENV_USER_ID.length == 0 || ENV_USER_PW.length == 0) {
    throw new Error(`DH_LOTTERY_USER_ID, DH_LOTTERY_PASSWORD must be defined in .env file`);
  }

  const USER_ID = ENV_USER_ID;
  const USER_PW = ENV_USER_PW;

  console.log(`USER_ID => ${USER_ID}`);
  console.log(`USER_PASSWORD => ${USER_PW.replace(/./g, '*')}`);
  console.log(`envionment loaded!`);

  const browser = await puppeteer.launch({ headless: 'new' });

  const page = await browser.newPage();

  await page.setUserAgent(USER_AGENT);
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'platform', {
      get: function () {
        return 'MacIntel';
      },
      set: function (a) {},
    });
  });

  console.log('[1] navigate to DH LOTTERY login page...');

  await page.goto(URL_LOGIN);

  await page.setViewport({ width: 1080, height: 1024 });

  await page.waitForSelector(SELECTOR_ID_FOR_LOGIN);

  console.log('[2] prepare login...');

  await page.type(SELECTOR_ID_FOR_LOGIN, USER_ID);
  await page.type(SELECTOR_PASSWORD_FOR_LOGIN, USER_PW);
  await page.keyboard.press('Enter');

  console.log('[3] try login...');

  await page.waitForNavigation();

  console.log('[4] login completed!');

  await page.goto("https://www.dhlottery.co.kr/myPage.do?method=lottoBuyListView")


  const URL_RESULT2 = `https://www.dhlottery.co.kr/myPage.do?method=lottoBuyList&searchStartDate=${getPrevDate()}&searchEndDate=${getDate()}&lottoId=LO40&nowPage=1`
  await page.goto(URL_RESULT2);

  const b64string: string = (await page?.screenshot({ encoding: 'base64' })) as string;

  //슬랙을 사용하려면 해당 주석을 풀고, .env 파일에 SLACK_BOT_TOKEN을 추가해야 합니다.
  console.log(getPrevDate() +" ~ "+ getDate())
  sendImageToSlack({
    base64fromImage: b64string,
    message: `이번주( ${getPrevDate() +" ~ "+ getDate()} ) 로또 구매 결과 확인!`,
  });

  await browser.close();
};
lotto();
