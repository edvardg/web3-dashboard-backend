import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialProjects1720031600167 implements MigrationInterface {
  name = 'SeedInitialProjects1720031600167';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO project (name, type, logo, price, "contractAddress")
      VALUES 
        ('Chainlink', 'token', 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png', 20, '0x514910771af9ca656af840dff83e8264ecf986ca'),
        ('USD Coin', 'token', 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png', 1, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'),
        ('Uniswap', 'token', 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png', 25, '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'),
        ('Wrapped Bitcoin', 'token', 'https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png', 30000, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'),
        ('Dai', 'token', 'https://assets.coingecko.com/coins/images/9956/large/4943.png', 1, '0x6b175474e89094c44da98b954eedeac495271d0f'),

        ('CryptoPunks', 'nft', 'https://i.seadn.io/s/raw/files/f3564ef33373939b024fb791f21ec37b.png?auto=format&dpr=1&w=1000', 100000, '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'),
        ('Bored Ape Yacht Club', 'nft', 'https://tradehousegeneraltrading.com/wp-content/uploads/2024/05/15-700x700_73afafb5-634c-4ea5-b2b1-3b5230703011_600x600-300x300-8.jpg', 200000, '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'),
        ('Pudgy Penguin', 'nft', 'https://i.seadn.io/gcs/files/5b91f60ad594c903b9bfe296efd47f5d.png?auto=format&dpr=1&w=2048', 10000, '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8'),
        ('Mutant Ape Yacht Club', 'nft', 'https://i.seadn.io/s/raw/files/d7483e2742ffb2027b2b9081be5d1b51.png?auto=format&dpr=1&w=2048', 1000, '0x60E4d786628Fea6478F785A6d7e704777c86a7c6'),
        ('Decentraland', 'nft', 'https://i.seadn.io/gae/wGNXnlE2kouVla8M1WjzPbzZIj8voLurPAIr8mTHRttBNT5HM6PSLnGnxmTbHlsrH4r53wFpV8CWoUkjqUGe7PXND-TERQDm0tAiAT4?auto=format&dpr=1&w=2048', 3000, '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM project WHERE "contractAddress" IN (
        '0x514910771af9ca656af840dff83e8264ecf986ca',
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        '0x6b175474e89094c44da98b954eedeac495271d0f',
        '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
        '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
        '0xBd3531dA5CF5857e7CfAA92426877b022e612cf8',
        '0x60E4d786628Fea6478F785A6d7e704777c86a7c6',
        '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d'
      );
    `);
  }
}
