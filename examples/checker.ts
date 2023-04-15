import delay from 'delay'
import { ProjectChecker } from '../src'
import { SupportChain } from '../src/web3'

const checkerExample = async () => {
    const checker = new ProjectChecker('example')
    await checker.testRpcLatency([SupportChain.Arbitrum, SupportChain.Optimism, SupportChain.Polygon, 'Goerli', 'https://endpoints.omniatech.io/v1/eth/goerli/public'])
    checker.sayResult()
    await delay(10000, { value: '---' })
}

checkerExample()