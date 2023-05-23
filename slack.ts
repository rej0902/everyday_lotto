import * as dotenv from 'dotenv';
dotenv.config();
import request from 'request';

const SLACK_UPLOAD_API_URL = 'https://slack.com/api/files.upload';
const SLACK_WRITE_API_URL = 'https://slack.com/api/chat.postMessage';

const ENV_SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const ENV_CHANNEL = process.env.SLACK_CHANNEL_ID;

const sendImageToSlack = ({
  base64fromImage,

  filename = 'lotto.png',
  filetype = 'image/png',
  message = '오늘의 로또가 발급됐읍니다. (https://dhlottery.co.kr/myPage.do?method=lottoBuyListView)',
  title = '오늘의 로또',
}: {
  base64fromImage: string;
  filename?: string;
  filetype?: string;
  title?: string;
  message?: string;
}) => {
  if (ENV_SLACK_BOT_TOKEN === undefined || ENV_CHANNEL === undefined) {
    throw new Error(`SLACK_BOT_TOKEN, SLACK_CHANNEL must be defined in .env file`);
  }

  console.log(`SLACK_BOT_TOKEN => ${ENV_SLACK_BOT_TOKEN}`);
  console.log(`SLACK_CHANNEL => ${ENV_CHANNEL}`);

  const buffer: Buffer = Buffer.from(base64fromImage, 'base64');

  request.post(
    {
      url: SLACK_UPLOAD_API_URL,
      formData: {
        channels: ENV_CHANNEL,
        file: {
          value: buffer,
          options: {
            filename,
          },
        },
        filename,
        filetype,
        token: ENV_SLACK_BOT_TOKEN,
        initial_comment: message,
        title,
      },
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(`[${ENV_CHANNEL}] Send image to slack completed!`);
      } else {
        console.error(error);
      }
    }
  );
};

const sendMessageToSlack = ({ message }: { message: string }) => {
  if (ENV_SLACK_BOT_TOKEN === undefined || ENV_CHANNEL === undefined) {
    throw new Error(`SLACK_BOT_TOKEN, SLACK_CHANNEL must be defined in .env file`);
  }

  console.log(`SLACK_BOT_TOKEN => ${ENV_SLACK_BOT_TOKEN}`);
  console.log(`SLACK_CHANNEL => ${ENV_CHANNEL}`);

  request.post(
    {
      url: SLACK_WRITE_API_URL,
      formData: {
        channel: ENV_CHANNEL,
        text: message,
        token: ENV_SLACK_BOT_TOKEN,
      },
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(`[${ENV_CHANNEL}] Send message to slack completed!`);
      } else {
        console.error(error);
      }
    }
  );
};

export { sendImageToSlack, sendMessageToSlack };
