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

        ('CryptoPunks', 'nft', 'https://www.larvalabs.com/public/images/cryptopunks/punk-variety.png', 100000, '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'),
        ('Bored Ape Yacht Club', 'nft', 'https://boredapeyachtclub.com/static/media/logo.6ba6ce63.png', 200000, '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'),
        ('Art Blocks', 'nft', 'https://artblocks.io/static/media/ArtBlocksIcon.0147a6ac.png', 10000, '0xa7d8d9ef8d8ce87622d88a26debbec39e0bf1aa7'),
        ('The Sandbox', 'nft', 'https://assets.coingecko.com/coins/images/12129/large/sandbox_logo.jpg', 1000, '0x7a5af6e4e68b2e0d8b1f24efbc283ae9b3f124f4'),
        ('Decentraland', 'nft', 'https://assets.coingecko.com/coins/images/139/large/decentraland.png', 3000, '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d');
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
        '0xa7d8d9ef8d8ce87622d88a26debbec39e0bf1aa7',
        '0x7a5af6e4e68b2e0d8b1f24efbc283ae9b3f124f4',
        '0xf87e31492faf9a91b02ee0deaad50d51d56d5d4d'
      );
    `);
  }
}
