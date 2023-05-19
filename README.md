# everyday_lotto

**로또로 승부내자**

해당페이지를 참고하세요

https://realtor-in-action.tistory.com/3

## Getting Started

1. https://dhlottery.co.kr/ 회원가입
2. 예치금 입금

이후에 다음 과정을 진행하시면 됩니다.

```
$ copy .env.sample .env
```

**필수 사항**

```
DH_LOTTERY_USER_ID='ID를 입력하세요'
DH_LOTTERY_PASSWORD='비밀번호를 입력하세요'
```

선택 사항

```
AMOUNT_PER_DAY='1'
# 1~5 하루에 구매할 게임 수량을 입력하세요. 로또는 일주일에 5게임까지 구매 가능합니다.
```

```
SLACK_BOT_TOKEN='xoxb-000000000000-000000000000-000000000000000000000000'
SLACK_CHANNEL_ID='C0000000000'
```

샘플 코드는 구매와 동시에 Slack으로 메시지를 발송합니다.
Incoming-Webhook 대신 Slack App을 생성하시고 토큰을 생성해야됩니다.

아래 페이지를 참고하세요

https://api.slack.com/messaging/webhooks

## Github Actions 을 통한 자동화 시스템 구축

.github/workflows/action.yml

```
name: Everyday Lotto

env:
  DH_LOTTERY_USER_ID: ${{ secrets.DH_LOTTERY_USER_ID }}
  DH_LOTTERY_PASSWORD: ${{ secrets.DH_LOTTERY_PASSWORD }}
  AMOUNT_PER_DAY: ${{ vars.AMOUNT_PER_DAY }}
  SLACK_BOT_TOKEN: ${{ vars.SLACK_BOT_TOKEN }}
  SLACK_CHANNEL_ID: ${{ vars.SLACK_CHANNEL_ID }}

on:
  schedule:
    - cron: '55 1 * * 1-5'

jobs:
  lotto:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x]

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm run build --if-present
      - run: npm run job

```

cron schedule 문법은 아래를 참고하세요

https://crontab.guru/
