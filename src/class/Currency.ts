import { BigNumber, ethers } from "ethers";
import { bn_fromWei, bn_parseWei, bn_toWei } from "../utils/bn";
import { chainState } from "../web3/chainState";
import { MAX_ALLOWANCE, ZERO_ADDRESS } from "../web3/constants";
import { CurrencyType, SupportChainType } from "../web3/type";
import { UniversalErc20__factory } from "../web3";

class CurrencyModel {
    protected provider: ethers.providers.Provider

    readonly chain: SupportChainType
    readonly type: CurrencyType
    readonly address: string

    public name: string | undefined
    public symbol: string | undefined
    public decimals: number = 18

    constructor(chain: SupportChainType, type: CurrencyType, address: string) {
        const provider = new ethers.providers.JsonRpcProvider(chainState[chain].rpcUrls[0])
        this.provider = provider
        this.chain = chain
        this.type = type
        this.address = address
    }
}

export class CurrencyNative extends CurrencyModel {
    constructor(chain: SupportChainType) {
        super(chain, 'NATIVE', ZERO_ADDRESS)
        this.name = chainState[chain].nativeCurrency.name
        this.symbol = chainState[chain].nativeCurrency.symbol
        this.decimals = chainState[chain].nativeCurrency.decimals
    }

    async balanceOf(account: string | ethers.Wallet) {
        const address = typeof account === 'string' ? account : account.address
        const _balance = await this.provider.getBalance(address)
        return bn_parseWei(_balance, this.decimals)
    }

    async amountOf(account: string | ethers.Wallet, fixed = 4) {
        const address = typeof account === 'string' ? account : account.address
        const _balance = await this.provider.getBalance(address)
        return bn_fromWei(_balance, this.decimals, fixed)
    }

    async transfer(signer: ethers.Wallet, toAddress: string, amount: number | string | 'Max') {
        let amountBn: BigNumber

        if (amount === 'Max') {
            const balanceBn = await this.provider.getBalance(signer.address)
            const gasPriceBn = await this.provider.getGasPrice()
            amountBn = balanceBn.sub(gasPriceBn.mul(21000))
        } else {
            amountBn = ethers.utils.parseEther(`${amount}`)
        }

        const transaction: ethers.utils.Deferrable<ethers.providers.TransactionRequest> = {
            to: toAddress,
            value: amountBn
        }
        return signer.sendTransaction(transaction)
    }
}

export class CurrencyErc20 extends CurrencyModel {
    public readonly assetsContract: ethers.Contract

    constructor(chain: SupportChainType, tokenAddress: string) {
        super(chain, 'ERC20', tokenAddress)
        this.assetsContract = UniversalErc20__factory.connect(tokenAddress, this.provider)
        this.initialize()
    }

    async initialize() {
        this.symbol = await this.assetsContract.symbol()
        this.decimals = await this.assetsContract.decimals()
        this.name = await this.assetsContract.name()

        return this
    }

    async totalSupply() {
        const _totalSupply = await this.assetsContract.totalSupply()
        return bn_fromWei(_totalSupply, this.decimals)
    }

    async balanceOf(account: string | ethers.Wallet) {
        const address = typeof account === 'string' ? account : account.address
        const _amount = await this.assetsContract.balanceOf(address)
        return bn_parseWei(_amount, this.decimals)
    }

    async amountOf(account: string | ethers.Wallet, fixed = 4) {
        const address = typeof account === 'string' ? account : account.address
        const _amount = await this.assetsContract.balanceOf(address)
        return bn_fromWei(_amount, this.decimals, fixed)
    }

    async allowance(owner: string, spender: string) {
        const _allowance = await this.assetsContract.allowance(owner, spender)
        return bn_fromWei(_allowance, this.decimals)
    }

    async approve(signer: ethers.Wallet, spender: string, amount: number | 'Max') {
        const amountWei = amount === 'Max' ? MAX_ALLOWANCE : bn_toWei(amount, this.decimals)
        const assetsContractWithSigner = this.assetsContract.connect(signer)
        const approveArgs = [spender, amountWei]
        await assetsContractWithSigner.estimateGas.approve(approveArgs)
        return assetsContractWithSigner.approve(approveArgs) as ethers.ContractTransaction
    }

    async transfer(signer: ethers.Wallet, toAddress: string, amount: number | string | 'Max') {
        const assetsContractWithSigner = this.assetsContract.connect(signer)
        let amountWei = amount === 'Max' ? await this.balanceOf(signer.address) : bn_toWei(amount, this.decimals)
        const transferArgs = [toAddress, amountWei]
        await assetsContractWithSigner.estimateGas.transfer(transferArgs)
        return assetsContractWithSigner.transfer(transferArgs)
    }
}