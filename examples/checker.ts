import delay from 'delay'
import { ProjectChecker } from '../src'
import { MainnetChain } from '../src/web3'

const checkerExample = async () => {
    const checker = new ProjectChecker('example')
    await checker.testRpcLatency([MainnetChain.Arbitrum, MainnetChain.Optimism, MainnetChain.Polygon, 'Goerli', 'https://endpoints.omniatech.io/v1/eth/goerli/public'])
    checker.sayResult()
    await delay(10000, { value: '---' })
}

checkerExample()